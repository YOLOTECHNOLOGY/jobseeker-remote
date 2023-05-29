import React,{useState,useEffect,useRef} from 'react'
import styles from '../index.module.scss'
import Captcha from './captcha/index'
import { useRouter } from 'next/navigation'
import {getLang } from 'helpers/country'

interface initProps {
  code?:string,
  sendOpt?: (value: string) => void,
  phone?:string
}

let timer = null;
const origninTimer = 60
function PhoneCode(props:initProps) {
  const {code,sendOpt,phone} = props;
 
  const [countdown,setCountdown] = useState<number>(origninTimer)
  
  const timerRef = useRef(origninTimer)
  const router = useRouter()
  const langKey = getLang()

  useEffect(()=>{
    
    timer = setInterval(()=>{
      const newTime =  timerRef.current - 1
      console.log(newTime,newTime)
      if(newTime <= 0){ 
        clearInterval(timer)
        timerRef.current = origninTimer 
      }else{
        timerRef.current = newTime     
      }
      setCountdown(newTime)     
    },1000)

  },[])
   
  
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
            Please enter the 6-digit code that we have sent to
            <span>{code}.</span>
          </p>
          <Captcha onChange={onChange} autoFocus={true}/>
          <p className={styles.countdown}>
            {
              countdown === 0 ?  <span onClick={()=>sendOpt}>resend code</span> : countdown + 's'
            }
            </p>
          <p className={styles.trouble}>
            Having trouble? Try to sign up with <span>other options</span>
          </p>
        </div>
      </div>
    </>
  )
}

export default PhoneCode
