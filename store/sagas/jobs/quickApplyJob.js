/* eslint-disable camelcase */
import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { QUICK_APPLY_JOB_REQUEST } from 'store/types/jobs/quickApplyJob'
import { quickApplyJobSuccess, quickApplyJobFailed } from 'store/actions/jobs/quickApplyJob'

import { setCookie } from 'helpers/cookies'
import { getUtmCampaignData, removeUtmCampaign } from 'helpers/utmCampaign'
import { authPathToOldProject } from 'helpers/authenticationTransition'

import { registerJobseekerService } from 'store/services/auth/registerJobseeker'
import {
  registerJobseekerSuccess,
  registerJobseekerFailed,
} from 'store/actions/auth/registerJobseeker'

import { uploadUserResumeService } from 'store/services/users/uploadUserResume'
import {
  uploadUserResumeSuccess,
  uploadUserResumeFailed,
} from 'store/actions/users/uploadUserResume'

import { applyJobService } from 'store/services/jobs/applyJob'

function* quickApplyJobReq(action) {
  try {
    const {
      email, 
      password,
      first_name,
      last_name,
      terms_and_condition,
      contact_number,
      is_subscribe,
      screening_answers,
      first_message,
      resume,
      jobId,
      jobCategories,
      companyId
    } = action.payload

    // Register jobseeker
    const registerPayload = {
      email, 
      password,
      first_name,
      last_name,
      terms_and_condition,
      contact_number,
      is_subscribe,
      source: "web",
      country_key: process.env.COUNTRY_KEY,
      ...(yield* getUtmCampaignData())
    } 

    const response = yield call(registerJobseekerService, registerPayload)

    if (response.status >= 200 && response.status < 300) {
      yield put(registerJobseekerSuccess(response.data))

      removeUtmCampaign()
      if (window !== 'undefined' && window.gtag) {
        yield window.gtag('event', 'conversion', {
          send_to: 'AW-844310282/-rRMCKjts6sBEIrOzJID'
        })
      }
      
      if (window !== 'undefined' && window.fbq) {
        yield fbq.event('CompleteRegistration', {'source': 'quick_apply'})
      }

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
        is_email_verify: registeredData.is_email_verify,
        notice_period_id: registeredData.notice_period_id,
        is_profile_completed: registeredData.is_profile_completed,
      }

      yield call(setCookie, 'user', userCookie)

      yield call(
        setCookie,
        'accessToken',
        registeredData.authentication.access_token
      )

      // Upload resume 
      yield uploadResumeSaga(resume, registeredData.authentication.access_token)

      // Apply job
      const applyJobPayload = {
        source: 'quick_apply',
        first_message,
        screening_answers
      }

      try {
        const applyJobResponse = yield call(applyJobService, jobId, applyJobPayload)

        yield put(quickApplyJobSuccess(applyJobResponse.data.data))

        const applySuccessUrl = authPathToOldProject(null, `/${jobCategories}/${companyId}/${jobId}/applysuccess`)

        yield put(push(applySuccessUrl))
      } catch (error) {
        yield put(quickApplyJobFailed(error.response.data.errors.message))
      }
    }
  } catch (error) {
    yield put(registerJobseekerFailed(error.response.data.errors.message))
  }
}

function* uploadResumeSaga(resume, accessToken) {
  try {
    const { data } = yield call(uploadUserResumeService, { resume, accessToken })

    yield put(uploadUserResumeSuccess(data.data))
  } catch (error) {
    yield put(uploadUserResumeFailed(error.response.data))
  }
}

export default function* quickApplyJob() {
  yield takeLatest(QUICK_APPLY_JOB_REQUEST, quickApplyJobReq)
}
