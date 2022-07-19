import {
    OPEN_UPDATE_JOB_ALERT_MODAL,
    CLOSE_UPDATE_JOB_ALERT_MODAL
  } from 'store/types/modals/updateJobAlertModal'
  
  const openUpdateJobAlertModal = () => ({
    type: OPEN_UPDATE_JOB_ALERT_MODAL,
  })
  
  const closeUpdateJobAlertModal = () => ({
    type: CLOSE_UPDATE_JOB_ALERT_MODAL,
  })
  
  export { openUpdateJobAlertModal, closeUpdateJobAlertModal }
  