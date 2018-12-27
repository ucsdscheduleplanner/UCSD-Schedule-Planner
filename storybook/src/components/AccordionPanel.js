import React, {Component} from 'react';
import "../css/AccordionPanel.css";
import classNames from 'classnames';


export class AccordionPanel extends Component {

    open() {
        this.props.open(this.props.label);
    }

    render() {
        console.log(this.props.isOpen);
        const names = classNames(['accordion__panel', {active: this.props.isOpen}]);

        return (
            <React.Fragment>
                <div className="accordion__panel__label"
                     onClick={this.open.bind(this)}>{this.props.label}</div>
                <div className={names} >
                    {this.props.children}
                </div>
            </React.Fragment>
        );
    }
}