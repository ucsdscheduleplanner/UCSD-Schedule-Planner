import React from 'react';
import ScheduleGeneratorContainer from "../../components/schedule/generator/ScheduleGeneratorContainer";
import {mount} from "enzyme";
import {Provider} from "react-redux";

export function mountScheduleGenerator(store) {
    const wrapper = mount(
        <Provider store={store}>
            <ScheduleGeneratorContainer/>
        </Provider>
    );

    return wrapper.find(ScheduleGeneratorContainer).children().instance();
}
