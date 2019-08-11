// Package route includes the route handlers for sd schedule planner
package route

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"database/sql"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/environ"
	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/store"
)

// HandlerFunc handles each route and returns *route.ErrorStruct, returns nil if no error
type HandlerFunc func(http.ResponseWriter, *http.Request, *environ.Env, *store.DB) *ErrorStruct

// Handlers is the enum for each handlers supported by the handler factory
type Handlers int

// Handlers enum, for factory pattern
const (
	_ Handlers = iota
	HandlerCourseNum
	HandlerDepartment
	HandlerInstructors
	HandlerTypes
	HandlerClassData
)

// ErrorType error enum
type ErrorType int

// ErrorType error enum
const (
	_                    ErrorType = iota
	ErrHTTPMethodInvalid           // invalid http method
	ErrPostRead                    // http.post fail to read body
	ErrPostParse                   // http.post fail to parse post body as json
	ErrPostEmpty                   // http.post empty post json body
	ErrQuery                       // fail to query
	ErrQueryEmpty                  // query returns nothing
	ErrQueryScan                   // fail to scan sql.rows
	ErrResponseCreate              // fail to create the json response to return
	ErrResponseWrite               // fail to write the json to the http.ResponseWriter
	ErrInputMissing                // missing required arguments for query
)

// ErrorStruct stores information for an error
type ErrorStruct struct {
	Type  ErrorType
	Error error

	QueryStr    string
	QueryParams []interface{}
	Status      int
	Missing     []string
	// Response    []byte
}

// HandlerFactory creates handlers
type HandlerFactory struct {
	Env *environ.Env
}

// MakeHandler creates closure for http handler func and handles the error
func (factory *HandlerFactory) MakeHandler(route Handlers) http.HandlerFunc {
	env := factory.Env
	switch route {
	case HandlerClassData:
		return createHandler(GetClassData, env, env.DB, LogPrefixClassData)
	case HandlerCourseNum:
		return createHandler(GetCourseNums, env, env.DB, LogPrefixCourseNums)
	case HandlerDepartment:
		return createHandler(GetDepartments, env, env.DB, LogPrefixDepartment)
	case HandlerInstructors:
		return createHandler(GetInstructors, env, env.DB, LogPrefixInstructors)
	case HandlerTypes:
		return createHandler(GetTypes, env, env.DB, LogPrefixTypes)
	}
	// route is not one of the Handlers enum, cannot proceed
	panic("Error: cannot create an unknown handler")
}

