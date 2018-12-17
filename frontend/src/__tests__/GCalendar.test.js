import React from "react";
import {shallow} from 'enzyme';
import WeekCalendar from "../components/schedule/WeekCalendar";

import {expect} from 'chai';

describe('Google calendar integration', () => {
    it('Renders correctly', () => {
        expect(shallow(<WeekCalendar/>).find("#gcalendar-button").length).to.equal(1);
    });
});
