package ctx

import (
	"fmt"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/store"
	"gopkg.in/ini.v1"
)

// Env for backend
// it stores environment of the whole server, e.g. *DB, port, hostname, config, etc.
// it will be constructed in main() and passed to all other handlers
type Env struct {
	Db             *store.DB
	Port           int
	DefaultQuarter string
}

// NewEnv returns a pointer to a Env
func NewEnv(db *store.DB, port int, defaultQuarter string) *Env {
	return &Env{Db: db, Port: port, DefaultQuarter: defaultQuarter}
}

// NewEnvConfig reads from a config ini file and returns a pointer to a Env
func NewEnvConfig(db *store.DB, config *ini.File) (*Env, error) {
	port, err := config.Section("BACKEND").Key("PORT").Int()
	if err != nil {
		return nil, fmt.Errorf("Error reading port number: %v", err.Error())
	}

	defaultQuarter := config.Section("DB").Key("DEFAULT_QUARTER").String()

	return NewEnv(db, port, defaultQuarter), nil
}
