export function Heap(comparator) {
  // -1 means should go ahead of the other
  // 0 means doesn't matter
  // 1 means switch the other way

  if(comparator === undefined){
    this.comparator = function(a, b) {
      if(a > b) return 1;
      if(a < b) return -1;
      return 0;
    }
  } else {
    this.comparator = comparator;
  }

  this.data = [];
  this.size = 0;

  this.add = function(element) {
    this.data.push(element);
    this.heapify();
  };

  this.bubbleDown = function(index) {
    let leftChildIndex = 2*index;
    let rightChildIndex = 2*index+1;

    let root = this.data[index];
    let leftChild = this.data[leftChildIndex];
    let rightChild = this.data[rightChildIndex];

    let nextToSwap = index;

    if(leftChild !== undefined && leftChild !== null) {
      if(this.comparator(root, leftChild) > 0) {
        this.swap(index, leftChildIndex);
        nextToSwap = leftChildIndex;
        console.log('swapping left with root');
      }
    }

    if(rightChild !== undefined && rightChild !== null) {
      if(this.comparator(root, rightChild) > 0) {
        this.swap(index, rightChildIndex);
        nextToSwap = rightChildIndex;
        console.log('swapping right with root');
      }
    }

    if(nextToSwap !== index) {
      this.bubbleDown(nextToSwap);
    }
  };

  this.swap = function(indexOne, indexTwo) {
    let temp = this.data[indexOne];
    this.data[indexOne] = this.data[indexTwo];
    this.data[indexTwo] = temp;
  };

  this.heapify = function() {
    for(let i = Math.floor(this.data.length/2); i >= 0; i--) {
      this.bubbleDown(i);
    }
  };

  this.removeRoot = function() {
    this.size -=1;
    let root = this.data[0];
    this.data[0] = this.data[this.size];
    this.data[this.size] = null;
    this.heapify();
    return root;
  };

  this.add = function(newElement) {
    this.data.push(newElement);
    this.size += 1;
    this.heapify();
  };

  this.peek = function() {
    return this.data[0];
  };

  this.isEmpty = function() {
    return this.size === 0;
  };

  this.copy = function() {
    let copyHeap = new Heap(comparator);
    copyHeap.data = this.data.slice();
    copyHeap.size = this.size;
    return copyHeap;
  };

  this.print = function() {
    this.data.forEach((element) => {
      console.log(element);
    });
  }
}
