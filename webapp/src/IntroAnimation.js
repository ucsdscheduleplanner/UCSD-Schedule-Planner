import React, {Component} from 'react';
import {
    Container,
    Divider,
    Dropdown,
    Grid,
    Header,
    Transition,
    Icon,
    Image,
    List,
    Menu,
    Segment,
    Visibility
} from 'semantic-ui-react'

export class IntroAnimation extends Component {
    render() {
        let {fadeOut, textVisible} = this.props;
        return (
            <React.Fragment>
                <Transition visible={!fadeOut} animation={'fade'} duration={300}>
                    <Segment vertical ui textAlign={"center"} className="landing-image landing-intro-font">
                        <Grid textAlign="center"
                              style={{height: "100%"}}
                              verticalAlign={"middle"}>

                            <Grid.Column style={{width: "100%"}}>
                                <Transition visible={textVisible} animation={'scale'} duration={300}>
                                    <Header id="landing-intro-text" as="h1" size={"huge"}>
                                        UCSD Web Registration Scraper
                                    </Header>
                                </Transition>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                </Transition>
            </React.Fragment>
        )
    }
}