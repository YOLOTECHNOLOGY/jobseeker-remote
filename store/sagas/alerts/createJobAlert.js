import { call, put, takeLatest } from 'redux-saga/effects'
import { CREATE_JOB_ALERT_REQUEST } from 'store/types/alerts/createJobAlert'
import {
  createJobAlertSuccess,
  createJobAlertFailed,
} from 'store/actions/alerts/createJobAlert'
import { createJobAlertService } from 'store/services/alerts/createJobAlert'
import { registerUserService } from 'store/services/users/registerUser'

function* createJobAlertReq(action) {
  const { jobAlertData, accessToken, user_id } = action.payload

  try {
    let registerUserResponse

    if (jobAlertData.email) {
      const first_name = jobAlertData.email.split('@')[0]
      const randomPassword =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15)
          
      const userPayload = {
        email: jobAlertData.email,
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

    if (registerUserResponse?.status === 201 || user_id) {
      const jobAlertPayload = {
        jobAlertData: {
          user_id: user_id ? user_id : registerUserResponse.data.data.id,
          keyword: jobAlertData.keyword,
          location_key: jobAlertData.location_key,
          job_category_key: jobAlertData.job_category_key,
          industry_key: jobAlertData.industry_key,
          xp_lvl_key: jobAlertData.xp_lvl_key,
          degree_key: jobAlertData.degree_key,
          job_type_key: jobAlertData.job_type_key,
          salary_range_key: jobAlertData.salary_range_key,
          is_company_verified: jobAlertData.is_company_verified,
          frequency_id: jobAlertData.frequency_id,
        },
        accessToken: accessToken
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
