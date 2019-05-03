package backend

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"gopkg.in/ini.v1"
	"log"
)

var Config, _ = ini.Load("./config/config.example.ini")

type DatabaseConnection struct {
	db     *sql.DB
	tableNames []string
}

func New(config *ini.File) DatabaseConnection {
	username := config.Section("DB").Key("USERNAME").String()
	password := config.Section("DB").Key("PASSWORD").String()
	endpoint := config.Section("DB").Key("ENDPOINT").String()
	databaseName := config.Section("DB").Key("DB_NAME").String()

	var tableNames []string
	quartersJson := []byte(config.Section("VARS").Key("QUARTERS").String())
	err := json.Unmarshal(quartersJson, &tableNames)

	if err != nil {
		log.Fatal("Could not get quarters from config file", err)
	}

	tableNames = append(tableNames, "DEPARTMENT")

	connectionString := fmt.Sprintf("%s:%s@/%s%s", username, password, endpoint, databaseName)
	db, err := sql.Open("mysql", connectionString)

	if err != nil {
		panic(err.Error())
	}

	return DatabaseConnection{db: db, tableNames: tableNames}
}

func (db DatabaseConnection) isValidTable(tableName string) bool {
	for _ , e := range db.tableNames {
		if e == tableName {
			return true
		}
	}
	return false
}

func (db DatabaseConnection) Close() {
	db.db.Close()
}

func (db DatabaseConnection) Query(tableName string, sqlQuery string, params ...interface{}) *sql.Rows {
	if !db.isValidTable(tableName) {
		log.Fatalf("Table name '%s' is not valid, cannot continue query", tableName)
	}
	results, err := db.db.Query(sqlQuery, params...)
	if err != nil {
		log.Fatal(err.Error())
	}
	return results
}
