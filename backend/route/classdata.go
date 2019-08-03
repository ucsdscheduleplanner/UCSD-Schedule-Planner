package route

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

// LogPrefixClassData log prefix for ClassData route
const LogPrefixClassData = "[ClassData]"

// ClassDataRequest stores information from a corresponding request
type ClassDataRequest struct {
	quarter      string
	department   string
	courseNumber string
}

// UnmarshalJSON populates a ClassDataRequest with the data from a JSON byte slice
func (o *ClassDataRequest) UnmarshalJSON(data []byte) error {
	var v map[string]string
	if err := json.Unmarshal(data, &v); err != nil {
		return err
	}

	if val, ok := v["quarter"]; ok {
		o.quarter = val
	} else {
		o.quarter = defaultQuarter
	}

	o.department = v["department"]
	o.courseNumber = v["courseNum"]
	return nil
}

// Subclass groups data to be packed into a JSON as http response
type Subclass struct {
	Department  string `json:"department"`
	CourseNum   string `json:"courseNum"`
	SectionId   string `json:"sectionId"`
	CourseId    string `json:"courseId"`
	ClassType   string `json:"type"`
	Days        string `json:"days"`
	Time        string `json:"time"`
	Location    string `json:"location"`
	Room        string `json:"room"`
	Instructor  string `json:"instructor"`
	Description string `json:"description"`
}

// RowScannerClassData scans one sql row and return as a DepartmentSummary Struct
func RowScannerClassData(rows *sql.Rows) (interface{}, error) {

	val := Subclass{}

	err := rows.Scan(
		&val.Department,
		&val.CourseNum,
		&val.SectionId,
		&val.CourseId,
		&val.ClassType,
		&val.Days,
		&val.Time,
		&val.Location,
		&val.Room,
		&val.Instructor,
		&val.Description)

	return val, err
}

// GetClassData is a route.HandlerFunc for class data route
func GetClassData(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) *ErrorStruct {

	if request.Method != "POST" {
		return &ErrorStruct{Type: ErrHTTPMethodInvalid}
	}

	body, err := ioutil.ReadAll(request.Body)

	if err != nil {
		return &ErrorStruct{Type: ErrPostRead, Error: err}
	}

	var classesToQuery []ClassDataRequest
	err = json.Unmarshal(body, &classesToQuery)

	if err != nil {
		return &ErrorStruct{Type: ErrPostParse, Error: err}
	}

	// TODO: reduce to one query?

	// query := "SELECT * FROM " + currentClass.quarter + "WHERE DEPARTMENT"

	ret := make(map[string][]Subclass)
	for i := 0; i < len(classesToQuery); i++ {
		currentClass := classesToQuery[i]
		classTitle := fmt.Sprintf("%s %s", currentClass.department, currentClass.courseNumber)
		// TODO: remove SELECT *
		query := "SELECT * FROM " + currentClass.quarter + " WHERE DEPARTMENT=? AND COURSE_NUM=?"
		rows, err := ds.Query(currentClass.quarter, query, currentClass.department, currentClass.courseNumber)

		if err != nil {
			return &ErrorStruct{Type: ErrQuery, Error: err,
				Query: query, QueryParams: []interface{}{currentClass.department, currentClass.courseNumber}}
		}

		if rows == nil {
			return &ErrorStruct{Type: ErrQueryEmpty,
				Query: query, QueryParams: []interface{}{currentClass.department, currentClass.courseNumber}}
		}

		for rows.Next() {

			row, err := RowScannerClassData(rows)

			if err != nil {
				return &ErrorStruct{Type: ErrQueryScan, Error: err}
			}

			ret[classTitle] = append(ret[classTitle], row.(Subclass))
		}
	}

	return response(writer, request, ret)

}
