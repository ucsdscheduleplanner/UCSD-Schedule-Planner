package main

import (
	"log"
	"net/http"
	"path/filepath"
	"strconv"

	"gopkg.in/ini.v1"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/route"
)

// TODO: make this config-able
const port = 8080

func main() {

	// var config, err = ini.Load(filepath.Join(".", "config", "config.example.ini"))

	var config, err = ini.Load(filepath.Join(".", "config", "config.dev.ini"))

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
	defer ds.Close()

	// only for the completeness of the code

	log.Printf("Starting server on port: %v\n", port)

	http.HandleFunc("/api_course_nums", route.MakeHandler(route.GetCourseNums, ds, route.LogPrefixCourseNums))
	http.HandleFunc("/api_departments", route.MakeHandler(route.GetDepartments, ds, route.LogPrefixDepartment))
	http.HandleFunc("/api_instructors", route.MakeHandler(route.GetInstructors, ds, route.LogPrefixInstructors))
	http.HandleFunc("/api_types", route.MakeHandler(route.GetTypes, ds, route.LogPrefixTypes))
	http.HandleFunc("/api_class_data", route.MakeHandler(route.GetClassData, ds, route.LogPrefixClassData))

	err = http.ListenAndServe(":"+strconv.Itoa(port), nil)

	if err != nil {
		log.Panic(err) // not fatal to close db (defer above)
	}
}
