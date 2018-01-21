import React, { Component } from 'react';
import {Class} from './ClassUtils.js';
import logo from './logo.svg';
import './App.css';
import {Heap} from './Heap.js';
import {TimeHeuristic} from './TimeHeuristic.js';
import {getSchedule} from "./ClassSelector.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.selectedClasses = {
      "classes": [
        "CSE 20", "CSE 21", "CSE 15L", "PHYS 2C"
      ]
    };
    this.dirtyClassData = {}
  }

  requestData(callback) {
    fetch('/data', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(this.selectedClasses)
    })
      .then(res=>res.json())
      .then(res=> {
        console.log(res);
        this.dirtyClassData=res;
        callback();
      })
    //  .catch(error=>console.log(`Error occured ${error}`));
  }

  handleData() {
    this.classData = {};
    this.selectedClasses['classes'].forEach((classGroup)=> {
      this.dirtyClassData[classGroup].forEach((class_data)=> {
        let new_class = new Class(class_data);
        if(this.classData[classGroup] === undefined) {
          let tH = new TimeHeuristic({
            "start": new Date("Mon, 01 Jan 1900 10:00:00"),
            "end": new Date("Mon, 01 Jan 1900 17:00:00")
          });
          this.classData[classGroup] = new Heap(tH.getOutput);
        }
        this.classData[classGroup].add(new_class);
      });
    });
    Object.entries(this.classData).forEach(function([key, val]) {
      console.log(key);
      val.print()
    });

    console.log("Results");
    console.log(getSchedule(this.classData));
  }

  doStuff() {
    this.requestData(this.handleData.bind(this));
  }

  componentDidMount() {
    /*this.intervalID = setInterval(
      this.requestData(),
      1000
    );*/
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  render() {
    return (
      <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Welcome to React</h1>
      </header>
      <p className="App-intro">
      To get started, edit <code>src/App.js</code> and save to reload.
      </p>
      <button onClick={this.doStuff.bind(this)}> 
      Hi how are you.
      </button>
      </div>
    );
  }
}

export default App;
