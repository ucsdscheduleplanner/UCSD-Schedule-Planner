package routes

import (
	"database/sql"
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

const logTagDepartmentSummary = "[DepartmentSummary]"

// DepartmentSummary stores the JSON response to a department summary request
type DepartmentSummary struct {
	Department  string `json:"department"`
	CourseNum   string `json:"courseNum"`
	Description string `json:"description"`
}

func rowScannerDepartmentSummary(rows *sql.Rows) (interface{}, error) {
	val := DepartmentSummary{}
	err := rows.Scan(&val.Department, &val.CourseNum, &val.Description)
	return val, err
}

// GetCourseNums is a pre-http.HandlerFunc for course num route ready and will become a closure with *DatabaseStruct
func GetCourseNums(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) {

	if request.Method != "GET" {
		errInvalidMethod(logTagDepartmentSummary, writer, request)
		return
	}

	department, quarter, missing := readURLQueryDeptQuarter(request)

	if len(missing) != 0 {
		errMissingInput(logTagInstructors, writer, request, missing)
		return
	}

	queryAndResponse(
		ds, logTagDepartmentSummary, writer, request,
		rowScannerDepartmentSummary,
		"SELECT DISTINCT DEPARTMENT, COURSE_NUM, DESCRIPTION FROM "+quarter+" WHERE DEPARTMENT=?",
		quarter, department)

}
