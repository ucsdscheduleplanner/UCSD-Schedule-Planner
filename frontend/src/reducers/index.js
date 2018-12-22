import {combineReducers} from 'redux';
import SchedulePreferences from './SchedulePreferencesReducer';
import ClassInputReducer from './ClassInputReducer';
import GenerateReducer from "./ScheduleGenerationReducer";
import ClassListReducer from "./ClassListReducer";

const reducers = combineReducers({
    SchedulePreferences: SchedulePreferences,
    ClassInput: ClassInputReducer,
    ScheduleGenerate: GenerateReducer,
    ClassList: ClassListReducer
});

export default reducers;