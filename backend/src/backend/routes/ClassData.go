package routes

import (
	"backend"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type ClassDataRequest struct {
	quarter      string
	department   string
	courseNumber string
}

func (o *ClassDataRequest) UnmarshalJSON(data []byte) error {
	var v map[string]string
	if err := json.Unmarshal(data, &v); err != nil {
		return err
	}

	// set default quarter to SP19
	if val, ok := v["quarter"]; ok {
		o.quarter = val
	} else {
		o.quarter = "SP19"
	}

	o.department = v["department"]
	o.courseNumber = v["courseNum"]
	return nil
}


type Subclass struct {
	Department  string `json:"department"`
	CourseNum   string `json:"courseNum"`
	SectionId   string `json:"sectionId"`
	CourseId    string `json:"courseId"`
	ClassType   string `json:"classType"`
	Days        string `json:"days"`
	Time        string `json:"time"`
	Location    string `json:"location"`
	Room        string `json:"room"`
	Instructor  string `json:"instructor"`
	Description string `json:"description"`
}

func GetClassData(writer http.ResponseWriter, request *http.Request) {
	if request.Method == "POST" {
		body, err := ioutil.ReadAll(request.Body)

		if err != nil {
			http.Error(writer, "Error handling POST request", http.StatusBadRequest);
		}

		var classesToQuery []ClassDataRequest
		err = json.Unmarshal(body, &classesToQuery)

		if err != nil {
			http.Error(writer, "Failed to parse request", http.StatusInternalServerError)
		}

		db := backend.New(Config)
		defer db.Close()

		var ret []Subclass
		for i := 0; i < len(classesToQuery); i++ {
			currentClass := classesToQuery[i]
			query := "SELECT * FROM " + currentClass.quarter + " WHERE DEPARTMENT=? AND COURSE_NUM=?"
			rows := db.Query(currentClass.quarter, query, currentClass.department, currentClass.courseNumber)

			if rows == nil {
				http.Error(writer, "Error querying for class data", http.StatusInternalServerError)
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
				}

				ret = append(ret, subClass)
			}
		}
		retJson, err := json.Marshal(ret)

		if err != nil {
			http.Error(writer, "Error retrieving data", http.StatusInternalServerError)
		}

		_, err = writer.Write(retJson)
		if err != nil {
			http.Error(writer, "Failed to send response", http.StatusInternalServerError)
		}
	} else {
		http.Error(writer, "Unsupported request type", http.StatusMethodNotAllowed)
	}
}

