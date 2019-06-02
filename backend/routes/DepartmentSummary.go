package routes

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

const logTagDepartmentSummary = "[DepartmentSummary]"

// DepartmentSummary stores the JSON response to a department summary request
type DepartmentSummary struct {
	Department  string `json:"department"`
	CourseNum   string `json:"courseNum"`
	Description string `json:"description"`
}

// GetCourseNums is a pre-http.HandlerFunc for course num route ready to be a closure with *DatabaseStruct
func GetCourseNums(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) {
	if request.Method != "GET" {
		http.Error(writer, "Invalid method type", http.StatusMethodNotAllowed)
		return
	}

	// TODO create a function for query value check
	keys, ok := request.URL.Query()["department"]
	department := keys[0]

	if !ok {
		http.Error(writer, "Request does not contain department!", http.StatusBadRequest)
		// not logging invalid input yet
		return
	}

	keys, ok = request.URL.Query()["quarter"]
	quarter := keys[0]

	if !ok {
		http.Error(writer, "Request does not contain department!", http.StatusBadRequest)
		// not logging invalid input yet
		return
	}

	query := "SELECT DISTINCT DEPARTMENT, COURSE_NUM, DESCRIPTION FROM " + quarter + " WHERE DEPARTMENT=?"
	rows, err := ds.Query(quarter, query, department)

	if err != nil {
		http.Error(writer, "Error querying department summary", http.StatusInternalServerError)
		log.Printf("%s Failed to query data with %q from %q: %s", logTagDepartmentSummary, query, request.RemoteAddr, err.Error())
		return
	}

	if rows == nil {
		http.Error(writer, "Could not query correctly.", http.StatusInternalServerError)
		log.Printf("%s Failed to query data with %q from %q: %s", logTagDepartmentSummary, query, request.RemoteAddr, err.Error())
		return
	}

	var ret []DepartmentSummary

	for rows.Next() {
		departmentSummary := DepartmentSummary{}
		err := rows.Scan(&departmentSummary.Department, &departmentSummary.CourseNum, &departmentSummary.Description)

		if err != nil {
			http.Error(writer, "Could not scan data into struct", http.StatusInternalServerError)
			log.Printf("%s Failed to parse department summary: %s", logTagDepartmentSummary, err.Error())
			return
		}

		ret = append(ret, departmentSummary)
	}

	retJSON, err := json.Marshal(ret)

	if err != nil {
		http.Error(writer, "Error converting data", http.StatusInternalServerError)
		log.Printf("%s Failed to read data from departments in response to %q: %s", logTagDepartmentSummary, request.RemoteAddr, err.Error())
		return
	}

	_, err = writer.Write(retJSON)
	if err != nil {
		http.Error(writer, "Failed to send response", http.StatusInternalServerError)
		log.Printf("%s Failed to write data in response to %q: %s", logTagDepartmentSummary, request.RemoteAddr, err.Error()) // log JSON?
		return
	}
}
