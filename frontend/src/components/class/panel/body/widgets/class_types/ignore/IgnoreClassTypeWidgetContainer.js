import React, {PureComponent} from 'react';

import {connect} from "react-redux";
import {IgnoreClassTypeWidget} from "./IgnoreClassTypeWidget";


class IgnoreClassTypeWidgetContainer extends PureComponent {

    render() {
        const ignoreClassTypes = this.props.ignoreClassTypeMapping[this.props.Class.classTitle];
        return (
            <IgnoreClassTypeWidget Class={this.props.Class}
                                   inputHandler={this.props.inputHandler}
                                   ignoreClassTypes={ignoreClassTypes}
                                   types={this.props.Class.types}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        ignoreClassTypeMapping: state.IgnoreClassTypes.classMapping,
    }
}

export default connect(mapStateToProps)(IgnoreClassTypeWidgetContainer)
