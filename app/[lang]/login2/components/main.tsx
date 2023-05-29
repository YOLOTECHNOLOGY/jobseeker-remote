'use client'
import React from 'react';
import styles from '../index.module.scss'
import Divider from '@mui/material/Divider';
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
      <li>
        <img src='https://dev.bossjob.ph/_next/image?url=https%3A%2F%2Fdev-assets.bossjob.com%2Fcompanies%2F31430%2Flogo%2Flogo.png&w=48&q=75'></img>
        Email
      </li>
      <li>
        <img src='https://dev.bossjob.ph/_next/image?url=https%3A%2F%2Fdev-assets.bossjob.com%2Fcompanies%2F31430%2Flogo%2Flogo.png&w=48&q=75'></img>
        Phone
      </li>
     </ul>
     
     
    
   
     
  </>
  )
}
export default Main
