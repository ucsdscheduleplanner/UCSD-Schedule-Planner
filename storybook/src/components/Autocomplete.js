import React, {PureComponent} from 'react';
import "../css/Autocomplete.css"

export class Autocomplete extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            active: false,
            activeSuggestion: false,
            activeIndex: 0,
            currentSuggestions: [],
            showSuggestions: true,
            input: ""
        }
    }

    onChange(event) {
        if (this.props.onChange)
            this.props.onChange(event);

        this.setState({input: event.currentTarget.value})
    }

    bindDocumentClickListener() {
        if (!this.clickListener) {
            this.clickListener = (event) => {
                console.log(3);
                if (event.which === 3) {
                    return;
                }

                if (!this.inputClick && !this.dropdownClick) {
                    this.setState({active: false});
                }

                this.inputClick = false;
                this.dropdownClick = false;
            };

            document.addEventListener('click', this.clickListener);
        }
    }

    onClick(event) {
        if (this.props.onClick)
            this.props.onClick(event);

        this.bindDocumentClickListener();

        this.setState({active: true})
        this.inputClick = true;
        console.log(1);
    }

    onClickSuggestion(event) {
        this.setState({activeSuggestion: true});
        this.dropdownClick = true;
        console.log(2);
    }

    onBlur(event) {
        this.setState({active: false});
    }

    render() {
        let suggestionsComponent = (
            <div className="autocomplete-suggestion-box" onClick={this.onClickSuggestion.bind(this)}>
                <ul className="autocomplete-suggestion">
                    Hello
                </ul>
                < ul>
                    Hello
                </ul>
            </div>
        );

        return (
            <div className="autocomplete-box">
                <input
                    className="autocomplete-input"
                    type="text"
                    onClick={this.onClick.bind(this)}
                    onChange={this.onChange.bind(this)}
                    value={this.state.input}
                />
                {this.state.active && suggestionsComponent}
            </div>
        )

    }
}