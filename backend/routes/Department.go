package routes

import (
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

const logTagDepartment = "[Department]"

// GetDepartments is a pre-http.HandlerFunc for department route and will become a closure with *DatabaseStruct
func GetDepartments(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) {

	if request.Method != "GET" {
		errInvalidMethod(logTagDepartment, writer, request)
		return
	}

	queryAndResponse(
		ds, logTagDepartment, writer, request,
		rowScannerOneString,
		"SELECT DISTINCT DEPT_CODE FROM DEPARTMENT",
		"DEPARTMENT")

}
