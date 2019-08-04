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
	db       *sql.DB
	tableSet map[string]bool
}

// New returns a pointer to a DatabaseStruct
func New(d *sql.DB, t map[string]bool) *DatabaseStruct {
	return &DatabaseStruct{db: d, tableSet: t}
}

// Connect returns a pointer to a DatabaseStruct while trying to connect using parameters
func Connect(user, password, endpoint, database string, tableSet map[string]bool) (*DatabaseStruct, error) {

	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s)/%s", user, password, endpoint, database))
	// db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@/%s%s", user, password, endpoint, database))

	if err != nil {
		return nil, err
	}

	err = db.Ping() // validate the connection

	if err != nil {
		return nil, err
	}

	return New(db, tableSet), nil
}

// NewIni reads from an ini file and returns a pointer to a DatabaseStruct
func NewIni(config *ini.File) (*DatabaseStruct, error) {

	username := config.Section("DB").Key("USERNAME").String()
	password := config.Section("DB").Key("PASSWORD").String()
	endpoint := config.Section("DB").Key("ENDPOINT").String()
	databaseName := config.Section("DB").Key("DB_NAME").String()

	var tables []string

	quartersJSON := []byte(config.Section("VARS").Key("QUARTERS").String())
	err := json.Unmarshal(quartersJSON, &tables)

	if err != nil {
		return nil, errors.New("Failed to read quarters from config file: " + err.Error())
	}

	tables = append(tables, "DEPARTMENT")

	// TODEL: must delete, for back compatibility temporarily
	tables = append(tables, "CLASS_DATA")

	tableSet := make(map[string]bool)

	for _, name := range tables {
		tableSet[name] = true
	}

	return Connect(username, password, endpoint, databaseName, tableSet)
}

func (ds *DatabaseStruct) invalidTables(tableNames []string) (invalidTables []string) {
	for _, name := range tableNames {
		if !ds.tableSet[name] {
			invalidTables = append(invalidTables, name)
		}
	}
	return
}

// Close the DB
func (ds *DatabaseStruct) Close() {
	ds.db.Close()
}

// Query using the input SQL query
func (ds *DatabaseStruct) Query(tableNames []string, sqlQuery string, params ...interface{}) (*sql.Rows, error) {
	if invalidTables := ds.invalidTables(tableNames); invalidTables != nil {
		return nil, fmt.Errorf("Invalid table names: '%v'", invalidTables)
	}

	// Query will creates a connection and automatically release it
	// ref: https://golang.org/src/database/sql/sql.go?s=40984:41081#L1522
	return ds.db.Query(sqlQuery, params...)
}
