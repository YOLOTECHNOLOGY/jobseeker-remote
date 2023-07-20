import React from 'react'
import styles from '../../index.module.scss'
import useGetStarted from '../../hooks/useGetStarted'
import { useRouter } from 'next/navigation'
const SetUpLater = (props: any) => {
  const { defaultLoginCallBack, userInfo } = useGetStarted()
  // const userInfo =   useSelector((store: any) => store.auth.jobseekersLogin.response)
  const { newGetStarted } = props.lang
  console.log({ userInfo })

  const login = () => {
    // if(userInfo && Object.keys(userInfo).length){
    //     const { data } = userInfo;
    //     removeItem('quickUpladResume')
    //     defaultLoginCallBack(data)
    //    }else{
    //     routes.push('/')
    //    }
    defaultLoginCallBack(userInfo)
  }
  return (
    <button className={`${styles.btn} ${styles.upLater}`} onClick={() => login()}>
      {newGetStarted.setUpLater}
    </button>
  )
}
export default SetUpLater
