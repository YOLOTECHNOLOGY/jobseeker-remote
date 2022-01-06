import React, { useState, useRef } from 'react'

/* Vendors */
import { useForm } from 'react-hook-form'

/* Components */
import Modal from 'components/Modal'
import Text from 'components/Text'

/* Styles */
import styles from './ModalWithdrawApplication.module.scss'

interface IModalWithdrawApplication {
  isShowModalWithdrawApplication?: boolean
  handleShowModalWithdrawApplication?: Function
}

const ModalWithdrawApplication = ({
  isShowModalWithdrawApplication,
  handleShowModalWithdrawApplication
}: IModalWithdrawApplication) => {
  return (
    <Modal
      headerTitle='Withdraw Application'
      showModal={isShowModalWithdrawApplication}
      handleModal={() => handleShowModalWithdrawApplication(false)}
      firstButtonText='Back'
      handleFirstButton={() => {
        console.log('Back')
      }}
      secondButtonText='Withdraw'
      handleSecondButton={() => console.log('Withdraw')}
    >
      <div className={styles.ModalWithdrawApplication}>
        <Text textStyle='lg'>You are about to withdraw your application. This cannot be undone.</Text>
      </div>
    </Modal>
  )
}

export default ModalWithdrawApplication