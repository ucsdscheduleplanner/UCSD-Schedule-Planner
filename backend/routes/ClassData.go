// Package routes includes the route handlers for sd schedule planner
package routes

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/db"
)

// TODO create some error checking functions to handle duplicated error checking codes
const logTagClassData = "[ClassData]"

// TODO make this graceful
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

// GetClassData is a pre-http.HandlerFunc for class data route ready to be a closure with *DatabaseStruct
func GetClassData(writer http.ResponseWriter, request *http.Request, ds *db.DatabaseStruct) {

	if request.Method != "POST" {
		http.Error(writer, "Unsupported request type", http.StatusMethodNotAllowed)
		return
	}

	body, err := ioutil.ReadAll(request.Body)

	if err != nil {
		http.Error(writer, "Error handling POST request", http.StatusBadRequest)
		log.Printf("%s Failed to read request to %q from %q: %s", logTagClassData, request.RequestURI, request.RemoteAddr, err.Error())
		return
	}

	var classesToQuery []ClassDataRequest
	err = json.Unmarshal(body, &classesToQuery)

	if err != nil {
		http.Error(writer, "Failed to parse request", http.StatusInternalServerError)
		log.Printf("%s Failed to parse request to %q from %q: %s", logTagClassData, request.RequestURI, request.RemoteAddr, err.Error())
		return
	}

	// TODO: reduce to one query?
	ret := make(map[string][]Subclass)
	for i := 0; i < len(classesToQuery); i++ {
		currentClass := classesToQuery[i]
		classTitle := fmt.Sprintf("%s %s", currentClass.department, currentClass.courseNumber)
		query := "SELECT * FROM " + currentClass.quarter + " WHERE DEPARTMENT=? AND COURSE_NUM=?"
		rows, err := ds.Query(currentClass.quarter, query, currentClass.department, currentClass.courseNumber)

		if err != nil {
			http.Error(writer, "Error querying for class data", http.StatusInternalServerError)
			// TODO think about better ways to log the query, and fix all the other such logs in other files
			log.Printf("%s Failed to query data with %q from %q: %s", logTagClassData, query+" "+currentClass.department+" "+currentClass.courseNumber, request.RemoteAddr, err.Error())
			return
		}

		// TODO this might not be an error, better error message?
		if rows == nil {
			http.Error(writer, "Error querying for class data", http.StatusInternalServerError)
			log.Printf("%s Empty query data with %q from %q: %s", logTagClassData, query+" "+currentClass.department+" "+currentClass.courseNumber, request.RemoteAddr, err.Error())
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
				http.Error(writer, "Error retrieving data", http.StatusInternalServerError)
				log.Printf("%s Failed to query data with %q from %q: %s", logTagClassData, query+" "+currentClass.department+" "+currentClass.courseNumber, request.RemoteAddr, err.Error())
				return
			}

			ret[classTitle] = append(ret[classTitle], subClass)
		}
	}

	retJSON, err := json.Marshal(ret)

	// TODO use a function to deal with same error checks for the routes
	if err != nil {
		http.Error(writer, "Error retrieving data", http.StatusInternalServerError)
		log.Printf("%s Failed to read data from ret in response to %q: %s", logTagClassData, request.RemoteAddr, err.Error())
		return
	}

	_, err = writer.Write(retJSON)

	if err != nil {
		http.Error(writer, "Failed to send response", http.StatusInternalServerError)
		log.Printf("%s Failed to write data in response to %q: %s", logTagClassData, request.RemoteAddr, err.Error()) // log JSON?
		return
	}
}
