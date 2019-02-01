import React from 'react';
import Dayz from "dayz/dist/dayz";
import ClassEventContainer from "./ClassEventContainer";

export default class ClassEventWrapper extends Dayz.EventsCollection.Event {
    defaultRenderImplementation() {
        return (
            <ClassEventContainer {...this.attributes} />
        );
    }
}

