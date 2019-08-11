package main

import (
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"strconv"

	"gopkg.in/ini.v1"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/environ"
	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/route"
	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/store"
)

// Config for the backend
type Config struct {
	File *ini.File
	Port int
}

func readConfig(configFile string) (*Config, error) {
	config, err := ini.Load(configFile)

	if err != nil {
		return nil, fmt.Errorf("Error reading config file: %v", err)
	}

	if config == nil {
		return nil, fmt.Errorf("Could not find config file: %v", configFile)
	}

	port, err := config.Section("BACKEND").Key("PORT").Int()
	if err != nil {
		return nil, fmt.Errorf("Error reading port number: %v", err.Error())
	}

	return &Config{File: config, Port: port}, nil
}

func main() {

	// config, err := readConfig(filepath.Join(".", "config", "config.example.ini"))
	config, err := readConfig(filepath.Join(".", "config", "config.dev.ini"))

	if err != nil {
		panic("Failed to load config: " + err.Error())
	}

	db, err := store.NewDBConfig(config.File)
	if err != nil {
		panic("Failed to init db: " + err.Error())
	}
	defer db.Close()

	env, err := environ.NewEnvConfig(db, config.File)
	if err != nil {
		panic("Failed to init env: " + err.Error())
	}

	log.Printf("Start server on port: %v\n", config.Port)

	routeFactory := route.HandlerFactory{Env: env}

	http.HandleFunc("/api_course_nums", routeFactory.MakeHandler(route.HandlerCourseNum))
	http.HandleFunc("/api_departments", routeFactory.MakeHandler(route.HandlerDepartment))
	http.HandleFunc("/api_instructors", routeFactory.MakeHandler(route.HandlerInstructors))
	http.HandleFunc("/api_types", routeFactory.MakeHandler(route.HandlerTypes))
	http.HandleFunc("/api_class_data", routeFactory.MakeHandler(route.HandlerClassData))

	err = http.ListenAndServe(":"+strconv.Itoa(config.Port), nil)

	if err != nil {
		log.Panic(err) // non-fatal to run deferred calls
	}
}
