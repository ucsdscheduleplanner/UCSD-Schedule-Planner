import {combineReducers} from 'redux';
import ClassSelection from './ClassSelectionReducer';
import ScheduleGeneration from './ScheduleGenerationReducer';
import ClassInput from './ClassInputReducer';

const reducers = combineReducers({
    ClassSelection,
    ScheduleGeneration,
    ClassInput
});

export default reducers;