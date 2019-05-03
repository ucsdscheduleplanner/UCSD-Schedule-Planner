package tests

import (
	"backend/routes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetInstructors(t *testing.T) {
	req, err := http.NewRequest("GET", "/api_instructors?department=CSE&courseNum=11&quarter=SP19", nil)

	if err != nil {
		t.Fatal("Could not create the request.")
	}

	response := GetInstructors(req)
	checkResponseCode(t, http.StatusOK, response.Code)

	body, err := ioutil.ReadAll(response.Body)

	var instructors []string
	err = json.Unmarshal(body, &instructors)

	if len(instructors) == 0 {
		t.Fatal("Instructors cannot be empty")
	}

	for _, el := range instructors {
		if len(el) == 0 {
			t.Fatal("Invalid instructor")
		}
	}
}

func GetInstructors(request *http.Request) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	routes.GetInstructors(recorder, request)
	return recorder
}
