import React from 'react';
import {bindActionCreators} from "redux";
import {removeTimePreference} from "../../../actions/TimePreferenceActions";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {TimeEvent} from "../event/TimeEvent";

class TimePreferenceEventContainer extends React.PureComponent {

    render() {
        return (
            <TimeEvent onClick={this.onClick.bind(this)}/>
        )
    }

    onClick() {
        console.log(this.props.range);
        this.props.removeTimePreference(this.props.range);
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
            removeTimePreference: removeTimePreference
        }, dispatch,
    );
}

TimePreferenceEventContainer.propTypes = {
    removeTimePreference: PropTypes.func.isRequired,
    range: PropTypes.object.isRequired,
};

export default connect(null, mapDispatchToProps)(TimePreferenceEventContainer)
