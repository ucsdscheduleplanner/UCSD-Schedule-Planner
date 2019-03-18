import {getStore} from "./utils/ReduxUtils";
import Moment from 'moment'
import {extendMoment} from 'moment-range'
import {addTimePreference, removeTimePreference} from "../actions/TimePreferenceActions";

const moment = extendMoment(Moment);


describe("Tests for time preference", () => {

    let store;
    beforeEach((done) => {
        store = getStore();
        done();
    });

    test("Sanity check", () => {
        let state = store.getState().TimePreference;
        chaiExpect(state.times).to.have.lengthOf(0);
    });

    test("Test that can add times and have them reflect in the store state", () => {
        let start = moment("2019-02-10").hours(8);
        let end = moment("2019-02-10").hours(12);
        let newPref = moment.range(start, end);
        store.dispatch(addTimePreference(newPref));

        let state = store.getState().TimePreference;
        chaiExpect(state.times).to.have.lengthOf(1);
    });

    test("Test that can remove times and have them reflect in the store state", () => {
        let start = moment("2019-02-10").hours(8);
        let end = moment("2019-02-10").hours(12);
        let time = moment.range(start, end);
        store.dispatch(addTimePreference(time));
        store.dispatch(removeTimePreference(time));

        let state = store.getState().TimePreference;
        chaiExpect(state.times).to.have.lengthOf(0);
    });
});

