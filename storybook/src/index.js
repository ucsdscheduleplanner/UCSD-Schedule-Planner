import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {Button} from '@storybook/react/demo';
import {Autocomplete} from "./components/Autocomplete";
import {Accordion} from "./components/Accordion";
import {AccordionBody, AccordionLabel, AccordionPanel} from "./components/AccordionPanel";

storiesOf('Button', module)
    .add('with text', () => (
        <Button onClick={action('clicked')}>Hello Button</Button>
    ))
    .add('just testing out hot reloading', () => (
        <Button onClick={action('clicked')}><span role="img"
                                                  aria-label="so cool">what you doing there bud</span></Button>
    ));


storiesOf('Autocomplete', module)
    .add('rendering', () => (
        <div style={{width: "200px"}}>
            <Autocomplete suggestions={["hello", "how", "are"]} onClick={action('clicked')}/>
        </div>
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

