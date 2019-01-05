import React, {Component} from 'react';
import {MyAutocomplete} from "./MyAutocomplete";

export class MyAutocompleteTesting extends Component {

    constructor() {
        super();

        this.state = {
            suggestions: ["hello",
                "how",
                "are",
                "cameron",
                "cameron",
                "cameron",
                "cameron",
                "cameron",
                "cameron",
                "cameron",
                "politz",
                "ord",
                "anna",
                "cora",
                "ray",
                "daniel",
                "david",
                "bad"
            ],
            value: ""
        }
    }

    onChange(value) {
        this.setState({value: value});
    }

    render() {
        return (<div style={{width: "400px"}}>
            <MyAutocomplete defaultValue="Department" value={this.state.value} suggestions={this.state.suggestions} onChange={this.onChange.bind(this)}/>
        </div>)
    }
}