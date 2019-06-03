package routes

import (
	"database/sql"
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

const logTagInstructors = "[Instructors]"

// GetInstructors is a pre-http.HandlerFunc for instructor route and will become a closure with *DatabaseStruct
func GetInstructors(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) {

	if request.Method != "GET" {
		errInvalidMethod(logTagInstructors, writer, request)
		return
	}

	department, courseNum, quarter, missing := readDeptCourseNumQuarter(request)

	if missing != "" {
		errMissingInput(logTagInstructors, writer, request, missing)
		return
	}

	query := "SELECT DISTINCT INSTRUCTOR FROM " + quarter + " WHERE DEPARTMENT=? AND COURSE_NUM=?"

	queryAndResponse(ds, logTagInstructors, writer, request,
		func(rows *sql.Rows) (interface{}, error) {
			var val string
			err := rows.Scan(&val)
			return val, err
		},
		query, quarter, department, courseNum)

}
