import {SET_INSTRUCTOR_PREF} from "../actions/preference/instructor/InstructorPreferenceActions";

export default function InstructorPreference(state = {
    // a map between Class and preferred instructor
    instructors: {},
}, action) {
    switch (action.type) {
        case SET_INSTRUCTOR_PREF:
            let instructor = action.instructor;
            let classTitle = action.classTitle;

            let copy = Object.assign({}, state.instructors);
            copy[classTitle] = instructor;

            return Object.assign({}, state, {instructors: copy});
        default:
            return state;
    }
};
