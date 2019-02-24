import React, {PureComponent} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {toggleEditMode} from "../../../../actions/classinput/ClassInputActions";
import {ClassEvent} from "../../event/ClassEvent";
import ClassUtils from "../../../../utils/class/ClassUtils";
import {codeToClassType} from "../../../class/panel/body/widgets/class_types/ignore/IgnoreClassTypeWidget";


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

    getDisplayComponent() {
        const classTitle = this.props.classTitle;
        const courseID = `Course ID: ${this.props.id}`;

        const TIME_STR = "h:mm a";
        const range = this.props.range;
        let startTime = 'TBD';
        let endTime = 'TBD';

        if (range) {
            startTime = range.start.format(TIME_STR);
            endTime = range.end.format(TIME_STR);
        }

        const time = `Time: ${startTime} - ${endTime}`;
        const location = `Location: ${this.props.location} ${this.props.room}`;
        const instructor = `Instructor: ${this.props.instructor}`;

        let formattedType = codeToClassType[this.props.type];
        const type = formattedType ? formattedType : "";
        const title = `${classTitle} ${type}`;

        return (
            <div className="ce-info__container">
                <div className="ce-info">
                    <div className="ce-info__title">
                        {title}
                    </div>
                    <div>
                        {courseID}
                    </div>
                    <div>
                        {location}
                    </div>
                    <div>
                        {instructor}
                    </div>
                    <div>
                        {time}
                    </div>
                </div>
            </div>
        )
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

                getDisplayComponent={this.getDisplayComponent.bind(this)}
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
