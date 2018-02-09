import React, {Component} from 'react';
import {Class} from './ClassUtils.js';
import logo from './logo.svg';
import './App.css';
import {Heap} from './Heap.js';
import TimeHeuristic from './TimeHeuristic.js';
import {getSchedule} from "./ClassSelector.js";
import LoginForm from "./Test";
import Landing from "./Landing.js"



function requestData(selectedClasses, callback) {
    fetch('/data', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify(selectedClasses)
    })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            callback(selectedClasses, res);
        })
    //  .catch(error=>console.log(`Error occured ${error}`));
}

function handleData(selectedClasses, dirtyClassData) {
    let classData = {};
    selectedClasses['classes'].forEach((classGroup) => {
        dirtyClassData[classGroup].forEach((class_data) => {
            let new_class = new Class(class_data);
            if (classData[classGroup] === undefined) {

                TimeHeuristic.prototype.timeRange = {
                    "start": new Date("Mon, 01 Jan 1900 10:00:00"),
                    "end": new Date("Mon, 01 Jan 1900 17:00:00")
                };

                classData[classGroup] = new Heap(TimeHeuristic.prototype.compare);
            }
            classData[classGroup].add(new_class);
        });
    });

    Object.entries(classData).forEach(function ([key, val]) {
        console.log(key);
        val.print()
    });

    console.log("Results");
    console.log(getSchedule(classData));
}

export function generateSchedule(selectedClasses) {
    let selectedClassesJSON = {};
    let stringSelectedClasses = [];
    for(let Class of selectedClasses) stringSelectedClasses.push(Class['class']);

    selectedClassesJSON['classes'] = stringSelectedClasses;

    // TODO Figure out a way to return the result of this to the caller of this function
    // TODO PROMISE????
    requestData(selectedClassesJSON, handleData);
}

