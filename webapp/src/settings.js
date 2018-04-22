export const PRODUCTION = false;
export let BACKEND_URL = null;

if(PRODUCTION) {
    BACKEND_URL = "https://api.sdschedule.com";
} else {
    BACKEND_URL = "";
}
