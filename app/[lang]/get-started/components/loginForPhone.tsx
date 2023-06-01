import React,{useState,useEffect} from "react";
import styles from '../index.module.scss'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import { useSelector } from 'react-redux'
import {  getSmsCountryList} from 'helpers/jobPayloadFormatter'
import { getCountryKey } from 'helpers/country' 
import Link from 'next/link'
import AppleLogin from './link/apple'
import FacebookLogin from './link/facebook'
import GoogleLogin from './link/google'
import EmailLogin from './link/email'
import Divider from '@mui/material/Divider'
import classNames from "classnames";
import { getLang } from 'helpers/country'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import PhoneComponent from './phoneComponent'
import {phoneOtpenerate} from 'store/services/auth/newLogin'


const countryForCountryCode = {
    ph: '+63',
    sg: '+65'
  }

const LoginForPhone = ()=>{

const [countryValue,setCountry] = useState<string>('');
const [isDisable,setDisable] = useState<boolean>(true)
const [phoneNumber,setPhoneNumber] = useState<string>('');
const [phoneError, setPhoneError] = useState<string>('')
   


const config = useSelector((store: any) => store.config.config.response ?? [])
const countryList = getSmsCountryList(config)
const country = getCountryKey()
const countryCode = countryForCountryCode[country]
const langKey = getLang();
const router = useRouter()
const dispatch = useDispatch()

useEffect(()=>{
  if(countryCode){
    setCountry(countryCode)
  }
},[countryCode])

useEffect(()=>{
  if(phoneNumber?.length > 4){
    setDisable(false)
  }else{
    setDisable(true)
  }
},[phoneNumber])
 
const sendOpt =()=>{
  console.log(1111)
  const phoneNum = countryValue + phoneNumber
  phoneOtpenerate({ phone_num:phoneNum })
  .then((res) => {
    console.log(res?.data?.data,'res')
    const {user_id,avatar,first_name,browser_serial_number,email} = res?.data?.data ?? {}
     let url = `${langKey}/get-started/phone?step=2&&phone=${phoneNum}`
     if(user_id){
       url = `${langKey}/get-started/phone?step=2&&phone=${phoneNum}&email=${email}&userId=${user_id}&avatar=${avatar}&name=${first_name}&browserId=${browser_serial_number}`
     }
     router.push(url)
  })
  .catch((error) => {
    dispatch(
      displayNotification({
        open: true,
        message: error.message ?? 'Send EmailOTP fail',
        severity: 'error'
      })
    )
  })
}

  return (
    <>
          <h2>Log in or sign up to Bossjob</h2>
         <div className={styles.phoneNumber}>
          <div className={styles.item}>
            <MaterialBasicSelect 
            className={styles.fullwidth} 
            label={'Country'} 
            options={countryList}
            value={countryValue}
            onChange={(e) => setCountry(e.target.value)}
             />
          </div>
          <div className={styles.item}>
            <PhoneComponent phoneError={phoneError} setPhoneNumber={setPhoneNumber} setDisable={setDisable}/>
          </div>
          <button className={styles.btn} disabled={isDisable} onClick={sendOpt}>Send verification code</button>

          <p className={styles.msg}>
            I have read and agreed to and
           <Link
            target='_blank'
            href='https://blog.bossjob.ph/terms-and-conditions/'
          >
             Terms of Use
          </Link>
            and
            <Link
            target='_blank'
            href='https://blog.bossjob.ph/terms-and-conditions/'
            //  className={styles.emailLoginContainer_link}
          >
             Privacy Policy
          </Link>
            <span></span>
          </p>
          <p className={styles.tips}>Looking to hire people? Sign up as <span>Employer</span></p>
          </div> 
          <div>
        <div className={classNames([styles.divider, styles.divider_none])}>
          <Divider>or continue with</Divider>
        </div>    
      </div>
      <div className={styles.list}>
        <GoogleLogin />
        <FacebookLogin />
        <AppleLogin />
        <EmailLogin/>
      </div>
      </>
  )
}
export default LoginForPhone