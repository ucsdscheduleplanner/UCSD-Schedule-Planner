import React, {Component} from 'react';
import {connect} from "react-redux";
import {Schedule} from "./Schedule";

class ScheduleContainer extends Component {
    render() {
        return (
            <Schedule generationResult={this.props.generationResult}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        generationResult: state.ScheduleGenerate.generationResult
    }
}

export default connect(mapStateToProps)(ScheduleContainer)
