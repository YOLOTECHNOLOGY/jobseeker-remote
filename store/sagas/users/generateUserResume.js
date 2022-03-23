import {call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { GENERATE_USER_RESUME_REQUEST } from 'store/types/users/generateUserResume'
import {
  generateUserResumeSuccess,
  generateUserResumeFailed,
} from 'store/actions/users/generateUserResume'
import {
  completeUserProfileSuccess,
  completeUserProfileFailed,
} from 'store/actions/users/completeUserProfile'

import { generateUserResumeService } from 'store/services/users/generateUserResume'
import { completeUserProfileService } from 'store/services/users/completeUserProfile'

import { getItem, removeItem } from 'helpers/localStorage'

function* generateUserResumeReq({ payload }) {
  const { accessToken, redirect } = payload
  try {
    const response = yield call(generateUserResumeService, { accessToken })
    if (response.status >= 200 && response.status < 300) {
      yield put(generateUserResumeSuccess(response.data.data))
      yield completeUserProfileSaga(redirect, accessToken)
    }

  } catch (error) {
    yield put(generateUserResumeFailed(error.response.data))
  }
}

function* completeUserProfileSaga(redirect, accessToken) {
  const isFromCreateResume = getItem('isFromCreateResume')

  try {
    const { data } = yield call(completeUserProfileService, { accessToken })
    yield put(completeUserProfileSuccess(data.data))

    let url = '/jobs-hiring/job-search'
    if (redirect) {
      url = redirect
    }

    if (isFromCreateResume && isFromCreateResume === '1') {
      url = `${process.env.OLD_PROJECT_URL}/dashboard/profile/jobseeker`
    }

    removeItem('isFromCreateResume')
    removeItem('isCreateFreeResume')
    yield put(push(url))
  } catch (error) {
    yield put(completeUserProfileFailed(error))
  }
}

export default function* generateUserResumeSaga() {
  yield takeLatest(GENERATE_USER_RESUME_REQUEST, generateUserResumeReq)
}
