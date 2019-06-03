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

// GetCourseNums is a pre-http.HandlerFunc for course num route ready and will become a closure with *DatabaseStruct
func GetCourseNums(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) {

	if request.Method != "GET" {
		errInvalidMethod(logTagDepartmentSummary, writer, request)
		return
	}

	// NOTE: hack way to re-use function
	department, _, quarter, missing := readDeptCourseNumQuarter(request)

	if missing != "courseNum" {
		errMissingInput(logTagInstructors, writer, request, missing)
		return
	}

	query := "SELECT DISTINCT DEPARTMENT, COURSE_NUM, DESCRIPTION FROM " + quarter + " WHERE DEPARTMENT=?"

	queryAndResponse(ds, logTagDepartmentSummary, writer, request,
		func(rows *sql.Rows) (interface{}, error) {
			val := DepartmentSummary{}
			err := rows.Scan(&val.Department, &val.CourseNum, &val.Description)
			return val, err
		},
		query, quarter, department)

}
