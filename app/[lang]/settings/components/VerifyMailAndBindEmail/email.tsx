import { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'

import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'
import MaterialTextField from 'components/MaterialTextField'
import Text from 'components/Text'
import { BlueTickIcon } from 'images'
import Captcha from '../captcha/index'

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

const VerifyMailAndBindEmail = ({
  label,
  setEdit,
  edit,
  emailDefault,
  verify,
  errorText,
  COUNT_DOWN_VERIFY_DEFAULT,
  lang
}: any) => {
  const { accountSetting } = lang
  const dispatch = useDispatch()
  console.log({ emailDefault })
  let countDownVerify = COUNT_DOWN_VERIFY_DEFAULT
  const [countDown, setCountDown] = useState(COUNT_DOWN_VERIFY_DEFAULT)
  const [isShowCountDownSwitch, setIsShowCountDownSwitch] = useState(false)
  const refCountDownTimeName = useRef(null)

  const firstRender = useFirstRender()
  const [isBtnDisabled, setBtnDisabled] = useState(verify)
  const [isBtnDisabledVerify, setIsBtnDisabledVerify] = useState(true)

  const [emailError, setEmailError] = useState(null)
  const [email, setEmail] = useState(emailDefault)
  const [open, setOpen] = useState(false)

  const [isShowemailVerify, setIsShowemailVerify] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [emailTip, setEmailTip] = useState(
    verify ? accountSetting.editEmailExplanation : accountSetting.notVerifyTips
  )
  const [number, setNumber] = useState<number>(0)

  useEffect(() => {
    if (isShowCountDownSwitch) {
      const eventCallBack = () => {
        if (countDownVerify <= 1) {
          setIsShowCountDownSwitch(false)
          clearInterval(refCountDownTimeName.current)
        } else {
          countDownVerify = countDownVerify - 1
          setCountDown(countDownVerify)
        }
      }
      refCountDownTimeName.current = setInterval(eventCallBack, 1000)
      return () => clearInterval(refCountDownTimeName.current)
    } else {
      clearInterval(refCountDownTimeName.current)
      // setBtnDisabled(false)
      countDownVerify = COUNT_DOWN_VERIFY_DEFAULT
      setCountDown(COUNT_DOWN_VERIFY_DEFAULT)
    }
  }, [isShowCountDownSwitch])

  const reductionEmail = () => {
    setEmail(emailDefault ? emailDefault : null)
    setIsShowemailVerify(false)
    setOtp('')
    // setEmailTip('To receive job applications update, please verify your email.')
    setOtpError(null)
    setBtnDisabled(verify)
  }

  useEffect(() => {
    if (firstRender || isShowCountDownSwitch) {
      return
    }
    let errorText = null
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      errorText = 'Please enter a valid email address.'
    }

    if (errorText) {
      setBtnDisabled(true)
    } else {
      setBtnDisabled(false)
    }

    setEmailError(errorText)
  }, [email])

  useEffect(() => {
    if (firstRender) {
      return
    }
    if (otp.length > 6) {
      setIsBtnDisabledVerify(true)
      setOtpError(accountSetting.errorMsg.optIncorrect)
    } else {
      setIsBtnDisabledVerify(false)
      setOtpError(null)
    }
  }, [otp])

  useEffect(() => {
    if (firstRender) {
      return
    }
    setBtnDisabled(isShowCountDownSwitch)
  }, [isShowCountDownSwitch])

  const sendEmailOTPS = () => {
    setIsShowCountDownSwitch(true)
    setIsShowemailVerify(true)
    setEmail(email)
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

  const emailVerifiSuccess = () => {
    setEmailTip(
      'Your email has been verified. You will be able to receive job applications update through your email.'
    )
    setIsShowemailVerify(false)
    setOtpError(null)
    setEdit(null)
  }

  const emailVerifiError = () => {
    setOtpError(accountSetting.errorMsg.optIncorrect)
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
          emailVerifiSuccess()
        })
        .catch(() => {
          emailVerifiError()
        })
    } else {
      // change
      changeEmail({ otp, email })
        .then(() => {
          dispatch(
            displayNotification({
              open: true,
              message: 'Your email account has been verified successfully',
              severity: 'success'
            })
          )
          emailVerifiSuccess()
        })
        .catch(() => {
          emailVerifiError()
        })
    }
  }

  const requiredLabel = (text: string) => {
    return (
      <>
        <span>{text}&nbsp;</span>
        <span className={styles.stepFieldRequired}>* &nbsp; &nbsp;</span>
      </>
    )
  }

  const handleOpen = () => {
    console.log('handle open!!!')
    setOpen(true)
  }

  const handleSave = () => {
    console.log('save')
    // setOpen(false)
  }

  const handleClose = () => {
    console.log('close')
    setOpen(false)
  }

  const sendOpt = () => {
    console.log('send opt')
  }

  const onChange = (opt) => {
    console.log('on change opt', opt)
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

      <ModalDialog
        key={'verify-email'}
        open={open}
        cancel='Cancel'
        confirm='Verify'
        handleSave={handleSave}
        handleClose={handleClose}
        lang={lang}
      >
        <div className={styles.modalContent}>
          <div className={styles.title}>
            <span>Change email address verify</span>
            <CloseIcon onClick={handleClose} sx={{ color: '#BCBCBC', cursor: 'pointer' }} />
          </div>
          <div className={styles.content}>
            <div className={styles.emailInput}>
              <MaterialTextField
                className={styles.fullWidth}
                label={'email'}
                size='medium'
                type='text'
                name='email'
                onChange={(e) => setEmail(e.target.value)}
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
              <button className={styles.sendOTP}>Send OTP</button>
            </div>
            <div className={styles.displayForWeb}>{emailError && errorText(emailError)}</div>
            <Captcha
              lang={lang}
              autoFocus={true}
              onChange={onChange}
              sendOpt={sendOpt}
              error={errorText}
              number={number}
            />
          </div>
        </div>
      </ModalDialog>
    </>
  )
}

export default VerifyMailAndBindEmail
