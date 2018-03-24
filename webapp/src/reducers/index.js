import {combineReducers} from 'redux';
import ClassSelection from './ClassSelection';
import ScheduleGeneration from './ScheduleGeneration';

const reducers = combineReducers({
    ClassSelection,
    ScheduleGeneration
});

export default reducers;