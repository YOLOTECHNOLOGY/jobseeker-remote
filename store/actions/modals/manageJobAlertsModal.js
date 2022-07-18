import {
    OPEN_MANAGE_JOB_ALERTS_MODAL,
    CLOSE_MANAGE_JOB_ALERTS_MODAL
  } from 'store/types/modals/manageJobAlertsModal'
  
  const openManageJobAlertsModal = () => ({
    type: OPEN_MANAGE_JOB_ALERTS_MODAL,
  })
  
  const closeManageJobAlertsModal = () => ({
    type: CLOSE_MANAGE_JOB_ALERTS_MODAL,
  })
  
  export { openManageJobAlertsModal, closeManageJobAlertsModal }
  