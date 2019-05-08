import React, {PureComponent} from 'react';

import PropTypes from 'prop-types';

import {connect} from "react-redux";
import {ViewClassTypeWidget} from "./ViewClassTypeWidget";


class ViewClassTypeWidgetContainer extends PureComponent {

    render() {
        const classTitle = this.props.classTitle;
        const displayedClassTypes = this.props.viewClassTypeMapping[classTitle] ?
            this.props.viewClassTypeMapping[classTitle] : [];
        const types = this.props.classTypeRegistry[classTitle] ?
            this.props.classTypeRegistry[classTitle] : [];

        return (
            <ViewClassTypeWidget classTitle={this.props.classTitle}
                                 inputHandler={this.props.inputHandler}
                                 displayedClassTypes={displayedClassTypes}
                                 types={types}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        viewClassTypeMapping: state.ViewClassTypes.classMapping,
        classTypeRegistry: state.ClassRegistry.types
    }
}

ViewClassTypeWidgetContainer.propTypes = {
    classTitle: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(ViewClassTypeWidgetContainer);
