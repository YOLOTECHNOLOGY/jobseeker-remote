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

let timer = null
// 默认位数
const originTimer = 10

const VIf = (props) => (props.show ? props.children : null)

const VerifyMailAndBindEmail = ({ label, emailDefault, verify, errorText, lang }: any) => {
  const { accountSetting } = lang
  const dispatch = useDispatch()
  console.log({ emailDefault })

  const firstRender = useFirstRender()

  const [emailError, setEmailError] = useState(null)
  const [email, setEmail] = useState(emailDefault)
  const [open, setOpen] = useState(false)

  const [initialTime, setInitialTime] = useState(0)
  const [startTimer, setStartTimer] = useState(false)
  const [showCountDown, setShowCountDown] = useState(false)

  const [otp, setOtp] = useState('')

  const [number, setNumber] = useState<number>(0)

  const { newGetStarted } = lang

  const clear = () => {
    clearTimeout(timer)
    setStartTimer(false)
    setInitialTime(0)
  }

  useEffect(() => {
    if (initialTime > 0) {
      timer = setTimeout(() => {
        console.log('startTime, ', initialTime)
        setInitialTime(initialTime - 1)
      }, 1000)
    }

    if (initialTime === 0 && startTimer) {
      console.log('done')
      clear()
    }
  }, [initialTime, startTimer])

  const handleOpen = () => {
    console.log('handle open!!!')
    setOpen(true)
    clear()
  }

  const handleSave = () => {
    console.log('save')
    // setOpen(false)
    clear()
    setShowCountDown(false)
  }

  const handleClose = () => {
    console.log('close')
    setOpen(false)
    clear()
    setShowCountDown(false)
  }

  const onChange = (opt) => {
    console.log('on change opt', opt)
  }

  const handleSendOTP = () => {
    console.log('handle send otp')
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
              <button
                className={styles.sendOTP}
                onClick={() => {
                  setShowCountDown(true)
                  handleSendOTP()
                }}
              >
                Send OTP
              </button>
            </div>
            <div className={styles.displayForWeb}>{emailError && errorText(emailError)}</div>
            <Captcha
              lang={lang}
              autoFocus={true}
              onChange={onChange}
              error={errorText}
              number={number}
            />
            <VIf show={showCountDown}>
              <p className={styles.countdown}>
                {initialTime <= 0 ? (
                  <span className={styles.resendCode} onClick={handleSendOTP}>
                    {newGetStarted.resendCode}
                  </span>
                ) : (
                  initialTime + 's'
                )}
              </p>
            </VIf>
          </div>
        </div>
      </ModalDialog>
    </>
  )
}

export default VerifyMailAndBindEmail
