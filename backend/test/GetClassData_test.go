package tests

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/routes"
)

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

	var classData []routes.Subclass
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

func TestGetRequestClassDataFails(t *testing.T) {
	req, err := http.NewRequest("GET", "/api_class_data", nil)

	if err != nil {
		t.Errorf("Could not create request")
	}

	response := GetClassData(req)
	checkResponseCode(t, http.StatusMethodNotAllowed, response.Code)
}

func GetClassData(request *http.Request) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	routes.GetClassData(recorder, request)
	return recorder
}
