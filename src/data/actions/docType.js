import { push } from 'connected-react-router';

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
import DocTypeApiService from '../services/DocTypeApiService';

export function requestDocTypeFail(error) {
    return { type: REQUEST_DOCTYPE_FAIL, error };
}

export function requestDocTypeSuccess(data) {
    return { type: REQUEST_DOCTYPE_SUCCESS, data };
}

export function requestDocType() {
    return { type: REQUEST_DOCTYPE };
}

export function handleRequestDocType() {
    return (dispatch) => {
        dispatch(requestDocType());

        return DocTypeApiService.fetchDocTypes()
            .then((response) => {
                dispatch(requestDocTypeSuccess(response.data));
            })
            .catch((error) => {
                console.log('requestDocTypeFail', error);
                dispatch(requestDocTypeFail(['Не удалось получить список типов документов']));
            })
    }
}

export function requestCourseRunDocTypeFail(error) {
    return { type: REQUEST_COURSERUN_DOCTYPE_FAIL, error };
}

export function requestCourseRunDocTypeSuccess(data) {
    return { type: REQUEST_COURSERUN_DOCTYPE_SUCCESS, data };
}

export function requestCourseRunDocType() {
    return { type: REQUEST_COURSERUN_DOCTYPE };
}
//Запрос документов всех запусков курса
export function handleRequestCourseRunDocType(courseId) {
    return (dispatch) => {
        dispatch(requestCourseRunDocType());

        return DocTypeApiService.fetchCourseRunDocTypes(courseId)
            .then((response) => {
                const docTypes = response.data;

                dispatch(requestCourseRunDocTypeSuccess(docTypes));
            })
            .catch((error) => {
                console.log('requestCourseTunDocTypeFail', error);
                dispatch(requestCourseRunDocTypeFail(['Не удалось получить список типов документов привязанных к запуску курса']));
            })
    }
}


export function editCourseRunDocTypeFail(error) {
    return { type: EDIT_COURSERUN_DOCTYPE_FAIL, error };
}

export function editCourseRunDocTypeSuccess(data) {
    return { type: EDIT_COURSERUN_DOCTYPE_SUCCESS, data };
}

export function editCourseRunDocType() {
    return { type: EDIT_COURSERUN_DOCTYPE };
}


export function handleEditCourseRunDocType(data) {
    return (dispatch) => {
        dispatch(editCourseRunDocType());

        return DocTypeApiService.editCourseRunDocType(data)
            .then(() => {
                dispatch(editCourseRunDocTypeSuccess(data));
            })
            .catch((error) => {
                console.log('editCourseRunDocTypeFail', error);
                dispatch(editCourseRunDocTypeFail(['Не удалось отредактировать типы документа у запуска курса']));
            })
    }
}