import React from "react";
import {mount, shallow} from 'enzyme';
import WeekCalendar from "../components/schedule/WeekCalendar";
import "./setupTests";

describe('Google calendar integration', () => {
    it('Renders correctly', () => {
        expect(shallow(<WeekCalendar/>).find("#gcalendar-button").length).toBe(1);
    });
});