import React from 'react';
import Dayz from "dayz/dist/dayz";
import ScheduleBuilderEventContainer from "./ScheduleBuilderEventContainer";


export default class ScheduleBuilderEventCollection extends Dayz.EventsCollection.Event {
    defaultRenderImplementation() {
        return (
            <ScheduleBuilderEventContainer {...this.attributes} />
        );
    }
}


