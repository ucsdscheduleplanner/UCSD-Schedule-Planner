import {combineReducers} from 'redux';
import ClassSelection from './ClassSelectionReducer';
import ScheduleGeneration from './ScheduleGenerationReducer';
import SchedulePreferences from './SchedulePreferencesReducer';
import ClassInput from './ClassInputReducer';

const reducers = combineReducers({
    SchedulePreferences,
    ClassSelection,
    ScheduleGeneration,
    ClassInput,
});

export default reducers;