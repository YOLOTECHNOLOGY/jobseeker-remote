import fetchJobsList from './fetchJobsList'
import fetchJobDetail from './fetchJobDetail'
import fetchSimilarJobs from './fetchSimilarJobs'

import fetchAppliedJobsList from './fetchAppliedJobsList'
import fetchAppliedJobDetail from './fetchAppliedJobDetail'
import withdrawAppliedJob from './withdrawAppliedJob'

import fetchSavedJobsList from './fetchSavedJobsList'
import fetchSavedJobDetail from './fetchSavedJobDetail'
import postSaveJob from './postSaveJob'
import deleteSaveJob from './deleteSaveJob'
import addJobView from './addJobView'
import addExternalJobClickService from './addExternalJobClick'

import updateUserVisibilityToWork from './updateUserVisibilityToWork'
import fetchHotJobsListService from './fetchHotJobs'

import fetchJobsFunction from './fetchJobFunction'

export default {
  fetchJobsList,
  fetchJobDetail,
  addJobView,
  fetchSimilarJobs,

  fetchAppliedJobsList,
  fetchAppliedJobDetail,
  withdrawAppliedJob,

  fetchSavedJobsList,
  fetchSavedJobDetail,
  postSaveJob,
  deleteSaveJob,

  applyJobService,
  addExternalJobClickService,

  updateUserVisibilityToWork,
  fetchHotJobsListService,
  fetchJobsFunction
}
