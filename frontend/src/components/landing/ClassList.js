import React, {PureComponent} from 'react';
import {CSSTransition} from 'react-transition-group'
import "../../css/ClassList.css";
import 'primeicons/primeicons.css';
import SchedulePreferencesContainer from "../../containers/SchedulePreferencesContainer";
import {Button} from "primereact/components/button/Button";

const activateSidePanelUI = (callback) => {
    let classListPanel = document.querySelector('.class-list');
    classListPanel.animate({
        width: ["0", "100%"],
    }, {
        duration: 300,
        fill: "forwards"
    });
    let firstItem = document.querySelector('.class-item');
    firstItem.style.opacity = 0;
    let animation = firstItem.animate({
        opacity: ["0", "1"],
    }, {
        delay: 300,
        duration: 100,
        fill: "forwards"
    });
    animation.onfinish = callback;
};

const deactivateSidePanelUI = (callback) => {
    let classListPanel = document.querySelector('.class-list');
    let animation = classListPanel.animate({
        width: ["100%", "0"],
    }, {
        duration: 300,
        fill: "forwards"
    });
    animation.onfinish = callback;
};

export default class ClassList extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            sidePanelActivated: false,
        }
    }

    componentDidUpdate(prevProps) {
        if (Object.keys(this.props.selectedClasses).length !== 0
            && Object.keys(prevProps.selectedClasses).length === 0) {
            // want to have some delay on adding so use callback on finish
            activateSidePanelUI(e => this.setState({sidePanelActivated: true}));
        } else if (Object.keys(this.props.selectedClasses).length === 0
            && Object.keys(prevProps.selectedClasses).length !== 0) {
            deactivateSidePanelUI();
            // set state right after because want to delete immediately
            this.setState({sidePanelActivated: false});
        }
    }

    getSchedule() {
        this.props.getSchedule(this.props.selectedClasses);
    }

    addAddButton(classes) {
        classes.push(
            <React.Fragment key="add-button">
                <button className="class-button"
                        onClick={this.props.enterInputMode}>
                    <CSSTransition
                        in={this.state.sidePanelActivated}
                        classNames="addButton"
                        unmountOnExit
                        timeout={500}>
                        <i className="pi pi-plus-circle"/>
                    </CSSTransition>
                </button>
                <div className="class-item-border"/>
            </React.Fragment>
        );
    }

    addSettingsButton(classes) {
        classes.push(
            <React.Fragment key="settings-button">
                <button className="class-button"
                        onClick={(e) => this.props.setDisplayed(true)}>
                    <CSSTransition
                        in={this.state.sidePanelActivated}
                        classNames="addButton"
                        unmountOnExit
                        timeout={500}>
                        <i className="pi pi-cog"/>
                    </CSSTransition>
                </button>
                <div className="class-item-border"/>
            </React.Fragment>
        );
    }

    addGenerationButton(classes) {
        classes.push(
            <React.Fragment key="generate-button">
                <CSSTransition
                    in={this.state.sidePanelActivated}
                    classNames="addButton"
                    unmountOnExit
                    timeout={500}>

                    <Button id="generate-button"
                            className="class-button"
                            label="Generate"
                            onClick={this.getSchedule.bind(this)}>
                    </Button>
                </CSSTransition>
                <div className="class-item-border"/>
            </React.Fragment>
        );
    }

    render() {
        // puts the selected classes into a jsx array
        let classes = Object.keys(this.props.selectedClasses).map((selectedClassID, index) => {
            let selectedClass = this.props.selectedClasses[selectedClassID];
            return (
                <React.Fragment key={index}>
                    <SchedulePreferencesContainer/>
                    <div className="class-item-border"/>
                    <button className="class-button"
                            onClick={this.props.enterEditMode.bind(this, selectedClassID)}
                            key={selectedClassID}>
                        <div className="class-item">
                            {/* TODO decouple this from classTitle maybe use a getter on the class */}
                            {selectedClass['classTitle']}
                        </div>
                    </button>
                    <div className="class-item-border"/>
                </React.Fragment>
            )
        });

        // adding the buttons on top of the class list
        this.addAddButton(classes);
        this.addSettingsButton(classes);
        this.addGenerationButton(classes);

        return (
            <div className="class-list">
                {classes}
            </div>
        );
    }
}
