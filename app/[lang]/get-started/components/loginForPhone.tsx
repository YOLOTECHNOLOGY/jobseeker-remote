import React, { useState, useEffect, useRef } from 'react'
import styles from '../index.module.scss'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import { useSelector } from 'react-redux'
import { getSmsCountryList } from 'helpers/jobPayloadFormatter'
import { getCountryKey } from 'helpers/country'
import Link from 'next/link'
import AppleLogin from './link/apple'
import FacebookLogin from './link/facebook'
import GoogleLogin from './link/google'
import EmailLogin from './link/email'
import Divider from '@mui/material/Divider'
import classNames from 'classnames'
import { getLang } from 'helpers/country'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import PhoneComponent from './phoneComponent'
import { phoneOtpenerate } from 'store/services/auth/newLogin'
import { formatTemplateString } from 'helpers/formatter'
import { CircularProgress } from 'app/components/MUIs'
import { countryForPhoneCode } from 'helpers/country'
import Turnstile, { useTurnstile } from "react-turnstile"
import { cfKey } from 'helpers/cookies'
import { useSearchParams } from 'next/navigation'

const LoginForPhone = (props: any) => {
  const turnstile = useTurnstile()
  const [countryValue, setCountry] = useState<string>('')
  const [isDisable, setDisable] = useState<boolean>(true)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [phoneError, setPhoneError] = useState<string>('')
  const [cfToken, setCfToken] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const {
    lang: { newGetStarted, errorcode },
    isModal = false,
    handleEmailClick,
    setLoginData
  } = props

  const config = useSelector((store: any) => store.config.config.response ?? [])
  const countryList = getSmsCountryList(config)
  const country = getCountryKey()
  const countryCode = countryForPhoneCode[country]
  const langKey = getLang()
  const router = useRouter()
  const dispatch = useDispatch()
  const phoneNumberRef = useRef(null)
  const searchParams = useSearchParams()

  const isDisableRef = useRef(null)
  const cfTokenRef = useRef(null)
  const referralCode = searchParams.get('referral_code')
  const invitedSource = searchParams.get('invited_source')

  useEffect(() => {
    isDisableRef.current = isDisable
  }, [isDisable])

  useEffect(() => {
    if (phoneNumber) {
      phoneNumberRef.current = phoneNumber
    }
  }, [phoneNumber])
  useEffect(() => {
    if (cfToken) {
      cfTokenRef.current = cfToken
    }
  }, [cfToken])

  useEffect(() => {
    window.addEventListener('keydown', handleOnKeyDownEnter)
    return () => window.removeEventListener('keydown', handleOnKeyDownEnter)
  }, [])

  const handleOnKeyDownEnter = (e) => {
    if (e.key === 'Enter' && e.keyCode === 13 && !isDisableRef.current) {
      sendOpt()
    }
  }

  useEffect(() => {
    if (countryCode) {
      setCountry(countryCode)
    }
  }, [countryCode])

  useEffect(() => {
    if (phoneNumber?.length > 6) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }, [phoneNumber])

  const sendOpt = () => {
    if (!cfTokenRef.current) {
      return
      // dispatch(
      //   displayNotification({
      //     open: true,
      //     message: "Please try again later.",
      //     severity: 'error'
      //   })
      // )
      // return 
    }
    const phoneNum = countryValue + phoneNumberRef.current
    setLoading(true)
    phoneOtpenerate({ phone_num: phoneNum, cf_token: cfTokenRef.current })
      .then((res) => {
        const {
          user_id,
          avatar,
          first_name,
          browser_serial_number,
          email,
          is_multiple_phones_num
        } = res?.data?.data ?? {}
        if (isModal) {
          setLoginData({ ...res?.data?.data, phoneNum } ?? {})
        } else {
          let originalSearch = window.location.search;
          if (originalSearch) {
            originalSearch = `&${originalSearch.slice(1)}`
          }

          let url = `/${langKey}/get-started/phone?step=2&phone=${phoneNum}&referral_code=${referralCode}&invited_source=${invitedSource}${originalSearch}`
          if (user_id) {
            url = `/${langKey}/get-started/phone?step=2&phone=${phoneNum}&email=${email}&userId=${user_id}&avatar=${avatar}&name=${first_name}&browserId=${browser_serial_number}&isMultiplePhonesNum=${is_multiple_phones_num}&referral_code=${referralCode}&invited_source=${invitedSource}${originalSearch}`
          }
          router.push(url)
        }
      })
      .catch((error) => {
        const code = error?.response?.data.code
        let transErr = errorcode[code]
        if (code === 40006) {
          transErr = formatTemplateString(transErr, {
            retry_after: error?.response?.data?.errors?.retry_after
          })
        }
        dispatch(
          displayNotification({
            open: true,
            message: transErr ?? newGetStarted.optError,
            severity: 'error'
          })
        )
      })
      .finally(() => setLoading(false))
  }

  const agreementWord = formatTemplateString(newGetStarted.agreement, {
    value1: `<a
      target='_blank'
      href='https://blog.bossjob.ph/terms-and-conditions/' rel="noreferrer"
    >
        ${newGetStarted.termsOfUse}
    </a>`,
    value2: `<a
      target='_blank'
      href='https://blog.bossjob.ph/terms-and-conditions/' rel="noreferrer"
    >
      ${newGetStarted.privacyPolicy}
    </a>`
  })

  return (
    <>
      <h2 style={{ padding: '10px 0 14px 0' }}>
        {newGetStarted.title} <span>Bossjob</span>
      </h2>
      <div className={styles.phoneNumber}>
        <div className={styles.item}>
          <MaterialBasicSelect
            className={styles.fullwidth}
            label={newGetStarted.country}
            options={countryList}
            value={countryValue}
            variant='standard'
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div className={styles.item}>
          <PhoneComponent
            lang={props.lang}
            phoneError={phoneError}
            setPhoneNumber={setPhoneNumber}
            setDisable={setDisable}
          />
        </div>
        {
          !cfToken && <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: 60 }}>
            <CircularProgress color={'primary'} size={30}
              style={{ position: 'absolute' }}
            />
            <Turnstile
              sitekey={process.env.ENV === 'production' ? '0x4AAAAAAAJCMK-FSFuXe0TG' : '0x4AAAAAAAJDRnSb5DfsUd2S'}
              theme='light'
              appearance='always'
              // appearance='interaction-only' // invisible managed challenge
              onVerify={(token) => {
                setTimeout(() => {
                  setCfToken(token)
                  sessionStorage.setItem(cfKey, token)
                }, 1000)
              }}
              onError={() => {
                turnstile?.reset()
              }}
              style={{ position: 'relative', zIndex: 2 }}
            />
          </div>

        }
        {Boolean(cfToken) && <button className={styles.btn} disabled={isDisable} onClick={sendOpt}>
          {loading ? <CircularProgress color={'primary'} size={16} /> : newGetStarted.sendCode}
        </button>}

        <p
          className={styles.msg}
          style={{ paddingBottom: '0px' }}
          dangerouslySetInnerHTML={{ __html: agreementWord }}
        ></p>
      </div>
      <div className={`${styles.list} ${styles.list2}`} style={{ paddingTop: '0px' }}>
        <GoogleLogin lang={props.lang} showTitle={false} />
        <FacebookLogin lang={props.lang} showTitle={false} />
        <AppleLogin lang={props.lang} showTitle={false} />
      </div>
      <div>
        <div className={classNames([styles.divider, styles.divider_none])}>
          <Divider>{newGetStarted.continueWith}</Divider>
        </div>
      </div>
      <div className={styles.list}>
        <EmailLogin lang={props.lang} isModal={isModal} handleClick={handleEmailClick} />
      </div>
    </>
  )
}
export default LoginForPhone
