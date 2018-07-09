import React, {PureComponent} from 'react';
import "../css/ClassList.css";

const activateSidePanelUI = () => {
    let classListPanel = document.querySelector('.class-list');
    classListPanel.animate({
        width: ["0", "100%"],
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

const deactivateSidePanelUI = () => {
    let classListPanel = document.querySelector('.class-list');
    classListPanel.animate({
        width: ["100%", "0"],
    }, {
        duration: 300,
        fill: "forwards"
    });
};

export default class ClassList extends PureComponent {
    componentDidUpdate(prevProps) {
        if (Object.keys(this.props.selectedClasses).length !== 0
            && Object.keys(prevProps.selectedClasses).length === 0) {
            activateSidePanelUI();
        } else if(Object.keys(this.props.selectedClasses).length === 0
            && Object.keys(prevProps.selectedClasses).length !== 0) {
            deactivateSidePanelUI();
        }
    }

    render() {
        let classes = Object.keys(this.props.selectedClasses).map((selectedClassKey, index) => {
            let selectedClass = this.props.selectedClasses[selectedClassKey];
            return (
                <button className="class-button"
                            onClick={(e) => {
                                this.props.exitCalendarMode();
                                this.props.enterEditMode(selectedClassKey)
                            }}
                            key={selectedClassKey}>
                    <div className="class-item">
                        {/* TODO decouple this from classTitle maybe use a getter on the class */}
                        {selectedClass['classTitle']}
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
