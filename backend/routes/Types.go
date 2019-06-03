package routes

import (
	"database/sql"
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

const logTagTypes = "[Types]"

// GetTypes is a pre-http.HandlerFunc for types route and will become a closure with *DatabaseStruct
func GetTypes(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) {

	if request.Method != "GET" {
		errInvalidMethod(logTagTypes, writer, request)
		return
	}

	department, courseNum, quarter, missing := readDeptCourseNumQuarter(request)

	if missing != "" {
		errMissingInput(logTagTypes, writer, request, missing)
		return
	}

	query := "SELECT DISTINCT TYPE FROM " + quarter + " WHERE DEPARTMENT=? AND COURSE_NUM=?"

	queryAndResponse(ds, logTagTypes, writer, request,
		func(rows *sql.Rows) (interface{}, error) {
			var val string
			err := rows.Scan(&val)
			return val, err
		},
		query, quarter, department, courseNum)

}
