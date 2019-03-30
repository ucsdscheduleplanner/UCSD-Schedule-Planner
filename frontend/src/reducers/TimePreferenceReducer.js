import {ADD_TIME_PREFERENCE, REMOVE_TIME_PREFERENCE} from "../actions/TimePreferenceActions";

export default function TimePreferenceReducer(state = {
    times: []
}, action) {
    let oldPreferences;
    switch (action.type) {
        /**
         * Called to add a time preference, action should only hold the time that should be added
         */
        case ADD_TIME_PREFERENCE:
            oldPreferences = state.times.slice();
            oldPreferences.push(action.time);
            return Object.assign({}, state, {
                times: oldPreferences
            });
        /**
         * Called to remove a time preference, action should only hold the time that should be removed
         */
        case REMOVE_TIME_PREFERENCE:
            oldPreferences = state.times.filter(preference => preference !== action.time);

            return Object.assign({}, state, {
                times: oldPreferences
            });
        default:
            return state;
    }
}
