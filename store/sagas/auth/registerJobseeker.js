import { take, fork, call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'

import { setCookie } from 'helpers/cookies'
import { setItem } from 'helpers/localStorage'
import { isFromCreateResume } from 'helpers/constants'
import { removeUtmCampaign } from 'helpers/utmCampaign'

import { REGISTER_JOBSEEKER_REQUEST } from 'store/types/auth/registerJobseeker'
import { FETCH_RECRUITER_SUBSCRIPTION_FEATURE_SUCCESS } from 'store/types/recruiters/fetchRecruiterSubscriptionFeature'

import {
  registerJobseekerSuccess,
  registerJobseekerFailed,
} from 'store/actions/auth/registerJobseeker'

import { registerJobseekerService } from 'store/services/auth/registerJobseeker'

function* registerJobSeekerReq(actions) {
  try {
    const {
      jobId,
      email,
      password,
      first_name,
      last_name,
      terms_and_condition,
      is_subscribe,
      source
    } = actions.payload

    let randomPassword
    if (source === 'free_resume') {
      randomPassword =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15)
    }

    const registerJobseekerPayload = {
      email,
      first_name,
      last_name,
      password: password || '12345678',
      is_subscribe: is_subscribe || 0,
      source: source || 'web',
      country_key: process.env.COUNTRY_KEY,
      terms_and_condition: terms_and_condition || 0,
    }

    const response = yield call(registerJobseekerService, registerJobseekerPayload)
    if (response.status >= 200 && response.status < 300) {
      removeUtmCampaign()
      if (window !== 'undefined' && window.gtag) {
        yield window.gtag('event', 'conversion', {
          send_to: 'AW-844310282/-rRMCKjts6sBEIrOzJID'
        })
      }
      yield put(registerJobseekerSuccess(response.data))

      const registeredData = response.data.data
      const userCookie = {
        active_key: registeredData.active_key,
        id: registeredData.id,
        first_name: registeredData.first_name,
        last_name: registeredData.last_name,
        email: registeredData.email,
        phone_num: registeredData.phone_num,
        is_mobile_verified: registeredData.is_mobile_verified,
        avatar: registeredData.avatar,
        additional_info: registeredData.additional_info,
        is_email_verify: registeredData.is_email_verify,
        notice_period_id: registeredData.notice_period_id,
        is_profile_completed: registeredData.is_profile_completed,
        recruiter_latest_work_xp:
          (registeredData.recruiter_latest_work_xp && {
            company_id: registeredData.recruiter_latest_work_xp.company_id,
            job_title: registeredData.recruiter_latest_work_xp.job_title
          }) ||
          null
      }
      setItem(isFromCreateResume, source === 'free_resume' ? '1' : '0')

      yield call(setCookie, 'user', userCookie)
      yield call(
        setCookie,
        'accessToken',
        registeredData.authentication.access_token
      )

      yield put(push(jobId ? `/job/${jobId}` : '/jobseeker-complete-profile/1'))
    }
  } catch (err) {
    yield put(registerJobseekerFailed(err.response.data.errors.message))
  }
}


export default function* registerJobseekerSaga() {
  yield takeLatest(REGISTER_JOBSEEKER_REQUEST, registerJobSeekerReq)
}
