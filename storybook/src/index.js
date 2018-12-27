import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {Button} from '@storybook/react/demo';
import {Autocomplete} from "./components/Autocomplete";
import {Accordion} from "./components/Accordion";
import {AccordionPanel} from "./components/AccordionPanel";

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
                    <div>
                        hello
                    </div>
                </AccordionPanel>
                <AccordionPanel label="nope">
                    <div>
                       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </div>
                </AccordionPanel>
                 <AccordionPanel label="test">
                    <div>
                       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </div>
                </AccordionPanel>
            </Accordion>
        </div>
    ));

