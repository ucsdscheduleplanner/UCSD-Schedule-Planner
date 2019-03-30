import React from 'react';
import Dayz from "dayz/dist/dayz";
import TimePreferenceEventContainer from "./TimePreferenceEventContainer";

export default class TimePreferenceEventWrapper extends Dayz.EventsCollection.Event {

    constructor(range) {
        const event = {
            range: range,
            resizable: {step: 15}
        };
        super(event);
    }


    defaultRenderImplementation() {
        return (
            <TimePreferenceEventContainer {...this.attributes} />
        );
    }
}

