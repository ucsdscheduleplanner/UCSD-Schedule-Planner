import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {Button} from '@storybook/react/demo';
import {MyAutocomplete} from "./components/MyAutocomplete";
import {Accordion} from "./components/Accordion";
import {AccordionBody, AccordionLabel, AccordionPanel} from "./components/AccordionPanel";
import {MyAutocompleteTesting} from "./components/MyAutocompleteTesting";

storiesOf('Button', module)
    .add('with text', () => (
        <Button onClick={action('clicked')}>Hello Button</Button>
    ))
    .add('just testing out hot reloading', () => (
        <Button onClick={action('clicked')}><span role="img"
                                                  aria-label="so cool">what you doing there bud</span></Button>
    ));

let temp = "hello";

let onChange = (value) => {
    console.log("changed to " + value);
    temp = value;
};

storiesOf('MyAutocomplete', module)
    .add('rendering', () => (
        <MyAutocompleteTesting/>
    ));


let values = ["hello", "how", "are"];

storiesOf('Accordion', module)
    .add('rendering', () => (
        <div>
            <Accordion>
                <AccordionPanel label="bad">
                    <AccordionLabel>
                        <div>
                            hello
                        </div>
                        <div>
                            hello
                        </div>
                        <div>
                            hello
                        </div>
                    </AccordionLabel>

                    <AccordionBody>
                        <div>
                            Hello world
                        </div>
                        <div>
                            How are you
                        </div>
                    </AccordionBody>
                </AccordionPanel>
                <AccordionPanel label="superjbad">
                    <AccordionLabel>
                        <div>
                            hello
                        </div>
                    </AccordionLabel>

                    <AccordionBody>
                        <div>
                            this is really poorly done
                        </div>
                        <div>
                            really poorly done
                        </div>
                    </AccordionBody>
                </AccordionPanel>
            </Accordion>
        </div>
    ));

