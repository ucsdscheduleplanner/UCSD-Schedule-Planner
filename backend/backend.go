package main

import (
	"log"
	"net/http"
	"path/filepath"
	"strconv"

	"gopkg.in/ini.v1"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/routes"
)

// TODO: make this config-able
const port = 8080

// create closure for http handler func
func makeHandler(f func(http.ResponseWriter, *http.Request, *db.DatabaseStruct), ds *db.DatabaseStruct) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) { f(w, r, ds) }
}

func main() {

	var config, err = ini.Load(filepath.Join(".", "config", "config.example.ini"))

	// var config, err = ini.Load(filepath.Join(".", "config", "config.dev.ini"))

	if err != nil {
		panic("Error reading config file: " + err.Error())
	}

	if config == nil {
		panic("Could not find configuration file, shutting down")
	}

	// open once, close once
	ds, err := db.NewIni(config)
	if err != nil {
		panic("Failed to init db: " + err.Error())
	}

	// only for the completeness of the code
	defer ds.Close()

	log.Printf("Starting server on port: %v\n", port)

	http.HandleFunc("/api_departments", makeHandler(routes.GetDepartments, ds))
	http.HandleFunc("/api_class_data", makeHandler(routes.GetClassData, ds))
	http.HandleFunc("/api_course_nums", makeHandler(routes.GetCourseNums, ds))
	http.HandleFunc("/api_instructors", makeHandler(routes.GetInstructors, ds))
	http.HandleFunc("/api_types", makeHandler(routes.GetTypes, ds))

	err = http.ListenAndServe(":"+strconv.Itoa(port), nil)

	if err != nil {
		log.Panic(err) // not fatal to close db (defer above)
	}
}
