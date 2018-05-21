function SimpleIntervalTreeNode(interval) {
    this.interval = interval;
    this.left = null;
    this.right = null;

    this.after = function (otherInterval) {
        return (this.interval['start'] > otherInterval['end']);
    };

    this.before = function (otherInterval) {
        return (this.interval['end'] < otherInterval['start']);
    }
}

export function SimpleIntervalTree() {
    this.size = 0;
    this.root = null;

    this.add = function (interval) {
        // converting into a node
        let prevSize = this.size;
        this.root = this.insert(this.root, interval);
        let afterSize = this.size;
        return afterSize === prevSize + 1;
    };

    this.insert = function (node, interval) {
        if (node === null) {
            this.size++;
            return new SimpleIntervalTreeNode(interval);
        }
        if (node.before(interval)) {
            node.right = this.insert(node.right, interval);
        } else if (node.after(interval)) {
            node.left = this.insert(node.left, interval);
        }
        return node;
    };

    this._copy = function(node) {
      if(node === null) return null;
      let copyNode = new SimpleIntervalTreeNode(node.interval);
      copyNode.left = this._copy(node.left);
      copyNode.right = this._copy(node.right);
      return copyNode;
    };

    this.copy = function() {
        return this._copy(this.root);
    };

    this.remove = function (interval) {
        this.root = this.removeNode(this.root, interval);
    };

    this.removeNode = function (node, interval) {
        if (node === null) return null;
        if (node.interval === interval) {
            // decrement size
            this.size--;
            // case 1 no children YAY
            if (node.right === null && node.left === null) {
                return null;
            }
            // case 2 we have one children on one side
            if (node.right === null && node.left !== null) {
                return node.left;
            }
            if (node.left === null && node.right !== null) {
                return node.right;
            }

            // case 3 bad case where we have to find the smallest guy on right tree
            if (node.left !== null && node.right !== null) {
                // have two pointers so we know what is above it
                let lagPointer = node;
                let fastPointer = node.right;
                while (fastPointer.left !== null) {
                    lagPointer = fastPointer;
                    fastPointer = fastPointer.left;
                }
                // now we have the leftmost thing on the right subtree
                // so we delete it
                // should return the right node or null

                // this is the case where lag pointer's immediate child is a leaf
                // that means we want to sub root out with lag pointer
                // must remove the lag pointer then

                // if lag pointer is the node then fast pointer must be immediately to its right
                if(lagPointer === node) {
                    lagPointer.right = this.removeNode(fastPointer, fastPointer.interval);
                } else {
                    // otherwise it is to the left and we can remove from the left
                    lagPointer.left = this.removeNode(fastPointer, fastPointer.interval);
                }
                this.size++;
                fastPointer.left = node.left;
                fastPointer.right = node.right;
                // return the fast pointer to indicate that we have shifted it up
                return fastPointer;
            }
        } else {
            if (node.before(interval)) {
                node.right = this.removeNode(node.right, interval);
            } else if (node.after(interval)) {
                node.left = this.removeNode(node.left, interval);
            }
            return node;
        }
    }
}