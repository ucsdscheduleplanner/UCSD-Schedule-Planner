package main

import (
	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

// Env for backend
type Env struct {
	Ds             *db.DatabaseStruct
	Port           int
	DefaultQuarter string
}
