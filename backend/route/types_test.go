package route

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/store"
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

	db := store.NewDB(d, map[string]bool{"SP19": true})

	response := mockGetTypes(req, db)
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

func mockGetTypes(request *http.Request, db *store.DB) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	MakeHandler(GetTypes, db, LogPrefixTypes)(recorder, request)
	return recorder
}
