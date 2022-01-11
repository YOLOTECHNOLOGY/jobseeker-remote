import { call, put, takeLatest } from 'redux-saga/effects'
import { CREATE_JOB_ALERT_REQUEST } from 'store/types/alerts/createJobAlert'
import {
  createJobAlertSuccess,
  createJobAlertFailed,
} from 'store/actions/alerts/createJobAlert'
import { createJobAlertService } from 'store/services/alerts/createJobAlert'
import { registerUserService } from 'store/services/users/registerUser'

function* createJobAlertReq(action) {
  const { payload } = action
  console.log('creating-job.payload', payload)
  try {
    let registerUserResponse

    if (payload.email) {
      const first_name = payload.email.split('@')[0]
      const randomPassword =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15)
          
      const userPayload = {
        email: payload.email,
        first_name: first_name,
        last_name: '',
        password: randomPassword,
        source: 'jobalert',
        country_key: process.env.COUNTRY_KEY,
        terms_and_condition: false,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
      }

      registerUserResponse = yield call(registerUserService, userPayload)
    }

    if (registerUserResponse?.status === 201 || payload.user_id) {
      const jobAlertPayload = {
        user_id: registerUserResponse?.data?.data.id || payload.user_id,
        keyword: payload.query,
        frequency_id: payload.frequency_id,
        is_active: payload.is_active,
        job_category_key: payload.job_category_key,
        location_key: payload.location_key
      }

      const { data } = yield call(createJobAlertService, jobAlertPayload)
      yield put(createJobAlertSuccess(data.data))
    }
  } catch (error) {
    console.log('error-saga', error)
    yield put(createJobAlertFailed(error))
  }
}

export default function* createJobAlertSaga() {
  yield takeLatest(CREATE_JOB_ALERT_REQUEST, createJobAlertReq)
}
