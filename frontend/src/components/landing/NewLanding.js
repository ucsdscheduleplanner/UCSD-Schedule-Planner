import React, {PureComponent} from 'react';
import '../../css/NewLanding.css';

export class NewLanding extends PureComponent {

    render() {
        return (
            <div className="header">
                <div className="header__sidebar__icon">
                    Icon here
                </div>
                <div className="header__title">
                    <span className="header__title__text">UCSD Schedule Planner</span>
                </div>
                <div className="header__menu">
                    <div className="header__menu__links">
                        <div>hello</div>
                        <div>how</div>
                        <div>are</div>
                    </div>
                </div>
                <div className="header__person__icon">
                    Icon here
                </div>
            </div>
        );
    }
}