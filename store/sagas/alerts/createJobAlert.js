/* eslint-disable camelcase */
import { call, put, takeLatest } from 'redux-saga/effects'
import { CREATE_JOB_ALERT_REQUEST } from 'store/types/alerts/createJobAlert'
import {
  createJobAlertSuccess,
  createJobAlertFailed,
} from 'store/actions/alerts/createJobAlert'
import {
  displayNotification
} from 'store/actions/notificationBar/notificationBar'
import {
  openCreateJobAlertModal
} from 'store/actions/modals/createJobAlertModal'
import { createJobAlertService } from 'store/services/alerts/createJobAlert'
import { registerUserService } from 'store/services/users/registerUser'
import { getUtmCampaignData, removeUtmCampaign } from 'helpers/utmCampaign'

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
        client_secret: process.env.CLIENT_SECRET,
        ...(yield* getUtmCampaignData())
      }

      registerUserResponse = yield call(registerUserService, userPayload)
    }

    if (registerUserResponse?.status === 201 || user_id) {
      const jobAlertPayload = {
        jobAlertData: {
          user_id: user_id ? user_id : registerUserResponse.data.data.id,
          ...jobAlertData
          // keyword: jobAlertData.keyword,
          // location_values: jobAlertData.location_values,
          // job_type_values: jobAlertData.job_type_values,
          // salary_range_values: jobAlertData.salary_range_values,
          // job_category_values: jobAlertData.job_category_values,
          // industry_values: jobAlertData.industry_values,
          // xp_lvl_values: jobAlertData.xp_lvl_values,
          // degree_values: jobAlertData.degree_values,
          // is_company_verified: jobAlertData.is_company_verified,
          // frequency_id: jobAlertData.frequency_id,
          // main_function_values: jobAlertData.main_functions,
          // job_function_ids: jobAlertData.job_functions,
          // function_job_title_ids: jobAlertData.function_titles
        },
        accessToken: accessToken
      }
      removeUtmCampaign()

      const { data } = yield call(createJobAlertService, jobAlertPayload)

      yield put(createJobAlertSuccess(data.data))
      yield put(openCreateJobAlertModal())
    }
  } catch (error) {
    yield put(createJobAlertFailed(error))

    const displayNotificationPayload = {
      "open": true,
      "severity": "error",
      "message": "Failed to enable job alert. Please contact support@bossjob.com for assistance."
    }
    yield put(displayNotification(displayNotificationPayload))

  }
}

export default function* createJobAlertSaga() {
  yield takeLatest(CREATE_JOB_ALERT_REQUEST, createJobAlertReq)
}
