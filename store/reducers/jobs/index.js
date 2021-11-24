import { combineReducers } from 'redux'

import fetchJobsListReducer from './fetchJobsList'

const jobsReducers = combineReducers({
  jobList: fetchJobsListReducer,
})

export default jobsReducers
