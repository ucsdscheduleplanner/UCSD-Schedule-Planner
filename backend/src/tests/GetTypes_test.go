package tests

import (
	"backend/routes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetTypes(t *testing.T) {
	req, err := http.NewRequest("GET", "/api_types?department=CSE&courseNum=11&quarter=SP19", nil)

	if err != nil {
		t.Fatal("Could not create the request.")
	}

	response := GetTypes(req)
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

func GetTypes(request *http.Request) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	routes.GetTypes(recorder, request)
	return recorder
}
