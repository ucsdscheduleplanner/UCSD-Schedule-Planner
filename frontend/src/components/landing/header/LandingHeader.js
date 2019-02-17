import React, {PureComponent} from 'react';
import './LandingHeader.css';

export class LandingHeader extends PureComponent {
    render() {
        return (
            <div className="landing__header">
                <div className="landing__header__sidebar__icon">
                </div>
                <div className="landing__header__title">
                    <span className="landing__header__title__text">UCSD Schedule Planner</span>
                </div>
            </div>
        );
    }
}
