import React, {PureComponent} from 'react';
import "./Accordion.css";

export class ControlledAccordion extends PureComponent {

    render() {
        // wrapping all children in component
        return React.Children.map(this.props.children, (e) => {
                const isOpen = this.props.openSection === e.props.label;
                return React.cloneElement(e, {
                    isOpen: isOpen,
                    open: () => {}
                });
            }
        );
    }
}