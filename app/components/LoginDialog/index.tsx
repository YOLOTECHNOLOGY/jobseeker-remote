import React, { useState, useEffect } from 'react'

import Dialog from './components/dialog'
import Main from 'app/[lang]/get-started/components/main'
import { languageContext } from 'app/components/providers/languageProvider'
import styles from 'app/[lang]/get-started/index.module.scss'
import LoginForEmail from 'app/[lang]/get-started/email/EmailLogin'
import LoginForPhone from 'app/[lang]/get-started/phone/PhoneLogin'
// import VerifyEmail from 'app/[lang]/get-started/components/verifyEmail'
// import PhoneCode from 'app/[lang]/get-started/components/PhoneCode'
export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

interface dialogProps {
  open: boolean
  handleClose?: () => void
}

export default function LoginDialog({ open = true, handleClose }: dialogProps) {
  const data = React.useContext(languageContext) as any
  const { newGetStarted } = data
  //  2:email, 3:phone,  4:email OPT
  const [step, setStep] = useState<number>(1)
  const [loginData, setLoginData] = useState<any>({})
  const [title, setTitle] = useState<string>(null)
  const [loginType, setLoginType] = useState<string>('home')
  useEffect(() => {
    if (step === 4 || step === 5) {
      setTitle(
        loginData?.user_id
          ? `${newGetStarted.welcomeBack} ${loginData?.first_name || ''} 🎉`
          : `${newGetStarted.signUpAnAccount} 🎉`
      )
    } else {
      setTitle(newGetStarted?.title)
    }
  }, [step, loginData])

  const initLogin = () => {
    console.log(11111)
    setStep(1)
    setLoginData({})
    setLoginType('home')
  }

  return (
    <div>
      <Dialog
        onClose={() => {
          localStorage.removeItem('isChatRedirect')
          handleClose()
        }}
        open={open}
        title={title}
        avatar={loginData?.avatar}
      >
        <div
          className={styles.main}
          style={{ margin: 0, minHeight: '200px', padding: 0, overflow: 'unset' }}
        >
          <div className={`${styles.container} ${styles.dialogContainer}`}>
            {loginType == 'home' && (
              <Main
                dictionary={data}
                isModal={true}
                handleEmailClick={() => setLoginType('email')}
                handlePhoneClick={() => setLoginType('phone')}
              />
            )}
            {loginType == 'email' && (
              <LoginForEmail
                lang={data}
                isModal={true}
                handleEmailClick={() => {
                  setStep(1)
                  setLoginType('phone')
                }}
                stepModal={step}
                setLoginType={initLogin}
                loginData={loginData}
                setLoginData={(e) => {
                  setStep(2)
                  setLoginData(e)
                }}
              />
            )}
            {loginType == 'phone' && (
              <LoginForPhone
                lang={data}
                isModal={true}
                stepModal={step}
                handleEmailClick={() => {
                  setStep(1)
                  setLoginType('email')
                }}
                loginData={loginData}
                setLoginType={initLogin}
                setLoginData={(e) => {
                  setStep(2)
                  setLoginData(e)
                }}
              />
            )}
            {/* {step == 4 && <VerifyEmail lang={data} isModal={true} loginData={loginData} setStep={(e)=>{
            setLoginData({})
            setStep(e)
            }}/>}
            {step == 5 && <PhoneCode lang={data} isModal={true} loginData={loginData} setStep={(e)=>{
            setLoginData({})
            setStep(e)
            }}/>} */}
          </div>
        </div>
      </Dialog>
    </div>
  )
}
