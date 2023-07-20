'use client'
import React, { useEffect, useState } from 'react'
import styles from '../index.module.scss'
import VerifyEmail from '../components/verifyEmail'
import { useSearchParams } from 'next/navigation'
import LoginForEmail from '../components/loginForEmail'
import LeftBanner from '../components/leftBanner'
import CodePopver from '../components/codePopver'
import QrCodeComponent from '../components/QrCode'
interface IProps {
  lang: any
  isModal?: boolean
  handleEmailClick?: () => void
  setLoginData?: any
  stepModal?: number
  loginData?: any
  setLoginType?: any
}

const EmailLogin = (props: IProps) => {
  const {
    lang,
    isModal = false,
    handleEmailClick,
    setLoginData,
    stepModal,
    loginData,
    setLoginType
  } = props
  const searchParams = useSearchParams()
  const search = searchParams.get('step')
  const [step, setStep] = useState(1)
  const [qrCode, setQrCode] = useState<boolean>(false)
  useEffect(() => {
    if (isModal) {
      setStep(stepModal)
      return
    }
    const hasStep = [1, 2].includes(+search)
    if (search && hasStep) {
      setStep(Number(search))
    } else {
      setStep(1)
    }
  }, [search, isModal, stepModal])

  const main = (
    <div className={styles.container}>
      <LeftBanner />
      <div className={styles.rightContainer}>
        <CodePopver setQrCode={setQrCode} qrCode={qrCode} dictionary={lang} isModal={isModal} />
        {qrCode ? (
          <QrCodeComponent lang={lang} />
        ) : (
          <>
            {step === 1 && (
              <LoginForEmail
                lang={props.lang}
                setLoginData={setLoginData}
                isModal={isModal}
                handleEmailClick={handleEmailClick}
              />
            )}
            {step === 2 && (
              <VerifyEmail
                lang={props.lang}
                isModal={isModal}
                loginData={loginData}
                setStep={setLoginType}
              />
            )}
          </>
        )}
      </div>
    </div>
  )

  return (
    <>
      {isModal ? (
        main
      ) : (
        <div className={styles.main}>
          <div className={styles.bg}></div>
          {main}
        </div>
      )}
    </>
  )
}

export default EmailLogin
