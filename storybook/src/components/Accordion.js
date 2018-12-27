import React, {PureComponent} from 'react';
import "../css/Accordion.css";

export class Accordion extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            // using label to remember which section is open
            openSection: ""
        }
    }

    openSection(label) {
        this.setState({openSection: label});
    }

    toggleSection() {

    }

    render() {
        console.log(this.props.children);
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