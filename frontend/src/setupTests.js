import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
import jsdom from 'jsdom'


function setUpDomEnvironment() {
    const { JSDOM } = jsdom;
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {url: 'http://localhost/'});
    const { window } = dom;

    global.window = window;
    global.document = window.document;
    global.navigator = {
        userAgent: 'node.js',
    };
}


setUpDomEnvironment();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

// allowing tests to use chaiExpect to use chai so can use jest too
global.chaiExpect = chai.expect;
