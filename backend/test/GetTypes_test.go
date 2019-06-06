package tests

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/routes"
)

func TestGetTypes(t *testing.T) {
	req, err := http.NewRequest("GET", "/api_types?department=CSE&courseNum=11&quarter=SP19", nil)

	if err != nil {
		t.Fatal("Could not create the request.")
	}

	d, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer d.Close()

	mock.ExpectQuery(`^SELECT DISTINCT TYPE FROM (.+)`).
		WithArgs("CSE", "11").
		WillReturnRows(sqlmock.NewRows([]string{"TYPE"}).
			AddRow("Lecture"))

	ds, _ := db.New(d, []string{"SP19"})

	response := GetTypes(req, ds)
	checkResponseCode(t, http.StatusOK, response.Code)

	body, err := ioutil.ReadAll(response.Body)

	var types []string
	err = json.Unmarshal(body, &types)

	if len(types) == 0 {
		t.Fatal("Types cannot be empty")
	}

	for _, el := range types {
		if len(el) == 0 {
			t.Fatal("Invalid class type")
		}
	}
}

func GetTypes(request *http.Request, ds *db.DatabaseStruct) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	routes.GetTypes(recorder, request, ds)
	return recorder
}
