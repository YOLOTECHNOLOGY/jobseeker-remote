import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'
import MaterialTextField from 'components/MaterialTextField'
// import Text from 'components/Text'
import { BlueTickIcon } from 'images'
import Captcha from '../captcha/index'
import { validEmailReg } from '../../config'
// tools
// import { handleNumericInput } from 'helpers/handleInput'

// ui
// import { Button } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import ModalDialog from '../Modal/index'
import InputAdornment from '@mui/material/InputAdornment'
// import CloseIcon from '@mui/icons-material/Close'

// api
import { changeEmail } from 'store/services/auth/changeEmail'
import { verifyEmail } from 'store/services/auth/verifyEmail'
import { emailOTPChangeEmailGenerate } from 'store/services/auth/emailOTPChangeEmailGenerate'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// styles
import styles from './email.module.scss'
// import { useFirstRender } from 'helpers/useFirstRender'
// import { formatTemplateString } from 'helpers/formatter'
import Image from 'next/image'
import { TooltipIcon, AccountSettingEditIconPen } from 'images'
import classNames from 'classnames/bind'

let timer = null
// 默认位数
const originTimer = 60

interface IProps {
  label: string
  emailDefault: string
  verify: boolean
  // errorText: React.ReactNode
  lang: any
}

const VerifyMailAndBindEmail = (props: IProps) => {
  const { label, emailDefault, verify, lang } = props
  const { accountSetting } = lang
  const alertJobsModal = lang?.search?.alertJobsModal || {}
  const dispatch = useDispatch()

  // const firstRender = useFirstRender()

  const [emailError, setEmailError] = useState(null)
  const [email, setEmail] = useState(emailDefault)
  const [defaultEmail, setDefaultEmail] = useState(emailDefault)
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)

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

  const clear = () => {
    clearTimeout(timer)
    setStartTimer(false)
    setInitialTime(0)
    setDisabled(false)
    setEmailError('')
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
    if (!emailError && otp.length == 6) {
      verifyEmailOrChangeEmail({ otp, email, emailDefault })
    }
  }

  const handleClose = () => {
    clearCloseModal()
  }

  const onChange = (otp) => {
    setOtp(otp)
  }

  const handleSendOTP = () => {
    if (!emailError) {
      clear()
      sendEmailOTP(email)
    }
  }

  const handleError = (error) => {
    const { data } = error.response
    let errorMessage
    if (data?.data) {
      errorMessage = data?.data?.detail ?? data?.message
    } else {
      errorMessage = data?.errors?.phone_num[0]
    }
    dispatch(
      displayNotification({
        open: true,
        message: errorMessage || data.message,
        severity: 'error'
      })
    )
  }

  const sendEmailOTP = (email) => {
    emailOTPChangeEmailGenerate({ email })
      .then(() => {
        setStartTimer(true)
        setInitialTime(originTimer)
        setDisabled(true)
      })
      .catch((error) => {
        setDisabled(false)
        handleError(error)
      })
  }

  const verifyEmailOrChangeEmail = ({ otp, email, emailDefault }) => {
    if (emailDefault === email) {
      // verify
      verifyEmail({ otp: Number(otp) || 0 })
        .then(() => {
          clearCloseModal()
          setDefaultEmail(email)
          dispatch(
            displayNotification({
              open: true,
              message: accountSetting?.verifiedMessages?.email,
              severity: 'success'
            })
          )
        })
        .catch((error) => {
          handleError(error)
        })
    } else {
      // change
      changeEmail({ otp: Number(otp) || 0, email })
        .then(() => {
          clearCloseModal()
          setDefaultEmail(email)
          dispatch(
            displayNotification({
              open: true,
              message: accountSetting?.verifiedMessages?.email,
              severity: 'success'
            })
          )
        })
        .catch((error) => {
          handleError(error)
        })
    }
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
        <div className={styles.tip}>{accountSetting?.emailTip}</div>
        <div className={styles.content}>
          <div className={styles.info}>
            <span>{defaultEmail ? defaultEmail : accountSetting?.notProvided}</span>
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
        cancel={accountSetting?.cancel}
        confirm={accountSetting?.verify}
        handleSave={handleSave}
        handleClose={handleClose}
        title={accountSetting?.modals?.verifyEmailTitle}
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
              <div className={classNames([styles.displayForMobile, styles.errorInfo])}>
                {emailError ? emailError : null}
              </div>
              <button
                className={classNames([styles.sendOTP, disabled ? styles.disabled : ''])}
                onClick={handleSendOTP}
                disabled={disabled}
              >
                {accountSetting?.sendOpt} {initialTime ? `(${initialTime}s)` : ''}
              </button>
            </div>
            <div className={classNames([styles.displayForWeb, styles.errorInfo])}>
              {emailError ? emailError : null}
            </div>

            {/* verify code */}
            <Captcha
              key={'verify-email-captcha'}
              lang={lang}
              autoFocus={true}
              onChange={onChange}
            />
          </div>
        </div>
      </ModalDialog>
    </>
  )
}

export default VerifyMailAndBindEmail
