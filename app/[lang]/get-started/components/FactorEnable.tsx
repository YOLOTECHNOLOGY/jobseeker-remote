import React,{useEffect} from 'react'
import styles from '../index.module.scss'
import { useSelector } from 'react-redux'
import useGetStarted from '../hooks/useGetStarted'
import Image from 'next/image'
import { PhoneIcon } from 'images'

function FactorEnable(props:any) {
   
  const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  const { newGetStarted } = props.lang
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
        {newGetStarted.enableTwoFactor} <br />
        {newGetStarted.authenticationEnabled} ✅
      </h2>
      <p className={styles.notice}>
        {newGetStarted.factorTip}
      </p>
    </div>
  )
}

export default FactorEnable
