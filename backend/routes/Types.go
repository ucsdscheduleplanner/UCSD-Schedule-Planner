package routes

import (
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

const logTagTypes = "[Types]"

// GetTypes is a pre-http.HandlerFunc for types route and will become a closure with *DatabaseStruct
func GetTypes(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) {

	if request.Method != "GET" {
		errInvalidMethod(logTagTypes, writer, request)
		return
	}

	department, courseNum, quarter, missing := readURLQueryDeptCourseNumQuarter(request)

	if len(missing) != 0 {
		errMissingInput(logTagTypes, writer, request, missing)
		return
	}

	queryAndResponse(
		ds, logTagTypes, writer, request,
		rowScannerOneString,
		"SELECT DISTINCT TYPE FROM "+quarter+" WHERE DEPARTMENT=? AND COURSE_NUM=?",
		quarter, department, courseNum)

}
