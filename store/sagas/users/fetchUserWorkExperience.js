import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_USER_WORK_EXPERIENCE_REQUEST } from 'store/types/users/fetchUserWorkExperience'
import {
  fetchUserWorkExperienceSuccess,
  fetchUserWorkExperienceFailed,
} from 'store/actions/users/fetchUserWorkExperience'
import { fetchUserWorkExperienceService } from 'store/services/users/fetchUserWorkExperience'

function* fetchUserWorkExperienceReq(action) {
  try {
    const { data } = yield call(fetchUserWorkExperienceService, action.payload)
    yield put(fetchUserWorkExperienceSuccess(data.data))
  } catch (error) {
    yield put(fetchUserWorkExperienceFailed(error))
  }
}

export default function* fetchUserWorkExperienceSaga() {
  yield takeLatest(FETCH_USER_WORK_EXPERIENCE_REQUEST, fetchUserWorkExperienceReq)
}
