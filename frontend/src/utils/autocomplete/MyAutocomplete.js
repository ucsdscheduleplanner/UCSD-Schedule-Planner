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

    componentDidUpdate(prevProps) {
        if(prevProps.suggestions !== this.props.suggestions){
            this.setState({suggestions: this.getSuggestions(this.state.value)});
        }
    }

    getSuggestions(value) {
        if (!value) {
            return this.props.suggestions;
        }

        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? this.props.suggestions : this.props.suggestions.filter(lang =>
            lang.toLowerCase().slice(0, inputLength) === inputValue.toLowerCase()
        );
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
        this.setState({suggestions: this.getSuggestions(value)});
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested() {
    };

    onSuggestionSelected(event, {suggestion}) {
        this.props.onSelect && this.props.onSelect(suggestion);
    }

    shouldRenderSuggestions() {
        return this.props.activeOnClick;
    }

    getSuggestionValue(suggestion) {
        return suggestion;
    }

    render() {
        const inputProps = {
            disabled: this.props.disabled,
            placeholder: this.props.defaultValue ? this.props.defaultValue : "",
            value: this.state.value,
            onChange: this.onChange.bind(this),
            tabIndex: this.props.tabIndex
        };

        if (this.props.onClick)
            inputProps.onClick = this.props.onClick;

        if (this.props.label)
            inputProps.id = this.props.label;

        if (this.props.onBlur)
            inputProps.onBlur = this.props.onBlur;

        return (
            <div className={this.props.className}>
                <Autosuggest
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion.bind(this)}
                    onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                    shouldRenderSuggestions={this.props.activeOnClick ? () => true : undefined}
                    scrollBar={true}
                    inputProps={inputProps}
                />
            </div>
        );
    }
}

MyAutocomplete.propTypes = {
    tabIndex: PropTypes.number.isRequired,
    suggestions: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string,
    defaultValue: PropTypes.string,
    onSelect: PropTypes.func,
    disabled: PropTypes.bool
};
