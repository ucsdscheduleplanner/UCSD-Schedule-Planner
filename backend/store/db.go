// Package store manages storage
package store

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"

	_ "github.com/go-sql-driver/mysql" // import mysql driver
	"gopkg.in/ini.v1"
)

// DB stores a *sql.DB and a set of legal tables names
type DB struct {
	db       *sql.DB
	tableSet map[string]bool
}

// NewDB returns *DB
func NewDB(d *sql.DB, t map[string]bool) *DB {
	return &DB{db: d, tableSet: t}
}

// NewDBConnect returns *DB with validated database connection
func NewDBConnect(user, password, endpoint, database string, tableSet map[string]bool) (*DB, error) {
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s)/%s", user, password, endpoint, database))

	if err != nil {
		return nil, err
	}

	// validate the connection
	err = db.Ping()

	if err != nil {
		return nil, err
	}

	return NewDB(db, tableSet), nil
}

// NewDBConfig reads from a config ini file and returns a *DB
func NewDBConfig(config *ini.File) (*DB, error) {
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

	// TODO: make this graceful
	// defaultTables for scheduleplanner web app, will be added to tableSet by default when connecting
	// var defaultTables = []string{"DEPARTMENT"}
	// TODEL: must delete CLASS_DATA, for back compatibility temporarily
	var defaultTables = []string{"DEPARTMENT", "CLASS_DATA"}

	tables = append(tables, defaultTables...)

	tableSet := make(map[string]bool)

	for _, name := range tables {
		tableSet[name] = true
	}

	return NewDBConnect(username, password, endpoint, databaseName, tableSet)
}

func (d *DB) invalidTables(tableNames []string) (invalidTables []string) {
	for _, name := range tableNames {
		if !d.tableSet[name] {
			invalidTables = append(invalidTables, name)
		}
	}
	return
}

// Close the DB
func (d *DB) Close() {
	d.db.Close()
}

// Query using the input SQL query
func (d *DB) Query(tableNames []string, sqlQuery string, params ...interface{}) (*sql.Rows, error) {
	if invalidTables := d.invalidTables(tableNames); invalidTables != nil {
		return nil, fmt.Errorf("Invalid table names: '%v'", invalidTables)
	}

	// Query will creates a connection and automatically release it
	// ref: https://golang.org/src/database/sql/sql.go?s=40984:41081#L1522
	return d.db.Query(sqlQuery, params...)
}
