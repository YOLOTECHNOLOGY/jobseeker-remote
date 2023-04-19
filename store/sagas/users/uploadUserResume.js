import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { UPLOAD_USER_RESUME_REQUEST } from 'store/types/users/uploadUserResume'
import {
  uploadUserResumeSuccess,
  uploadUserResumeFailed
} from 'store/actions/users/uploadUserResume'
import { uploadUserResumeService } from 'store/services/users/uploadUserResume'

function* uploadUserResumeReq({ payload }) {
  const { resume, redirect } = payload
  try {
    const { data } = yield call(uploadUserResumeService, resume)

    yield put(uploadUserResumeSuccess(data.data))

    if (redirect) {
      yield put(push(redirect))
    }
  } catch (error) {
    yield put(uploadUserResumeFailed(error.response.data))
  }
}

export default function* uploadUserResumeSaga() {
  yield takeLatest(UPLOAD_USER_RESUME_REQUEST, uploadUserResumeReq)
}
