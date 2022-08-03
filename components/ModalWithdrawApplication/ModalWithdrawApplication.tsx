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
  isWithdrawApplicationResult?: boolean
}

const modalText = {
  defaultText: 'You are about to withdraw your application. This cannot be undone.',
  successText: 'Your application was successfully withdrawn.'
}

const ModalWithdrawApplication = ({
  isShowModalWithdrawApplication,
  handleShowModalWithdrawApplication,
  handleWithdrawApplication,
  jobId,
  isWithdrawAppliedJobFetching,
  isWithdrawApplicationResult
}: IModalWithdrawApplication) => {
  const handleText = () => {
    if (!isWithdrawApplicationResult) {
      return isWithdrawAppliedJobFetching ? 'Updating...' : 'Withdraw'
    }
    return ''
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
      firstButtonIsClose={true}
      // secondButtonIsClose={true}
      secondButtonText={handleText()}
      handleSecondButton={() => {
        handleWithdrawApplication({ jobId })
      }}
    >
      <div className={styles.ModalWithdrawApplication}>
        <Text textStyle='lg'>
          {isWithdrawApplicationResult ? modalText.successText : modalText.defaultText}
        </Text>
      </div>
    </Modal>
  )
}

export default ModalWithdrawApplication
