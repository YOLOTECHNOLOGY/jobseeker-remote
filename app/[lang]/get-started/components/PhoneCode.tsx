import React,{useEffect,useState} from 'react'
import styles from '../index.module.scss'
import Captcha from './captcha/index'
import { useSearchParams } from 'next/navigation'
import {getLang } from 'helpers/country'
import Link from 'next/link'
import useGetStarted from '../hooks/useGetStarted'
import { useSelector } from 'react-redux'
import { removeItem } from 'helpers/localStorage'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { useRouter } from 'next/navigation'
function PhoneCode() {
  const searchParams = useSearchParams()
  const [captchaError,setCaptchaError] = useState<string>('');
  const langKey = getLang()
  const userId = searchParams.get('userId')
  const phoneNum =  '+' + searchParams.get('phone')?.trim?.()
  const avatar =  searchParams.get('avatar')
  const name = searchParams.get('name')
  let uuid = localStorage.getItem('uuid');
  const router = useRouter()
  console.log({uuid})
  useEffect(()=>{
    if(!uuid){
    const fpPromise = FingerprintJS.load();
    (async () => {
      // Get the visitor identifier when you need it.
      const fp = await fpPromise
      const result = await fp.get()
      // This is the visitor identifier:
      uuid = result.visitorId
      localStorage.setItem('uuid',uuid)
      console.log({uuid})
    })()
  }
  },[])

  useEffect(() => {
    setUserId(userId)
  }, [userId])
  const { 
    setUserId,
    defaultLoginCallBack, 
    handleAuthenticationJobseekersLoginPhone,
  } =  useGetStarted()

  const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)

  const onChange = (otp) => {
    console.log(otp)
    if(otp?.length === 6 ){
      handleAuthenticationJobseekersLoginPhone(otp,phoneNum,uuid)
    }
  }
  console.log(userInfo,userInfo)
 useEffect(()=>{
   if(userInfo && Object.keys(userInfo).length){
    const { data } = userInfo;
    if(userId){
      removeItem('quickUpladResume')
      defaultLoginCallBack(data)
    }else{
      router.push(`${langKey}/get-started/phone?step=3&&phone=${phoneNum}`)
    }
  
   }
 },[userInfo])


  return (
    <>
      <div className={styles.phoneNumber}>
        <div className={styles.optBox}>
          {
            userId ?   <h2>Welcome back, {name}  🎉</h2> :  <h2>Sign up an account 🎉</h2>
          }
          {
             avatar ? <div className={styles.avatar}>
             <img
               className={styles.avatar_img}
               src={avatar}
               alt='avatar'
             />
           </div> : null
          }

          <p className={styles.enterTips}>
            Please enter the 6-digit code that we have sent to <span>{phoneNum}.</span>
          </p>
          <Captcha onChange={onChange} autoFocus={true} error = {captchaError}/>
          <p className={styles.trouble}>
            Having trouble? Try to sign up with   <Link className={styles.link} href={`${langKey}/get-started`}>other options</Link> 
          </p>
        </div>
      </div>
    </>
  )
}

export default PhoneCode
