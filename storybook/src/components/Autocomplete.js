import React, {PureComponent} from 'react';
import {CSSTransition} from 'react-transition-group';
import "../css/Autocomplete.css";
import classNames from 'classnames';

export class Autocomplete extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            inputVal: null,
            dropDown: false,
            suggestions: []
        };

        this.state.suggestions = this.initSuggestions();
        this.onInputClick = this.onInputClick.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDropDownClick = this.onDropDownClick.bind(this);
    }

    initSuggestions() {
        return this.props.suggestions.map((suggestion) => suggestion);
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.onClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onClick, false);
    }

    onInputClick(event) {
        this.setState({dropDown: true});
    }

    onInputChange(event) {
        let input = event.target.value;
        this.setState({inputVal: input});
    }

    renderInput() {
        return (
            <input
                className="autocomplete-input-box"
                ref={(input) => this.input = input}
                onChange={this.onInputChange}
                onClick={this.onInputClick}
                value={this.state.inputVal}/>
        );
    }

    renderDropDown() {
        const suggestionsComp = this.state.suggestions.map((suggestion) => {
            return (
                <AutocompleteSuggestion onClick={this.onDropDownClick} value={suggestion} />
            )
        });

        return (
            <CSSTransition
                in={this.state.dropDown}
                timeout={300}
                classNames="fade"
                unmountOnExit>
                <div ref={(dropdown) => this.dropdown = dropdown}
                     className="autocomplete-dropdown-box">
                    {suggestionsComp}
                </div>
            </CSSTransition>
        );
    }

    onClick(event) {
        if (!this.node)
            return;

        if (!this.node.contains(event.target))
            this.handleClickOutside();
    }

    onDropDownClick(event) {
        let buttonText = event.target.textContent;
        this.setState({inputVal: buttonText, dropDown: false});
    }

    handleClickOutside() {
        this.setState({dropDown: false});
    }

    render() {
        const input = this.renderInput();
        const dropDown = this.renderDropDown();

        return (
            <div className="autocomplete-box" ref={(node) => this.node = node}>
                {input}
                {dropDown}
            </div>
        );
    }
}

class AutocompleteSuggestion extends PureComponent {
    render() {
        const classes = classNames({
            "autocomplete-suggestion": true,
        });

        return (
            <button onClick={this.props.onClick} className="autocomplete-suggestion">{this.props.value}</button>
        )
    }
}


Autocomplete.defaultProps = {
    suggestions: [],
};
