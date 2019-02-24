import React from 'react';
import {makeTimeInterval} from "../../utils/time/TimeUtils";
import {mount} from "enzyme";
import {Provider} from "react-redux";
import ScheduleBuilderContainer from "../../components/schedule/builder/ScheduleBuilderContainer";
import {addClass} from "../../actions/classinput/ClassInputActions";

export const testSchedule = ["CSE12$0", "CSE11$0"];
export const testData = [
    {
        title: "CSE 12",
        number: "12",
        description: "Basic Data Struct & OO Design  ( 4Units)",
        department: "CSE",
        sections: [{
            id: "961434",
            sectionNum: "CSE12$0",
            subsections: [{
                day: "Tu",
                instructor: "Politz, Joseph Gibbs",
                location: "YORK",
                room: "115",
                timeInterval: makeTimeInterval("17:00-17:50", "Tu"),
                type: "DI",
            }]
        },
            {
                id: "961434",
                sectionNum: "CSE12$1",
                subsections: [{
                    day: "Tu",
                    instructor: "Politz, Joseph Gibbs",
                    location: "YORK",
                    room: "115",
                    timeInterval: makeTimeInterval("17:00-17:50", "Tu"),
                    type: "DI",
                }]
            }
        ]
    },
    {
        title: "CSE 11",
        number: "11",
        description: "Random class",
        department: "CSE",
        sections: [{
            id: "961434",
            sectionNum: "CSE11$0",
            subsections: [{
                day: "Tu",
                instructor: "Trando, Cameron",
                location: "WLH",
                room: "2001",
                timeInterval: makeTimeInterval("17:00-17:50", "Tu"),
                type: "DI",
            }]
        }]
    }
];

export function mountScheduleBuilder(store) {
    const wrapper = mount(
        <Provider store={store}>
            <ScheduleBuilderContainer/>
        </Provider>
    );

    return wrapper.find(ScheduleBuilderContainer).children().instance();
}

export function addClassForTest(classTitle, store) {
    let transactionID = store.getState().ClassInput.transactionID;
    store.dispatch(addClass({classTitle: classTitle}, transactionID));
    return transactionID;
}
