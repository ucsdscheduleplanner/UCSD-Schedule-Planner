import React from 'react';
import {DownloadOptions} from "./DownloadOptions";
import {connect} from "react-redux";

class DownloadOptionsContainer extends React.PureComponent {

    render() {
        return (
            <DownloadOptions
                currentSchedule={this.props.currentSchedule}
                classData={this.props.classData}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        currentSchedule: state.Schedule.currentSchedule,
        classData: state.Schedule.classData,
    }
}

export default connect(mapStateToProps)(DownloadOptionsContainer);
