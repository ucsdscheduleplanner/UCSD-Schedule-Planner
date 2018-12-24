import React, {Component, PureComponent} from 'react';
import WeekCalendar from "./WeekCalendar";
import memoize from 'memoize-one';
import {TabView, TabPanel} from 'primereact/components/tabview/TabView';
import "../../css/ResultPanel.css";


/**
 * This class will hold the results of each generation result and pass them
 * to the corresponding calendar
 */
export class ResultPanel extends Component {

    constructor(props) {
        super(props);
        this.scheduleKey = 0;
        this.state = {
            scheduleIndex: 0,
        };
    }

    getKey() {
        return this.scheduleKey++;
    }

    hasSchedule = memoize((schedules) => {
        return schedules.length !== 0;
    });

    getCurrentSchedule = memoize((schedules, idx) => {
        if(idx < schedules.length)
            return schedules[idx];
        return null;
    });

    componentDidUpdate(prevProps) {
        console.log("GOT HERE");
        let hasNewError = false;

        if (this.props.generationResult && this.props.generationResult.errors)
            hasNewError = Object.keys(this.props.generationResult.errors).length > 0;

        if (hasNewError) {
            this.props.messageHandler.showError("Failed to generate generationResult", 1000);
            this.props.messageHandler.showError(this.getErrorMsg(), 3500);
        }
    }

    getErrorMsg() {
        let errors = this.props.generationResult.errors;
        let classWithMostConflicts = Object.keys(errors).reduce((key1, key2) => errors[key1].length > errors[key2].length ? key1 : key2);
        let conflicts = errors[classWithMostConflicts].join(", ");
        return `Failed to generate. Had the most trouble adding ${classWithMostConflicts}. During schedule generation, it 
        conflicted with ${conflicts}`
    }

    render() {
        let schedules = this.props.generationResult.schedules;
        const hasSchedule = this.hasSchedule(schedules);
        const currentSchedule = this.getCurrentSchedule(schedules, this.state.scheduleIndex);


        const scheduleComponents = schedules.map((element, index) => {
            const scheduleStr = `Schedule #${index}`;
            return (
                <TabPanel key={index} header={scheduleStr}>
                    <WeekCalendar
                        key={this.getKey()}
                        visible={hasSchedule}
                        messageHandler={this.props.messageHandler}
                        schedule={hasSchedule ? currentSchedule : undefined}/>
                </TabPanel>
            );
        });

        const blankCalendar = (
            <WeekCalendar
                empty={true}
                messageHandler={this.props.messageHandler}
                schedule={hasSchedule ? currentSchedule : undefined}/>
        );

        const calendarTabs = (
            <TabView activeIndex={this.state.scheduleIndex}
                     onTabChange={(e) => {
                         this.setState({
                             scheduleIndex: e.index,
                             currentSchedule: schedules[e.index]
                         });
                     }}>
                {scheduleComponents}
            </TabView>
        );

        if (schedules.length === 0)
            return (blankCalendar);
        else return (calendarTabs);
    }
}
