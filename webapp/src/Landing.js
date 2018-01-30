import React, {Component} from 'react';
import './Landing.css'
import {
    Container,
    Divider,
    Dropdown,
    Form,
    Button,
    Message,
    Grid,
    Header,
    Transition,


    Icon,
    Image,
    List,
    Label,
    Input,
    Menu,
    Segment,
    Visibility
} from 'semantic-ui-react'

import {IntroAnimation} from "./IntroAnimation.js";
import {Heap} from "./Heap";


export default class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeOut: false,
            animationComplete: false,
            textVisible: false,
        };
        this.list = [
            {
                text: "hello world",
                value: "Jenny hess",
            },
            {
                text: "hello world",
                value: "Jenny hess",
            },
            {
                text: "hello world",
                value: "Jenny hess",
            },
            {
                text: "hello world",
                value: "Jenny hess",
            },
            {
                text: "hello world",
                value: "Jenny hess",
            },
            {
                text: "hello world",
                value: "Jenny hess",
            }
        ];
    }

    componentDidMount() {
        let that = this;
        setTimeout(function () {
            that.setState({
                textVisible: true
            });
        }, 1000);
        setTimeout(function () {
            that.setState({
                fadeOut: true
            });
        }, 1500);
        setTimeout(function () {
            that.setState({
                animationComplete: true
            });
        }, 2000);
    }

    render() {
        let {textVisible, fadeOut, animationComplete} = this.state;
        /* if (!animationComplete) {
             return (
                 <React.Fragment>
                     <IntroAnimation fadeOut={fadeOut} textVisible={textVisible}/>
                 </React.Fragment>
             );
         } else { */
        return (
            <React.Fragment>
                <Grid stackable={true}
                      columns={2}
                      textAlign='center'
                      style={{height: '100%', margin: '2em'}}>

                    <Grid.Column>
                        <Container style={{clear: "both"}}>
                            <Header as='h1' color='red' inverted textAlign='left'>
                                Enter your classes below!
                            </Header>

                            <Segment style={{width: "100%", display: "table"}}>

                                <Grid columns={2}>

                                    <Grid.Column>
                                        <Header as="h4" color="red" textAlign="left" content="Department"/>

                                        <Dropdown style={{width: "100%"}}
                                                  placeholder="Department"
                                                  search selection options={this.list}/>

                                        <Header as="h4" color="red" textAlign="left" content="Class"/>
                                        <Dropdown style={{width: "100%"}}
                                                  placeholder="Class"
                                                  search selection options={this.list}/>

                                    </Grid.Column>

                                    <Grid.Column>
                                        <Header as="h4" color="red" textAlign="left" content="Options"/>
                                    </Grid.Column>
                                </Grid>

                                <Button style={{marginTop: "1em"}} floated="right" color="teal">
                                    Add Class
                                </Button>

                            </Segment>
                        </Container>
                    </Grid.Column>

                    <Grid.Column>
                        <Container id="classes">
                            <Header as='h1' color='red' inverted textAlign='left'>
                               Classes
                            </Header>

                            <Segment style={{width: "100%", height: "100%"}}>

                            </Segment>
                        </Container>
                    </Grid.Column>
                </Grid>
            </React.Fragment>
        );
        //  }

        /*
        return (

            <React.Fragment>
                <Segment vertical ui padded="left" className="landing-image" style={{minHeight: "100%"}}>
                    <Header as="h1"
                            style={{fontSize: '3em', fontWeight: 'normal'}}>
                        UCSD Web Registration Scraper</Header>
                    <p>Going to try and do stuff here</p>
                </Segment>
            </React.Fragment>
        );
        */
    }
}

