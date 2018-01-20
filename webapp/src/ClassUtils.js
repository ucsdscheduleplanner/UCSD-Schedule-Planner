export function Subclass(data) {
  this.data = data;
  this.timeInterval = makeTimeInterval.call(this);

  function makeTimeInterval() {
    let times = this.data['TIME'].split('-');
    let tempTimeInterval = [];
    times.forEach((time) => {
      let pm = time.indexOf('p');
      if(pm !== -1) {
        tempTimeInterval.push(
          parseInt(time.substring(0, pm)) + 12);
      } else {
        let am = time.indexOf('a');
        tempTimeInterval.push(
          parseInt(time.substring(0, am)));
      }
    });
    let timeInterval = {};
    timeInterval['start'] = tempTimeInterval[0];
    timeInterval['end'] = tempTimeInterval[1];

    return timeInterval;
  }

  this.getType = function() {
    return this.data['TYPE'];
  }

  this.getTimeInterval = function() {
    return this.timeInterval;
  }
}

export function Class(data) {
  this.subclasses = {};
  data.forEach((subclass_data)=> {
    let subclass = new Subclass(subclass_data);
    if(this.subclasses[subclass.getType()] === undefined) {
      this.subclasses[subclass.getType()] = [];
    }
    this.subclasses[subclass.getType()].push(subclass);
  });

  this.getTimeIntervals = function() {
    let retList = [];
    Object.entries(this.subclasses).forEach(function([key, value]) {
      value.forEach(function(cl) {
        retList.push(cl.getTimeInterval());
      });
    });
    return retList;
  }
}

