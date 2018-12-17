import {makeTimeInterval} from "../utils/ClassUtils";
import {SGWorker} from "../schedulegeneration/SGWorker";

import {expect} from 'chai';


describe('Schedule generation', () => {

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

    const testInputShouldGiveError = {
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
            },
            {
                title: "CSE 11",
                number: "11",
                description: "Test Class ( 4Units)",
                department: "CSE",
                sections: [{
                    id: "2828382",
                    sectionNum: "CSE11$0",
                    subsections: [{
                        day: "Tu",
                        instructor: "Cameron Trando",
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

    it('It can generate a schedule of one class', () => {
        let worker = new SGWorker();
        let result = worker.generate(testInput);

        console.log(result);
        expect(Object.keys(result.errors).length).to.equal(0);
        expect(result.schedules.length).to.equal(1);

        // schedule is a list of classes
        let schedule = result.schedules[0];
        let Class = schedule[0];

        expect(Class.title).to.equal("CSE 12");
        expect(Class.number).to.equal("12");
        expect(Class.sections.length).to.equal(1);

        let section = Class.sections[0];

        expect(section.sectionNum).contains("$0");
    });

    it('Returns nothing on given empty data', () => {
        let worker = new SGWorker();
        let result = worker.generate({classData: [], conflicts: [], preferences: []});

        expect(Object.keys(result.errors).length).to.equal(0);
        console.log(result.schedules);
        expect(result.schedules.length).to.equal(0);
    });

    it('Can handle bad inputs correctly', () => {
        let worker = new SGWorker();
        let result = worker.generate({classData: [{hello: "world"}], conflicts: ["bad", "input"], preferences: ["really bad"]});

        expect(Object.keys(result.errors).length).should.equal(0);
        expect(result.schedules).should.equal(0);
    });

    it('Fails when two of the required classes overlap', () => {
        let worker = new SGWorker();
        let result = worker.generate(testInputShouldGiveError);

        expect(Object.keys(result.errors).length).to.not.equal(0);
        expect(result.schedules.length).to.equal(0);

        let errors = result.errors["CSE11$0"];
        expect(errors[0]).to.equal("CSE12$0");
    });


});
