package routes

import (
	"encoding/json"
	"net/http"

	"database/sql"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

/*
queryAndResponse is a function to
query using ds
process rows using rowScanner
write response
*/
func queryAndResponse(ds *db.DatabaseStruct, tag string, writer http.ResponseWriter, request *http.Request,
	rowScanner func(*sql.Rows) (val interface{}, err error),
	query string, queryTable string, queryParams ...interface{}) {

	rows, err := ds.Query(queryTable, query, queryParams...)

	if err != nil {
		errQuery(tag, err, writer, request, query, queryParams...)
		return
	}

	if rows == nil {
		errEmptyQuery(tag, writer, request, query, queryParams...)
		return
	}

	var res []interface{}

	for rows.Next() {
		r, err := rowScanner(rows)

		// TODO: might consider try again here
		if err != nil {
			errParseQueryResult(tag, err, writer, request)
			return
		}

		res = append(res, r)

	}

	resJSON, err := json.Marshal(res)

	if err != nil {
		errCreateResponse(tag, err, writer, request)
		return
	}

	status, err := writer.Write(resJSON)

	if err != nil {
		errWriteResponse(tag, err, writer, request, status)
		return
	}

}

// TODO: have a better name
func readDeptCourseNumQuarter(request *http.Request) (department, courseNum, quarter, missing string) {

	keys, ok := request.URL.Query()["department"]

	if !ok {
		missing = "department"
		return
	}

	department = keys[0]

	keys, ok = request.URL.Query()["quarter"]

	if !ok {
		missing = "quarter"
		return
	}

	quarter = keys[0]

	keys, ok = request.URL.Query()["courseNum"]

	if !ok {
		missing = "courseNum"
		return
	}

	courseNum = keys[0]

	return // named return
}
