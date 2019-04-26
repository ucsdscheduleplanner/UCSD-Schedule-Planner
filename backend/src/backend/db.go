package backend

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"gopkg.in/ini.v1"
	"log"
)

var Config, _ = ini.Load("./config/config.example.ini")

type DatabaseConnection struct {
	db *sql.DB
}

func New(config *ini.File) DatabaseConnection {
	username := config.Section("DB").Key("USERNAME").String()
	password := config.Section("DB").Key("PASSWORD").String()
	endpoint := config.Section("DB").Key("ENDPOINT").String()
	databaseName := config.Section("DB").Key("DB_NAME").String()

	connectionString := fmt.Sprintf("%s:%s@/%s%s", username, password, endpoint, databaseName)
	db, err := sql.Open("mysql", connectionString)

	if err != nil {
		panic(err.Error())
	}

	return DatabaseConnection{db: db}
}

func (db DatabaseConnection) Close() {
	db.db.Close()
}

func (db DatabaseConnection) Query(sqlQuery string, params ...interface{}) *sql.Rows {
	results, err := db.db.Query(sqlQuery, params...)
	if err != nil {
		log.Fatal(err.Error())
	}
	return results
}
