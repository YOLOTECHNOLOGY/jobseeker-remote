/* eslint-disable camelcase */
import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import * as fbq from 'lib/fpixel'

// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { QUICK_APPLY_JOB_REQUEST } from 'store/types/jobs/quickApplyJob'
import { quickApplyJobSuccess, quickApplyJobFailed } from 'store/actions/jobs/quickApplyJob'

import { setCookie } from 'helpers/cookies'
import { getUtmCampaignData, removeUtmCampaign } from 'helpers/utmCampaign'

import { registerJobseekerService } from 'store/services/auth/registerJobseeker'
import {
  registerJobseekerSuccess,
  registerJobseekerFailed
} from 'store/actions/auth/registerJobseeker'

import { uploadUserResumeService } from 'store/services/users/uploadUserResume'
import {
  uploadUserResumeSuccess,
  uploadUserResumeFailed
} from 'store/actions/users/uploadUserResume'
import { applyJobService } from 'store/services/jobs/applyJob'
import { addExternalJobClickService } from 'store/services/jobs/addExternalJobClick'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { checkErrorCode } from 'helpers/errorHandlers'

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
      jobUrl,
      externalApplyUrl,
      source
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
      source,
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
        yield fbq.event('CompleteRegistration', { source: 'quick_apply' })
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
        is_profile_completed: registeredData.is_profile_completed
      }

      yield call(setCookie, 'user', userCookie)

      yield call(setCookie, 'accessToken', registeredData.authentication.access_token)

      // Upload resume
      yield uploadResumeSaga(resume)

      // Apply job
      const applyJobPayload = {
        source: 'quick_apply',
        first_message,
        screening_answers
      }

      try {
        // If external apply exists redirect jobseeker to external apply url (No application will be created)
        if (externalApplyUrl) {
          yield call(addExternalJobClickService, jobId)
          
          if (source === 'mobile_web') {
            yield window.location.href = externalApplyUrl
          } else {
            yield window.open(externalApplyUrl)
            yield window.location.reload()
          }
        } else {
          const applyJobResponse = yield call(applyJobService, jobId, applyJobPayload)

          if (applyJobResponse) {
            const { job_categories, company_industry } = applyJobResponse.data.data

            yield put(quickApplyJobSuccess(applyJobResponse.data.data))

            sendGoogleEvent(job_categories, company_industry)

            if (window !== 'undefined' && window.fbq) {
              yield fbq.event('Application success', { source: 'quick_apply' })
            }

            yield put(push(`${jobUrl}/apply/success`))
          }
        }
      } catch (error) {
        const isServerError = checkErrorCode(error)
        if (isServerError) {
          yield put(
            displayNotification({
              open: true,
              severity: 'error',
              message:
                'We are sorry. Something went wrong. There was an unexpected server error. Try refreshing the page or contact support@bossjob.com for assistance.'
            })
          )
        } else {
          yield put(quickApplyJobFailed(error.response.data.errors.message))
        }
      }
    }
  } catch (error) {
    const isServerError = checkErrorCode(error)
    if (isServerError) {
      yield put(
        displayNotification({
          open: true,
          severity: 'error',
          message:
            'We are sorry. Something went wrong. There was an unexpected server error. Try refreshing the page or contact support@bossjob.com for assistance.'
        })
      )
    } else {
      yield put(registerJobseekerFailed(error.response.data.errors.message))
    }
  }
}

function* uploadResumeSaga(resume) {
  try {
    const { data } = yield call(uploadUserResumeService, resume)

    yield put(uploadUserResumeSuccess(data.data))
  } catch (error) {
    const isServerError = checkErrorCode(error)
    if (isServerError) {
      yield put(
        displayNotification({
          open: true,
          severity: 'error',
          message:
            'We are sorry. Something went wrong. There was an unexpected server error. Try refreshing the page or contact support@bossjob.com for assistance.'
        })
      )
    } else {
      yield put(uploadUserResumeFailed(error.response.data))
    }
  }
}

function sendGoogleEvent(job_categories, company_industry) {
  // Send Google event
  const IT_job_categories = [
    'IT - Hardware',
    'IT - Network/Sys/DB Admin',
    'IT - Software Engineering',
    'Sales - Eng/Tech/IT',
    'Tech & Helpdesk Support'
  ]

  const finance_categories = [
    'Audit & Taxation',
    'Banking/Financial',
    'Corporate Finance/Investment',
    'Sales - Insurance/Financial Services',
    'General/Cost Accounting'
  ]

  if (window !== 'undefined' && window.gtag) {
    // job application success tracker
    window.gtag('event', 'conversion', {
      send_to: 'AW-844310282/OLR1CNOj7aoBEIrOzJID'
    })

    // if job_categories includes IT jobs or industry is IT, send marketing tracker
    if (
      company_industry.indexOf('Information Technology') !== -1 ||
      job_categories.some((job) => IT_job_categories.indexOf(job) !== -1)
    ) {
      // IT job application tracker
      window.gtag('event', 'conversion', {
        send_to: 'AW-844310282/13DTCOHj_tIBEIrOzJID'
      })
    }

    // if job_categories includes finance jobs or industry is finance, send marketing tracker
    if (
      company_industry.indexOf('Accounting & Finance') !== -1 ||
      company_industry.indexOf('Financial Services') !== -1 ||
      job_categories.some((job) => finance_categories.indexOf(job) !== -1)
    ) {
      // IT job application tracker
      window.gtag('event', 'conversion', {
        send_to: 'AW-844310282/7ufFCPuXsfEBEIrOzJID'
      })
    }
  }
}

export default function* quickApplyJob() {
  yield takeLatest(QUICK_APPLY_JOB_REQUEST, quickApplyJobReq)
}