// newHandler handles the creation of handlers
func createHandler(f HandlerFunc, env *environ.Env, db *store.DB, tag string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Notes

		// Customized error: if specific error message needed, create a new error type and error with fmt.Errorf() etc.
		// Server-side error only: currently only log server-side error, i.e. no logs for invalid input and so on
		// More context in the future: the current logging logs the IP but it might not be enough for troubleshooting

		// Rule is to hide details from users but have detailed logs on the server
		// TODO: formalize error based on https://tools.ietf.org/html/rfc7807

		if es := f(w, r, env, db); es != nil {
			switch es.Type {
			case ErrHTTPMethodInvalid:
				http.Error(w, "Invalid method type", http.StatusMethodNotAllowed)
			case ErrPostRead:
				http.Error(w, "Error handling POST request", http.StatusBadRequest)
				log.Printf("%s Failed to read request to %q from %q: %v", tag, r.RequestURI, r.RemoteAddr, es.Error)
			case ErrPostParse:
				http.Error(w, "Failed to parse request", http.StatusInternalServerError)
				log.Printf("%s Failed to parse request to %q from %q: %v", tag, r.RequestURI, r.RemoteAddr, es.Error)
			case ErrPostEmpty:
				http.Error(w, fmt.Sprintf("Empty post request: %v", es.Error), http.StatusInternalServerError)
				// non server-side error
			case ErrQuery:
				http.Error(w, "Error query", http.StatusInternalServerError)
				log.Printf("%s Failed to query data requested by %q with %q and params %v: %v", tag, r.RemoteAddr, es.QueryStr, es.QueryParams, es.Error)
			case ErrQueryEmpty:
				http.Error(w, "Empty query", http.StatusNoContent)
				log.Printf("%s Empty query data requested by %q with %q and params %v", tag, r.RemoteAddr, es.QueryStr, es.QueryParams)
			case ErrQueryScan:
				http.Error(w, "Could not scan data", http.StatusInternalServerError)
				log.Printf("%s Failed to parse returned rows: %v", tag, es.Error)
			case ErrResponseCreate:
				http.Error(w, "Error creating the response JSON", http.StatusInternalServerError)
				log.Printf("%s Failed to create response JSON in response to %q: %v", tag, r.RemoteAddr, es.Error)
			case ErrResponseWrite:
				// TODO: log JSON content?
				http.Error(w, "Failed to send response", http.StatusInternalServerError)
				log.Printf("%s Failed to write data in response to %q: %v %v", tag, r.RemoteAddr, es.Status, es.Error)
			case ErrInputMissing:
				http.Error(w, fmt.Sprintf("Request does not contain necessary information: %v", es.Missing), http.StatusBadRequest)
				// skip logging invalid request since it's not server-side error
			default:
				// ErrorType is not in the enum list, impossible, but still catch it here
				http.Error(w, "Unsupported error type, internal backend error", http.StatusInternalServerError)
				log.Printf("%s Unsupported error type: %q from %q to %q", tag, es.Type, r.RemoteAddr, r.RequestURI)
			}
		}
	}
}

// RowScanner scan *sql.Rows and return requested values
// Might consider sql.Scanner but here a lambda is easier
type RowScanner func(*sql.Rows) (val interface{}, err error)

// QueryStruct stores information for query
type QueryStruct struct {
	RowScanner  RowScanner
	QueryStr    string
	QueryTables []string
	QueryParams []interface{}
}

// Query with qs and return the scanned results
// 1. query using db
// 2. process rows using RowScanner
func Query(db *store.DB, qs QueryStruct) ([]interface{}, *ErrorStruct) {
	rows, err := db.Query(qs.QueryTables, qs.QueryStr, qs.QueryParams...)
	if err != nil {
		return nil, &ErrorStruct{Type: ErrQuery, Error: err, QueryStr: qs.QueryStr, QueryParams: qs.QueryParams}
	}
	if rows == nil {
		return nil, &ErrorStruct{Type: ErrQueryEmpty, QueryStr: qs.QueryStr, QueryParams: qs.QueryParams}
	}

	var res []interface{}

	for rows.Next() {
		row, err := qs.RowScanner(rows)
		// TODO: might consider try again here
		if err != nil {
			return nil, &ErrorStruct{Type: ErrQueryScan, Error: err}
		}
		res = append(res, row)
	}

	return res, nil
}

// Response a json
func Response(w http.ResponseWriter, r *http.Request, res interface{}) *ErrorStruct {
	resJSON, err := json.Marshal(res)
	if err != nil {
		return &ErrorStruct{Type: ErrResponseCreate, Error: err}
	}

	w.Header().Set("Content-Type", "application/json")

	status, err := w.Write(resJSON)
	if err != nil {
		return &ErrorStruct{Type: ErrResponseWrite, Error: err, Status: status}
	}

	return nil
}

// RowScannerOneString scans one sql row and return as single string
func RowScannerOneString(rows *sql.Rows) (interface{}, error) {
	var val string
	err := rows.Scan(&val)
	return val, err
}

// readURLQuery returns a map of queries and a slice of missing ones
func readURLQuery(request *http.Request, args []string) (ans map[string]string, missing []string) {
	ans = make(map[string]string)
	for _, s := range args {
		keys, ok := request.URL.Query()[s]
		if !ok || len(keys[0]) < 1 {
			missing = append(missing, s)
		} else {
			ans[s] = keys[0]
		}
	}
	return
}
