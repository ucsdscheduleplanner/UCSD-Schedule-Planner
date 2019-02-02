export const IGNORE_CLASS_TYPE_CODES = "IGNORE_CLASS_TYPE_CODES";

export const classTypeToCode = {
    Activity: 'AC',
    'Clinical Clerkship': 'CL',
    Conference: 'CO',
    Discussion: 'DI',
    'Final Exam': 'DI',
    Film: 'FM',
    Fieldwork: 'FW',
    'Independent Study': 'IN',
    Internship: 'IT',
    Lab: 'LA',
    Lecture: 'LE',
    Midterm: 'MI',
    'Make-up Session': 'MU',
    'Other Additional Meeting': 'OT',
    'Problem Session': 'PB',
    Practicum: 'PR',
    'Review Session': 'RE',
    Seminar: 'SE',
    Studio: 'ST',
    Tutorial: 'TU',
};

export function ignoreClassTypes(classTitle, classTypes) {
    console.log("CLASS TITLE");
    console.log(classTitle);
    console.log(classTypes);
    return function(dispatch) {
        dispatch(ignoreClassTypeCodes(classTitle, classTypes.map(e => classTypeToCode[e])));
    }
}

export function ignoreClassTypeCodes(classTitle, classTypes) {
    return {
        type: IGNORE_CLASS_TYPE_CODES,
        classTitle: classTitle,
        typesToIgnore: classTypes
    }
}
