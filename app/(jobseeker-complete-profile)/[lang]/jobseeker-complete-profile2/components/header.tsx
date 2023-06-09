import React from 'react'
import styles from '../index.module.scss'
import { BossjobLogoWhite } from 'images'
import Link from 'next/link'
const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.main}>
      <img
        className={styles.headerLogoImage}
        src={BossjobLogoWhite}
        title='Bossjob logo'
        alt='Bossjob logo'
        style={{
          marginTop: '3px'
        }}
      />
      <Link  href={process.env.BOSSHUNT_URL}>I’m hiring</Link>
      </div>
      
    </div>
  )
}

export default Header
