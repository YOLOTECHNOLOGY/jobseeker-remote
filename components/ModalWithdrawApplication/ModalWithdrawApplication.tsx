import React, { useState, useEffect } from 'react'

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
  appliedJobId?: number
  isWithdrawAppliedJobFetching?: boolean
  withdrawAppliedJobResponse?: any
}

const ModalWithdrawApplication = ({
  isShowModalWithdrawApplication,
  handleShowModalWithdrawApplication,
  handleWithdrawApplication,
  appliedJobId,
  isWithdrawAppliedJobFetching,
  withdrawAppliedJobResponse
}: IModalWithdrawApplication) => {
  const [hasWithdrawed, setHasWithdrawed] = useState(false)

  useEffect(() => {
    if (withdrawAppliedJobResponse?.message === 'success') {
      setHasWithdrawed(true)
    }
  }, [withdrawAppliedJobResponse])

  const handleText = () => {
    if (hasWithdrawed) return 'Done'
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
        if (!hasWithdrawed) {
          handleWithdrawApplication({appliedJobId})
        }
      }}
    >
      <div className={styles.ModalWithdrawApplication}>
        <Text textStyle='lg'>You are about to withdraw your application. This cannot be undone.</Text>
      </div>
    </Modal>
  )
}

export default ModalWithdrawApplication