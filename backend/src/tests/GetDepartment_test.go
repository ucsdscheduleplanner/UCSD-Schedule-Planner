package tests

import (
	"backend/routes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetDepartments(t *testing.T) {
	req, err := http.NewRequest("GET", "/api_department", nil)

	if err != nil {
		t.Errorf("Could not create request")
	}

	response := GetDepartments(req)

	if response.Code != 200 {
		t.Errorf("Expected a 200 code but got %d", response.Code)
	}

	body, err := ioutil.ReadAll(response.Body)

	var departments []string
	err = json.Unmarshal(body, &departments)

	if err != nil {
		t.Errorf("Server did not send valid JSON")
	}
}

func TestGetDepartmentsOnPostFails(t *testing.T) {
	req, err := http.NewRequest("POST", "/api_department", nil)

	if err != nil {
		t.Errorf("Could not create request")
	}

	response := GetDepartments(req)
	checkResponseCode(t, http.StatusMethodNotAllowed, response.Code)
}

func GetDepartments(request *http.Request) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	routes.GetDepartments(recorder, request)
	return recorder
}
