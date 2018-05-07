export const PRODUCTION = false;
export let BACKEND_URL = "";

if(PRODUCTION) {
    BACKEND_URL = "https://api.sdschedule.com";
} else {
    BACKEND_URL = "";
}
