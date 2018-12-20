import {combineReducers} from 'redux';
import SchedulePreferences from './SchedulePreferencesReducer';
import ClassInputReducer from './ClassInputReducer';
import GenerateReducer from "./GenerateReducer";
import ClassListReducer from "./ClassListReducer";

const reducers = combineReducers({
    SchedulePreferences: SchedulePreferences,
    ClassInput: ClassInputReducer,
    Generate: GenerateReducer,
    ClassList: ClassListReducer
});

export default reducers;