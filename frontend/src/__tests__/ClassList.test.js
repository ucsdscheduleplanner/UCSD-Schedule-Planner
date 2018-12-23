import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";
import {addClass, editClass, removeClass} from "../actions/ClassInput/ClassInputActions";

describe('Class list', () => {
    let store;
    beforeEach((done) => {
        store = createStore(reducers, applyMiddleware(thunk));
        done();
    });

    it('Every time add a class, it will get appended to the end', () => {
        store.dispatch(addClass({title: "LOL"}));
        store.dispatch(addClass({title: "LOL"}));
        store.dispatch(addClass({title: "LOL"}));

        let state = store.getState().ClassList;
        chaiExpect(Object.keys(state.selectedClasses)).to.have.lengthOf(3);
    });

    it('Appends to the end even after an edit', () => {
        store.dispatch(addClass({title: "LOL"}));
        store.dispatch(addClass({title: "LOL"}));
        store.dispatch(addClass({title: "LOL"}));
        store.dispatch(editClass(1, {title: "BAD"}));
        store.dispatch(addClass({title: "newClass"}));

        let state = store.getState().ClassList;
        chaiExpect(Object.keys(state.selectedClasses)).to.have.lengthOf(4);
        chaiExpect(state.selectedClasses[3].title).to.equal("newClass");
    });

    it('Appends to the end even after a remove operation', () => {
        store.dispatch(addClass({title: "LOL"}));
        store.dispatch(addClass({title: "LOL"}));
        store.dispatch(addClass({title: "LOL"}));

        store.dispatch(removeClass(1));

        store.dispatch(addClass({title: "newClass"}));

        let state = store.getState().ClassList;
        chaiExpect(Object.keys(state.selectedClasses)).to.have.lengthOf(3);
        chaiExpect(state.selectedClasses[3].title).to.equal("newClass");
    });
});