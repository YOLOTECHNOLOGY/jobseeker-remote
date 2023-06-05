import React, { useState, useEffect } from 'react'
import MaterialTextField from 'components/MaterialTextField'
import { useFirstRender } from 'helpers/useFirstRender'
import styles from '../../index.module.scss'
import errorText from '../errorText'

interface initProps {
  setEmail?: Function
  email: string
  setDisable?: Function
  lang: any
}

const EmailComponent = ({ setEmail, email, setDisable, lang }: initProps) => {
  const [emailError, setEmailError] = useState<string>('')
  const { newGetStarted } = lang
  const firstRender = useFirstRender()

  useEffect(() => {
    if (firstRender) {
      return
    }
    let errorText = null
    const validEmailReg = /^[\w-\\.]+@([\w-]+\.)+[\w-]{1,9}$/i
    if (!email?.length || !validEmailReg.test(email)) {
      errorText = newGetStarted.emailValid
    } else {
      errorText = null
    }
    setEmailError(errorText)
  }, [email])

  useEffect(() => {
    if (firstRender) {
      return
    }
    setDisable(!!emailError)
  }, [emailError])

  return (
    <>
      <MaterialTextField
        className={styles.fullwidth}
        label={newGetStarted.emailLabel}
        size='small'
        type='email'
        onChange={(e) => setEmail(e.target.value)}
        error={emailError ? true : false}
      />
      {emailError && errorText(emailError)}
    </>
  )
}
export default EmailComponent
