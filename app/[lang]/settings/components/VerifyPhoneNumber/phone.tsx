import { useEffect, useState, useRef, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'
import MaterialTextField from 'components/MaterialTextField'
import Text from 'components/Text'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import { BlueTickIcon, TooltipIcon, AccountSettingEditIconPen } from 'images'
import ModalDialog from '../Modal/index'
import Captcha from '../captcha/index'
import TextField from '@mui/material/TextField'

// tools
import { handleNumericInput } from 'helpers/handleInput'
import { getSmsCountryList } from 'helpers/jobPayloadFormatter'

// ui
import { Button } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import Image from 'next/image'
import CloseIcon from '@mui/icons-material/Close'

// api
import { smsOTPChangePhoneNumverGenerate } from 'store/services/auth/smsOTPChangePhoneNumberGenerate'
import { verifyPhoneNumber } from 'store/services/auth/verifyPhoneNumber'
import { changePhoneNumber } from 'store/services/auth/changePhoneNumber'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// styles
import styles from './phone.module.scss'
import { useFirstRender } from 'helpers/useFirstRender'
import { formatTemplateString } from 'helpers/formatter'
import { find } from 'lodash-es'
import Countdown from '../captcha/countDown'

const VerifyPhoneNumber = ({
  label,
  setEdit,
  edit,
  phoneDefault,
  verify,
  errorText,
  config,
  COUNT_DOWN_VERIFY_DEFAULT,
  lang
}: any) => {
  const { accountSetting, newGetStarted } = lang
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)
  const [number, setNumber] = useState<number>(0)

  const [defaultPhone, setDefaultPhone] = useState(phoneDefault)
  const firstRender = useFirstRender()

  const smsCountryList = getSmsCountryList(config)

  const getSmsCountryCode = (phoneNumber, smsCountryList) => {
    if (!phoneNumber || !smsCountryList) return null

    const matchedCountryCode = smsCountryList.filter((country) => {
      return phoneNumber.includes(country.value)
    })

    return matchedCountryCode ? matchedCountryCode[0]?.value : null
  }

  const [smsCode, setSmsCode] = useState(getSmsCountryCode(phoneDefault, smsCountryList))

  if (!smsCode) {
    setSmsCode('+63')
  } else if (phoneDefault) {
    phoneDefault = phoneDefault.substring(smsCode.length, phoneDefault.length)
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
            title={accountSetting.mobileTip}
            placement='top'
            arrow
            classes={{ tooltip: styles.toolTip }}
          >
            <Image className={styles.image} src={TooltipIcon} alt='icon' width={20} height={20} />
          </Tooltip>
        </div>
        <div className={styles.tip}>
          Help recruiters to better contact you for job opportunities.
        </div>
        <div className={styles.content}>
          <div className={styles.info}>
            <span>{defaultPhone ? defaultPhone : 'Not provided'}</span>
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
        key={'verify-phone'}
        open={open}
        cancel='Cancel'
        confirm='Verify'
        handleSave={handleSave}
        handleClose={handleClose}
        lang={lang}
      >
        <div className={styles.modalContent}>
          <div className={styles.title}>
            <span>Verify your mobile number</span>
            <CloseIcon onClick={handleClose} sx={{ color: '#BCBCBC', cursor: 'pointer' }} />
          </div>
          <div className={styles.content}>
            <div className={styles.phoneInput}>
              <MaterialBasicSelect
                className={styles.smsCountry}
                options={smsCountryList}
                value={smsCode}
                variant='standard'
                onChange={(e) => setSmsCode(e.target.value)}
              />
              <MaterialTextField
                type='number'
                label='Phone Number'
                className={styles.smsInput}
                variant='standard'
              />
              <button className={styles.sendOTP} onClick={sendOpt}>
                Send OTP
              </button>
            </div>

            {/* <div>{emailError && errorText(emailError)}</div> */}
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

export default VerifyPhoneNumber
