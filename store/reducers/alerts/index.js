import { combineReducers } from 'redux'

import fetchJobAlertsListReducer from './fetchJobAlertsList'
import updateJobAlertReducer from './updateJobAlert'
import deleteJobAlertReducer from './deleteJobAlert'
import createJobAlertReducer from './createJobAlert'

const alertsReducers = combineReducers({
  fetchJobAlertsList: fetchJobAlertsListReducer,
  updateJobAlert: updateJobAlertReducer,
  deleteJobAlert: deleteJobAlertReducer,
  createJobAlert: createJobAlertReducer
})

export default alertsReducers
