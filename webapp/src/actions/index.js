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

export const generateSchedule = (selectedClasses) => {
    return {
        type: "GENERATE_SCHEDULE",
        payload: {
            selectedClasses: selectedClasses
        }
    }
};

