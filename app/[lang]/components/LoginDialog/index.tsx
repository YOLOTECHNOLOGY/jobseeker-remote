import React, { useState,useEffect } from 'react'

import Dialog from './components/dialog'
import Main from 'app/[lang]/get-started/components/main'
import { languageContext } from 'app/[lang]/components/providers/languageProvider'
import styles from 'app/[lang]/get-started/index.module.scss'
import LoginForEmail from 'app/[lang]/get-started/components/loginForEmail'
import LoginForPhone from 'app/[lang]/get-started/components/loginForPhone'
import VerifyEmail from 'app/[lang]/get-started/components/verifyEmail'
import PhoneCode from 'app/[lang]/get-started/components/PhoneCode'
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
  console.log({ data })
  //  2:email, 3:phone,  4:email OPT
  const [step, setStep] = useState<number>(1)
  const [loginData, setLoginData] = useState<any>({})
  const [title,setTitle] = useState<string>(null)
  
  useEffect(()=>{
    if(step === 4 || step === 5){
      setTitle(loginData?.userId  ? `${newGetStarted.welcomeBack}! 🎉` : `${newGetStarted.signUpAnAccount} 🎉`)
    }else{
      setTitle(newGetStarted?.title)
    }
  },[step,loginData])
  console.log({ step })
  return (
    <div>
      <Dialog onClose={handleClose} open={open} title={title}>
        <div className={styles.main} style={{ margin: 0, minHeight: '300px', padding: 0 }}>
          <div  className={`${styles.container} ${styles.dialogContainer}`}>
            {step == 1 && (
              <Main
                dictionary={data}
                isModal={true}
                handleEmailClick={() => setStep(2)}
                handlePhoneClick={() => setStep(3)}
              />
            )}
            {step == 2 && (
              <LoginForEmail
                lang={data}
                isModal={true}
                handlePhoneClick={() => setStep(3)}
                setLoginData={(e) => {
                  setStep(4)
                  setLoginData(e)
                }}
              />
            )}
            {step == 3 && (
              <LoginForPhone 
                lang={data} 
                isModal={true} 
                handleEmailClick={() => setStep(2)} 
                setLoginData={(e) => {
                  setStep(5)
                  setLoginData(e)
                }}
              />
            )}
            {step == 4 && <VerifyEmail lang={data} isModal={true} loginData={loginData} />}
            {step == 5 && <PhoneCode lang={data} isModal={true} loginData={loginData} />}
          </div>
        </div>
      </Dialog>
    </div>
  )
}
