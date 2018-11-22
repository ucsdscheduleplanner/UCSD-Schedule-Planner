import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {Button} from '@storybook/react/demo';
import {Autocomplete} from "./components/Autocomplete";

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
            <Autocomplete onClick={action('clicked')}/>
        </div>
    ));

