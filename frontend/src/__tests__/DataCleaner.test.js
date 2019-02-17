import {expect} from 'chai';
import {DataCleaner} from "../utils/DataCleaner";
describe('Data cleaner', () => {
    const testScrapeResult = {
        "CSE 12": [{
            COURSE_ID: "961434",
            COURSE_NUM: "12",
            DAYS: "F",
            DEPARTMENT: "CSE",
            DESCRIPTION: "Basic Data Struct & OO Design  ( 4Units)",
            INSTRUCTOR: "Politz, Joseph Gibbs",
            LOCATION: "YORK",
            ROOM: "2622",
            SECTION_ID: "CSE12$0",
            TIME: "17:00-17:50",
            TYPE: "DI",
        }]
    };

    const testScrapeResultMultipleSubsections = {
        "DSC 22": [
            {
                COURSE_ID: "928293",
                COURSE_NUM: "22",
                DAYS: "F",
                DEPARTMENT: "DSC",
                DESCRIPTION: "Test Description",
                INSTRUCTOR: "Politz, Joseph Gibbs",
                LOCATION: "YORK",
                ROOM: "2622",
                SECTION_ID: "CSE12$0",
                TIME: "17:00-17:50",
                TYPE: "DI",
            },
            {
                COURSE_ID: "928293",
                COURSE_NUM: "22",
                DAYS: "Th",
                DEPARTMENT: "DSC",
                DESCRIPTION: "Test Description",
                INSTRUCTOR: "Test Professor",
                LOCATION: "YORK",
                ROOM: "2622",
                SECTION_ID: "CSE12$0",
                TIME: "10:00-10:50",
                TYPE: "LE",
            },
             {
                COURSE_ID: "928293",
                COURSE_NUM: "22",
                DAYS: "Tu",
                DEPARTMENT: "DSC",
                DESCRIPTION: "Test Description",
                INSTRUCTOR: "Test Professor 2",
                LOCATION: "YORK",
                ROOM: "2622",
                SECTION_ID: "CSE12$0",
                TIME: "8:00-8:50",
                TYPE: "LE",
            }
        ]
    };

    it('Separates data into one class with one class and one section', () => { // get the data in some way and try to clean it
        // result should return a list of class objects
        let result = DataCleaner.clean(testScrapeResult);
        expect(result.length).to.equal(1);
        let resClass = result[0];

        expect(resClass.title).to.equal("CSE 12");
        expect(resClass.department).to.equal("CSE");
        expect(resClass.number).to.equal("12");
        expect(resClass.description).to.equal("Basic Data Struct & OO Design  ( 4Units)");

        expect(resClass.sections.length).to.equal(1);

        let resSection = resClass.sections[0];

        expect(resSection.sectionNum).to.equal("CSE12$0");
        expect(resSection.id).to.equal("961434");

        expect(resSection.subsections.length).to.equal(1);
    });

    it('Separates data from multiple classes correctly', () => {
        // result should return a list of class objects
        let result = DataCleaner.clean(testScrapeResultMultipleSubsections);
        expect(result.length).to.equal(1);
        let resClass = result[0];

        expect(resClass.title).to.equal("DSC 22");
        expect(resClass.department).to.equal("DSC");
        expect(resClass.number).to.equal("22");
        expect(resClass.description).to.equal("Test Description");

        expect(resClass.sections.length).to.equal(1);

        let resSection = resClass.sections[0];

        expect(resSection.sectionNum).to.equal("CSE12$0");
        expect(resSection.id).to.equal("928293");

        expect(resSection.subsections.length).to.equal(3);
    });
});
