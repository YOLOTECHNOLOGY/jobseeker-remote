import { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch } from 'react-redux'

import MaterialTextField from 'components/MaterialTextField'
import { BlueTickIcon } from 'images'
import Captcha from '../CaptchaCode'
import { validEmailReg } from '../../config'

// ui
import Tooltip from '@mui/material/Tooltip'
import ModalDialog from '../Modal/index'
import InputAdornment from '@mui/material/InputAdornment'

// api
import { changeEmail } from 'store/services/auth/changeEmail'
import { verifyEmail } from 'store/services/auth/verifyEmail'
import { emailOTPChangeEmailGenerate } from 'store/services/auth/emailOTPChangeEmailGenerate'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// styles
import styles from './email.module.scss'
import Image from 'next/image'
import { TooltipIcon, AccountSettingEditIconPen } from 'images'
import classNames from 'classnames/bind'
import { useRouter } from 'next/navigation'
import { formatTemplateString } from 'helpers/formatter'

let timer = null
// 默认位数
const originTimer = 60

interface IProps {
  userDetail: any
  label: string
  lang: any
}

const VerifyMailAndBindEmail = (props: IProps) => {
  const { label, userDetail, lang={} } = props
  const accountSetting = lang.accountSetting || {}
  const errorCode = lang.errorcode || {}

  const alertJobsModal = lang?.search?.alertJobsModal || {}
  const dispatch = useDispatch()
  const emailDefault = userDetail?.email ? userDetail.email : null
  const router = useRouter()
  const captchaRef = useRef(null)
  
  const [loading, startTransition] = useTransition()
  
  const [verify, setVerify] = useState(!!userDetail.is_email_verify)

  const [emailError, setEmailError] = useState(null)
  const [email, setEmail] = useState(emailDefault)
  const [defaultEmail, setDefaultEmail] = useState(emailDefault)

  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const [initialTime, setInitialTime] = useState(0)
  const [startTimer, setStartTimer] = useState(false)

  const [otp, setOtp] = useState('')
  const [isLoadingButton, setIsLoadingButton] = useState(false)

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
    if(loading) {
      setVerify(!!userDetail?.is_email_verify)
    }
  }, [loading, userDetail])

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
    setEmail(userDetail?.email ? userDetail.email : null)
  }

  const clearCloseModal = () => {
    clear()
    setOpen(false)
  }

  const handleSave = () => {
    const emailError = validEmail(email)
    if (!emailError && otp?.length == 6) {
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
    const emailError = validEmail(email)
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
      errorMessage = data?.errors?.email[0]
    }

    const code = data?.code
    let transErr = errorCode[code]
    if (code === 40006) {
      transErr = formatTemplateString(transErr, {
        retry_after: error?.response?.data?.errors?.retry_after
      })
    }

    dispatch(
      displayNotification({
        open: true,
        message: transErr || errorMessage || data.message,
        severity: 'error'
      })
    )
  }

  const sendEmailOTP = (email) => {
    emailOTPChangeEmailGenerate({ email })
      .then(() => {
        captchaRef.current && captchaRef.current?.focus()
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
    setIsLoadingButton(true)
    if (emailDefault === email) {
      // verify
      verifyEmail({ otp: Number(otp) || 0 })
        .then(() => {
          clearCloseModal()
          setDefaultEmail(email)
          startTransition(() => {
            router.refresh()
          })
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
        .finally(() => setIsLoadingButton(false))
    } else {
      // change
      changeEmail({ otp: Number(otp) || 0, email })
        .then(() => {
          clearCloseModal()
          setDefaultEmail(email)
          startTransition(() => {
            router.refresh()
          })
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
        .finally(() => setIsLoadingButton(false))
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
        isLoading={isLoadingButton}
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
              ref={captchaRef}
            />
          </div>
        </div>
      </ModalDialog>
    </>
  )
}

export default VerifyMailAndBindEmail
