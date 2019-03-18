import React from 'react';
import PropTypes from 'prop-types';
import WeekCalendar from "./WeekCalendar";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {addTimePreference} from "../../../actions/TimePreferenceActions";
import TimePreferenceEventWrapper from "../preferences/TimePreferenceEventWrapper";


class WeekCalendarContainer extends React.PureComponent {

    buildTimePreferenceEvents() {
        return this.props.times.map((time) => {
            return new TimePreferenceEventWrapper(time);
        })
    }

    render() {
        const timePreferenceEvents = this.buildTimePreferenceEvents();

        return (
            <WeekCalendar events={timePreferenceEvents.concat(this.props.events)}
                          addTimePreference={this.props.addTimePreference.bind(this)}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        times: state.TimePreference.times,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addTimePreference: addTimePreference,
    }, dispatch);
}

WeekCalendar.propTypes = {
    events: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(WeekCalendarContainer)
