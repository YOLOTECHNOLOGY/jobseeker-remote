import Text from 'components/Text'
import MaterialTextField from 'components/MaterialTextField'

import { Button } from '@mui/material'

// tools
import { handleNumericInput } from 'helpers/handleInput'

import styles from './SendTOP.module.scss'
import { useState } from 'react'

const SendTOP = () => {
  const [emailTOP, setEmailTOP] = useState<number>()
  const [emailError] = useState<string>()

  const errorText = (errorMessage: string) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
        {errorMessage}
      </Text>
    )
  }

  return (
    <div className={styles.SendTOPContainer}>
      <div className={styles.SendTOPContainer_title}>
        <Text bold textStyle='xxxl' tagName='h2'>
          Sign up an account 🎉
        </Text>
      </div>

      <div className={styles.SendTOPContainer_desc}>
        <Text tagName='p' textStyle='lg' className={styles.SendTOPContainer_desc_text}>
          Please enter the 6-digit one-time password that we sent to boss@gmail.com.
        </Text>
      </div>
      <div className={styles.SendTOPContainer_main}>
        <MaterialTextField
          className={styles.SendTOPContainer_main_field}
          id='email'
          label='Enter 6-digit OTP'
          variant='outlined'
          size='small'
          value={emailTOP}
          autoComplete='off'
          error={emailError ? true : false}
          onChange={(e) => setEmailTOP(handleNumericInput(e.target.value))}
        />
        <Button variant='contained' className={styles.SendTOPContainer_main_submit}>
          Get OTP
        </Button>
        {emailError && errorText(emailError)}
      </div>

      <div className={styles.SendTOPContainer_sendMagicLink}>
        <Text tagName='p' textStyle='lg'>
          Having trouble?{' '}
          <a className={styles.SendTOPContainer_sendMagicLink_magicLink}>Request a Magic Link</a>
        </Text>
      </div>
    </div>
  )
}

export default SendTOP
