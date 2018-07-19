import {combineReducers} from 'redux';
import ClassSelection from './ClassSelectionReducer';
import ScheduleGeneration from './ScheduleGenerationReducer';
import ScheduleOptions from './ScheduleOptionsReducer';
import ClassInput from './ClassInputReducer';

const reducers = combineReducers({
    ScheduleOptions,
    ClassSelection,
    ScheduleGeneration,
    ClassInput,
});

export default reducers;