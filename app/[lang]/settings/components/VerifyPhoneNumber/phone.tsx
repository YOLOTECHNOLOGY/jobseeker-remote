import { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch } from 'react-redux'

import MaterialTextField from 'components/MaterialTextField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import { BlueTickIcon, TooltipIcon, AccountSettingEditIconPen } from 'images'
import ModalDialog from '../Modal/index'
import Captcha from '../CaptchaCode'
import { getCookie } from 'helpers/cookies'

// tools
import { getSmsCountryList } from 'helpers/jobPayloadFormatter'

// ui
import Tooltip from '@mui/material/Tooltip'
import Image from 'next/image'

// api
import { smsOTPChangePhoneNumverGenerate } from 'store/services/auth/smsOTPChangePhoneNumberGenerate'
import { verifyPhoneNumber } from 'store/services/auth/verifyPhoneNumber'
import { changePhoneNumber } from 'store/services/auth/changePhoneNumber'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// styles
import styles from './phone.module.scss'
import { find } from 'lodash-es'
import classNames from 'classnames/bind'
import { getCountryId } from 'helpers/country'
import { useRouter } from 'next/navigation'


let timer = null
// 默认位数
const originTimer = 60

interface IProps {
  label: string
  config: any
  lang: any
  userDetail: any
}

const VerifyPhoneNumber = (props: IProps) => {
  const { label, config, lang, userDetail } = props

  const { accountSetting } = lang
  const dispatch = useDispatch()
  // const accessToken = getCookie('accessToken')
  const router = useRouter()
  const captchaRef = useRef(null)
  const phoneDefault = userDetail.phone_num ? userDetail.phone_num : null

  const [open, setOpen] = useState(false)

  const [verify, setVerify] = useState(!!userDetail.is_mobile_verified)
  const [defaultPhone, setDefaultPhone] = useState(phoneDefault)
  const [phoneNumber, setPhoneNumber] = useState('')
  const smsCountryList = getSmsCountryList(config)

  const [initialTime, setInitialTime] = useState(0)
  const [startTimer, setStartTimer] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [otp, setOtp] = useState('')
  const [numberError, setNumberError] = useState('')

  const [isLoadingButton, setIsLoadingButton] = useState(false)

  const getSmsCountryCode = (userDetail, smsCountryList) => {
    const mobile_country_id = userDetail.mobile_country_id || getCountryId()
    const smsCode = smsCountryList.find((item) => item.id == mobile_country_id)?.value
    return smsCode || '+63'
  }

  const [smsCode, setSmsCode] = useState(getSmsCountryCode(userDetail, smsCountryList))

  const [loading, startTransition] = useTransition()

  const clear = () => {
    clearTimeout(timer)
    setStartTimer(false)
    setInitialTime(0)
    setDisabled(false)
    setNumberError('')
  }

  useEffect(() => {
    if(loading) {
      setVerify(!!userDetail?.is_mobile_verified)
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

  const handleOpen = () => {
    setOpen(true)
    clear()
    setSmsCode(getSmsCountryCode(userDetail, smsCountryList))
    setPhoneNumber(userDetail?.phone_num_without_country_code || '')
  }

  const clearCloseModal = () => {
    clear()
    setOpen(false)
  }

  const handleSave = () => {
    if (otp?.length == 6 && smsCode && phoneNumber?.length > 6) {
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
    if (phoneNumber && smsCode && phoneNumber?.length > 6) {
      clear()
      sendPhoneNumberOTP({ phoneNumber, smsCode })
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

  const sendPhoneNumberOTP = ({ phoneNumber, smsCode }) => {
    const mobile_country_id = find(smsCountryList, { value: smsCode })?.id
    smsOTPChangePhoneNumverGenerate({ phone_num: smsCode + phoneNumber, mobile_country_id })
      .then(() => {
        captchaRef.current && captchaRef.current.focus()
        setStartTimer(true)
        setInitialTime(originTimer)
        setDisabled(true)
      })
      .catch((error) => {
        handleError(error)
      })
  }

  const verifyEmailOrChangeEmail = ({ phoneNumber, smsCode, otp }) => {
    const mobile_country_id = find(smsCountryList, { value: smsCode })?.id
    const phone = smsCode + phoneNumber
    setIsLoadingButton(true)
    // console.log('verify', { phoneNumber, smsCode, otp, phone, mobile_country_id })
    if (defaultPhone === phone) {
      // verify
      verifyPhoneNumber({ otp: otp })
        .then(({ data }) => {
          if (data?.data?.message == 'success') {
            clearCloseModal()

            startTransition(() => {
              router.refresh()
            })
            
            dispatch(
              displayNotification({
                open: true,
                message: accountSetting?.verifiedMessages?.mobile,
                severity: 'success'
              })
            )
          }
        })
        .catch((error) => {
          handleError(error)
        })
        .finally(() => setIsLoadingButton(false))
    } else {
      // change
      changePhoneNumber({
        otp: otp,
        mobile_country_id: mobile_country_id,
        phone_num: smsCode + Number(phoneNumber)
      })
        .then(({ data }) => {
          if (data?.data?.message == 'success') {
            clearCloseModal()
            setDefaultPhone(smsCode + Number(phoneNumber))

            startTransition(() => {
              router.refresh()
            })
         
            dispatch(
              displayNotification({
                open: true,
                message: accountSetting?.verifiedMessages?.mobile,
                severity: 'success'
              })
            )
          }
        })
        .catch((error) => {
          handleError(error)
        })
        .finally(() => setIsLoadingButton(false))
    }
  }

  const handlePhoneNumber = (ev) => {
    const value = ev.target.value || ''
    if(!value) {
      setNumberError(accountSetting?.verifiedMessages?.phoneEmpty)
    }else if(value.length < 7) {
      setNumberError(accountSetting?.verifiedMessages?.phoneError)
    } else {
      setNumberError('')
    }
    setPhoneNumber(value)
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
        isLoading={isLoadingButton}
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
                onChange={handlePhoneNumber}
                helperText={<span style={{color: 'red'}}>{numberError}</span>}
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
              ref={captchaRef}
            />
          </div>
        </div>
      </ModalDialog>
    </>
  )
}

export default VerifyPhoneNumber
