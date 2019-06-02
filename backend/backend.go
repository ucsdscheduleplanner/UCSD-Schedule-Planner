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

const port = 8080

func makeHandler(f func(http.ResponseWriter, *http.Request, *db.DatabaseStruct), ds *db.DatabaseStruct) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) { f(w, r, ds) }
}

func main() {
	var config, err = ini.Load(filepath.Join(".", "config", "config.example.ini"))

	if err != nil {
		panic("Error reading config file: " + err.Error())
	}

	if config == nil {
		panic("Could not find configuration file, shutting down")
	}

	// open once, close once
	ds, err := db.New(config)
	if err != nil {
		panic("Failed to init db: " + err.Error())
	}

	defer ds.Close()

	log.Printf("Starting server on port: %v\n", port)

	http.HandleFunc("/api_departments", makeHandler(routes.GetDepartments, ds))
	http.HandleFunc("/api_class_data", makeHandler(routes.GetClassData, ds))
	http.HandleFunc("/api_course_nums", makeHandler(routes.GetCourseNums, ds))
	http.HandleFunc("/api_instructors", makeHandler(routes.GetInstructors, ds))
	http.HandleFunc("/api_types", makeHandler(routes.GetTypes, ds))

	// close db no matter what
	log.Panic(http.ListenAndServe(":"+strconv.Itoa(port), nil))
}
