import {
    REQUEST_DOCTYPE,
    REQUEST_DOCTYPE_SUCCESS,
    REQUEST_DOCTYPE_FAIL,
    
    REQUEST_COURSERUN_DOCTYPE,
    REQUEST_COURSERUN_DOCTYPE_SUCCESS,
    REQUEST_COURSERUN_DOCTYPE_FAIL,
    
    EDIT_COURSERUN_DOCTYPE,
    EDIT_COURSERUN_DOCTYPE_SUCCESS,
    EDIT_COURSERUN_DOCTYPE_FAIL,
} from '../constants/docType';

const initialState = {
    docTypes: [],
    courseRunDocTypes: {},
    error: null,
}

function docType(state = initialState, action) {
    switch (action.type) {
        case REQUEST_DOCTYPE_SUCCESS: 
            return {
                ...state,
                docTypes: [ 
                    {
                        "label": "Выберите тип документа",
                        "value": "",
                        "description": null
                    }, 
                    ...action.data
                ],
                error: null,
            };

        case REQUEST_DOCTYPE_FAIL: 
            return {
                ...state,
                docTypes: [],
                error: action.error,
            };

        case REQUEST_COURSERUN_DOCTYPE_SUCCESS:
            return {
                ...state,
                courseRunDocTypes : action.data,
            }

        case EDIT_COURSERUN_DOCTYPE_SUCCESS:
            return {
                ...state,
                courseRunDocTypes : {
                    ...state.courseRunDocTypes,
                    [action.data.coursRunKey]: action.data.docTypes,
                }
            }
        default:
            return state;
    }
}

export default docType;