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
      location,
      salary,
      workExperience,
      qualification,
      jobType,
      industry,
      verifiedCompany,
      page,
      // isVerified,
      sort,
      // viewPage,
      // applicationStatus,
      category,
      size,
      companyIds,
    } = action.payload

    const [salaryFrom, salaryTo ]= handleSalary(salary?.split(','))
    const payload = {
      query,
      job_locations: location,
      job_categories: category,
      salary_from: salaryFrom,
      salary_to: salaryTo,
      company_industries: industry,
      degrees: qualification,
      xp_lvls: workExperience,
      job_types: jobType,
      company_ids: companyIds,
      is_company_verified: verifiedCompany,
      sort,
      page,
      size: size || 30,
      source: 'web',
    }

    const response = yield call(fetchJobsListService, payload, action.accessToken)

    if (response.status === 200 || response.status === 201) {
      yield put(fetchJobsListSuccess(response.data))
    }
  } catch (error) {
    yield put(fetchJobsListFailed(error))
  }
}

export default function* fetchJobsList() {
  yield takeLatest(FETCH_JOBS_LIST_REQUEST, fetchJobsListReq)
}
