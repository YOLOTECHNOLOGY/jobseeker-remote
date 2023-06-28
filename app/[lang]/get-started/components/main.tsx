'use client'
import React, { useEffect,useState } from 'react'
import styles from '../index.module.scss'
import Divider from '@mui/material/Divider'
import PhoneLink from './link/phone'
import EmailLink from './link/email'
import AppleLogin from './link/apple'
import FacebookLogin from './link/facebook'
import GoogleLogin from './link/google'
import { useDispatch } from 'react-redux'
import { jobbseekersLoginSuccess } from 'store/actions/auth/jobseekersLogin'
import {jobbseekersSocialLoginSuccess} from 'store/actions/auth/jobseekersSocialLogin'
import Image from 'next/image'
import { GoogleLogo } from 'images'
import QrCodeComponent from './QrCode'

interface IProps {
  dictionary: any,
  isModal?:boolean,
  handleEmailClick?:()=>void,
  handlePhoneClick?:()=>void,
}



const Main = (props: IProps) => {
  const { dictionary,isModal = false,handleEmailClick,handlePhoneClick } = props
  const { newGetStarted,getStatred } = dictionary
  const dispatch = useDispatch()
  const [qrCode,setQrCode] = useState<boolean>(false)

  useEffect(()=>{
    dispatch(jobbseekersLoginSuccess({}))
    dispatch(jobbseekersSocialLoginSuccess({}))
  },[])
 
  const {
    loginUsingSocialMediaOTP,
    loginUsingQRCode,
  } = getStatred


  return (<>
      <div className={`${styles.code} ${!isModal ? styles.codePage: ''}`}>
      <div className={styles.codePopver}>
          {
            qrCode ? loginUsingSocialMediaOTP : loginUsingQRCode
          }    
          </div> 
          <div className={styles.codeImg} onClick={()=>setQrCode(!qrCode)}>
             <span className={`${qrCode ?  'icon-windows' : 'icon-appqr'}`}></span>
          </div>
        
      </div>
       { qrCode ?  <QrCodeComponent lang={dictionary}/>
       : <>
        <h2>{newGetStarted.title}</h2>
      <div className={styles.list}>    
        <GoogleLogin lang={dictionary} />
        <FacebookLogin lang={dictionary} />
        <AppleLogin lang={dictionary} />
      </div>
      <div className={styles.divider}>
        <Divider>{newGetStarted.continueWith}</Divider>
      </div>
      <ul className={`${styles.list} ${styles.listEmail}`}>
        <EmailLink lang={dictionary} isModal={isModal} handleClick={handleEmailClick}/>
        <PhoneLink lang={dictionary} isModal={isModal} handleClick={handlePhoneClick}/>
      </ul>
      </>

      } 
     

    </>
  )
}
export default Main
