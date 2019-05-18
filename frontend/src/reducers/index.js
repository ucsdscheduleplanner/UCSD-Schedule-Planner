import {combineReducers} from 'redux';
import DayTimePreferenceReducer from './DayTimePreferenceReducer';
import ClassInputReducer from './ClassInputReducer';
import GenerateReducer from "./ScheduleGenerationReducer";
import ClassListReducer from "./ClassListReducer";
import IgnoreClassTypesReducer from "./IgnoreClassTypesReducer";
import ScheduleReducer from "./ScheduleReducer";
import ScheduleBuilderReducer from "./ScheduleBuilderReducer";
import ViewClassTypesReducer from "./ViewClassTypesReducer";
import ClassRegistryReducer from "./ClassRegistryReducer";
import InstructorPreferenceReducer from "./InstructorPreferenceReducer";

const reducers = combineReducers({
    DayTimePreference: DayTimePreferenceReducer,
    ClassInput: ClassInputReducer,
    ScheduleGenerate: GenerateReducer,
    ClassList: ClassListReducer,
    Schedule: ScheduleReducer,
    ScheduleBuilder: ScheduleBuilderReducer,
    IgnoreClassTypes: IgnoreClassTypesReducer,
    ViewClassTypes: ViewClassTypesReducer,
    ClassRegistry: ClassRegistryReducer,
    InstructorPreference: InstructorPreferenceReducer
});

export default reducers;
