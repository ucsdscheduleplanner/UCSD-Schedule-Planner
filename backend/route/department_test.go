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

func TestGetDepartments(t *testing.T) {
	req, err := http.NewRequest("GET", "/api_department", nil)

	if err != nil {
		t.Errorf("Could not create request")
	}

	d, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer d.Close()

	mock.ExpectQuery(`^SELECT DISTINCT DEPT_CODE FROM DEPARTMENT`).
		WillReturnRows(sqlmock.NewRows([]string{"DEPT_CODE"}).
			AddRow("ECE"))

	db := store.NewDB(d, map[string]bool{"DEPARTMENT": true, "SP19": true})

	response := mockGetDepartments(req, db)

	if response.Code != 200 {
		t.Errorf("Expected a 200 code but got %d", response.Code)
	}

	body, err := ioutil.ReadAll(response.Body)

	var departments []string
	err = json.Unmarshal(body, &departments)

	if err != nil {
		t.Errorf("Server did not send valid JSON: " + err.Error())
	}
}

func TestGetDepartmentsOnPostFails(t *testing.T) {
	req, err := http.NewRequest("POST", "/api_department", nil)

	if err != nil {
		t.Errorf("Could not create request")
	}

	response := mockGetDepartments(req, nil)
	checkResponseCode(t, http.StatusMethodNotAllowed, response.Code)
}

func mockGetDepartments(request *http.Request, db *store.DB) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	MakeHandler(GetDepartments, db, LogPrefixDepartment)(recorder, request)
	return recorder
}
