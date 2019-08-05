package route

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"regexp"
	"sort"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/store"
)

var getClassDataColumns = []string{
	"Department",
	"CourseNum",
	"SectionId",
	"CourseId",
	"ClassType",
	"Days",
	"Time",
	"Location",
	"Room",
	"Instructor",
	"Description"}

func TestBuildQueryClassData(t *testing.T) {
	testRequests := [][]ClassDataRequest{
		{{"SP19", "LTEN", "25"}},
		{{"SP19", "LTEN", "26"}, {"SP19", "LTEN", "26"}},
		{{"SP19", "LTEN", "26"}, {"FA20", "LTEN", "26"}},
	}

	// note: there is no order of quarters and queryParams guaranteed
	// use same class to make testing easier

	expects := []struct {
		queryRex    string
		quarters    []string
		queryParams []interface{}
	}{
		{
			fmt.Sprintf(
				`SELECT %s FROM %s WHERE \(DEPARTMENT, COURSE_NUM\) IN \(\(\?,\?\)\)`, classDataColumns, "SP19",
			),
			[]string{"SP19"},
			[]interface{}{"LTEN", "25"},
		},
		{
			fmt.Sprintf(
				`SELECT %s FROM %s WHERE \(DEPARTMENT, COURSE_NUM\) IN \(\(\?,\?\),\(\?,\?\)\)`, classDataColumns, "SP19",
			),
			[]string{"SP19"},
			[]interface{}{"LTEN", "26", "LTEN", "26"},
		},
		{
			fmt.Sprintf(
				`SELECT %s FROM %s WHERE \(DEPARTMENT, COURSE_NUM\) IN \(\(\?,\?\)\) UNION ALL \(SELECT %s FROM %s WHERE \(DEPARTMENT, COURSE_NUM\) IN \(\(\?,\?\)\)\)`, classDataColumns, "(SP19|FA20)", classDataColumns, "(SP19|FA20)",
			),
			[]string{"SP19", "FA20"},
			[]interface{}{"LTEN", "26", "LTEN", "26"},
		},
	}

	for i, testRequest := range testRequests {

		expected := expects[i]

		rQuery := regexp.MustCompile(expected.queryRex)

		gotQuery, gotQuarters, gotParams := buildQueryClassData(testRequest)

		if !rQuery.MatchString(gotQuery) {
			t.Errorf("Wrong sql query, want '%v' got '%v'", rQuery, gotQuery)
		}

		if len(gotQuarters) != len(expected.quarters) {
			t.Fatalf("Wrong size of quarters slice, want '%v' got '%v'", expected.quarters, gotQuarters)
		}

		// order matters for testing but not matters for program
		sort.Strings(gotQuarters)
		sort.Strings(expected.quarters)

		for j, s := range gotQuarters {
			if s != expected.quarters[j] {
				t.Errorf("Wrong quarter: Want '%v', got '%v' with mismatch at index %v", expected.quarters, gotQuarters, j)
			}
		}

		if len(gotParams) != len(expected.queryParams) {
			t.Fatalf("Wrong size of query params slice, want '%v' got '%v'", expected.queryParams, gotParams)
		}

		for j, s := range gotParams {
			if s != expected.queryParams[j] {
				t.Errorf("Wrong query params: Want '%v', got '%v' with mismatch at index %v", expected.queryParams, gotParams, j)
			}
		}

	}

}

func TestGetClassData(t *testing.T) {
	data := map[string]string{
		"department": "CSE",
		"courseNum":  "11",
		"quarter":    "SP19",
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

	d, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer d.Close()

	mock.ExpectQuery(`^SELECT (.+) FROM SP19`).
		WithArgs("CSE", "11").
		WillReturnRows(sqlmock.NewRows(getClassDataColumns).
			AddRow("CSE", "11", "a", "a", "a", "a", "a", "a", "a", "a", "a"))

	db := store.NewDB(d, map[string]bool{"SP19": true})

	response := mockGetClassData(req, db)
	body, err := ioutil.ReadAll(response.Body)

	var classDataMap map[string][]Subclass
	err = json.Unmarshal(body, &classDataMap)

	if err != nil {
		t.Error(err)
	}

	classData := classDataMap["CSE 11"]

	if len(classData) == 0 {
		t.Errorf("Subclasses for %s should definitely not be empty!", "CSE 11")
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

	response := mockGetClassData(req, nil)
	checkResponseCode(t, http.StatusMethodNotAllowed, response.Code)
}

func mockGetClassData(request *http.Request, db *store.DB) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	MakeHandler(GetClassData, db, LogPrefixClassData)(recorder, request)
	return recorder
}
