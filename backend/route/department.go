package route

import (
	"fmt"
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
			RowScanner:  RowScannerOneString,
			Query:       fmt.Sprintf("SELECT DISTINCT DEPT_CODE FROM DEPARTMENT"),
			QueryTables: []string{"DEPARTMENT"},
		},
	)

	if es != nil {
		return es
	}

	writer.Header().Set("Content-Type", "application/json")

	return response(writer, request, res)
}
