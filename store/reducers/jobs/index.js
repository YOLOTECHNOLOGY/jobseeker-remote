import { combineReducers } from 'redux'

import fetchJobsListReducer from './fetchJobsList'
import fetchJobDetailReducer from './fetchJobDetail'
import fetchAppliedJobsListReducer from './fetchAppliedJobsList'
import fetchSavedJobsListReducer from './fetchSavedJobsList'

const jobsReducers = combineReducers({
  jobList: fetchJobsListReducer,
  jobDetail: fetchJobDetailReducer,
  appliedJobsList: fetchAppliedJobsListReducer,
  savedJobsList: fetchSavedJobsListReducer,
})

export default jobsReducers
