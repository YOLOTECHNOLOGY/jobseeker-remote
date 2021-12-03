import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { FETCH_JOB_DETAIL_REQUEST } from 'store/types/jobs/fetchJobDetail'
import { fetchJobDetailSuccess, fetchJobDetailFailed } from 'store/actions/jobs/fetchJobDetail'
import { fetchCompanyDetailSuccess, fetchCompanyDetailFailed } from 'store/actions/companies/fetchCompanyDetail'
import { fetchJobDetailService } from 'store/services/jobs/fetchJobDetail'
import { fetchCompanyDetailService } from 'store/services/companies/fetchCompanyDetail'

function* fetchJobDetailReq(actions) {
  try {
    const { payload } = actions

    const jobDetailResponse = yield call(fetchJobDetailService, payload)

    if (jobDetailResponse.status >= 200 && jobDetailResponse.status < 300) {
      /*
       * Check if job status is active / pending / expired
       *
       * Active -> Display as per normal, conditional button state check
       * Pending -> Conditional check if job is created by current user, and userRole as Recruiter, else Redirects to 404
       * Expired -> Display as per normal, conditional button state check
       */

      // if (jobDetailResponse.data.data.status_key === 'pending') {
      //   // Pending Job Logic Flow
      //   if (
      //     !getCookie('user') &&
      //     !getCookie('user').active_key === 2 &&
      //     jobDetailResponse.data.data.recruiter_id === getCookie('user').id
      //   ) {
      //     yield put(push('/404'))
      //   }
      // }

      // if (getCookie('user') && getCookie('user').active_key === 1) {
      //   // const recipientChatUserResponse = yield call(
      //   //   api.chat.fetchDialogueInfoService,
      //   //   getCookie('user').id,
      //   //   jobDetailResponse.data.data.recruiter_id,
      //   //   jobDetailResponse.data.data.id
      //   // )

      //   const applicationExistedInfo = yield call(
      //     api.applications.checkApplicationExistedService,
      //     jobDetailResponse.data.data.id,
      //     getCookie('user').id
      //   )

      //   // jobDetailResponse.data.data['dialogue_id'] =
      //   //   recipientChatUserResponse.data.data.dialogue_id
      //   // jobDetailResponse.data.data['founder_id'] =
      //   //   recipientChatUserResponse.data.data.founder_id
      //   // jobDetailResponse.data.data['another_user'] =
      //   //   recipientChatUserResponse.data.data.another_user
      //   // jobDetailResponse.data.data['job_id'] =
      //   //   recipientChatUserResponse.data.data.job_id
      //   // jobDetailResponse.data.data['status'] =
      //   //   recipientChatUserResponse.data.data.status
      //   jobDetailResponse.data.data['applicationInfo'] = applicationExistedInfo.data.data
      // }

      yield put(
        fetchJobDetailSuccess(jobDetailResponse.data)
      )

      try {
        const companyDetailResponse = yield call(
          fetchCompanyDetailService,
          jobDetailResponse.data.data.company_id
        )

        yield put(
          fetchCompanyDetailSuccess(
            companyDetailResponse.data
          )
        )
      } catch (err) {
        yield put(fetchCompanyDetailFailed(err))
      }
    }
  } catch (err) {
    yield put(fetchJobDetailFailed(err))
  }
}

export default function* fetchJobDetail() {
  yield takeLatest(FETCH_JOB_DETAIL_REQUEST, fetchJobDetailReq)
}
