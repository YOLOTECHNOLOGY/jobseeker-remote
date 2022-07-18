import {
    OPEN_CREATE_JOB_ALERT_MODAL,
    CLOSE_CREATE_JOB_ALERT_MODAL
  } from 'store/types/modals/createJobAlertModal'
  
  const openCreateJobAlertModal = () => ({
    type: OPEN_CREATE_JOB_ALERT_MODAL,
  })
  
  const closeCreateJobAlertModal = () => ({
    type: CLOSE_CREATE_JOB_ALERT_MODAL,
  })
  
  export { openCreateJobAlertModal, closeCreateJobAlertModal }
  