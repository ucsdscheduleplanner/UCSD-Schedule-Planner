package route

import (
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

// LogPrefixTypes log prefix for Types route
const LogPrefixTypes = "[Types]"

// GetTypes is a route.HandlerFunc for types route
func GetTypes(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) *ErrorStruct {

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
			Query:       "SELECT DISTINCT TYPE FROM " + quarter + " WHERE DEPARTMENT=? AND COURSE_NUM=?",
			QueryTable:  quarter,
			QueryParams: []interface{}{department, courseNum},
		})

	if es != nil {
		return es
	}

	return response(writer, request, res)

}
