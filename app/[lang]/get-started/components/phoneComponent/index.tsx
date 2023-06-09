import React, { useEffect } from 'react'
import MaterialTextField from 'components/MaterialTextField'
import { useFirstRender } from 'helpers/useFirstRender'
import styles from '../../index.module.scss'
import errorText from '../errorText'

interface initProps {
  setPhoneNumber?: Function
  phone?: string
  setDisable?: Function
  phoneError?: string
  lang: any
}

const PhoneComponent = ({ setPhoneNumber, phone, setDisable, phoneError, lang }: initProps) => {
  const firstRender = useFirstRender()
  const { newGetStarted } = lang
  useEffect(() => {
    if (firstRender) {
      return
    }
    setDisable(!!phoneError)
  }, [phoneError])

  return (
    <>
      <MaterialTextField
        className={styles.fullwidth}
        label={newGetStarted.phoneNumber}
        size='small'
        type='number'
        name='phone'
        error={!!phoneError}
        value={phone}
        autoComplete="true"
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      {phoneError && errorText(phoneError)}
    </>
  )
}
export default PhoneComponent
