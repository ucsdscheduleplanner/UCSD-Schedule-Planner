import React from 'react';
import Dayz from "dayz/dist/dayz";
import ScheduleBuilderEventContainer from "./ScheduleBuilderEventContainer";


export default class ScheduleBuilderEventCollection extends Dayz.EventsCollection.Event {

    /**
     * Method called when two events have the same time ranges, which one should be shown first
     * @param event
     * @returns {number}
     */
    breakTie(event) {
        // TODO enforce this
        let classTitle1 = this.attributes.classTitle;
        let classTitle2 = event.attributes.classTitle;

        if(classTitle1 < classTitle2)
            return -1;
        else if(classTitle2 > classTitle1)
            return 1;
        else return 0;
    }


    defaultRenderImplementation() {
        return (
            <ScheduleBuilderEventContainer {...this.attributes} />
        );
    }
}


