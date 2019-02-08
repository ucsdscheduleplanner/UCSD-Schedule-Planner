import React, {PureComponent} from 'react';

import {connect} from "react-redux";
import {ClassTypePrefWidget} from "./ClassTypePrefWidget";


class ClassTypePrefWidgetContainer extends PureComponent {

    render() {
        return (
            <ClassTypePrefWidget Class={this.props.Class}
                                 inputHandler={this.props.inputHandler}
                                 classTypesToIgnore={this.props.classTypesToIgnore}
                                 types={this.props.Class.types}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        classTypesToIgnore: state.ClassInput.classTypesToIgnore,
    }
}

export default connect(mapStateToProps)(ClassTypePrefWidgetContainer)
