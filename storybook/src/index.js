import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {Button} from './components/Button';
import {Autocomplete} from "./components/Autocomplete";

storiesOf('Button', module)
    .add('with text', () => (
        <Button className="test-button" label="Hello React" onClick={action('clicked')}/>
    ))
    .add('round', () => (
        <Button className="test-button" label="Round button" round={true} onClick={action('clicked')}/>
    ));



storiesOf('Autocomplete', module)
    .add('rendering', () => (
        <div style={{width: "200px"}}>
            <Autocomplete suggestions={["hello", "how", "are", "you"]} onClick={action('clicked')}/>
        </div>
    ));

