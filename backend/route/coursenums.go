package route

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/store"
)

// LogPrefixCourseNums log prefix for CourseNums route
const LogPrefixCourseNums = "[CourseNums]"

// DepartmentSummary stores the JSON response to a course num request
type DepartmentSummary struct {
	Department  string `json:"department"`
	CourseNum   string `json:"courseNum"`
	Description string `json:"description"`
}

// RowScannerCourseNums scans one sql row and return as a DepartmentSummary Struct
func RowScannerCourseNums(rows *sql.Rows) (interface{}, error) {
	val := DepartmentSummary{}
	err := rows.Scan(&val.Department, &val.CourseNum, &val.Description)
	return val, err
}

// GetCourseNums is a route.HandlerFunc for course num route
func GetCourseNums(writer http.ResponseWriter, request *http.Request, db *store.DB) *ErrorStruct {
	if request.Method != "GET" {
		return &ErrorStruct{Type: ErrHTTPMethodInvalid}
	}

	ans, missing := readURLQuery(request, []string{"department", "quarter"})

	if len(missing) != 0 {
		return &ErrorStruct{Type: ErrInputMissing, Missing: missing}
	}

	department, quarter := ans["department"], ans["quarter"]

	res, es := Query(
		db,
		QueryStruct{
			RowScanner:  RowScannerCourseNums,
			Query:       fmt.Sprintf("SELECT DISTINCT DEPARTMENT, COURSE_NUM, DESCRIPTION FROM %s WHERE DEPARTMENT=?", quarter),
			QueryTables: []string{quarter},
			QueryParams: []interface{}{department},
		},
	)

	if es != nil {
		return es
	}

	return Response(writer, request, res)
}
