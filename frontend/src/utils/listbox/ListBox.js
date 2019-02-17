import React, {PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import "./ListBox.css"
import {HighlightButton} from "../button/highlight/HighlightButton";

export class ListBox extends PureComponent {
    getSelectedVals() {
        return this.props.values.filter(this.props.isSelected);
    }

    onSelect(val) {
        const selectedVals = this.getSelectedVals();
        const newVals = this.props.getValsOnSelect(selectedVals, val);
        // for now don't really care about duplicates
        this.props.onClick(newVals);
    }

    onDeselect(val) {
        const selectedVals = this.getSelectedVals();
        console.log(selectedVals);
        console.log(val);

        if (!selectedVals.includes(val))
            console.warn("Value to be deselected inside ListBox is somehow not contained in the ListBox!");

        const newVals = this.props.getValsOnDeselect(selectedVals, val);
        console.log(newVals);
        this.props.onClick(newVals);
    }

    render() {
        let buttons = this.props.values.map((value, index) => {
            const names = classNames("list-box__button", this.props.stylePerButton);
            return (
                <HighlightButton className={names}
                                 key={this.props.keyPrefix + index.toString()}
                                 label={this.props.getDisplayValue(value)}
                                 value={value}
                                 getDisplayValue={this.props.getDisplayValue}
                                 onSelect={(e) => this.onSelect(e)}
                                 onDeselect={(e) => this.onDeselect(e)}
                                 highlighted={this.props.isSelected(value)}
                />
            );
        });

        const names = classNames(this.props.className, "list-box__container");
        return (
            <div className={names}>
                {buttons}
            </div>
        );
    }
}

ListBox.defaultProps = {
    getDisplayValue: (key) => key,
    getValsOnSelect: (selectedVals, val) => {
        return [...selectedVals, val];
    },
    getValsOnDeselect: (selectedVals, val) => {
        return selectedVals.filter((selectedVal) => selectedVal !== val);
    }
};

ListBox.propTypes = {
    getDisplayValue: PropTypes.func,
    getValsOnSelect: PropTypes.func,
    getValsOnDeselect: PropTypes.func,
    isSelected: PropTypes.func.isRequired,
    keyPrefix: PropTypes.string.isRequired,
    values: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    stylePerButton: PropTypes.array
};
