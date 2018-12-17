import React from 'react';
import renderer from 'react-test-renderer';
import ClassInput from "../components/landing/ClassInput";
import {shallow} from 'enzyme';

const should = require('chai').should();

const classInputProperties = {
    departments: [],
    currentDepartment: null,
    setCurrentDepartment: () => {
    },
    setCurrentCourseNum: () => {
    },
    setCurrentInstructor: () => {
    },
    setPriority: () => {
    },
    setClassSummaryFromDepartment: () => {

    }
};

test('Renders correctly with no props', () => {
    const classInput = renderer.create(
        <ClassInput/>,
    );
    let tree = classInput.toJSON();
    expect(tree).toMatchSnapshot();
});

test('Can enter department', () => {
    let currentDepartment = null;
    let properties = Object.assign({}, classInputProperties);

    const classInput = shallow(
        <ClassInput {...properties} />
    );

    properties.departments = ["CSE", "hi"];
    properties.setCurrentDepartment = (e) => {
        classInput.setProps({currentDepartment: e});
    };
    properties.currentDepartment = currentDepartment;

    classInput.setProps(properties);


    classInput.find("#department").simulate('change', {value: "CSE"});
    classInput.instance().forceUpdate();
    chaiExpect(classInput.instance().props['currentDepartment']).to.equal('CSE');
});


test('Having department opens up course number', () => {
    let properties = Object.assign({}, classInputProperties);
    properties.departments = ["CSE", "hi"];
    properties.currentDepartment = "CSE";

    const classInput = shallow(
        <ClassInput {...properties} />
    );
    let test = classInput.find("#course-number");
    chaiExpect(test.prop("disabled")).to.equal(false);
});


test('Putting in invalid department does not enable course number input', () => {
    let properties = Object.assign({}, classInputProperties);
    properties.departments = ["CSE", "hi"];
    properties.currentDepartment = "superbad";

    const classInput = shallow(
        <ClassInput {...properties} />
    );
    let test = classInput.find("#course-number");
    chaiExpect(test.prop("disabled")).to.equal(true);
});


test('Having department opens up instructor', () => {
    let properties = Object.assign({}, classInputProperties);
    properties.departments = ["CSE", "hi"];
    properties.currentDepartment = "CSE";

    const classInput = shallow(
        <ClassInput {...properties} />
    );
    let test = classInput.find("#instructor");
    chaiExpect(test.prop("disabled")).to.equal(false);
});

test('Creates a class from input', () => {
    const testConfig = {
        currentDepartment: "CSE",
        currentCourseNum: "12",
        departments: ["CSE"],
        courseNums: ["12"]
    };

    const wrapper = shallow(<ClassInput {...testConfig} />);
    const instance = wrapper.instance();

    let Class = instance.buildClassFromInput();
    should.not.equal(Class, undefined);

    chaiExpect(Class.department).to.equal("CSE");
    chaiExpect(Class.courseNum).to.equal("12");
    chaiExpect(Class.classTitle).to.equal("CSE 12");
});
