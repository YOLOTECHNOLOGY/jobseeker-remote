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
import Countdown from '../captcha/countDown'

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

  const firstRender = useFirstRender()

  const [emailError, setEmailError] = useState(null)
  const [email, setEmail] = useState(emailDefault)
  const [open, setOpen] = useState(false)

  const [otp, setOtp] = useState('')

  const [number, setNumber] = useState<number>(0)

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

  const handleSendOTP = () => {
    console.log('handle send otp')
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
              <button className={styles.sendOTP} onClick={handleSendOTP}>
                Send OTP
              </button>
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
            <Countdown sendOpt={sendOpt} lang={lang} />
          </div>
        </div>
      </ModalDialog>
    </>
  )
}

export default VerifyMailAndBindEmail
