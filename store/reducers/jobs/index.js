import { combineReducers } from 'redux'

import fetchJobsListReducer from './fetchJobsList'
import fetchJobDetailReducer from './fetchJobDetail'
import fetchSimilarJobsReducer from './fetchSimilarJobs'

import fetchAppliedJobsListReducer from './fetchAppliedJobsList'
import fetchAppliedJobDetailReducer from './fetchAppliedJobDetail'
import withdrawAppliedJobReducer from './withdrawAppliedJob'

import fetchSavedJobsListReducer from './fetchSavedJobsList'
import fetchSavedJobDetailReducer from './fetchSavedJobDetail'
import fetchChatDetailReducer from './fetchChatDetail'
import postSaveJobReducer from './postSaveJob'
import deleteSaveJobReducer from './deleteSaveJob'
import jobHiredDefaultValues from './jobHiredDefaultValues'
import quickApplyJobReducer from './quickApplyJob'
import applyJobReducer from './applyJob'

const jobsReducers = combineReducers({
  jobList: fetchJobsListReducer,
  jobDetail: fetchJobDetailReducer,
  chatDetail: fetchChatDetailReducer,
  similarJobs: fetchSimilarJobsReducer,
  jobHiredDefaultValues,
  appliedJobsList: fetchAppliedJobsListReducer,
  appliedJobDetail: fetchAppliedJobDetailReducer,
  withdrawAppliedJob: withdrawAppliedJobReducer,

  savedJobsList: fetchSavedJobsListReducer,
  savedJobDetail: fetchSavedJobDetailReducer,
  postSaveJob: postSaveJobReducer,
  deleteSaveJob: deleteSaveJobReducer,

  quickApplyJob: quickApplyJobReducer,
  applyJob: applyJobReducer
})

export default jobsReducers
