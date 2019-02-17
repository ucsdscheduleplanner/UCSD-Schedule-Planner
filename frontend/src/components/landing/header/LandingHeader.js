import React, {PureComponent} from 'react';
import './LandingHeader.css';

export class LandingHeader extends PureComponent {
    render() {
        return (
            <div className="landing__header">
                <div className="landing__header__sidebar__icon">
                    Icon here
                </div>
                <div className="landing__header__title">
                    <span className="landing__header__title__text">UCSD Schedule Planner</span>
                </div>
                <div className="landing__header__menu">
                    <div className="landing__header__menu__links">
                        <div>hello</div>
                        <div>how</div>
                        <div>are</div>
                    </div>
                </div>
                <div className="landing__header__person__icon">
                    Icon here
                </div>
            </div>
        );
    }
}
