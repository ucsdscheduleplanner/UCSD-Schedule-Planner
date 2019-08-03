// Package db provides a simple way to communicate with database
package db

// TODO: if necessary, covert the db struct to a Env struct
// that stores environment of the whole server, e.g. *DB, port, hostname, config, etc.
// Env will be constructed in main() and passed to all other handlers

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
func New(d *sql.DB, t []string) (*DatabaseStruct) {
	return &DatabaseStruct{db: d, tableNames: t}
}

// Connect returns a pointer to a DatabaseStruct while trying to connect using parameters
func Connect(user, password, endpoint, database string, tableNames []string) (*DatabaseStruct, error) {

	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s)/%s", user, password, endpoint, database))
	// db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@/%s%s", user, password, endpoint, database))

	if err != nil {
		return nil, err
	}

	err = db.Ping() // validate the connection

	if err != nil {
		return nil, err
	}

	return New(db, tableNames), nil
}

// NewIni reads from an ini file and returns a pointer to a DatabaseStruct
func NewIni(config *ini.File) (*DatabaseStruct, error) {

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

	// TODEL: must delete, for back compatibility temporarily
	tableNames = append(tableNames, "CLASS_DATA")

	return Connect(username, password, endpoint, databaseName, tableNames)
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
	return ds.db.Query(sqlQuery, params...)
}
