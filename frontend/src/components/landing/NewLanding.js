import React, {PureComponent} from 'react';
import {LandingHeader} from "./header/LandingHeader";
import {LandingBody} from "./body/LandingBody";
import {ToastContainer} from 'react-toastify';

import '../../css/NewLanding.css';
import 'react-toastify/dist/ReactToastify.css';
import {ToastMessageHandler} from "../../utils/message/ToastMessageHandler";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {setMessageHandler} from "../../actions/classinput/ClassInputMutator";

class NewLanding extends PureComponent {

    componentDidMount() {
        this.props.setMessageHandler(new ToastMessageHandler());
    }

    render() {
        return (
            <React.Fragment>
                <LandingHeader/>
                <LandingBody/>
                <ToastContainer/>
            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
            setMessageHandler: setMessageHandler,
        }, dispatch,
    );
}

export default connect(null, mapDispatchToProps,)(NewLanding);
