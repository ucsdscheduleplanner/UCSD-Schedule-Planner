// @format
import React from 'react';
import {mount, shallow} from 'enzyme';

import {Dialog} from 'primereact/components/dialog/Dialog';
import WeekCalendar from '../components/schedule/WeekCalendar';
import {ResultPanel} from '../components/schedule/ResultPanel';
import ClassEvent from '../components/schedule/ClassEvent';

import {expect} from 'chai';
import moment from 'moment';

const TIME_STRING = 'HH:mm';
function makeTimeInterval(time) {
  let timeInterval = {};
  // first element is start, second is end
  let splitTime = time.split('-');

  // if it failed to split
  if (splitTime.length === 1) {
    //timeInterval['start'] = new Date(1990, 1, 1);
    //timeInterval['end'] = new Date(1990, 1, 1);
    // let the caller know that no timeInterval was created
    return null;
  }

  let currentDate = new Date();
  let currentDay = currentDate.getDay();
  let dist, dayToSet;

  // convert to javascript date first
  let startTime = moment(splitTime[0], TIME_STRING).toDate();
  dayToSet = 2;
  dist = 0;
  startTime.setDate(startTime.getDate() + dist);

  let endTime = moment(splitTime[1], TIME_STRING).toDate();
  dayToSet = 2;
  dist = 0;
  endTime.setDate(endTime.getDate() + dist);

  timeInterval['start'] = startTime;
  timeInterval['end'] = endTime;
  return timeInterval;
}

describe('Calendar component', () => {
  const time = '17:00-18:20';

  let testSchedule = {
    classes: [
      [
        {
          classTitle: 'CSE 11',
          courseID: '961427',
          courseNum: '11',
          day: 'Tu',
          department: 'CSE',
          description: 'Intr/Computer Sci&Obj-Ori:Java( 4Units)',
          instructor: 'Zaitsev, Anna L',
          location: 'CENTR 115',
          room: '115',
          roomLocation: 'CENTR',
          sectionID: 'CSE11$0',
          time: time,
          timeInterval: makeTimeInterval(time),
          type: 'LE',
        },
      ],
    ],
    errors: {},
  };

  let testSchedule2 = {
    classes: [
      [
        {
          classTitle: 'CSE 12',
          courseID: '961423',
          courseNum: '12',
          day: 'Tu',
          department: 'CSE',
          description: 'Intr/Computer Sci&Obj-Ori:Java( 4Units)',
          instructor: 'Zaitsev, Anna L',
          location: 'CENTR 115',
          room: '115',
          roomLocation: 'CENTR',
          sectionID: 'CSE12$0',
          time: '12:00-15:20',
          timeInterval: makeTimeInterval(time),
          type: 'LE',
        },
      ],
    ],
    errors: {},
  };

  const generationResult = {
    schedules: [testSchedule, testSchedule2],
    errors: {},
  };

  it('Renders correctly', () => {
    expect(shallow(<WeekCalendar />).hasClass('calendar-content')).to.equal(
      true,
    );
  });

  it('Renders a class given a schedule', () => {
    const wrapper = mount(
      <WeekCalendar empty={false} schedule={testSchedule} />,
    );

    expect(wrapper.contains(ClassEvent)).to.equal(true);
  });

  it('Renders the download ics button given a schedule', () => {
    const wrapper = mount(<WeekCalendar schedule={testSchedule} />);
    expect(wrapper.exists('#ics-button')).to.equal(true);
  });

  it('Renders a tab that can be used to choose which schedule from the generation result', () => {
    expect(
      mount(<ResultPanel generationResult={generationResult} />).exists(
        '.ui-tabview-title',
      ),
    ).to.equal(true);
  });

  it('Renders multiple tabs given multiple schedules', () => {
    const wrapper = mount(<ResultPanel generationResult={generationResult} />);

    expect(wrapper.find('.ui-tabview-title').length).to.equal(2);
  });

  // skipping for now because enzyme is not rendering deep enough
  it.skip('Makes a modal when clicking on an event', () => {
    const wrapper = mount(
      <WeekCalendar empty={false} schedule={testSchedule} />,
    );

    wrapper.update();
    expect(wrapper.find('event').length).to.equal(3);

    const eventButton = wrapper.find('.ce-button').first();
    eventButton.simulate('click');

    wrapper.update();

    expect(wrapper.find(Dialog).length).to.equal(1);
  });

  it.skip('Makes a modal with the correct title after click', () => {
    const wrapper = mount(<ResultPanel generationResult={generationResult} />);

    const eventButton = wrapper.find('.ce-component').first();
    eventButton.simulate('click');

    wrapper.update();

    const modal = wrapper.find('.ui-dialog');
    expect(modal).to.contain.text('CSE 11');
  });

  it.skip('Makes a modal with the correct public facing information after click', () => {
    const wrapper = mount(<ResultPanel generationResult={generationResult} />);

    const eventButton = wrapper.find('.ce-component').first();
    eventButton.simulate('click');

    wrapper.update();

    const modal = wrapper.find('.ui-dialog');
    expect(modal).to.contain.text('CENTR');
    expect(modal).to.contain.text('Zaitsev, Anna L');
    expect(modal).to.contain.text('5:00');
    expect(modal).to.contain.text('6:20');
  });
});
