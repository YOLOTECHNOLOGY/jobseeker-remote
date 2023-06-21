import React, { useEffect, useState } from 'react'
import Captcha from './captcha/index'
import styles from '../index.module.scss'
import { useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useFirstRender } from 'helpers/useFirstRender'
import { removeItem } from 'helpers/localStorage'
import useGetStarted from '../hooks/useGetStarted'
import { getLang } from 'helpers/country'
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { jobbseekersLoginFailed } from 'store/actions/auth/jobseekersLogin'
import { useRouter } from 'next/navigation'
const verifyEmail = function (props) {
  const {isModal,lang,loginData,setStep} = props
  const { newGetStarted} =lang
  const searchParams = useSearchParams()

  // const userId = searchParams.get('userId')
  // const email = searchParams.get('email')
  // const avatar = searchParams.get('avatar')
     let userId = null;
     let email = null;
     let avatar = null;
     if(isModal){
       userId = loginData?.user_id;
       email = loginData?.email;
       avatar = loginData?.avatar
     }else{
      userId = searchParams.get('userId')
      email = searchParams.get('email')
      avatar = searchParams.get('avatar')
     }
   
 console.log({loginData})
  const langKey = getLang()
  const [errorText, setErrorText] = useState<string>('')
  const [number, setNumber] = useState<number>(0)
  const {
    setUserId,
    setEmail,
    defaultLoginCallBack,
    handleAuthenticationJobseekersLogin,
    handleAuthenticationSendEmailMagicLink,
    userInfo,
    error
  } = useGetStarted()

  // const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  // const error = useSelector((store: any) => store.auth.jobseekersLogin.error)
  console.log({ error })
  const dispatch = useDispatch()
  const router = useRouter()
  useEffect(() => {
    dispatch(jobbseekersLoginFailed({}))
    setErrorText('')
  }, [])

  useEffect(() => {
    const text = error?.data?.message ?? ''
    setErrorText(text)
  }, [JSON.stringify(error)])
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
    setErrorText('')
    if (code?.length === 6) {
      handleAuthenticationJobseekersLogin(code)
    }
  }

  const sendOpt = () => {
    dispatch(jobbseekersLoginFailed({}))
    authenticationSendEmaillOtp({ email })
      .then(() => {
        setNumber(new Date().getTime())
        dispatch(
          displayNotification({
            open: true,
            message: newGetStarted.resendEmailCode,
            severity: 'success'
          })
        )
      })
      .catch((error) => {
        dispatch(
          displayNotification({
            open: true,
            message: error.message ?? newGetStarted.optError,
            severity: 'error'
          })
        )
      })
  }
  console.log({isModal})

  return (
    <>
      <div className={styles.phoneNumber}>
        <div className={styles.optBox} >
          {
            !isModal &&   <>
            {userId ? (
              <>
                <h2>{newGetStarted.welcomeBack}!🎉</h2>
                <p className={styles.enterTips}>
                  {newGetStarted.sendCodeDigit} <span className={styles.phone_text}>{email}</span>
                </p>
                <div className={styles.avatar}>
                  <img className={styles.avatar_img} src={avatar} alt='avatar' />
                </div>
              </>
            ) : (
              <>
                <h2>{newGetStarted.signUpAnAccount} 🎉</h2>
                <p className={styles.enterTips}>
                  {newGetStarted.sendCodeDigit} <span className={styles.phone_text}>{email}</span>
                </p>
              </>
            )}
            </>
          } 
        
          <Captcha
            lang={props.lang}
            autoFocus={true}
            onChange={onChange}
            error={errorText}
            sendOpt={sendOpt}
            number={number}
          />
          <div>
            <div>{newGetStarted.checkSpamEmail}</div>
            <div>
              {newGetStarted.havingTrouble}{' '}
              <span className={styles.link} onClick={()=>isModal ? setStep(1) :  router.push(`/${langKey}/get-started`)} > 
                {newGetStarted.otherOptions}
              </span>
            </div>
            <div>
              {newGetStarted.alternatively}
              <span
                className={styles.link}
                onClick={() => handleAuthenticationSendEmailMagicLink()}
              >
                {' '}{newGetStarted.magicLink}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default verifyEmail
