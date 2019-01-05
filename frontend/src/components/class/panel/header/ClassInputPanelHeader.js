import React, {PureComponent} from 'react';

export class ClassInputPanelHeader extends PureComponent {

    render() {
        return (
            <div>
                {this.props.title}
            </div>
        )
    }
}