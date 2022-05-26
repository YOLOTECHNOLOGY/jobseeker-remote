import React from 'react'

/* Vendors */
// import { useForm } from 'react-hook-form'

/* Components */
import Modal from 'components/Modal'
import Text from 'components/Text'

/* Styles */
import styles from './ModalWithdrawApplication.module.scss'

interface IModalWithdrawApplication {
  isShowModalWithdrawApplication?: boolean
  handleShowModalWithdrawApplication?: Function
  handleWithdrawApplication?: Function
  jobId?: number
  isWithdrawAppliedJobFetching?: boolean
}

const ModalWithdrawApplication = ({
  isShowModalWithdrawApplication,
  handleShowModalWithdrawApplication,
  handleWithdrawApplication,
  jobId,
  isWithdrawAppliedJobFetching
}: IModalWithdrawApplication) => {

  const handleText = () => {
    return isWithdrawAppliedJobFetching ? 'Updating...' : 'Withdraw'
  }

  return (
    <Modal
      headerTitle='Withdraw Application'
      showModal={isShowModalWithdrawApplication}
      handleModal={() => handleShowModalWithdrawApplication(false)}
      firstButtonText='Back'
      handleFirstButton={() => {
        handleShowModalWithdrawApplication(false)
      }}
      secondButtonText={handleText()}
      handleSecondButton={() => {
        handleWithdrawApplication({jobId})
      }}
    >
      <div className={styles.ModalWithdrawApplication}>
        <Text textStyle='lg'>You are about to withdraw your application. This cannot be undone.</Text>
      </div>
    </Modal>
  )
}

export default ModalWithdrawApplication