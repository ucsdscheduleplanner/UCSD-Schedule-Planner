import React from 'react';
import {getStore} from "./utils/ReduxUtils";
import WeekCalendarContainer from "../components/schedule/calendar/WeekCalendarContainer";
import Moment from 'moment'
import {extendMoment} from 'moment-range'
import {Provider} from "react-redux";
import {mount} from "enzyme";
import WeekCalendar from "../components/schedule/calendar/WeekCalendar";

const moment = extendMoment(Moment);


function mountWeekCalendar(store) {
    const wrapper = mount(
        <Provider store={store}>
            <WeekCalendarContainer/>
        </Provider>
    );

    return wrapper.find(WeekCalendar).instance();
}

describe("Behavior from interacting with the week calendar", () => {

    let store;
    beforeEach((done) => {
        store = getStore();
        done();
    });

    test("When double clicking day, adds to time preference", () => {
        let instance = mountWeekCalendar(store);
        let start = moment("2019-02-10").hours(8);
        instance.onDayDoubleClick(null, start);

        const state = store.getState().TimePreference;
        chaiExpect(state.times).to.have.lengthOf(1);
    });
});
