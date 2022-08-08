/* eslint-disable camelcase */
import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import * as fbq from 'lib/fpixel'

import { APPLY_JOB_REQUEST } from 'store/types/jobs/applyJob'
import { applyJobSuccess, applyJobFailed } from 'store/actions/jobs/applyJob'
import { applyJobService } from 'store/services/jobs/applyJob'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { checkErrorCode } from 'helpers/errorHandlers'
import { updateUserCompleteProfileService } from 'store/services/users/updateUserCompleteProfile'

function* applyJobReq(action) {
  try {
		const {
			screeningAnswers,
			firstMessage,
			jobId,
			jobUrl,
			source,
			userSkills
		} = action.payload

		const payload = {
			source,
			first_message: firstMessage,
			screening_answers: screeningAnswers
		}

		if (userSkills) {
			yield call(updateUserCompleteProfileService, {skills: userSkills})
		}

		const response = yield call(applyJobService, jobId, payload)

		yield put(applyJobSuccess(response.data.data))

		if (window !== 'undefined' && window.fbq) {
			yield fbq.event('Application success', {'source': source})
		}

		const applySuccessUrl = `${jobUrl}/apply/success`

		yield put(push(applySuccessUrl))
  } catch (error) {
		const isServerError = checkErrorCode(error)

		if (isServerError) {
			yield put(displayNotification({
			open: true,
			severity: 'error',
			message: 'We are sorry. Something went wrong. There was an unexpected server error. Try refreshing the page or contact support@bossjob.com for assistance.'
			}))
		} else {
			yield put(applyJobFailed(error.response.data.errors.message))
		}
  }
}

export default function* applyJob() {
  yield takeLatest(APPLY_JOB_REQUEST, applyJobReq)
}
