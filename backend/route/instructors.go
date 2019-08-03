package route

import (
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

// LogPrefixInstructors log prefix for Instructors route
const LogPrefixInstructors = "[Instructors]"

// GetInstructors is a route.HandlerFunc for instructor route
func GetInstructors(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) *ErrorStruct {

	if request.Method != "GET" {
		return &ErrorStruct{Type: ErrHTTPMethodInvalid}
	}

	department, courseNum, quarter, missing := readURLQueryDeptCourseNumQuarter(request)

	if len(missing) != 0 {
		return &ErrorStruct{Type: ErrInputMissing, Missing: missing}
	}

	res, es := query(
		ds,
		QueryStruct{
			RowScanner:  RowScannerOneString,
			Query:       "SELECT DISTINCT INSTRUCTOR FROM " + quarter + " WHERE DEPARTMENT=? AND COURSE_NUM=?",
			QueryTable:  quarter,
			QueryParams: []interface{}{department, courseNum},
		})

	if es != nil {
		return es
	}

	return response(writer, request, res)

}
