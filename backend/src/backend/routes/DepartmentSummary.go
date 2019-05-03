package routes

import (
	"backend"
	"encoding/json"
	"net/http"
)

type DepartmentSummary struct {
	Department  string  `json:"department"`
	CourseNum   string	`json:"courseNum"`
	Description string	`json:"description"`
}

func GetDepartmentSummary(writer http.ResponseWriter, request *http.Request) {
	if request.Method == "GET" {
		keys, ok := request.URL.Query()["department"]
		department := keys[0]

		if !ok {
			http.Error(writer, "Request does not contain department!", http.StatusBadRequest)
		}

		keys, ok = request.URL.Query()["quarter"]
		quarter := keys[0]

		if !ok {
			http.Error(writer, "Request does not contain department!", http.StatusBadRequest)
		}

		db := backend.New(Config)
		defer db.Close()

		query := "SELECT DISTINCT DEPARTMENT, COURSE_NUM, DESCRIPTION FROM " + quarter + " WHERE DEPARTMENT=?"
		rows := db.Query(quarter, query, department)

		if rows == nil {
			http.Error(writer, "Could not query correctly.", http.StatusInternalServerError)
		}

		var ret []DepartmentSummary

		for rows.Next() {
			departmentSummary := DepartmentSummary{}
			err := rows.Scan(&departmentSummary.Department, &departmentSummary.CourseNum, &departmentSummary.Description)

			if err != nil {
				http.Error(writer, "Could not scan data into struct", http.StatusInternalServerError)
			}
			ret = append(ret, departmentSummary)
		}

		retJson, err := json.Marshal(ret)

		if err != nil {
			http.Error(writer, "Error converting data", http.StatusInternalServerError)
		}

		_, err = writer.Write(retJson)
		if err != nil {
			http.Error(writer, "Failed to send response", http.StatusInternalServerError)
		}
	} else {
		http.Error(writer, "Invalid method type", http.StatusMethodNotAllowed)
	}
}
