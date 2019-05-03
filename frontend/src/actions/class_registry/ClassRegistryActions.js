export const STORE_TYPES = "STORE_TYPES";
export const STORE_INSTRUCTORS = "STORE_INSTRUCTORS";


export function storeTypes(department, courseNum, types) {
    return {
        type: STORE_TYPES,
        department: department,
        courseNum: courseNum,
        types: types
    }
}

export function storeInstructors(department, courseNum, instructors) {
    return {
        type: STORE_INSTRUCTORS,
        department: department,
        courseNum: courseNum,
        instructors: instructors
    }
}
