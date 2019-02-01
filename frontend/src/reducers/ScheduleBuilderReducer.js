/**
 Reducer to manage state for schedule builder
 **/

import {SET_SECTION_NUM} from "../actions/schedule/builder/ScheduleBuilderActions";

export default function ScheduleBuilderReducer(state = {
    // what section num the user has selected
    sectionNum: null,
}, action) {
    switch (action.type) {
        case SET_SECTION_NUM:
            return Object.assign({}, state, {
                sectionNum: action.sectionNum
            });
        default:
            return state;
    }
}
