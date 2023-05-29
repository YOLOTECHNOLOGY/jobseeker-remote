'use client'
import React from 'react';
import styles from '../index.module.scss'
import Divider from '@mui/material/Divider';
import PhoneLink from './link/phone';
import EmailLink from './link/email'

const Main = () => {

  return (
  <>
    <ul className={styles.list}>
      <li>
        <img src='https://dev.bossjob.ph/_next/image?url=https%3A%2F%2Fdev-assets.bossjob.com%2Fcompanies%2F31430%2Flogo%2Flogo.png&w=48&q=75'></img>
        Continue with Google
      </li>
      <li>
        <img src='https://dev.bossjob.ph/_next/image?url=https%3A%2F%2Fdev-assets.bossjob.com%2Fcompanies%2F31430%2Flogo%2Flogo.png&w=48&q=75'></img>
        Continue with Facebook
      </li>
      <li>
        <img src='https://dev.bossjob.ph/_next/image?url=https%3A%2F%2Fdev-assets.bossjob.com%2Fcompanies%2F31430%2Flogo%2Flogo.png&w=48&q=75'></img>
        Continue with Apple
      </li>
    </ul>
     <div className={styles.divider}>
     <Divider>or continue with</Divider>
     </div>
     <ul className={`${styles.list} ${styles.listEmail}`}>
      <EmailLink/>
      
      <PhoneLink/>
     </ul>
     
     
    
   
     
  </>
  )
}
export default Main
