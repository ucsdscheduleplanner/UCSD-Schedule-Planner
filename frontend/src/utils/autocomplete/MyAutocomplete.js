import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';
import PropTypes from 'prop-types';
import "./MyAutoComplete.css";

export class MyAutocomplete extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value ? this.props.value : "",
            suggestions: this.props.suggestions
        }
    }

    getSuggestions(value) {
        console.log("getting suggestions");
        if (!value) {
            console.log("Nothing found, returning default");
            console.log(this.props.suggestions);
            return this.props.suggestions;
        }

        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        let hello = inputLength === 0 ? this.props.suggestions : this.props.suggestions.filter(lang =>
            lang.toLowerCase().slice(0, inputLength) === inputValue.toLowerCase()
        );
        console.log(hello);
        return hello;
    };

    renderSuggestion(suggestion) {
        return (
            <span>
            {suggestion}
            </span>
        )
    }

    onChange(event, {newValue}) {
        if (typeof newValue !== "string") {
            console.warn(`Value ${newValue} is not a string in autocomplete`);
            return;
        }
        this.setState({value: newValue.toUpperCase()});
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested({value}) {
        console.log("FETCHING " + value);
        this.setState({suggestions: this.getSuggestions(value)});
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested() {
    };

    onSuggestionSelected(event, {suggestion}) {
        console.log("suggestion selected");
        this.props.onSelect && this.props.onSelect(suggestion);
    }

    shouldRenderSuggestions() {
        return this.props.activeOnClick;
    }

    getSuggestionValue(suggestion) {
        return suggestion;
    }

    onKeyDown(e) {
        let input;
        switch(e.keyCode) {
            // tab key
            case 9:
                input = e.target;
                this.onSuggestionSelected(e, {suggestion: input.value});
                break;
        }
    }

    render() {
        // Autosuggest will pass through all these props to the input.
        // TODO add on key down here to check for tab and enter and call onSuggestionSelected on there
        const inputProps = {
            placeholder: this.props.defaultValue ? this.props.defaultValue : "",
            value: this.state.value,
            onChange: this.onChange.bind(this),
            onKeyDown: this.onKeyDown.bind(this),
            disabled: this.props.disabled ? this.props.disabled : false
        };

        if (this.props.label)
            inputProps.id = this.props.label;

        // Finally, render it!
        return (
            <div className={this.props.className}>
                <Autosuggest
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion.bind(this)}
                    onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                    shouldRenderSuggestions={this.props.activeOnClick ? () => true: undefined}
                    scrollBar={true}
                    inputProps={inputProps}
                />
            </div>
        );
    }
}

MyAutocomplete.propTypes = {
    key: PropTypes.any.isRequired,
    suggestions: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string,
    defaultValue: PropTypes.string,
    onSelect: PropTypes.func,
};
