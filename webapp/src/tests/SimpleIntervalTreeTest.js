import {SimpleIntervalTree} from "../utils/SimpleIntervalTree";


let intervalTree = new SimpleIntervalTree();
let interval = {
    "start": new Date(),
    "end": new Date()
};
let first = interval;
intervalTree.add(interval);
let start = new Date();
start.setHours(9,10,10);
let end = new Date();
end.setHours(10,10,20);
interval = {
    "start": start,
    "end": end
};
intervalTree.add(interval);
let start2 = new Date();
start2.setHours(18,10,10);
let end2 = new Date();
end2.setHours(20,10,20);
interval = {
    "start": start2,
    "end": end2
};
intervalTree.add(interval);
console.log(intervalTree.size === 3);

intervalTree.remove(first);
console.log(intervalTree.size === 2);
