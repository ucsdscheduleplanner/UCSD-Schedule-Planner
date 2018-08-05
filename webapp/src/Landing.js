import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {generateSchedule} from "./schedulegeneration/ScheduleGenerator";
import "./css/Landing.css";
import {LeftSidePanel} from './landing/LeftSidePanel';
import {RightSidePanel} from './landing/RightSidePanel';
import MainPanel from './landing/MainPanel';
import MessageHandler from "./utils/MessageHandler";
import {initMessageHandler} from "./actions/ClassInputActions";

class Landing extends Component {
    render() {
        // have to remove padding from grid
        return (
            <React.Fragment>
                <div className="container">
                    <LeftSidePanel />
                    <MainPanel />
                    <RightSidePanel />

                    <MessageHandler ref={(el) => this.props.initMessageHandler(el)}/>
                </div>
            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        initMessageHandler: initMessageHandler,
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(Landing);
