package route

import (
	"fmt"
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/environ"
	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/store"
)

// LogPrefixDepartment log prefix for Department route
const LogPrefixDepartment = "[Department]"

// GetDepartments is a route.HandlerFunc for department route
func GetDepartments(writer http.ResponseWriter, request *http.Request, env *environ.Env, db *store.DB) *ErrorStruct {
	if request.Method != "GET" {
		return &ErrorStruct{Type: ErrHTTPMethodInvalid}
	}

	res, es := Query(
		db,
		QueryStruct{
			RowScanner:  RowScannerOneString,
			QueryStr:    fmt.Sprintf("SELECT DISTINCT DEPT_CODE FROM DEPARTMENT"),
			QueryTables: []string{"DEPARTMENT"},
		},
	)

	if es != nil {
		return es
	}

	return Response(writer, request, res)
}
