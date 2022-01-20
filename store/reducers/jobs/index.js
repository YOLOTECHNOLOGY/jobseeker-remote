import { combineReducers } from 'redux'

import fetchJobsListReducer from './fetchJobsList'
import fetchJobDetailReducer from './fetchJobDetail'

import fetchAppliedJobsListReducer from './fetchAppliedJobsList'
import fetchAppliedJobDetailReducer from './fetchAppliedJobDetail'

import fetchSavedJobsListReducer from './fetchSavedJobsList'
import fetchSavedJobDetailReducer from './fetchSavedJobDetail'
import postSaveJobReducer from './postSaveJob'
import deleteSaveJobReducer from './deleteSaveJob'

const jobsReducers = combineReducers({
  jobList: fetchJobsListReducer,
  jobDetail: fetchJobDetailReducer,

  appliedJobsList: fetchAppliedJobsListReducer,
  appliedJobDetail: fetchAppliedJobDetailReducer,

  savedJobsList: fetchSavedJobsListReducer,
  savedJobDetail: fetchSavedJobDetailReducer,
  postSaveJob: postSaveJobReducer,
  deleteSaveJob: deleteSaveJobReducer,
})

export default jobsReducers
