package route

import (
	"fmt"
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

	ans, missing := readURLQuery(request, []string{"department", "quarter", "courseNum"})

	if len(missing) != 0 {
		return &ErrorStruct{Type: ErrInputMissing, Missing: missing}
	}

	department, courseNum, quarter := ans["department"], ans["courseNum"], ans["quarter"]

	res, es := query(
		ds,
		QueryStruct{
			RowScanner:  RowScannerOneString,
			Query:       fmt.Sprintf("SELECT DISTINCT INSTRUCTOR FROM %s WHERE DEPARTMENT=? AND COURSE_NUM=?", quarter),
			QueryTables: []string{quarter},
			QueryParams: []interface{}{department, courseNum},
		},
	)

	if es != nil {
		return es
	}

	writer.Header().Set("Content-Type", "application/json")

	return response(writer, request, res)
}
