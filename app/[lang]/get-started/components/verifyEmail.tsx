import React, { useEffect } from 'react'
import Captcha from './captcha/index'
import styles from '../index.module.scss'
import { useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useFirstRender } from 'helpers/useFirstRender'
import { removeItem } from 'helpers/localStorage'
import useGetStarted from '../hooks/useGetStarted'
import Link from 'next/link'
import { getLang } from 'helpers/country'

const verifyEmail = function (props) {
  const { newGetStarted } = props.lang
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const email = searchParams.get('email')
  const langKey = getLang();
  // const jobseekersSocialResponse = useSelector(
  //   (store: any) => store.auth.jobseekersSocialLogin?.response
  // )
  console.log(userId, 'userId')
  const { setUserId, setEmail, 
    defaultLoginCallBack, 
    handleAuthenticationJobseekersLogin ,
    handleAuthenticationSendEmailMagicLink
  
  } =  useGetStarted()

  const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  const firstRender = useFirstRender()
  useEffect(() => {
    if (email) {
      setEmail(email)
    }
  }, [email])

  useEffect(() => {
    setUserId(userId)
  }, [userId])

  useEffect(() => {
    if (firstRender || !Object.keys(userInfo).length) {
      return
    }
    const { data } = userInfo
    removeItem('quickUpladResume')
    defaultLoginCallBack(data)
  }, [userInfo])

  const onChange = (code) => {
    if (code?.length === 6) {
      handleAuthenticationJobseekersLogin(code)
    }
  }

  return (
    <>
      <div className={styles.phoneNumber}>
        <div className={styles.optBox}>
          {userId ? (
            <>
              <h2>{newGetStarted.welcomeBack}!🎉</h2>
              <p className={styles.enterTips}>
                {newGetStarted.sendCodeDigit}{' '}
                <span className={styles.phone_text}>{email}</span>
              </p>
              <div className={styles.avatar}>
                <img
                  className={styles.avatar_img}
                  src='https://dev-assets.bossjob.com/users/2847285/avatars/b.jpeg'
                  alt='avatar'
                />
              </div>
            </>
          ) : (
            <>
              <h2>{newGetStarted.signUpAnAccount} 🎉</h2>
              <p className={styles.enterTips}>
                {newGetStarted.sendCodeDigit}{' '}
                <span className={styles.phone_text}>johndoe@gmail.com</span>
              </p>
            </>
            
          )}
          <Captcha lang={props.lang} autoFocus={true} onChange={onChange} />
          <div>
            <div>{newGetStarted.checkSpamEmail}</div>
            <div>
             {newGetStarted.havingTrouble}{' '}
              <Link className={styles.link} href={`${langKey}/get-started`}>{newGetStarted.otherOptions}</Link>
            </div>
            <div>
              {newGetStarted.alternatively}<span className={styles.link} onClick={()=>handleAuthenticationSendEmailMagicLink}>{newGetStarted.magicLink}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default verifyEmail
