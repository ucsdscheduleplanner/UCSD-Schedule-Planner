package tests

import (
	"backend"
	"bytes"
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

func TestGetClassData(t *testing.T) {
	data := map[string]string{
		"department": "CSE",
		"courseNum":  "11",
	}
	request := []map[string]string{
		data,
	}
	jsonValues, err := json.Marshal(request)

	if err != nil {
		t.Fatal(err.Error())
	}

	req, err := http.NewRequest("POST", "/api_class_data", bytes.NewBuffer(jsonValues))

	if err != nil {
		t.Errorf("Could not create request")
	}

	response := GetClassData(req)
	body, err := ioutil.ReadAll(response.Body)

	var classData []backend.Subclass
	err = json.Unmarshal(body, &classData)

	if len(classData) == 0 {
		t.Errorf("Subclasses for %s should definitely not be 0!", "CSE 11")
	}

	for i := 0; i < len(classData); i++ {
		subClass := classData[i]
		if subClass.Department != "CSE" {
			t.Errorf("Department should be %s but is %s", "CSE", subClass.Department)
		}
		if subClass.CourseNum != "11" {
			t.Errorf("CourseNum should be %s but is %s", "11", subClass.Department)
		}
	}

	checkResponseCode(t, http.StatusOK, response.Code)
}

func GetDepartments(request *http.Request) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	backend.GetDepartments(recorder, request)
	return recorder
}

func GetClassData(request *http.Request) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	backend.GetClassData(recorder, request)
	return recorder
}

func checkResponseCode(t *testing.T, expected, actual int) {
	if expected != actual {
		t.Errorf("Expected response code %d. Got %d\n", expected, actual)
	}
}
