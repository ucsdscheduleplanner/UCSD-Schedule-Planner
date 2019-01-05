import React, {PureComponent} from 'react';
import "./Accordion.css";

export class Accordion extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            // using label to remember which section is open
            openSection: null
        }
    }

    openSection(label) {
        this.setState({openSection: label === this.state.openSection ? null: label});
    }

    render() {
        // wrapping all children in component
        return React.Children.map(this.props.children, (e) => {
                const isOpen = this.state.openSection === e.props.label;
                return React.cloneElement(e, {
                    isOpen: isOpen,
                    open: this.openSection.bind(this),
                });
            }
        );
    }
}