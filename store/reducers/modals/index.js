import { combineReducers } from 'redux'

import manageJobAlertsModal from './manageJobAlertsModal'
import createJobAlertModal from './createJobAlertModal'
import updateJobAlertModal from './updateJobAlertModal'
import deleteJobAlertModal from './deleteJobAlertModal'

const modalReducers = combineReducers({
  manageJobAlertsModal: manageJobAlertsModal,
  createJobAlertModal: createJobAlertModal,
  updateJobAlertModal: updateJobAlertModal,
  deleteJobAlertModal: deleteJobAlertModal
})

export default modalReducers
