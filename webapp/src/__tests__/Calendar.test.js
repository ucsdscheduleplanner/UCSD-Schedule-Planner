import React from "react";
import {shallow, mount, render} from 'enzyme';
import WeekCalendar from "../components/schedule/WeekCalendar";
import "./setupTests";


describe('Calendar component', () => {

    let testResult = {
        schedules:
            [{
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
                }]]
            }],
        errors: {},
    };

    it('Renders correctly', () => {
        expect(shallow(<WeekCalendar/>).hasClass("calendar-content")).toBe(true);
    });

    it('Renders a class given a generationResult', () => {
        expect(mount(<WeekCalendar
            generationResult={testResult}/>).exists(".rbc-event-content")).toBe(true);
    });

    it('Renders a slider that can be used to choose which generationResult', () => {
        expect(mount(<WeekCalendar
            generationResult={testResult}/>).exists(".ui-slider")).toBe(true);
    });
});