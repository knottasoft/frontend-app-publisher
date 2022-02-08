import api from './CoppApi'

class DocTypeApiService {
    static fetchDocTypes() {
        return api.get(`/docTypes/`)
    }

    static async fetchCourseRunDocTypes(courseId) {
        console.log("DocTypeApiService -> fetchCourseRunDocTypes", courseId)

        const { data } = await api.get(`/courseRunDocTypes/?course_id=${courseId}`)
        console.log("DocTypeApiService -> get -> courseRunDocTypes", data)
        
        let result = {}
        data.reduce(function(res, value) {
            if (value.doc_types) {
                res [value.course_run_key] = value.doc_types.split(';')
            }

            return res;
        }, result)
        console.log("DocTypeApiService -> get -> courseRunDocTypes -> result ", result)
        return {data: result};
    }

    static editCourseRunDocType({courseId, coursRunKey, docTypes}) {
        const data = {
            "course_id": courseId,
            "course_run_key": coursRunKey,
            "doc_types": docTypes.join(';')
        }
        console.log("DocTypeApiService -> editCourseRunDocType", data, docTypes)
        return api.post(`/courseRunDocTypes/`,data)
    }
}

export default DocTypeApiService