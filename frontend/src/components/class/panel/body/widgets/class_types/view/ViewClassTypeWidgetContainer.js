import React, {PureComponent} from 'react';

import {connect} from "react-redux";
import {ViewClassTypeWidget} from "./ViewClassTypeWidget";


class ViewClassTypeWidgetContainer extends PureComponent {

    render() {
        const displayedClassTypes = this.props.viewClassTypeMapping[this.props.Class.classTitle];
        return (
            <ViewClassTypeWidget Class={this.props.Class}
                                 inputHandler={this.props.inputHandler}
                                 displayedClassTypes={displayedClassTypes}
                                 types={this.props.Class.types}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        viewClassTypeMapping: state.ViewClassTypes.classMapping,
    }
}

export default connect(mapStateToProps)(ViewClassTypeWidgetContainer);
