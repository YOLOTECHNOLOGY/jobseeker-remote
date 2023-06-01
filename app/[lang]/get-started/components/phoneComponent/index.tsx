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
}

const EmailComponent = ({ setPhoneNumber, phone, setDisable, phoneError }: initProps) => {
  const firstRender = useFirstRender()

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
        label={'Phone number'}
        size='small'
        type='number'
        error={!!phoneError}
        value={phone}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      {phoneError && errorText(phoneError)}
    </>
  )
}
export default EmailComponent
