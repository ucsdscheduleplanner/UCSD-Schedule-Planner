import React, {PureComponent} from 'react';
import '../../css/NewLanding.css';
import {LandingHeader} from "./header/LandingHeader";
import {LandingBody} from "./body/LandingBody";

export class NewLanding extends PureComponent {

    render() {
        return (
            <React.Fragment>
                <LandingHeader/>
                <LandingBody/>
            </React.Fragment>
        );
    }
}