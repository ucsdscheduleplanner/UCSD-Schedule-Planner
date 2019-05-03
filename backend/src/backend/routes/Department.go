package routes

import (
	"backend"
	"encoding/json"
	"gopkg.in/ini.v1"
	"net/http"
)

var Config, _ = ini.Load("./config/config.example.ini")

func GetDepartments(writer http.ResponseWriter, request *http.Request) {
	if request.Method == "GET" {
		db := backend.New(Config)
		defer db.Close()

		rows := db.Query("DEPARTMENT", "SELECT DISTINCT DEPT_CODE FROM DEPARTMENT")
		if rows == nil {
			http.Error(writer, "Error querying departments", http.StatusInternalServerError)
		}

		var departments []string
		for rows.Next() {
			var (
				department string
			)
			err := rows.Scan(&department)
			if err != nil {
				http.Error(writer, "Error parsing departments", http.StatusInternalServerError)
			}

			departments = append(departments, department)
		}

		departmentJson, err := json.Marshal(departments)

		if err != nil {
			http.Error(writer, "Error fetching departments", http.StatusInternalServerError);
		}

		_, err = writer.Write(departmentJson)
		if err != nil {
			http.Error(writer, "Failed to send response", http.StatusInternalServerError)
		}
	} else {
		http.Error(writer, "Method not allowed", http.StatusMethodNotAllowed);
	}
}


