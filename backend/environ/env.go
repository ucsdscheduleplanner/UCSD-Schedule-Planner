// Package environ manages the environment vars and configs for the backend
package environ

import (
	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/store"
	"gopkg.in/ini.v1"
)

// Env for routes, stores environment variables for the route handlers
type Env struct {
	DB             *store.DB
	DefaultQuarter string
}

// NewEnv returns a pointer to a Env
func NewEnv(db *store.DB, defaultQuarter string) *Env {
	return &Env{DB: db, DefaultQuarter: defaultQuarter}
}

// NewEnvConfig reads from a config ini file and returns a pointer to a Env
func NewEnvConfig(db *store.DB, config *ini.File) (*Env, error) {
	defaultQuarter := config.Section("DB").Key("DEFAULT_QUARTER").String()
	return NewEnv(db, defaultQuarter), nil
}
