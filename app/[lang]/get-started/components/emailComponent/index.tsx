import React, { useState, useEffect ,memo} from 'react'
import MaterialTextField from 'components/MaterialTextField'
import { useFirstRender } from 'helpers/useFirstRender'
import styles from '../../index.module.scss'
import errorText from '../errorText'

interface initProps {
  setEmail?: Function
  email: string
  setDisable?: Function
  lang: any
  validateErr?: string
}

const EmailComponent = ({ setEmail, email, setDisable, lang, validateErr }: initProps) => {
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

 useEffect(()=>{
  setEmailError(validateErr)
 },[validateErr])

  useEffect(() => {
    if(email){
      setDisable(!!emailError)
    }
  }, [emailError])

  return (
    <>
      <MaterialTextField
        className={styles.fullwidth}
        label={newGetStarted.emailLabel}
        size='small'
        type='text'
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        error={emailError ? true : false}
        autoComplete="true"
      />
      {emailError && errorText(emailError)}
    </>
  )
}
export default memo(EmailComponent)
