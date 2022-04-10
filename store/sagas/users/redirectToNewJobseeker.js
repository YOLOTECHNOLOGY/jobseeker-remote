import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-next-router'
import { REDIRECT_TO_NEW_JOBSEEKER_REQUEST } from 'store/types/users/redirectToNewJobseeker'
import { setCookie } from 'helpers/cookies'
import {
  redirectToNewJobseekerSuccess,
  redirectToNewJobseekerFailed,
} from 'store/actions/users/redirectToNewJobseeker'
import { fetchUserOwnDetailService } from 'store/services/users/fetchUserOwnDetail'
import { loginSuccess } from 'store/actions/auth/login'

function* redirectToNewJobseekerReq(action) {
  const { token, redirectUrl } = action.payload
  try {

    yield call(setCookie, 'accessToken', token)
    const response = yield call(fetchUserOwnDetailService, {accessToken: token})

    if (response.status >= 200 && response.status < 300) {
      yield put(loginSuccess(response.data.data))
      yield put(redirectToNewJobseekerSuccess(response.data.data))

      const loginData = response.data.data

      const userCookie = {
        active_key: loginData.active_key,
        id: loginData.id,
        first_name: loginData.first_name,
        last_name: loginData.last_name,
        email: loginData.email,
        phone_num: loginData.phone_num,
        is_mobile_verified: loginData.is_mobile_verified,
        avatar: loginData.avatar,
        additional_info: loginData.additional_info,
        is_email_verify: loginData.is_email_verify,
        notice_period_id: loginData.notice_period_id,
        is_bosshunt_talent: loginData.is_bosshunt_talent,
        is_bosshunt_talent_active: loginData.is_bosshunt_talent_active,
        bosshunt_talent_opt_out_at: loginData.bosshunt_talent_opt_out_at,
        is_profile_completed: loginData.is_profile_completed,
        recruiter_latest_work_xp:
          (loginData.recruiter_latest_work_xp && {
            company_id: loginData.recruiter_latest_work_xp.company_id,
            job_title: loginData.recruiter_latest_work_xp.job_title,
            is_currently_work_here:
              loginData.recruiter_latest_work_xp.is_currently_work_here
          }) ||
          null
      }

      yield call(setCookie, 'user', userCookie)
      yield put(push(redirectUrl))
    }

  } catch (error) {
    yield put(redirectToNewJobseekerFailed(error))
  }
}

export default function* redirectToNewJobseekerSaga() {
  yield takeLatest(REDIRECT_TO_NEW_JOBSEEKER_REQUEST, redirectToNewJobseekerReq)
}
