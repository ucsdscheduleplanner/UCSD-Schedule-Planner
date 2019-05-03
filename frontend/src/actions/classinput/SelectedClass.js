export default class SelectedClass {
    constructor(department, courseNum, transactionID) {
        this.department = department;
        this.courseNum = courseNum;
        this.transactionID = transactionID;
        this.classTitle = `${department} ${courseNum}`;

        this.instructor = null;
    }
}
