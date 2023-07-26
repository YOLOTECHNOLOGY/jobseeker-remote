import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'
import MaterialTextField from 'components/MaterialTextField'
// import Text from 'components/Text'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import { BlueTickIcon, TooltipIcon, AccountSettingEditIconPen } from 'images'
import ModalDialog from '../Modal/index'
import Captcha from '../captcha/index'
// import TextField from '@mui/material/TextField'

// tools
// import { handleNumericInput } from 'helpers/handleInput'
import { getSmsCountryList } from 'helpers/jobPayloadFormatter'

// ui
// import { Button } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import Image from 'next/image'
// import CloseIcon from '@mui/icons-material/Close'

// api
import { smsOTPChangePhoneNumverGenerate } from 'store/services/auth/smsOTPChangePhoneNumberGenerate'
import { verifyPhoneNumber } from 'store/services/auth/verifyPhoneNumber'
import { changePhoneNumber } from 'store/services/auth/changePhoneNumber'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// styles
import styles from './phone.module.scss'
// import { useFirstRender } from 'helpers/useFirstRender'
// import { formatTemplateString } from 'helpers/formatter'
import { find } from 'lodash-es'
import classNames from 'classnames/bind'
import { getCountryId } from 'helpers/country'

let timer = null
// 默认位数
const originTimer = 60

interface IProps {
  label: string
  phoneDefault: string
  verify: boolean
  errorText: any
  config: any
  lang: any
  userDetail: any
}

const VerifyPhoneNumber = (props: IProps) => {
  const { label, phoneDefault, verify, errorText, config, lang, userDetail } = props

  const { accountSetting } = lang
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)

  const [defaultPhone, setDefaultPhone] = useState(phoneDefault)
  const [phoneNumber, setPhoneNumber] = useState(userDetail.phone_num_without_country_code || '')
  // const firstRender = useFirstRender()
  const smsCountryList = getSmsCountryList(config)

  const [initialTime, setInitialTime] = useState(0)
  const [startTimer, setStartTimer] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [otp, setOtp] = useState('')

  const getSmsCountryCode = (userDetail, smsCountryList) => {
    const mobile_country_id = userDetail.mobile_country_id || getCountryId()
    const smsCode = smsCountryList.find((item) => item.id == mobile_country_id)?.value
    return smsCode || '+63'
  }

  const [smsCode, setSmsCode] = useState(getSmsCountryCode(userDetail, smsCountryList))

  const clear = () => {
    clearTimeout(timer)
    setStartTimer(false)
    setInitialTime(0)
    setDisabled(false)
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
    setOpen(true)
    clear()
  }

  const clearCloseModal = () => {
    clear()
    setOpen(false)
  }

  const handleSave = () => {
    if (otp.length == 6 && smsCode && phoneNumber) {
      verifyEmailOrChangeEmail({ phoneNumber, otp, smsCode })
    }
  }

  const handleClose = () => {
    clearCloseModal()
  }

  const onChange = (opt) => {
    setOtp(opt)
  }

  const handleSendOTP = () => {
    if (phoneNumber && smsCode) {
      clear()
      sendPhoneNumberOTP({ phoneNumber, smsCode })
    }
  }

  const sendPhoneNumberOTP = ({ phoneNumber, smsCode }) => {
    const mobile_country_id = find(smsCountryList, { value: smsCode })?.id
    // console.log('handle send otp', { phoneNumber, smsCode, mobile_country_id })
    smsOTPChangePhoneNumverGenerate({ phone_num: smsCode + phoneNumber, mobile_country_id })
      .then(() => {
        setStartTimer(true)
        setInitialTime(originTimer)
        setDisabled(true)
      })
      .catch((exceptionHandler) => {
        const { data } = exceptionHandler.response
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
            severity: 'warning'
          })
        )
      })
  }

  const verifyEmailOrChangeEmail = ({ phoneNumber, smsCode, otp }) => {
    const mobile_country_id = find(smsCountryList, { value: smsCode })?.id
    const phone = smsCode + phoneNumber
    // console.log('verify', { phoneNumber, smsCode, otp, phone, mobile_country_id })
    if (defaultPhone === phone) {
      // verify
      verifyPhoneNumber({ otp: otp })
        .then(({ data }) => {
          if (data.data?.message == 'success') {
            clearCloseModal()
            dispatch(
              displayNotification({
                open: true,
                message: accountSetting?.verifiedMessages?.mobile,
                severity: 'success'
              })
            )
          }
        })
        .catch((exceptionHandler) => {
          const { data } = exceptionHandler.response
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
              severity: 'warning'
            })
          )
        })
    } else {
      // change
      changePhoneNumber({
        otp: otp,
        mobile_country_id: mobile_country_id,
        phone_num: smsCode + Number(phoneNumber)
      })
        .then(({ data }) => {
          if (data.data?.message == 'success') {
            clearCloseModal()
            setDefaultPhone(smsCode + Number(phoneNumber))
            dispatch(
              displayNotification({
                open: true,
                message: accountSetting?.verifiedMessages?.mobile,
                severity: 'success'
              })
            )
          }
        })
        .catch((exceptionHandler) => {
          const { data } = exceptionHandler.response
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
              severity: 'warning'
            })
          )
        })
    }
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
        <div className={styles.tip}>{accountSetting?.mobileTip}</div>
        <div className={styles.content}>
          <div className={styles.info}>
            <span>{defaultPhone ? defaultPhone : accountSetting?.notProvided}</span>
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
        key={'verify-phone'}
        open={open}
        cancel={accountSetting?.cancel}
        confirm={accountSetting?.verify}
        handleSave={handleSave}
        handleClose={handleClose}
        title={accountSetting?.modals?.verifyMobileTitle}
        lang={lang}
      >
        <div className={styles.modalContent}>
          <div className={styles.content}>
            {/* phone input */}
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
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <button
                className={classNames([styles.sendOTP, disabled ? styles.disabled : ''])}
                onClick={handleSendOTP}
                disabled={disabled}
              >
                {accountSetting?.sendOpt} {initialTime ? `(${initialTime}s)` : ''}
              </button>
            </div>

            {/* verify code */}
            <Captcha
              key={'verify-phone-captcha'}
              lang={lang}
              autoFocus={true}
              onChange={onChange}
              error={errorText}
            />
          </div>
        </div>
      </ModalDialog>
    </>
  )
}

export default VerifyPhoneNumber
