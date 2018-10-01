import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import "./css/Landing.css";
import {LeftSidePanel} from './components/landing/LeftSidePanel';
import RightSidePanel from './components/landing/RightSidePanel';
import MainPanel from './components/landing/MainPanel';
import MessageHandler from "./utils/MessageHandler";
import {initMessageHandler} from "./actions/ClassInputActions";
import {CacheManager} from "./utils/CacheManager";

class Landing extends Component {
    constructor(props) {
        super(props);
        CacheManager.init();
    }

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
