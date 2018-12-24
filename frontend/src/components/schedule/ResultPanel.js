import React, {PureComponent} from 'react';
import WeekCalendar from "./WeekCalendar";
import {TabView, TabPanel} from 'primereact/components/tabview/TabView';
import "../../css/ResultPanel.css";


/**
 * This class will hold the results of each generation result and pass them
 * to the corresponding calendar
 */
export class ResultPanel extends PureComponent {

    constructor(props) {
        super(props);

        console.log(props.generationResult);

        this.state = {
            scheduleIndex: 0,
            currentSchedule: null,
            hasSchedule: false,
            schedules: props.generationResult.schedules
        };

        this.state.errors = props.generationResult.errors;
        this.state.hasError = Object.keys(props.generationResult.errors).length > 0;
        this.state.hasSchedule = props.generationResult.schedules.length > 0 && !this.state.hasError;

        console.log(this.state.errors);
        if (this.state.hasError) {
            console.log("SHOWING ERROR");
            props.messageHandler.showError("Failed to generate generationResult", 1000);
            props.messageHandler.showError(this.getErrorMsg(), 3500);

            this.state.hasError = false;
        }

        if (!this.state.hasSchedule)
            return;

        this.state.currentSchedule = props.generationResult.schedules[this.state.scheduleIndex];
    }

    getErrorMsg() {
        let errors = this.state.errors;
        let classWithMostConflicts = Object.keys(errors).reduce((key1, key2) => errors[key1].length > errors[key2].length ? key1 : key2);
        let conflicts = errors[classWithMostConflicts].join(", ");
        return `Failed to generate. Had the most trouble adding ${classWithMostConflicts}. During schedule generation, it 
        conflicted with ${conflicts}`
    }

    render() {
        const schedules = this.state.schedules.map((element, index) => {
            const scheduleStr = `Schedule #${index}`;
            return (
                <TabPanel key={index} header={scheduleStr} >
                    <WeekCalendar
                        key={index}
                        visible={this.state.hasSchedule}
                        messageHandler={this.props.messageHandler}
                        schedule={this.state.hasSchedule ? this.state.currentSchedule : undefined}/>
                </TabPanel>
            );
        });

        const blankCalendar = (
            <WeekCalendar
                empty={true}
                messageHandler={this.props.messageHandler}
                schedule={this.state.hasSchedule ? this.state.currentSchedule : undefined}/>
        );

        const calendarTabs = (
            <TabView activeIndex={this.state.scheduleIndex}
                     onTabChange={(e) => {
                         this.setState({
                             scheduleIndex: e.index,
                             currentSchedule: this.props.generationResult.schedules[e.index]
                         });
                     }}>
                {schedules}
            </TabView>
        );

        if (schedules.length === 0)
            return (blankCalendar);
        else return (calendarTabs);
    }
}
