// Package routes includes the route handlers for sd schedule planner
package routes

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

const logTagClassData = "[ClassData]"

// TODO: make this graceful, maybe an Env var or config
// set default quarter to SP19
const defaultQuarter = "SP19"

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

// GetClassData is a pre-http.HandlerFunc for class data route and will become a closure with *DatabaseStruct
func GetClassData(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) {

	if request.Method != "POST" {
		errInvalidMethod(logTagClassData, writer, request)
		return
	}

	body, err := ioutil.ReadAll(request.Body)

	if err != nil {
		errRequestBodyPost(logTagClassData, err, writer, request)
		return
	}

	var classesToQuery []ClassDataRequest
	err = json.Unmarshal(body, &classesToQuery)

	if err != nil {
		errRequestBodyParse(logTagClassData, err, writer, request)
		return
	}

	// TODO: reduce to one query?

	ret := make(map[string][]Subclass)
	for i := 0; i < len(classesToQuery); i++ {
		currentClass := classesToQuery[i]
		classTitle := fmt.Sprintf("%s %s", currentClass.department, currentClass.courseNumber)
		query := "SELECT * FROM " + currentClass.quarter + " WHERE DEPARTMENT=? AND COURSE_NUM=?" // TODO: remove SELECT *
		rows, err := ds.Query(currentClass.quarter, query, currentClass.department, currentClass.courseNumber)

		if err != nil {
			errQuery(logTagClassData, err, writer, request, query, currentClass.department, currentClass.courseNumber)
			return
		}

		if rows == nil {
			errEmptyQuery(logTagClassData, writer, request, query, currentClass.department, currentClass.courseNumber)
			return
		}

		for rows.Next() {
			subClass := Subclass{}

			err := rows.Scan(
				&subClass.Department,
				&subClass.CourseNum,
				&subClass.SectionId,
				&subClass.CourseId,
				&subClass.ClassType,
				&subClass.Days,
				&subClass.Time,
				&subClass.Location,
				&subClass.Room,
				&subClass.Instructor,
				&subClass.Description)

			if err != nil {
				errParseQueryResult(logTagClassData, err, writer, request)
				return
			}

			ret[classTitle] = append(ret[classTitle], subClass)
		}
	}

	retJSON, err := json.Marshal(ret)

	if err != nil {
		errCreateResponse(logTagClassData, err, writer, request)
		return
	}

	status, err := writer.Write(retJSON)

	if err != nil {
		errWriteResponse(logTagClassData, err, writer, request, status)
		return
	}

}
