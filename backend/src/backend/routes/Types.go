package routes

import (
	"backend"
	"encoding/json"
	"net/http"
)

func GetTypes(writer http.ResponseWriter, request *http.Request) {
	if request.Method == "GET" {
		keys, ok := request.URL.Query()["department"]
		department := keys[0]

		keys, ok = request.URL.Query()["courseNum"]
		courseNum := keys[0]

		keys, ok = request.URL.Query()["quarter"]
		quarter := keys[0]

		if !ok {
			http.Error(writer, "Request does not contain necessary information!", http.StatusBadRequest)
		}

		db := backend.New(Config)
		defer db.Close()

		query := "SELECT DISTINCT TYPE FROM " + quarter + " WHERE DEPARTMENT=? AND COURSE_NUM=?"
		rows := db.Query(quarter, query, department, courseNum)

		if rows == nil {
			http.Error(writer, "Could not query correctly.", http.StatusInternalServerError)
		}

		var ret []string

		for rows.Next() {
			var classType string
			err := rows.Scan(&classType)

			if err != nil {
				http.Error(writer, "Could not scan data", http.StatusInternalServerError)
			}
			ret = append(ret, classType)
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
