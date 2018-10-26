import React from "react";
import {mount, shallow} from 'enzyme';
import "./setupTests";

import WeekCalendar from "../components/schedule/WeekCalendar";
import {ResultPanel} from "../components/schedule/ResultPanel";


describe('Calendar component', () => {

    let testSchedule = {
        classes: [[{
            classTitle: "CSE 11",
            courseID: "961427",
            courseNum: "11",
            day: "Tu",
            department: "CSE",
            description: "Intr/Computer Sci&Obj-Ori:Java( 4Units)",
            instructor: "Zaitsev, Anna L",
            location: "CENTR 115",
            room: "115",
            roomLocation: "CENTR",
            sectionID: "CSE11$0",
            time: "17:00-18:20",
            timeInterval: {
                start: new Date(),
                end: new Date()
            },
            type: "LE",
        }]],
        errors: {},
    };

    let testSchedule2 = {
        classes: [[{
            classTitle: "CSE 12",
            courseID: "961423",
            courseNum: "12",
            day: "Tu",
            department: "CSE",
            description: "Intr/Computer Sci&Obj-Ori:Java( 4Units)",
            instructor: "Zaitsev, Anna L",
            location: "CENTR 115",
            room: "115",
            roomLocation: "CENTR",
            sectionID: "CSE12$0",
            time: "12:00-15:20",
            timeInterval: {
                start: new Date(),
                end: new Date()
            },
            type: "LE",
        }]],
        errors: {},
    };

    const generationResult = {
        schedules: [
            testSchedule, testSchedule2
        ],
        errors: {}
    };

    it('Renders correctly', () => {
        expect(shallow(<WeekCalendar/>).hasClass("calendar-content")).toBe(true);
    });

    it('Renders a class given a schedule', () => {
        expect(mount(<WeekCalendar
            schedule={testSchedule}/>).exists(".rbc-event-content")).toBe(true);
    });

    it('Renders the download ics button given a schedule', () => {
        const wrapper = mount(<WeekCalendar schedule={testSchedule}/>);
        expect(wrapper.exists(".ics-button")).toBe(true);
    });

    it('Renders a tab that can be used to choose which schedule from the generation result', () => {
        expect(mount(<ResultPanel
            generationResult={generationResult}/>).exists(".ui-tabview-title")).toBe(true);
    });

    it('Renders multiple tabs given multiple schedules', () => {
        const wrapper = mount(<ResultPanel
            generationResult={generationResult}/>);

        expect(wrapper.find(".ui-tabview-title").length).toBe(2);
    });

});