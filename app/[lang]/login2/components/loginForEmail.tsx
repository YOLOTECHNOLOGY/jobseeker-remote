import React,{useState,useEffect} from "react";
import styles from '../index.module.scss'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialTextField from 'components/MaterialTextField'
import { useSelector } from 'react-redux'
import {  getSmsCountryList} from 'helpers/jobPayloadFormatter'
import { getCountryKey } from 'helpers/country' 
import Link from 'next/link'
import AppleLogin from './link/apple'
import FacebookLogin from './link/facebook'
import GoogleLogin from './link/google'
import Divider from '@mui/material/Divider'
import classNames from "classnames";
const countryForCountryCode = {
    ph: '+63',
    sg: '+65'
  }

const loginForEmail = ()=>{

const [countryValue,setCountry] = useState<string>('');
const [isDisable,setDisable] = useState<boolean>(true)
const [phoneNumber,setPhoneNumber] = useState<string>('');
const config = useSelector((store: any) => store.config.config.response ?? [])
const countryList = getSmsCountryList(config)
const country = getCountryKey()
const countryCode = countryForCountryCode[country]
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

}
 console.log(country,phoneNumber,111)
  return (
    <>
          <h2>Log in or sign up to Bossjob</h2>
         <div className={styles.phoneNumber}>
          <div className={styles.item}>
            <MaterialTextField
              className={styles.fullwidth}
              label={'Email address'}
              size='small'
              type='email'
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
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
      </div>
          </>
  )
}
export default loginForEmail