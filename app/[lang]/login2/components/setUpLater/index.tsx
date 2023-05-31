import React from "react";
import styles from '../../index.module.scss'
// import useGetStarted from '../../hooks/useGetStarted'
// import { useSearchParams } from 'next/navigation'

const SetUpLater = ()=>{
   // const searchParams = useSearchParams()
   // const phoneOpt =  sessionStorage.getItem('phoneOpt')
   // const phoneNum = searchParams.get('phone')
  //  const {handleAuthenticationJobseekersLoginPhone } =  useGetStarted()
    const login = () => {
       // handleAuthenticationJobseekersLoginPhone(phoneNum,phoneOpt,'')
       }
    return  <button className={styles.btn} onClick={()=>login}>Set this up later</button>
}
export default SetUpLater