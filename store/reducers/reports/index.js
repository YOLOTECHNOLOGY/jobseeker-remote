import { combineReducers } from 'redux'

import postReportReducer from './postReport'

const reportsReducers = combineReducers({
  postReport: postReportReducer,
})

export default reportsReducers
