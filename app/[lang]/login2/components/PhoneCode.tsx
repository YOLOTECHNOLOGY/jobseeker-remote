import React,{useState,useEffect,useRef} from 'react'
import styles from '../index.module.scss'
import Captcha from './captcha/index'
import { useRouter } from 'next/navigation'
import {getLang } from 'helpers/country'
import Link from 'next/link'

interface initProps {
  code?:string,
  sendOpt?: (value: string) => void,
  phone?:string
}

function PhoneCode(props:initProps) {
  const {code,sendOpt} = props;
 
  const router = useRouter()
  const langKey = getLang()

  
  const onChange = (opt) => {
    console.log(opt)
    if(opt?.length === 6){
      router.push(`${langKey}/phone?step=3`)
    }
  }


  return (
    <>
      <div className={styles.phoneNumber}>
        <div className={styles.optBox}>
          <h2>Sign up an account 🎉</h2>
          <p className={styles.enterTips}>
            Please enter the 6-digit code that we have sent to 1111
            <span>{code}.</span>
          </p>
          <Captcha onChange={onChange} autoFocus={true}/>
          <p className={styles.trouble}>
            Having trouble? Try to sign up with   <Link className={styles.link} href={`${langKey}/get-started`}>other options</Link> 
          </p>
        </div>
      </div>
    </>
  )
}

export default PhoneCode
