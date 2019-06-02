package routes

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

const logTagInstructors = "[Instructors]"

// GetInstructors is a pre-http.HandlerFunc for instructor route ready to be a closure with *DatabaseStruct
func GetInstructors(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) {
	if request.Method != "GET" {
		http.Error(writer, "Invalid method type", http.StatusMethodNotAllowed)
		return
	}

	keys, ok := request.URL.Query()["department"]
	department := keys[0]

	if !ok {
		http.Error(writer, "Request does not contain necessary information!", http.StatusBadRequest)
		return
	}

	keys, ok = request.URL.Query()["courseNum"]
	courseNum := keys[0]

	if !ok {
		http.Error(writer, "Request does not contain necessary information!", http.StatusBadRequest)
		return
	}

	keys, ok = request.URL.Query()["quarter"]
	quarter := keys[0]

	if !ok {
		http.Error(writer, "Request does not contain necessary information!", http.StatusBadRequest)
		return
	}

	query := "SELECT DISTINCT INSTRUCTOR FROM " + quarter + " WHERE DEPARTMENT=? AND COURSE_NUM=?"
	rows, err := ds.Query(quarter, query, department, courseNum)

	if err != nil {
		http.Error(writer, "Error querying department summary", http.StatusInternalServerError)
		log.Printf("%s Failed to query data with %q from %q: %s", logTagInstructors, query, request.RemoteAddr, err.Error())
		return
	}

	if rows == nil {
		http.Error(writer, "Could not query correctly.", http.StatusInternalServerError)
		log.Printf("%s Failed to query data with %q from %q: %s", logTagInstructors, query, request.RemoteAddr, err.Error())
		return
	}

	var ret []string

	for rows.Next() {
		var instructor string
		err := rows.Scan(&instructor)

		if err != nil {
			http.Error(writer, "Could not scan data", http.StatusInternalServerError)
			log.Printf("%s Failed to parse returned rows: %s", logTagInstructors, err.Error())
			return
		}

		ret = append(ret, instructor)

	}

	retJSON, err := json.Marshal(ret)

	if err != nil {
		http.Error(writer, "Error converting data", http.StatusInternalServerError)
		log.Printf("%s Failed to read JSON data in response to %q: %s", logTagInstructors, request.RemoteAddr, err.Error())
		return
	}

	_, err = writer.Write(retJSON)

	if err != nil {
		http.Error(writer, "Failed to send response", http.StatusInternalServerError)
		log.Printf("%s Failed to write data in response to %q: %s", logTagInstructors, request.RemoteAddr, err.Error()) // log JSON?
		return
	}
}
