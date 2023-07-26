import { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'

import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'
import MaterialTextField from 'components/MaterialTextField'
import Text from 'components/Text'
import { BlueTickIcon } from 'images'
import Captcha from '../captcha/index'
import { validEmailReg } from '../../config'
// tools
import { handleNumericInput } from 'helpers/handleInput'

// ui
import { Button } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import ModalDialog from '../Modal/index'
import InputAdornment from '@mui/material/InputAdornment'
import CloseIcon from '@mui/icons-material/Close'

// api
import { changeEmail } from 'store/services/auth/changeEmail'
import { verifyEmail } from 'store/services/auth/verifyEmail'
import { emailOTPChangeEmailGenerate } from 'store/services/auth/emailOTPChangeEmailGenerate'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// styles
import styles from './email.module.scss'
import { useFirstRender } from 'helpers/useFirstRender'
import { formatTemplateString } from 'helpers/formatter'
import Image from 'next/image'
import { TooltipIcon, AccountSettingEditIconPen } from 'images'

let timer = null
// 默认位数
const originTimer = 10

const VerifyMailAndBindEmail = ({ label, emailDefault, verify, errorText, lang }: any) => {
  const { accountSetting } = lang
  const alertJobsModal = lang?.search?.alertJobsModal || {}
  const dispatch = useDispatch()

  const firstRender = useFirstRender()

  const [emailError, setEmailError] = useState(null)
  const [email, setEmail] = useState(emailDefault)
  const [open, setOpen] = useState(false)

  const [initialTime, setInitialTime] = useState(0)
  const [startTimer, setStartTimer] = useState(false)

  const [otp, setOtp] = useState('')

  const validEmail = (value: string) => {
    let errorMessage = !validEmailReg.test(value) ? alertJobsModal?.emailValid : ''
    if (value == '') {
      errorMessage = alertJobsModal?.emailEmpty
    }
    return errorMessage
  }

  const sendEmailOTPS = () => {
    emailOTPChangeEmailGenerate({ email })
      .then()
      .catch((exceptionHandler) => {
        const { data } = exceptionHandler.response
        let errorMessage
        if (data?.data) {
          errorMessage = data?.data?.detail
        } else {
          errorMessage = data?.errors?.email[0]
        }
        dispatch(
          displayNotification({
            open: true,
            message: exceptionHandler.message ?? errorMessage,
            severity: 'warning'
          })
        )
      })
  }

  const verifyEmailOrChangeEmail = () => {
    if (emailDefault === email) {
      // verify
      verifyEmail({ otp })
        .then(() => {
          dispatch(
            displayNotification({
              open: true,
              message: 'Your email account has been verified successfully',
              severity: 'success'
            })
          )
          console.log('verify success')
        })
        .catch((err) => {
          console.log('err', err)
        })
    } else {
      // change
      changeEmail({ otp, email })
        .then(() => {
          console.log('change success')
          dispatch(
            displayNotification({
              open: true,
              message: 'Your email account has been verified successfully',
              severity: 'success'
            })
          )
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
  }

  const clear = () => {
    clearTimeout(timer)
    setStartTimer(false)
    setInitialTime(0)
  }

  useEffect(() => {
    if (initialTime > 0) {
      timer = setTimeout(() => {
        setInitialTime(initialTime - 1)
      }, 1000)
    }

    if (initialTime === 0 && startTimer) {
      clear()
    }
  }, [initialTime, startTimer])

  const handleKeyUp = (ev) => {
    const value = ev?.target?.value || ''
    setEmailError(validEmail(value))
  }

  const handleOpen = () => {
    setOpen(true)
    clear()
  }

  const clearCloseModal = () => {
    clear()
    setOpen(false)
  }

  const handleSave = () => {
    console.log('save', { otp, email })
    // clearCloseModal()
  }

  const handleClose = () => {
    console.log('close')
    clearCloseModal()
  }

  const onChange = (otp) => {
    setOtp(otp)
  }

  const handleSendOTP = () => {
    console.log('handle send otp', email)
    clear()
    setTimeout(() => {
      setInitialTime(originTimer)
    }, 20)
  }

  return (
    <>
      <div className={styles.main}>
        <div className={styles.title}>
          <span>{label}</span>
          <Tooltip
            title={accountSetting.emailTip}
            placement='top'
            arrow
            classes={{ tooltip: styles.toolTip }}
          >
            <Image className={styles.image} src={TooltipIcon} alt='icon' width={20} height={20} />
          </Tooltip>
        </div>
        <div className={styles.tip}>Receive job applications updates through your email.</div>
        <div className={styles.content}>
          <div className={styles.info}>
            <span>{email ? email : 'Not provided'}</span>
            {verify && (
              <Tooltip title='Verified' placement='top' arrow classes={{ tooltip: styles.toolTip }}>
                <Image
                  className={styles.image}
                  src={BlueTickIcon}
                  alt='icon'
                  width={20}
                  height={20}
                />
              </Tooltip>
            )}
          </div>
          <div className={styles.action} onClick={handleOpen}>
            <Image src={AccountSettingEditIconPen} width={14} height={16} alt='edit'></Image>
          </div>
        </div>
      </div>

      {/* modal */}
      <ModalDialog
        key={'verify-email'}
        open={open}
        cancel='Cancel'
        confirm='Verify'
        handleSave={handleSave}
        handleClose={handleClose}
        title='Change email address verify'
        lang={lang}
      >
        <div className={styles.modalContent}>
          <div className={styles.content}>
            {/* email input */}
            <div className={styles.emailInput}>
              <MaterialTextField
                className={styles.fullWidth}
                label={'email'}
                size='medium'
                type='text'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyUp={handleKeyUp}
                error={emailError ? true : false}
                autoComplete='true'
                variant='standard'
                autoFocus={true}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='icon-email' style={{ fontSize: '18px' }}></i>
                    </InputAdornment>
                  )
                }}
              />
              <div className={styles.displayForMobile}>{emailError && errorText(emailError)}</div>
              <button className={styles.sendOTP} onClick={handleSendOTP}>
                Send OTP {initialTime ? `(${initialTime}s)` : ''}
              </button>
            </div>
            <div className={styles.displayForWeb}>{emailError && errorText(emailError)}</div>

            {/* verify code */}
            <Captcha lang={lang} autoFocus={true} onChange={onChange} error={errorText} />
          </div>
        </div>
      </ModalDialog>
    </>
  )
}

export default VerifyMailAndBindEmail
