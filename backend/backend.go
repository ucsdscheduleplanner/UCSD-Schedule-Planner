package main

import (
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"strconv"

	"gopkg.in/ini.v1"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/ctx"
	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/route"
	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/store"
)

func readConfig(configFile string) (config *ini.File, err error) {
	config, err = ini.Load(configFile)

	if err != nil {
		return nil, fmt.Errorf("Error reading config file: %v", err)
	}

	if config == nil {
		return nil, fmt.Errorf("Could not find config file: %v", configFile)
	}

	return
}

func main() {

	// config, err := readConfig(filepath.Join(".", "config", "config.example.ini"))
	config, err := readConfig(filepath.Join(".", "config", "config.dev.ini"))

	if err != nil {
		panic("Failed to load config: " + err.Error())
	}

	db, err := store.NewDBConfig(config)
	if err != nil {
		panic("Failed to init db: " + err.Error())
	}
	defer db.Close()

	env, err := ctx.NewEnvConfig(db, config)
	if err != nil {
		panic("Failed to init env: " + err.Error())
	}

	log.Printf("Start server on port: %v\n", env.Port)

	// TODO: use env in handlers
	// TODO: make a handler factory
	http.HandleFunc("/api_course_nums", route.MakeHandler(route.GetCourseNums, db, route.LogPrefixCourseNums))
	http.HandleFunc("/api_departments", route.MakeHandler(route.GetDepartments, db, route.LogPrefixDepartment))
	http.HandleFunc("/api_instructors", route.MakeHandler(route.GetInstructors, db, route.LogPrefixInstructors))
	http.HandleFunc("/api_types", route.MakeHandler(route.GetTypes, db, route.LogPrefixTypes))
	http.HandleFunc("/api_class_data", route.MakeHandler(route.GetClassData, db, route.LogPrefixClassData))

	err = http.ListenAndServe(":"+strconv.Itoa(env.Port), nil)

	if err != nil {
		log.Panic(err) // non-fatal to run deferred calls
	}
}
