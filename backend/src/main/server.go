package main

import (
	"backend"
	"backend/routes"
	_ "github.com/go-sql-driver/mysql"
	"net/http"
)

func main() {
	if backend.Config == nil {
		panic("Could not find configuration file, shutting down")
	}

	println("Server has started on port 8080")

	http.HandleFunc("/api_departments", routes.GetDepartments)
	http.HandleFunc("/api_class_data", routes.GetClassData)
	http.HandleFunc("/api_course_nums", routes.GetCourseNums)
	http.HandleFunc("/api_instructors", routes.GetInstructors)
	http.HandleFunc("/api_types", routes.GetTypes)

	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}
