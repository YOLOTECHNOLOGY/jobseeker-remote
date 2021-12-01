/* eslint-disable */
import { call, put, takeLatest } from 'redux-saga/effects'
// import { call, put, takeLatest, select } from 'redux-saga/effects'
import { FETCH_JOBS_LIST_REQUEST } from 'store/types/jobs/fetchJobsList'
import { fetchJobsListSuccess, fetchJobsListFailed } from 'store/actions/jobs/fetchJobsList'
import { fetchJobsListService } from 'store/services/jobs/fetchJobsList'

import {
  handleSalary,
  handleWorkExperience,
  handleEducation,
  handleJobType,
  handleIndustry,
  handleApplicationStatus,
  handleJobCategory,
  handleJobLocation,
  handleIsCompanyVerified,
} from 'helpers/jobPayloadFormatter'

function* fetchJobsListReq(action) {
  try {
    const {
      query,
      queryFields,
      companyName,
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
      jobCategory,
      size,
    } = action.payload
    // let queryParam = ''
    // const formattedXpLvls = handleWorkExperience(workExperience)
    // const [formattedSalaryFrom, formattedSalaryTo] = handleSalary(salary)
    // const formattedDegrees = handleEducation(education)
    // const formattedJobTypes = handleJobType(jobType)
    // const formattedCompanyIndustries = handleIndustry(industry)
    // const formattedIsCompanyVerified = handleIsCompanyVerified(isVerified)
    // const formattedApplicationStatus = handleApplicationStatus(applicationStatus)
    // const formattedJobCategories = handleJobCategory(jobCategory, true)
    // const formattedJobLocation = handleJobLocation(jobLocation)

    // if (query !== undefined || query !== null) {
    //   queryParam = query
    // }

    // const isMobile = yield select((state) => state.utility.setUserDevice.userAgent.isMobile)

    // const formatCompanyIndustries = formattedCompanyIndustries.replace(/%26/gi, '&')
    const [salaryFrom, salaryTo ]= handleSalary(salary)
    let payload = {
      query: queryParam,
      job_locations: jobLocation,
      job_categories: formattedJobCategories,
      salary_from: salaryFrom,
      salary_to: salaryTo,
      company_industries: industry,
      degrees: qualification,
      xp_lvls: workExperience,
      sort,
      source: 'web',
    }

    // let payload = {
    //   query: queryParam,
    //   query_fields: queryFields,
    //   company_name: companyName,
    //   job_locations: formattedJobLocation,
    //   xp_lvls: formattedXpLvls,
    //   salary_from: formattedSalaryFrom,
    //   salary_to: formattedSalaryTo,
    //   degrees: formattedDegrees,
    //   job_types: formattedJobTypes,
    //   company_industries: formattedCompanyIndustries,
    //   size: size || 18,
    //   page: page,
    //   is_company_verified: formattedIsCompanyVerified,
    //   sort: sort,
    //   status: formattedApplicationStatus,
    //   job_categories: formattedJobCategories,
    //   source: isMobile ? 'mobile_web' : 'web',
    // }

    console.log('saga payload', payload)

    if (viewPage === 'Applied') {
      payload = {
        page: page,
        size: size || 18,
      }

      if (formattedApplicationStatus) {
        payload.status_id = formattedApplicationStatus
      }
    }

    const response = yield call(fetchJobsListService, payload)

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
