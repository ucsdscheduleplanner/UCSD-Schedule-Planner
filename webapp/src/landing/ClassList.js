import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {removeClass, removeConflict} from '../actions/index';
import {Card} from 'primereact/components/card/Card';

import "../css/ClassList.css";

const activateSidePanelUI = () => {
    let classListPanel = document.querySelector('.class-list');
    classListPanel.animate({
        width: ["0", "75%"],
    }, {
        duration: 300,
        fill: "forwards"
    });
    let firstItem = document.querySelector('.class-item');
    firstItem.style.opacity = 0;
    firstItem.animate({
        opacity: ["0", "1"],
    }, {
        delay: 300,
        duration: 100,
        fill: "forwards"
    });
};

class ClassList extends Component {

    componentDidUpdate(prevProps) {
        if (Object.keys(this.props.selectedClasses).length !== 0
            && Object.keys(prevProps.selectedClasses).length === 0) {
            activateSidePanelUI();
        }
    }

    render() {
        let classes = Object.keys(this.props.selectedClasses).map((selectedClassKey, index) => {
            let selectedClass = this.props.selectedClasses[selectedClassKey];
            return (<button className="class-button" key={selectedClassKey} onClick={(e) => console.log("hello world")}>
                    <div className="class-item">
                        {selectedClass['class_title']}
                    </div>
                    <div className="class-item-border"/>
                </button>
            )
        });

        return (
            <div className="class-list">
                {classes}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassSelection
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        removeClass: removeClass,
        removeConflict: removeConflict
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassList);

