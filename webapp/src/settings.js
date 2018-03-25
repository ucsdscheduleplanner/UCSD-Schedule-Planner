export let PRODUCTION = true;
export let BACKEND_URL = null;

if(PRODUCTION) {
    BACKEND_URL = "http://UCSD-Webscraper-Backend-dev.us-west-1.elasticbeanstalk.com";
} else {
    BACKEND_URL = "";
}
