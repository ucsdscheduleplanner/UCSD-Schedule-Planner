export const SET_DISPLAYED = "SET_DISPLAYED";

export function setDisplayed(displayed) {
    return {
        type: SET_DISPLAYED,
        displayed: displayed
    }
}
