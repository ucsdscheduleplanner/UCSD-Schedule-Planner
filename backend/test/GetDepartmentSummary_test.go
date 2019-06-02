package tests

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/routes"
)

func TestGetDepartmentSummary(t *testing.T) {
	req, err := http.NewRequest("GET", "/api_course_nums?department=CSE&quarter=SP19", nil)

	if err != nil {
		t.Fatal("Could not create the request.")
	}

	response := GetDepartmentSummary(req)
	checkResponseCode(t, http.StatusOK, response.Code)

	body, err := ioutil.ReadAll(response.Body)

	var departmentSummary []routes.DepartmentSummary
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

	response := GetDepartmentSummary(req)

	checkResponseCode(t, http.StatusMethodNotAllowed, response.Code)
}

func GetDepartmentSummary(request *http.Request) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	routes.GetCourseNums(recorder, request)
	return recorder
}
