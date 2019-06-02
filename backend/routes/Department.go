package routes

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

const logTagDepartment = "[Department]"

// GetDepartments is a pre-http.HandlerFunc for department route ready to be a closure with *DatabaseStruct
func GetDepartments(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) {

	if request.Method != "GET" {
		http.Error(writer, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rows, err := ds.Query("DEPARTMENT", "SELECT DISTINCT DEPT_CODE FROM DEPARTMENT")

	if err != nil {
		http.Error(writer, "Error querying departments", http.StatusInternalServerError)
		log.Printf("%s Failed to query data with %q from %q: %s", logTagDepartment, "SELECT DISTINCT DEPT_CODE FROM DEPARTMENT", request.RemoteAddr, err.Error())
		return
	}

	if rows == nil {
		http.Error(writer, "Error querying departments", http.StatusInternalServerError)
		log.Printf("%s Empty query data with %q from %q: %s", logTagDepartment, "SELECT DISTINCT DEPT_CODE FROM DEPARTMENT", request.RemoteAddr, err.Error())
		return
	}

	var departments []string
	for rows.Next() {
		var (
			department string
		)
		err := rows.Scan(&department)
		if err != nil {
			http.Error(writer, "Error parsing departments", http.StatusInternalServerError)
			log.Printf("%s Failed to parse departments: %s", logTagDepartment, err.Error())
			return
		}

		departments = append(departments, department)
	}

	departmentJSON, err := json.Marshal(departments)

	if err != nil {
		http.Error(writer, "Error fetching departments", http.StatusInternalServerError)
		log.Printf("%s Failed to read data from departments in response to %q: %s", logTagDepartment, request.RemoteAddr, err.Error())
		return
	}

	_, err = writer.Write(departmentJSON)

	if err != nil {
		http.Error(writer, "Failed to send response", http.StatusInternalServerError)
		log.Printf("%s Failed to write data in response to %q: %s", logTagDepartment, request.RemoteAddr, err.Error()) // log JSON?
		return
	}
}
