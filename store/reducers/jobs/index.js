import { combineReducers } from 'redux'

import fetchJobsListReducer from './fetchJobsList'
import fetchJobDetailReducer from './fetchJobDetail'
import fetchAppliedJobsListReducer from './fetchAppliedJobsList'

import fetchSavedJobsListReducer from './fetchSavedJobsList'
import postSaveJobReducer from './postSaveJob'
import deleteSaveJobReducer from './deleteSaveJob'

const jobsReducers = combineReducers({
  jobList: fetchJobsListReducer,
  jobDetail: fetchJobDetailReducer,
  appliedJobsList: fetchAppliedJobsListReducer,

  savedJobsList: fetchSavedJobsListReducer,
  postSaveJob: postSaveJobReducer,
  deleteSaveJob: deleteSaveJobReducer,
})

export default jobsReducers
