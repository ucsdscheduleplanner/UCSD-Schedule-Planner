package main

import (
	"backend"
	"backend/routes"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"net/http"
	"time"
)

func LogWrapper(targetMux http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		targetMux.ServeHTTP(w, r)

		fmt.Printf(
			"\nRequest Type: %s \nEndpoint: %s \nRequest time: %v\n",
			r.Method,
			r.URL,
			time.Since(start),
		)
	})
}

func main() {
	if backend.Config == nil {
		panic("Could not find configuration file, shutting down")
	}

	println("Server has started on port 8080")

	mux := http.NewServeMux()
	mux.HandleFunc("/api_departments", routes.GetDepartments)
	mux.HandleFunc("/api_class_data", routes.GetClassData)
	mux.HandleFunc("/api_course_nums", routes.GetCourseNums)
	mux.HandleFunc("/api_instructors", routes.GetInstructors)
	mux.HandleFunc("/api_types", routes.GetTypes)

	if err := http.ListenAndServe(":8080", LogWrapper(mux)); err != nil {
		panic(err)
	}
}
