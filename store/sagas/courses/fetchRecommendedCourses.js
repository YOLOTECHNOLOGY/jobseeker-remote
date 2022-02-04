import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_RECOMMENDED_COURSES_REQUEST } from 'store/types/courses/fetchRecommendedCourses'
import { fetchRecommendedCoursesSuccess, fetchRecommendedCoursesFailed } from 'store/actions/courses/fetchRecommendedCourses'
import { fetchRecommendedCoursesService } from 'store/services/courses/fetchRecommendedCourses'


function* fetchRecommendedCoursesReq(action) {
  try {
    const {
      size,
      job_category_ids,
      xp_lvl_key,
    } = action.payload

    const payload = {
      size,
      job_category_ids,
      xp_lvl_key,
    }

    console.log({payload})

    const response = yield call(fetchRecommendedCoursesService, payload)

    if (response.status === 200 || response.status === 201) {
      yield put(fetchRecommendedCoursesSuccess(response.data))
    }
  } catch (error) {
    console.log('error', error)
    yield put(fetchRecommendedCoursesFailed(error))
  }
}

export default function* fetchRecommendedCourses() {
  yield takeLatest(FETCH_RECOMMENDED_COURSES_REQUEST, fetchRecommendedCoursesReq)
}
