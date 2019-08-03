package route

import (
	"database/sql"
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
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
func GetCourseNums(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) *ErrorStruct {

	if request.Method != "GET" {
		return &ErrorStruct{Type: ErrHTTPMethodInvalid}
	}

	department, quarter, missing := readURLQueryDeptQuarter(request)

	if len(missing) != 0 {
		return &ErrorStruct{Type: ErrInputMissing, Missing: missing}
	}

	res, es := query(
		ds,
		QueryStruct{
			RowScanner:  RowScannerCourseNums,
			Query:       "SELECT DISTINCT DEPARTMENT, COURSE_NUM, DESCRIPTION FROM " + quarter + " WHERE DEPARTMENT=?",
			QueryTable:  quarter,
			QueryParams: []interface{}{department},
		})

	if es != nil {
		return es
	}

	return response(writer, request, res)

}
