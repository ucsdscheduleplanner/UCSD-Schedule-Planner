import {SGWorker} from "../schedulegeneration/SGWorker";
import {makeTimeInterval} from "../utils/time/TimeUtils";

import {expect} from 'chai';


describe("Schedule generation unit tests", () => {
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
        conflicts: {"CSE 12": ["DI"]},
        preferences: []
    };

    it("Schedule generation can ignore sections correctly", () => {
        let sg = new SGWorker().getScheduleGenerator(testInput);

        let result = sg.isClassIgnored(testInput.classData[0]);
        expect(result).to.equal(true);
    });
});
