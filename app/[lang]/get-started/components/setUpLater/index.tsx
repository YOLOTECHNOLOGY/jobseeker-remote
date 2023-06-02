import React from "react";
import styles from '../../index.module.scss'
import useGetStarted from '../../hooks/useGetStarted'
import { useSelector } from 'react-redux'
import { removeItem } from 'helpers/localStorage'
import { useRouter} from 'next/navigation'
const SetUpLater = (props: any)=>{
    const {defaultLoginCallBack } =  useGetStarted()
  const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  const { newGetStarted } = props.lang
  const routes = useRouter()
  console.log({userInfo});
  
    const login = () => {
        if(userInfo && Object.keys(userInfo).length){
            const { data } = userInfo;
            removeItem('quickUpladResume')
            defaultLoginCallBack(data)        
           }else{
            routes.push('/')
           }
       }
    return  <button className={styles.btn} onClick={()=>login()}>{newGetStarted.setUpLater}</button>
}
export default SetUpLater