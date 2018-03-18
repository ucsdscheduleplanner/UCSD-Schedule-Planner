export const addClass = (uuid, newClass) => {
    return {
        type: "ADD_CLASS",
        payload: {
            uuid: uuid,
            add: newClass
        }
    }
};

export const removeClass = (uuid) => {
    return {
        type: "REMOVE_CLASS",
        payload: {
            uuid: uuid
        },
    }
};

export const removeConflict = (uuid, conflict) => {
    return {
        type: "REMOVE_CONFLICT",
        payload: {
            uuid: uuid,
            conflict: conflict
        }
    }
};

