import React, { useEffect, useState } from 'react'
import styles from '../index.module.scss'
import Captcha from './captcha/index'
import { useSearchParams } from 'next/navigation'
import { getLang } from 'helpers/country'
import useGetStarted from '../hooks/useGetStarted'
import { useSelector, useDispatch } from 'react-redux'
import { removeItem } from 'helpers/localStorage'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { useRouter, usePathname } from 'next/navigation'
import { verificationPhoneOtp, phoneOtpenerate } from 'store/services/auth/newLogin'
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { jobbseekersLoginFailed } from 'store/actions/auth/jobseekersLogin'

function PhoneCode(props: any) {
  const { lang:{newGetStarted}, isModal = false ,loginData,setStep} = props
  const searchParams = useSearchParams()
  const [errorText, setErrorText] = useState<string>('')
  const [number, setNumber] = useState<number>(0)
  const langKey = getLang()

  let userId:string;
  let phoneNum:string;
  let avatar:string;
  let name:string; 
  let email:string; 
  let browserId:string;
  let isMultiplePhonesNum:string;

  if(isModal){
    const { user_id, first_name, browser_serial_number, is_multiple_phones_num} = loginData
    userId = user_id
    phoneNum = loginData.phoneNum
    avatar = loginData.avatar
    name = first_name
    email = loginData.email
    browserId = browser_serial_number
   isMultiplePhonesNum = String(is_multiple_phones_num)
  }else{
     userId = searchParams.get('userId')
     phoneNum = '+' + searchParams.get('phone')?.trim?.()
     avatar = searchParams.get('avatar')
     name = searchParams.get('name')
     email = searchParams.get('email')
     browserId = searchParams.get('browserId')
    isMultiplePhonesNum = searchParams.get('isMultiplePhonesNum')
  }

  let uuid = localStorage.getItem('uuid')
  const router = useRouter()
  const pathname = usePathname()


  const dispatch = useDispatch()
  console.log({ uuid })
  useEffect(()=>{
    dispatch(jobbseekersLoginFailed({}))
  },[])
  useEffect(() => {
    if (!uuid) {
      const fpPromise = FingerprintJS.load()
      ;(async () => {
        // Get the visitor identifier when you need it.
        const fp = await fpPromise
        const result = await fp.get()
        // This is the visitor identifier:
        uuid = result.visitorId
        localStorage.setItem('uuid', uuid)
        console.log({newUUid: uuid })
      })()
    }
  }, [])

  useEffect(() => {
    setUserId(userId)
  }, [userId])
  const { setUserId, defaultLoginCallBack, handleAuthenticationJobseekersLoginPhone,userInfo,error } =
    useGetStarted()

 // const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
 // const error = useSelector((store: any) => store.auth.jobseekersLogin.error)
  const onChange = (otp) => {
    if(error?.data?.message){
      dispatch(jobbseekersLoginFailed({}))
    }
    console.log({otp},otp?.length)
    if (otp?.length === 6) {
      console.log(otp, uuid, browserId)
     
      if(isMultiplePhonesNum === 'true'){
        router.push(`/${langKey}/get-started/phone?step=7&phone=${phoneNum}`)
         return
      }

      if (uuid != browserId && browserId && email) {
        verifyPhoneFun(otp)
      } else {
        handleAuthenticationJobseekersLoginPhone(otp, phoneNum)
      }

    }
  }

  useEffect(() => {
    const text = error?.data?.message || ''
    setErrorText(text)
  }, [error])

  const verifyPhoneFun = (otp) => {
    console.log(otp)
    verificationPhoneOtp({
      otp,
      phone_num: phoneNum
    }).then((res) => {
      const { data } = res?.data ?? {}
      if (data) {
        sendOpt(email)
      } else {
        setErrorText(newGetStarted.invalidOtp)
      }
    })
  }

  const sendOptPhone = () => {
    dispatch(jobbseekersLoginFailed({}))
    phoneOtpenerate({ phone_num: phoneNum }).then((res) => {
      console.log(res?.data?.data, 'res')
      dispatch(
        displayNotification({
          open: true,
          message: newGetStarted.resendPhoneCode,
          severity: 'success'
        })
      )
      setNumber(new Date().getTime())
    })
  }

  const sendOpt = (email) => {
    authenticationSendEmaillOtp({ email }).then((res) => {
      console.log(res?.data?.data, 'res')
      router.push(`/${langKey}/get-started/phone?step=6&email=${email}&userId=${userId}`)
    })
  }
  console.log({ userInfo },error?.data,7777)
  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length) {
      const { data } = userInfo
      if (userId) {
        removeItem('quickUpladResume')
        defaultLoginCallBack(data)
      } else {
        router.push(`/${langKey}/get-started/phone?step=3&phone=${phoneNum}`)
      }
      // removeItem('quickUpladResume')
      // defaultLoginCallBack(data,true)
    }
  }, [userInfo])

  return (
    <>
      <div className={styles.phoneNumber}>
        <div className={styles.optBox} >

         {
          !isModal && <>
            {userId ? (
            <h2>
              {newGetStarted.welcomeBack} {name} 🎉
            </h2>
          ) : (
            <h2>{newGetStarted.signUpAnAccount} 🎉</h2>
          )}
          {avatar && avatar != 'null' ? (
            <div className={styles.avatar}>
              <img className={styles.avatar_img} src={avatar} alt='avatar' />
            </div>
          ) : null}
          </>
         }

          <p className={styles.enterTips}>
            {newGetStarted.sendCodeDigit} <span>{phoneNum}.</span>
          </p>
          <Captcha
            lang={props.lang}
            onChange={onChange}
            sendOpt={sendOptPhone}
            autoFocus={true}
            error={errorText}
            number={number}
          />
          <p className={styles.trouble}>
            {newGetStarted.havingTrouble}{' '}
            <span className={styles.link} onClick={()=>isModal ? setStep(1) :  router.push(`/${langKey}/get-started`)} >
              {newGetStarted.otherOptions}.
            </span>
          </p>
        </div>
      </div>
    </>
  )
}

export default PhoneCode
