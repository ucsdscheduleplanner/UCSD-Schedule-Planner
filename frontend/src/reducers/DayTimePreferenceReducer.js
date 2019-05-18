import moment from "moment";
import {TimeBuilder} from "../utils/time/TimeUtils";

const momentDefaultStart = moment("1970-01-01 17:00Z");
const momentDefaultEnd = moment("1970-01-01 01:00Z");

let defaultStart = new TimeBuilder().withHour(9).build();
let defaultEnd = new TimeBuilder().withHour(17).build();

const defaultGlobalPref = {
    startPref: defaultStart,
    endPref: defaultEnd,
    dayPref: null
};
export default function DayTimePreference(state = {
    startPref: momentDefaultStart,
    endPref: momentDefaultEnd,
    globalPref: defaultGlobalPref,
    dayPref: null,
    displayed: false,
}, action) {
    return state;
}
