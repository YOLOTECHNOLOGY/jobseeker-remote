import React from 'react'
import styles from '../../index.module.scss'
import useGetStarted from '../../hooks/useGetStarted'
const SetUpLater = (props: any) => {
  const { defaultLoginCallBack, userInfo } = useGetStarted()
  // const userInfo =   useSelector((store: any) => store.auth.jobseekersLogin.response)
  const { newGetStarted } = props.lang
  const login = () => {
    defaultLoginCallBack(userInfo)
  }
  return (
    <button className={`${styles.btn} ${styles.upLater}`} onClick={() => login()}>
      {newGetStarted.setUpLater}
    </button>
  )
}
export default SetUpLater
