export const VIEW_CLASS_TYPE_CODES = "VIEW_CLASS_TYPE_CODES";

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

export function viewClassTypes(classTitle, classTypes) {
    return function(dispatch) {
        dispatch(TESTING_viewClassTypeCodes(classTitle, classTypes.map(e => classTypeToCode[e])));
    }
}

export function TESTING_viewClassTypeCodes(classTitle, classTypes) {
    return {
        type: VIEW_CLASS_TYPE_CODES,
        classTitle: classTitle,
        typesToView: classTypes
    }
}
