import {call, put, takeLatest } from 'redux-saga/effects'
import { UPLOAD_USER_RESUME_REQUEST } from 'store/types/users/uploadUserResume'
import {
  uploadUserResumeSuccess,
  uploadUserResumeFailed,
} from 'store/actions/users/uploadUserResume'
import { uploadUserResumeService } from 'store/services/users/uploadUserResume'

function* uploadUserResumeReq({ payload }) {
  const { accessToken, resume } = payload
  try {
    const resumePayload = {
      accessToken,
      resume
    }
    const { data } = yield call(uploadUserResumeService, resumePayload)
    yield put(uploadUserResumeSuccess(data.data))
  } catch (error) {
    yield put(uploadUserResumeFailed(error.response.data))
  }
}

export default function* uploadUserResumeSaga() {
  yield takeLatest(UPLOAD_USER_RESUME_REQUEST, uploadUserResumeReq)
}
