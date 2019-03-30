import moment from 'moment';
import ClassUtils from "../class/ClassUtils";

const CONFIG_KEY_CLIENT_ID = "client-id";
const CONFIG_API_KEY = "api-key";
const CONFIG_DISCOVERY_DOCS = "discoveryDocs";
const CONFIG_SCOPES = "scopes";

const configs = {
    "client-id": "215311567185-hq5j6i1sfqd6uk75vkuug1hrnvq6kqa2.apps.googleusercontent.com",
    "api-key": "AIzaSyCRoIa6XnnI1MhfuaOFSU4z7z7j5vt10ZM",
    "discoveryDocs": ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    "scopes": "https://www.googleapis.com/auth/calendar",
};

const GTIME_FORMAT = "YYYY-MM-DDTHH:mm:ssZ";
const NUM_WEEKS_AHEAD = 5;
const RECURRING_EVENT_RULE = "RRULE:FREQ=WEEKLY;COUNT=" + NUM_WEEKS_AHEAD;

export function getEvents(schedule, classData) {
    let events = [];
    const data = ClassUtils.getEventInfo(schedule, classData);

    for (let Class of data) {
        events.push({
            'summary': Class.classTitle,
            'location': `${Class.location} ${Class.room}`,
            'description': Class.description,
            'start': {
                "dateTime": Class.range.start.format(GTIME_FORMAT),
                "timeZone": "America/Los_Angeles"
            },
            'end': {
                "dateTime": Class.range.end.format(GTIME_FORMAT),
                "timeZone": "America/Los_Angeles"
            },
            'recurrence': [
                RECURRING_EVENT_RULE
            ],
        });
    }
    return events;
}

export function addToCalendar(schedule, classData) {
    const events = getEvents(schedule, classData);
    // Client ID and API key from the Developer Console

    const CLIENT_ID = configs[CONFIG_KEY_CLIENT_ID];
    const API_KEY = configs[CONFIG_API_KEY];
    const DISCOVERY_DOCS = configs[CONFIG_DISCOVERY_DOCS];
    const SCOPES = configs[CONFIG_SCOPES];

    async function addToGCalendar(isSignedIn) {
        if (isSignedIn) {
            for (let event of events) {
                await window.gapi.client.calendar.events.insert({
                    'calendarId': 'primary',
                    'resource': event
                });
                console.log("Added " + event['summary'] + " on " + event['start']['dateTime']);
            }
        }
    }

    async function start() {
        await window.gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        });
        const GAPI_AUTH_INSTANCE = window.gapi.auth2.getAuthInstance();

        await GAPI_AUTH_INSTANCE.signIn();
        await addToGCalendar(GAPI_AUTH_INSTANCE.isSignedIn.get());
    }

    window.gapi.load('client:auth2', start);
}
