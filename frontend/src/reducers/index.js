import {combineReducers} from 'redux';
import ClassSelection from './ClassSelectionReducer';
import ScheduleGeneration from './ScheduleGenerationReducer';
import SchedulePreferences from './SchedulePreferencesReducer';
import ClassInputReducer from './ClassInputReducer';

const reducers = combineReducers({
    SchedulePreferences,
    ClassSelection,
    ScheduleGeneration,
    ClassInput: ClassInputReducer,
});

export default reducers;