import React from "react";
import {mount, shallow} from 'enzyme';
import "./setupTests";

import WeekCalendar from "../components/schedule/WeekCalendar";
import {ResultPanel} from "../components/schedule/ResultPanel";

import {expect} from 'chai';


describe('Calendar component', () => {

    let startTime = new Date();
    startTime.setHours(5);
    startTime.setMinutes(0);

    let endTime = new Date();
    endTime.setHours(6);
    endTime.setMinutes(20);

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
                start: startTime,
                end: endTime
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
                start: startTime,
                end: endTime
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
        expect(shallow(<WeekCalendar/>).hasClass("calendar-content")).to.equal(true);
    });

    it('Renders a class given a schedule', () => {
        expect(mount(<WeekCalendar
            schedule={testSchedule}/>).exists(".rbc-event-content")).to.equal(true);
    });

    it('Renders the download ics button given a schedule', () => {
        const wrapper = mount(<WeekCalendar schedule={testSchedule}/>);
        expect(wrapper.exists("#ics-button")).to.equal(true);
    });

    it('Renders a tab that can be used to choose which schedule from the generation result', () => {
        expect(mount(<ResultPanel
            generationResult={generationResult}/>).exists(".ui-tabview-title")).to.equal(true);
    });

    it('Renders multiple tabs given multiple schedules', () => {
        const wrapper = mount(<ResultPanel
            generationResult={generationResult}/>);

        expect(wrapper.find(".ui-tabview-title").length).to.equal(2);
    });

    it('Makes a modal when clicking on an event', () => {
        const wrapper = mount(<ResultPanel
            generationResult={generationResult}/>);

        expect(wrapper.find(".ce-component").length).to.equal(2);

        const eventButton = wrapper.find(".ce-component").first();
        eventButton.simulate('click');

        wrapper.update();

        expect(wrapper.find(".ui-dialog").length).to.equal(1);
    });

    it('Makes a modal with the correct title after click', () => {
        const wrapper = mount(<ResultPanel
            generationResult={generationResult}/>);

        const eventButton = wrapper.find(".ce-component").first();
        eventButton.simulate('click');

        wrapper.update();

        const modal = wrapper.find(".ui-dialog");
        expect(modal).to.contain.text("CSE 11");
    });

    it('Makes a modal with the correct public facing information after click', () => {
        const wrapper = mount(<ResultPanel
            generationResult={generationResult}/>);

        const eventButton = wrapper.find(".ce-component").first();
        eventButton.simulate('click');

        wrapper.update();

        const modal = wrapper.find(".ui-dialog");
        expect(modal).to.contain.text("CENTR");
        expect(modal).to.contain.text("Zaitsev, Anna L");
        expect(modal).to.contain.text("5:00");
        expect(modal).to.contain.text("6:20");
    });
});