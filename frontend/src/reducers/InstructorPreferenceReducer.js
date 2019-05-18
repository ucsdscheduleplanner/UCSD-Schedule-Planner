import {SET_INSTRUCTOR_PREF} from "../actions/preference/instructor/InstructorPreferenceActions";

/**
 * The reducer itself is a map between class title and preferred instructor
 */
export default function InstructorPreference(state = {}, action) {
    switch (action.type) {
        case SET_INSTRUCTOR_PREF:
            let instructor = action.instructor;
            let classTitle = action.classTitle;

            return Object.assign({}, state, {[classTitle]: instructor});
        default:
            return state;
    }
};
