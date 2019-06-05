package routes

import (
	"fmt"
	"log"
	"net/http"
)

// Notes

// Customized error: if specific error message needed, create a new combined error using fmt.Errorf() etc.
// Server only: currently only log server-side error, i.e. no logs for invalid input and so on
// More context in the future: the current logging logs the IP but it might not be enough for troubleshooting

func errInvalidMethod(tag string, writer http.ResponseWriter, request *http.Request) {
	http.Error(writer, "Invalid method type", http.StatusMethodNotAllowed)
}

func errRequestBodyPost(tag string, err error, writer http.ResponseWriter, request *http.Request) {
	http.Error(writer, "Error handling POST request", http.StatusBadRequest)
	log.Printf("%s Failed to read request to %q from %q: %s", tag, request.RequestURI, request.RemoteAddr, err.Error())
}

func errRequestBodyParse(tag string, err error, writer http.ResponseWriter, request *http.Request) {
	http.Error(writer, "Failed to parse request", http.StatusInternalServerError)
	log.Printf("%s Failed to parse request to %q from %q: %s", tag, request.RequestURI, request.RemoteAddr, err.Error())
}

func errQuery(tag string, err error, writer http.ResponseWriter, request *http.Request, query string, params ...interface{}) {
	http.Error(writer, "Error query", http.StatusInternalServerError)
	log.Printf("%s Failed to query data requested by %q with %q and params %#v: %s", tag, request.RemoteAddr, query, params, err.Error())
}

func errEmptyQuery(tag string, writer http.ResponseWriter, request *http.Request, query string, params ...interface{}) {
	http.Error(writer, "Could not query correctly.", http.StatusInternalServerError)
	log.Printf("%s Empty query data requested by %q with %q and params %#v", tag, request.RemoteAddr, query, params)
}

func errParseQueryResult(tag string, err error, writer http.ResponseWriter, request *http.Request) {
	http.Error(writer, "Could not scan data", http.StatusInternalServerError)
	log.Printf("%s Failed to parse returned rows: %s", tag, err.Error())
}

func errCreateResponse(tag string, err error, writer http.ResponseWriter, request *http.Request) {
	http.Error(writer, "Error creating the response JSON", http.StatusInternalServerError)
	log.Printf("%s Failed to create response JSON in response to %q: %s", tag, request.RemoteAddr, err.Error())
}

// func errWriteResponse(tag string, err error, writer http.ResponseWriter, request *http.Request, status int, JSON []byte) {
func errWriteResponse(tag string, err error, writer http.ResponseWriter, request *http.Request, status int) {
	// log JSON content?
	http.Error(writer, "Failed to send response", http.StatusInternalServerError)
	log.Printf("%s Failed to write data in response to %q: %v %s", tag, request.RemoteAddr, status, err.Error())
}

func errMissingInput(tag string, writer http.ResponseWriter, request *http.Request, missing []string) {
	http.Error(writer, fmt.Sprintf("Request does not contain necessary information: %#v", missing), http.StatusBadRequest)
	// skip logging invalid request for now
}
