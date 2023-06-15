import React from 'react'
import styles from '../index.module.scss'
import { BossjobLogoWhite } from 'images'
import Link from 'next/link'
const Header = (props:any) => {
  const {lang,step} = props
  console.log({step})
  return (
    <div className={styles.header}>
      <div className={styles.headerMain}>
      <img
        className={styles.headerLogoImage}
        src={BossjobLogoWhite}
        title='Bossjob logo'
        alt='Bossjob logo'
        style={{
          marginTop: '3px'
        }}
      />
      {
        step === 1 &&  <Link  href={process.env.BOSSHUNT_URL}>{lang?.profile?.ImHiring}</Link>
      }
      </div>
      
    </div>
  )
}

export default Header
