import React, {PureComponent} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {toggleEditMode} from "../../../../actions/classinput/ClassInputActions";
import {ClassEvent} from "../../event/ClassEvent";
import ClassUtils from "../../../../utils/class/ClassUtils";


class ScheduleGeneratorEventContainer extends PureComponent {
    isSelected() {
        let userSelectedClass = ClassUtils.getClassFor(this.props.transactionID, this.props.selectedClasses);
        if (userSelectedClass)
            return userSelectedClass.classTitle === this.props.classTitle;
        return false;
    }

    onClick() {
        let transactionID = ClassUtils.getTransactionIDForClass(this.props.classTitle, this.props.selectedClasses);
        if (transactionID)
            this.props.toggleEditMode(transactionID);

        this.setState({popOverOpen: false});
    }

    render() {
        const isSelected = this.isSelected();
        return (
            <ClassEvent
                classTitle={this.props.classTitle}
                instructor={this.props.instructor}
                range={this.props.range}
                type={this.props.type}
                id={this.props.id}
                location={this.props.location}
                room={this.props.room}

                isSelected={isSelected}
                onClick={this.onClick.bind(this)}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassList.selectedClasses,
        transactionID: state.ClassInput.transactionID
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleEditMode: toggleEditMode,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleGeneratorEventContainer);
