import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";
import {setDisplayed} from "../actions/schedulepreference/SchedulePreferenceUIHandler";


describe("The functionality in which the SchedulePreferenceComponent is shown on the browser", () => {
    let store;
    beforeEach((done) => {
        store = createStore(reducers, applyMiddleware(thunk));
        done();
    });

    test("If component was not shown previously, toggling it displays it", () => {
        store.dispatch(setDisplayed(false));
        store.dispatch(setDisplayed(true));

        let state = store.getState().SchedulePreferences;
        chaiExpect(state.displayed).to.equal(true);
    });

    test("If component was shown previously, toggling it turns it off", () => {
        store.dispatch(setDisplayed(true));
        store.dispatch(setDisplayed(false));

        let state = store.getState().SchedulePreferences;
        chaiExpect(state.displayed).to.equal(false);
    });
});