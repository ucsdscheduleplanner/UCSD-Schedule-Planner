export const PRODUCTION = false;
//export let BACKEND_URL = "";
export let BACKEND_URL = "https://api.sdschedule.com";

if(PRODUCTION) {
    BACKEND_URL = "https://api.sdschedule.com";
} else {
    BACKEND_URL = "";
}
