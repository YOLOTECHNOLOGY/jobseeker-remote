import { combineReducers } from 'redux'

import fetchJobAlertsListReducer from './fetchJobAlertsList'
import updateJobAlertReducer from './updateJobAlert'
import deleteJobAlertReducer from './deleteJobAlert'

const alertsReducers = combineReducers({
  fetchJobAlertsList: fetchJobAlertsListReducer,
  updateJobAlert: updateJobAlertReducer,
  deleteJobAlert: deleteJobAlertReducer
})

export default alertsReducers
