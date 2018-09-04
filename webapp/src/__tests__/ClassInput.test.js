import React from 'react';
import renderer from 'react-test-renderer';
import ClassInput from "../components/landing/ClassInput";
import {shallow} from 'enzyme';

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
    expect(classInput.instance().props['currentDepartment']).toBe('CSE');
});


test('Having department opens up course number', () => {
    let properties = Object.assign({}, classInputProperties);
    properties.departments = ["CSE", "hi"];
    properties.currentDepartment = "CSE";

    const classInput = shallow(
        <ClassInput {...properties} />
    );
    let test = classInput.find("#course-number");
    expect(test.prop("disabled")).toBe(false);
});