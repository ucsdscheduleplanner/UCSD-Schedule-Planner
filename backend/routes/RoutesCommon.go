package routes

import (
	"encoding/json"
	"net/http"

	"database/sql"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

// queryAndResponse is a function to
// query using ds
// process rows using rowScanner
// write response
func queryAndResponse(
	ds *db.DatabaseStruct, tag string, writer http.ResponseWriter, request *http.Request,
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

// rowScannerOneString scans one sql row and return as single string
func rowScannerOneString(rows *sql.Rows) (interface{}, error) {
	var val string
	err := rows.Scan(&val)
	return val, err
}

// readURLQuery returns a map of queries and a slice of missing ones
func readURLQuery(request *http.Request, args []string) (ans map[string]string, missing []string) {
	for _, s := range args {
		keys, ok := request.URL.Query()[s]
		if !ok || len(keys[0]) < 1 {
			missing = append(missing, s)
		} else {
			ans[s] = keys[0]
		}
	}
	return // named return
}

func readURLQueryDeptCourseNumQuarter(request *http.Request) (string, string, string, []string) {
	ans, missing := readURLQuery(request, []string{"department", "quarter", "courseNum"})
	return ans["department"], ans["courseNum"], ans["quarter"], missing
}

func readURLQueryDeptQuarter(request *http.Request) (string, string, []string) {
	ans, missing := readURLQuery(request, []string{"department", "quarter"})
	return ans["department"], ans["courseNum"], missing
}
