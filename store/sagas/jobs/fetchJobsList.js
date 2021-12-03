import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { FETCH_JOBS_LIST_REQUEST } from 'store/types/jobs/fetchJobsList'
import { fetchJobsListSuccess, fetchJobsListFailed } from 'store/actions/jobs/fetchJobsList'
import { fetchJobsListService } from 'store/services/jobs/fetchJobsList'

import {
  handleSalary,
} from 'helpers/jobPayloadFormatter'

function* fetchJobsListReq(action) {
  try {
    const {
      query,
      jobLocation,
      salary,
      workExperience,
      qualification,
      jobType,
      industry,
      page,
      isVerified,
      sort,
      viewPage,
      applicationStatus,
      jobCategories,
      size,
    } = action.payload

    const [salaryFrom, salaryTo ]= handleSalary(salary?.split(','))
    const payload = {
      query,
      job_locations: jobLocation,
      job_categories: jobCategories,
      salary_from: salaryFrom,
      salary_to: salaryTo,
      company_industries: industry,
      degrees: qualification,
      xp_lvls: workExperience,
      job_types: jobType,
      sort,
      page,
      source: 'web',
    }

    const response = yield call(fetchJobsListService, payload)
    console.log('response', response)

    if (response.status === 200 || response.status === 201) {
      yield put(fetchJobsListSuccess(response.data))
    }
  } catch (error) {
    console.log('error', error)
    yield put(fetchJobsListFailed(error))
  }
}

export default function* fetchJobsList() {
  yield takeLatest(FETCH_JOBS_LIST_REQUEST, fetchJobsListReq)
}
