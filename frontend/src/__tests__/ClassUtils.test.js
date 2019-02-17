import {makeTimeInterval} from "../utils/time/TimeUtils";
import ClassUtils from "../utils/class/ClassUtils";

const testInput = {
    classData: [
        {
            title: "CSE 12",
            number: "12",
            description: "Basic Data Struct & OO Design  ( 4Units)",
            department: "CSE",
            sections: [{
                id: "961434",
                sectionNum: "CSE12$0",
                subsections: [{
                    day: "Tu",
                    instructor: "Politz, Joseph Gibbs",
                    location: "YORK",
                    room: "115",
                    timeInterval: makeTimeInterval("17:00-17:50", "Tu"),
                    type: "DI",
                }]
            }]
        }
    ],
    conflicts: [],
    preferences: []
};


describe("Class utils", () => {

    test("Getting subsections from section num and class data", () => {
        let subsections = ClassUtils.getSubsectionsFor("CSE12$0", testInput.classData);

        chaiExpect(subsections).to.have.lengthOf(1);
        chaiExpect(subsections[0].location).to.equal("YORK");
    });

    test("Getting event info from schedule and class data", () => {
        let eventInfo = ClassUtils.getEventInfo(["CSE12$0"], testInput.classData);

        chaiExpect(eventInfo).to.have.lengthOf(1);
        chaiExpect(eventInfo[0].location).to.equal("YORK");
        chaiExpect(eventInfo[0].id).to.equal("961434");
    });
});
