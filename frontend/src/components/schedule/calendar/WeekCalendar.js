import React, {PureComponent} from "react";
import moment from 'moment';
import Dayz from "dayz/dist/dayz";

import "dayz/dist/css/dayz.min.css";
import "./WeekCalendar.css";
import ScheduleBuilderEventCollection from "../builder/event/ScheduleBuilderEventCollection";
import ScheduleGeneratorEventCollection from "../generator/event/ScheduleGeneratorEventCollection";


class WeekCalendar extends PureComponent {
    convertToRange(timeInterval) {
        if (timeInterval === null)
            return null;
        let start = timeInterval.start;
        let end = timeInterval.end;

        if (start && end) {
            start = moment(start);
            end = moment(end);
        } else {
            console.warn("Start or end are not valid");
            console.warn(start);
            console.warn(end);
        }

        return moment.range(start, end);
    }

    /**
     * Takes in classes and renders their sections and subsections
     * @param schedule
     * @returns {EventsCollection|*|EventsCollection|g}
     */
    createEvents(schedule) {
        let ret = [];
        for (let Class of schedule) {
            if (Class.sections.length === 0)
                continue;

            for (let section of Class.sections) {
                for (let subsection of section.subsections) {
                    let strippedClassData = Object.assign({}, Class, {sections: []});
                    let strippedSectionData = Object.assign({}, section, {subsections: []});

                    let timeRange = this.convertToRange(subsection.timeInterval);

                    ret.push(
                        new ScheduleBuilderEventCollection({
                            content: strippedSectionData.classTitle,
                            ...strippedClassData,
                            ...strippedSectionData,
                            ...subsection,
                            range: timeRange
                        })
                    );
                }
            }
        }
        return new Dayz.EventsCollection(ret);
    }

    onEventClick(ev, event) {
        console.log("got clicked");
        console.log(ev);
        console.log(event);
    }

    render() {
        const relativeDate = moment();
        const events = this.createEvents(this.props.schedule);

        return (
            <div className="calendar">
                <Dayz
                    onEventClick={this.onEventClick.bind(this)}
                    date={relativeDate}
                    events={events}
                    display="week"
                    displayHours={[8, 21]}
                />
            </div>
        );
    }
}


WeekCalendar.defaultProps = {
    schedule: [],
};

export default WeekCalendar;

