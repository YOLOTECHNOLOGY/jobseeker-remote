import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

/* Components */
import Modal from 'components/Modal'
import Text from 'components/Text'
import MaterialTextField from '../MaterialTextField'
import MaterialButton from '../MaterialButton'

/* Styles */
import styles from './ModalVerifyEmail.module.scss'

/* Vendors */
import Link from '../Link'
import { useDispatch, useSelector } from 'react-redux'

/* State */
import { generateVerifyEmailOTPRequest } from '../../store/actions/users/generateVerifyEmailOTP'
import { checkVerifyEmailOTPRequest } from '../../store/actions/users/checkVerifyEmailOTP'

/* Helpers */
import { authPathToOldProject } from '../../helpers/authenticationTransition'

interface ModalVerifyEmailProps {
  email: string
  isShowModal?: boolean
  handleModal?: Function
}

const ModalVerifyEmail = ({ email, isShowModal, handleModal }: ModalVerifyEmailProps) => {
  const [otp, setOtp] = useState<string>('') // Text Input field state
  const [timerCount, setTimerCount] = useState<number>(-1) // timer counter
  const [canRequestOTP, setCanRequestOTP] = useState<boolean>(true) // if an otp is requested or timer countdown starts
  const [isVerifyingOTP, setIsVerifyingOTP] = useState<boolean>(false) // if an otp is given as input and being verified
  const [isVerifiedEmail, setIsVerifiedEmail] = useState<boolean>(false) // set to true 3 seconds after user verifies email otp, to change modal content
  const [OTPErrorMessage, setOTPErrorMessage] = useState<string>('')
  const [OTPSuccessMessage, setOTPSuccessMessage] = useState<string>('')

  const dispatch = useDispatch()
  const isOTPRequested = useSelector(
    (store: any) => store.users.generateVerifyEmailOTP.response.data
  )
  const isOTPVerifying = useSelector((store: any) => store.users.checkVerifyEmailOTP.fetching)
  const isOTPVerified = useSelector((store: any) => store.users.checkVerifyEmailOTP.response.data)
  const OTPVerifyingError = useSelector((store: any) => store.users.checkVerifyEmailOTP.error)

  useEffect(() => {
    if (isOTPVerified) {
      // stop counting once email is verified
      setTimerCount(0)
    } else if (!canRequestOTP) {
      // if user has requested for otp, start counting
      if (timerCount == 0) {
        setCanRequestOTP(true)
      } else {
        setTimeout(() => {
          setTimerCount(timerCount - 1)
        }, 1000)
      }
    }
  }, [timerCount])

  useEffect(() => setIsVerifyingOTP(isOTPVerifying), [isOTPVerifying])

  useEffect(() => {
    setOTPErrorMessage('') // if user types, remove error
    if (otp.length == 6) {
      setIsVerifyingOTP(true)
      dispatch(checkVerifyEmailOTPRequest(otp))
    }
  }, [otp])

  // OTP request success
  useEffect(() => {
    if (isOTPRequested) {
      setOTPSuccessMessage('OTP Sent!')
      setTimeout(() => {
        setOTPSuccessMessage('')
      }, 3000)
    }
  }, [isOTPRequested])

  // OTP verification success
  useEffect(() => {
    if (isOTPVerified) {
      setOTPSuccessMessage('Successfully verified email')

      setTimeout(() => {
        setOTPSuccessMessage('')
        setIsVerifiedEmail(true)

        // if (redirectLink) {
        //   router.push(redirectLink)
        // }
      }, 1000)

    }
  }, [isOTPVerified])

  // OTP verification error
  useEffect(() => {
    // verify OTP
    switch (OTPVerifyingError?.response?.status) {
      case 400: {
        // OTP verification failed for given email
        setOTPErrorMessage('The OTP you have entered is wrong. Please try again')
        break
      }
      case 422: {
        // invalid OTP >6 characters
        setOTPErrorMessage('The OTP you have entered is wrong. Please try again')
        break
      }
    }
  }, [OTPVerifyingError])

  const handleRequestOtp = () => {
    dispatch(generateVerifyEmailOTPRequest())
    setCanRequestOTP(false)
    setOTPErrorMessage('')
    setTimerCount(61)
  }

  const handleContinueBtn = () => {
    handleModal(isOTPVerified)
  }

  const handleCloseModal = () => {
    handleModal(isOTPVerified)
  }

  const modalContent = !isVerifiedEmail ? (
    <div className={styles.ModalVerifyEmail}>
      <Text>
        To receive job application status update, please verify your email. Request for an OTP to be
        sent to <b>{email}</b>
      </Text>
      <div className={styles.VerifyingEmailForm}>
      <div className={styles.VerifyingEmailFormInput}>
        <MaterialTextField
          id='otp'
          label='Enter 6-digit OTP'
          variant='outlined'
          value={otp}
          error={OTPErrorMessage}
          size='small'
          defaultValue={otp}
          autoComplete='off'
          disabled={isVerifyingOTP}
          onChange={(e) => setOtp(e.target.value)}
          fullWidth={true}
        />
      </div>
      <MaterialButton
        className={
          !isVerifiedEmail ? styles.VerifyingEmailFormButton : styles.VerifiedEmailFormButton
        }
        capitalize
        size='large'
        variant='contained'
        isLoading={isOTPVerifying}
        disabled={!canRequestOTP || isVerifyingOTP || isOTPVerified}
        onClick={handleRequestOtp}
      >
        <Text textColor='white' bold>
          Get OTP {timerCount > 1 ? '(' + (timerCount - 1) + ')' : ''}
        </Text>
      </MaterialButton>
      </div>
      <div className={styles.VerifyingEmailErrorMessage}>
      {OTPErrorMessage && (
          <Text textStyle='sm' textColor='red' tagName='p' className={styles.inputMessage}>
            {OTPErrorMessage}
          </Text>
        )}
        {OTPSuccessMessage && (
          <Text textStyle='sm' textColor='primaryBlue' tagName='p' className={styles.inputMessage}>
            {OTPSuccessMessage}
          </Text>
        )}
      </div>
      <Text style={{ display: 'block' }}>
        Want to get the code on another email?{' '}
        <Link to={authPathToOldProject(null, '/dashboard/profile/settings')}>
          <Text textColor='primaryBlue' underline>
            Change email
          </Text>
        </Link>
      </Text>
    </div>
  ) : (
    <div className={styles.ModalVerifyEmail}>
      <Text style={{ display: 'block' }} tagName='h3'>
        <b>Email is verified</b>
      </Text>
      <Text style={{ display: 'block', marginBottom: '32px' }}>
        <b>{email}</b> has been successfully verified. You will receive application updates via
        email.
      </Text>
      <MaterialButton
        className={styles.VerifiedEmailFormButton}
        capitalize
        size='large'
        variant='contained'
        isLoading={isOTPVerifying}
        onClick={() => {
          handleContinueBtn()
        }}
      >
        <Text textColor='white' bold>
          Continue {timerCount > 1 ? '(' + (timerCount - 1) + ')' : ''}
        </Text>
      </MaterialButton>
    </div>
  )

  return (
    <Modal
      headerTitle='Verify your email'
      showModal={isShowModal}
      handleModal={handleCloseModal}
    >
      {modalContent}
    </Modal>
  )
}

export default ModalVerifyEmail
