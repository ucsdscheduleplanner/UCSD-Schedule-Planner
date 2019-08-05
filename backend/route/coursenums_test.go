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

func TestGetDepartmentSummary(t *testing.T) {
	req, err := http.NewRequest("GET", "/api_course_nums?department=CSE&quarter=SP19", nil)

	if err != nil {
		t.Fatal("Could not create the request.")
	}

	d, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer d.Close()

	mock.ExpectQuery(`^SELECT DISTINCT DEPARTMENT, COURSE_NUM, DESCRIPTION FROM (.+)`).
		WithArgs("CSE").
		WillReturnRows(sqlmock.NewRows([]string{"DEPARTMENT", "COURSE_NUM", "DESCRIPTION"}).
			AddRow("CSE", "11", "Java"))

	db := store.NewDB(d, map[string]bool{"SP19": true})

	response := mockGetDepartmentSummary(req, db)
	checkResponseCode(t, http.StatusOK, response.Code)

	body, err := ioutil.ReadAll(response.Body)

	var departmentSummary []DepartmentSummary
	err = json.Unmarshal(body, &departmentSummary)

	if len(departmentSummary) == 0 {
		t.Fatal("Department summary cannot be empty")
	}

	for _, el := range departmentSummary {
		if el.Department != "CSE" || len(el.CourseNum) == 0 {
			t.Fatal("Invalid department summary entry")
		}
	}
}

func TestGetDepartmentSummaryFailsOnPost(t *testing.T) {
	req, err := http.NewRequest("POST", "/api_course_nums?department=CSE&quarter=SP19", nil)

	if err != nil {
		t.Fatal("Could not create the request.")
	}

	response := mockGetDepartmentSummary(req, nil)

	checkResponseCode(t, http.StatusMethodNotAllowed, response.Code)
}

func mockGetDepartmentSummary(request *http.Request, db *store.DB) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	MakeHandler(GetCourseNums, db, LogPrefixCourseNums)(recorder, request)
	return recorder
}
