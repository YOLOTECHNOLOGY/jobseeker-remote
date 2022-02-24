import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_USER_EDUCATION_REQUEST } from 'store/types/users/fetchUserEducation'
import {
  fetchUserEducationSuccess,
  fetchUserEducationFailed,
} from 'store/actions/users/fetchUserEducation'
import { fetchUserEducationService } from 'store/services/users/fetchUserEducation'

function* fetchUserEducationReq(action) {
  try {
    const { data } = yield call(fetchUserEducationService, action.payload)
    yield put(fetchUserEducationSuccess(data.data))
  } catch (error) {
    console.log(error)
    yield put(fetchUserEducationFailed(error))
  }
}

export default function* fetchUserEducationSaga() {
  yield takeLatest(FETCH_USER_EDUCATION_REQUEST, fetchUserEducationReq)
}
