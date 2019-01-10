import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";
import {addClass, editClass, removeClass} from "../actions/classinput/ClassInputActions";

describe('Class list', () => {
    let store;
    beforeEach((done) => {
        store = createStore(reducers, applyMiddleware(thunk));
        done();
    });

    it('Every time add a class, it will get appended to the end', () => {
        store.dispatch(addClass({classTitle: "LOL"}));
        store.dispatch(addClass({classTitle: "LOL"}));
        store.dispatch(addClass({classTitle: "LOL"}));

        let state = store.getState().ClassList;
        chaiExpect(Object.keys(state.selectedClasses)).to.have.lengthOf(3);
    });

    it('Appends to the end even after an edit', () => {
        store.dispatch(addClass({classTitle: "LOL"}));
        store.dispatch(addClass({classTitle: "LOL"}));
        store.dispatch(addClass({classTitle: "LOL"}));
        store.dispatch(editClass(1, {classTitle: "BAD"}));
        store.dispatch(addClass({classTitle: "newClass"}));

        let state = store.getState().ClassList;
        chaiExpect(Object.keys(state.selectedClasses)).to.have.lengthOf(4);
        chaiExpect(state.selectedClasses[3].classTitle).to.equal("newClass");
    });

    it('Appends to the end even after a remove operation', () => {
        store.dispatch(addClass({classTitle: "LOL"}));
        store.dispatch(addClass({classTitle: "LOL"}));
        store.dispatch(addClass({classTitle: "LOL"}));

        store.dispatch(removeClass(1));

        store.dispatch(addClass({classTitle: "newClass"}));

        let state = store.getState().ClassList;
        chaiExpect(Object.keys(state.selectedClasses)).to.have.lengthOf(3);
        chaiExpect(state.selectedClasses[3].classTitle).to.equal("newClass");
    });

    test('Removes class correctly', () => {
        let classInput = store.getState().ClassInput;
        let transactionID = classInput.transactionID;

        store.dispatch(addClass({classTitle: "newClass"}, transactionID));

        let state = store.getState().ClassList;
        chaiExpect(Object.keys(state.selectedClasses)).to.have.lengthOf(1);

        chaiExpect(transactionID).to.not.equal(null);

        // removing class now
        store.dispatch(removeClass(transactionID));
        state = store.getState().ClassList;
        chaiExpect(Object.keys(state.selectedClasses)).to.have.lengthOf(0);
    });
});