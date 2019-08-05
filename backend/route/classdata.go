package route

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/ucsdscheduleplanner/UCSD-Schedule-Planner/backend/store"
)

// LogPrefixClassData log prefix for ClassData route
const LogPrefixClassData = "[ClassData]"

// columns to select from db
const classDataColumns = "DEPARTMENT, COURSE_NUM, SECTION_ID, COURSE_ID, TYPE, DAYS, TIME, LOCATION, ROOM, INSTRUCTOR, DESCRIPTION"

// ClassDataRequest stores information from a corresponding request
type ClassDataRequest struct {
	Quarter    string
	Department string
	CourseNum  string
}

// UnmarshalJSON populates a ClassDataRequest with the data from a JSON byte slice
func (o *ClassDataRequest) UnmarshalJSON(data []byte) error {
	var v map[string]string
	if err := json.Unmarshal(data, &v); err != nil {
		return err
	}

	if val, ok := v["quarter"]; ok {
		o.Quarter = val
	} else {
		o.Quarter = defaultQuarter
	}

	o.Department = v["department"]
	if o.Department == "" {
		return fmt.Errorf("Failed to parse class data request json: empty department")
	}

	o.CourseNum = v["courseNum"]
	if o.CourseNum == "" {
		return fmt.Errorf("Failed to parse class data request json: empty courseNum")
	}

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

/*
	buildQueryClassData
	receives: []ClassDataRequest
	returns:
	* a sql string
  * a slice of quarters
  * a queryParams slice with size 6
	Example:
	SELECT
		DEPARTMENT, COURSE_NUM, SECTION_ID, COURSE_ID, TYPE, DAYS, TIME, LOCATION, ROOM, INSTRUCTOR, DESCRIPTION
	FROM
		FA20
	WHERE
		(DEPARTMENT, COURSE_NUM) IN ((?,?),(?,?))
	UNION ALL
	(SELECT
		DEPARTMENT, COURSE_NUM, SECTION_ID, COURSE_ID, TYPE, DAYS, TIME, LOCATION, ROOM, INSTRUCTOR, DESCRIPTION
	FROM
		SP_19
	WHERE
		(DEPARTMENT, COURSE_NUM) IN((?,?))
	)

	Contract: len(classesToQuery) > 0
	No order of queries and quarters guaranteed
*/
func buildQueryClassData(classesToQuery []ClassDataRequest) (queryString string, quarters []string, queryParams []interface{}) {
	queryMap := make(map[string][]ClassDataRequest)
	for _, class := range classesToQuery {
		queryMap[class.Quarter] = append(queryMap[class.Quarter], class)
	}

	var queryBuilder strings.Builder

	isFirstQuarter := true
	for quarter, classes := range queryMap {
		quarters = append(quarters, quarter)
		if !isFirstQuarter {
			fmt.Fprintf(&queryBuilder, " UNION ALL (")
		}
		fmt.Fprintf(&queryBuilder, "SELECT %s FROM %s WHERE (DEPARTMENT, COURSE_NUM) IN (", classDataColumns, quarter)
		for iClass, class := range classes {
			if iClass != 0 {
				fmt.Fprintf(&queryBuilder, ",")
			}
			fmt.Fprintf(&queryBuilder, "(?,?)")
			queryParams = append(queryParams, []interface{}{class.Department, class.CourseNum}...)
		}
		fmt.Fprintf(&queryBuilder, ")")
		if !isFirstQuarter {
			fmt.Fprintf(&queryBuilder, ")")
		}
		isFirstQuarter = false
	}

	queryString = queryBuilder.String()

	return
}

// GetClassData is a route.HandlerFunc for class data route
func GetClassData(writer http.ResponseWriter, request *http.Request, db *store.DB) *ErrorStruct {
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

	if len(classesToQuery) == 0 {
		return &ErrorStruct{Type: ErrPostRead, Error: fmt.Errorf("Empty post: Require an array of ClassDataRequest in JSON")}
	}

	queryString, queryQuarters, queryParams := buildQueryClassData(classesToQuery)

	res, es := Query(
		db,
		QueryStruct{
			RowScanner:  RowScannerClassData,
			Query:       queryString,
			QueryTables: queryQuarters,
			QueryParams: queryParams,
		},
	)

	if es != nil {
		return es
	}

	ret := make(map[string][]Subclass)

	// construct the json to return using a map
	for _, classData := range res {
		subclass := classData.(Subclass)
		classTitle := fmt.Sprintf("%s %s", subclass.Department, subclass.CourseNum)
		ret[classTitle] = append(ret[classTitle], subclass)
	}

	return Response(writer, request, ret)
}
