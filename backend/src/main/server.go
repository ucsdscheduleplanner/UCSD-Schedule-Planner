package main

import (
	"backend"
	_ "github.com/go-sql-driver/mysql"
	"net/http"
)

func main() {
	if backend.Config == nil {
		panic("Could not find configuration file, shutting down");
	}

	println("Server has started on port 8080")
	http.HandleFunc("/api_department", backend.GetDepartments)
	http.HandleFunc("/api_class_data", backend.GetClassData)

	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}
