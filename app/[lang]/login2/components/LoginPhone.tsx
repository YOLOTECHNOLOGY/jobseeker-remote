import React from 'react'
import styles from '../index.module.scss'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialTextField from 'components/MaterialTextField'
import Divider from '@mui/material/Divider'

import AppleLogin from './link/apple'
import FacebookLogin from './link/facebook'
import GoogleLogin from './link/google'


function Login() {
  return (
    <>
      <h2>Log in or sign up to Bossjob</h2>
      <div className={styles.phoneNumber}>
        <div className={styles.item}>
          <MaterialBasicSelect className={styles.fullwidth} label={'Country'} options={[]} />
        </div>
        <div className={styles.item}>
          <MaterialTextField
            className={styles.fullwidth}
            label={'Phone number'}
            size='small'
            type='number'
            sx={{ borderRadius: '8px' }}
          />
        </div>
        <button className={styles.btn}>Send verification code</button>
        <p className={styles.msg}>
          I have read and agreed to and
          <span>Terms of Use</span>
          and
          <span>Privacy Policy</span>
        </p>

        <p className={styles.tips}>
          Looking to hire people? Sign up as <span>Employer</span>
        </p>
      </div>
      <div>
        <Divider>or continue with</Divider>
      </div>
      <div className={styles.list}>
        <GoogleLogin />
        <FacebookLogin />
        <AppleLogin />
      </div>
    </>
  )
}

export default Login
