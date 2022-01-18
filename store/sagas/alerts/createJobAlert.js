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

    // if (registerUserResponse?.status === 201 || payload.user_id) {
    const jobAlertPayload = {
      user_id: 1820, //ToDo: Fetch UserID
      keyword: payload.keyword,
      location: payload.location,
      job_category_key: payload.job_category_key,
      industry_key: payload.industry_key,
      xp_lvl_key: payload.xp_lvl_key,
      degree_key: payload.degree_key,
      job_type_key: payload.job_type_key,
      salary_range_key: payload.salary_range_key,
      is_company_verified: payload.is_company_verified,
      frequency_id: payload.frequency_id,
    }
    
    const { data } = yield call(createJobAlertService, jobAlertPayload)
    yield put(createJobAlertSuccess(data.data))
    // }
  } catch (error) {
    console.log('error-saga', error)
    yield put(createJobAlertFailed(error))
  }
}

export default function* createJobAlertSaga() {
  yield takeLatest(CREATE_JOB_ALERT_REQUEST, createJobAlertReq)
}
