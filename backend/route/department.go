package route

import (
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

// LogPrefixDepartment log prefix for Department route
const LogPrefixDepartment = "[Department]"

// GetDepartments is a route.HandlerFunc for department route
func GetDepartments(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) *ErrorStruct {

	if request.Method != "GET" {
		return &ErrorStruct{Type: ErrHTTPMethodInvalid}
	}

	res, es := query(
		ds,
		QueryStruct{
			RowScanner: RowScannerOneString,
			Query:      "SELECT DISTINCT DEPT_CODE FROM DEPARTMENT",
			QueryTable: "DEPARTMENT",
		})

	if es != nil {
		return es
	}

	return response(writer, request, res)

}
