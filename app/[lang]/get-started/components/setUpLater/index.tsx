import React from "react";
import styles from '../../index.module.scss'
import useGetStarted from '../../hooks/useGetStarted'
import { useSelector } from 'react-redux'
import { removeItem } from 'helpers/localStorage'

const SetUpLater = ()=>{
    const {defaultLoginCallBack } =  useGetStarted()
  const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  
  console.log({userInfo});
  
    const login = () => {
        if(userInfo && Object.keys(userInfo).length){
            const { data } = userInfo;
            removeItem('quickUpladResume')
            defaultLoginCallBack(data)        
           }
       }
    return  <button className={styles.btn} onClick={()=>login}>Set this up later</button>
}
export default SetUpLater