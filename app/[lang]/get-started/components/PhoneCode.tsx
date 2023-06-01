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
import { useRouter,usePathname } from 'next/navigation'
import {verificationPhoneOtp} from 'store/services/auth/newLogin'
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'

function PhoneCode(props: any) {
  const searchParams = useSearchParams()
  const [errorText,setErrorText] = useState<string>('')
  const langKey = getLang()
  const userId = searchParams.get('userId')
  const phoneNum =  '+' + searchParams.get('phone')?.trim?.()
  const avatar =  searchParams.get('avatar')
  const name = searchParams.get('name')
  const email = searchParams.get('email')
  const browserId = searchParams.get('browserId')
  let uuid = localStorage.getItem('uuid');
  const router = useRouter()
  const pathname = usePathname()
  const { newGetStarted } = props.lang

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
  const error = useSelector((store: any) => store.auth.jobseekersLogin.error)
  const onChange = (otp) => {
   
    if(otp?.length === 6 ){
      console.log(otp,uuid,browserId)
      if(uuid != browserId && browserId){
        verifyPhoneFun(otp)
      }else{
        handleAuthenticationJobseekersLoginPhone(otp,phoneNum,uuid)
      }
    }
  }
  
  console.log({error})

  useEffect(()=>{
    const text = error?.data?.message
     if(text){
      setErrorText(text)
     }
   },[error])

  const  verifyPhoneFun = (otp)=>{
   console.log(otp)
   verificationPhoneOtp({
    otp,
    phone_num:phoneNum
   }).then(res=>{
    console.log(res?.data)
    const {data } = res?.data ?? {}
    if(data){
      sendOpt(email)
    }else{
      setErrorText('Invalid otp')
    }
   })
  }

  const sendOpt =(email)=>{
      authenticationSendEmaillOtp({ email })
      .then((res) => {
        console.log(res?.data?.data,'res')
        router.push(`${pathname}?step=6&email=${email}&userId=${userId}`)
      })
    
  }
 console.log({userInfo})
 useEffect(()=>{
   if(userInfo && Object.keys(userInfo).length){
    const { data} = userInfo;
    if(userId){
          removeItem('quickUpladResume')
          defaultLoginCallBack(data)
    }else{
      router.push(`${langKey}/get-started/phone?step=5`)
    }
   }
 },[userInfo])


  return (
    <>
      <div className={styles.phoneNumber}>
        <div className={styles.optBox}>
          {
            userId ?   <h2>{newGetStarted.welcomeBack}  {name}  🎉</h2> : <h2>{newGetStarted.signUpAnAccount} 🎉</h2>
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
            {newGetStarted.sendCodeDigit} <span>{phoneNum}.</span>
          </p>
          <Captcha lang={props.lang} onChange={onChange} autoFocus={true} error = {errorText}/>
          <p className={styles.trouble}>
          {newGetStarted.havingTrouble}   <Link className={styles.link} href={`${langKey}/get-started`}>{newGetStarted.otherOptions}</Link> 
          </p>
        </div>
      </div>
    </>
  )
}

export default PhoneCode
