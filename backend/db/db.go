// Package db provides a simple way to communicate with database
package db

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"

	_ "github.com/go-sql-driver/mysql" // import mysql driver
	"gopkg.in/ini.v1"
)

// DatabaseStruct stores a DB* and a slice of tables names
type DatabaseStruct struct {
	db         *sql.DB
	tableNames []string
}

// New returns a pointer to a DatabaseStruct
func New(config *ini.File) (*DatabaseStruct, error) {

	username := config.Section("DB").Key("USERNAME").String()
	password := config.Section("DB").Key("PASSWORD").String()
	endpoint := config.Section("DB").Key("ENDPOINT").String()
	databaseName := config.Section("DB").Key("DB_NAME").String()

	var tableNames []string

	quartersJSON := []byte(config.Section("VARS").Key("QUARTERS").String())
	err := json.Unmarshal(quartersJSON, &tableNames)

	if err != nil {
		return nil, errors.New("Failed to read quarters from config file: " + err.Error())
	}

	tableNames = append(tableNames, "DEPARTMENT")

	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@/%s%s", username, password, endpoint, databaseName))

	if err != nil {
		return nil, err
	}

	return &DatabaseStruct{db: db, tableNames: tableNames}, nil
}

func (ds *DatabaseStruct) isValidTable(tableName string) bool {
	for _, e := range ds.tableNames {
		if e == tableName {
			return true
		}
	}
	return false
}

// Close the DB
func (ds *DatabaseStruct) Close() {
	ds.db.Close()
}

// Query using the input SQL query
func (ds *DatabaseStruct) Query(tableName string, sqlQuery string, params ...interface{}) (*sql.Rows, error) {
	if !ds.isValidTable(tableName) {
		return nil, fmt.Errorf("Table name '%s' is not valid, cannot continue query", tableName)
	}
	// Query will creates a connection and automatically release it
	// ref: https://golang.org/src/database/sql/sql.go?s=40984:41081#L1522
	results, err := ds.db.Query(sqlQuery, params...)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return results, nil
}
