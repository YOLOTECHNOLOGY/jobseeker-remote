import React,{useEffect} from 'react'
import styles from '../index.module.scss'
import { useSelector } from 'react-redux'
import useGetStarted from '../hooks/useGetStarted'
import Image from 'next/image'
import { PhoneIcon } from 'images'

function FactorEnable({lang}:any) {
   
  const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  const {  defaultLoginCallBack } =  useGetStarted() 
  console.log({userInfo})
  useEffect(()=>{
    if(userInfo && Object.keys(userInfo).length){
    const { data } = userInfo
      setTimeout(()=>{
        defaultLoginCallBack(data)
      },3000)
    }
  },[userInfo])

  return (
    <div className={styles.enabled}>
      <Image src={PhoneIcon} alt={''}   className={styles.factorImg} width={200} height={200}></Image>
      <h2>
        Two-factor <br />
        authentication enabled ✅
      </h2>
      <p className={styles.notice}>
        If we notice an attempted login from a device or browser that we don’t recognise, we will
        ask you for code sent to your email address.
      </p>
    </div>
  )
}

export default FactorEnable
