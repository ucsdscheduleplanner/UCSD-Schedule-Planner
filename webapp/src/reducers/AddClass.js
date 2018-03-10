

const addClass = (state=[], action) => {
    switch(action.type) {
        case "ADD_CLASS":
            return [
                ...state,
                action.payload
            ];
        default:
            return state;
    }
};


export default addClass;
