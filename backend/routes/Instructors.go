package routes

import (
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

const logTagInstructors = "[Instructors]"

// GetInstructors is a pre-http.HandlerFunc for instructor route and will become a closure with *DatabaseStruct
func GetInstructors(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) {

	if request.Method != "GET" {
		errInvalidMethod(logTagInstructors, writer, request)
		return
	}

	department, courseNum, quarter, missing := readURLQueryDeptCourseNumQuarter(request)

	if len(missing) != 0 {
		errMissingInput(logTagInstructors, writer, request, missing)
		return
	}

	queryAndResponse(
		ds, logTagInstructors, writer, request,
		rowScannerOneString,
		"SELECT DISTINCT INSTRUCTOR FROM "+quarter+" WHERE DEPARTMENT=? AND COURSE_NUM=?",
		quarter, department, courseNum)

}
