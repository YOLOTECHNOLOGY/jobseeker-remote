import {
    OPEN_DELETE_JOB_ALERT_MODAL,
    CLOSE_DELETE_JOB_ALERT_MODAL
  } from 'store/types/modals/deleteJobAlertModal'
  
  const openDeleteJobAlertModal = () => ({
    type: OPEN_DELETE_JOB_ALERT_MODAL,
  })
  
  const closeDeleteJobAlertModal = () => ({
    type: CLOSE_DELETE_JOB_ALERT_MODAL,
  })
  
  export { openDeleteJobAlertModal, closeDeleteJobAlertModal }
  