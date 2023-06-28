'use client'
import React from 'react'

import styles from './Footer.module.scss'
import PC from './components/PC'
import Mobile from './components/Mobile'

const Footer = ({lang}:any) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Start of Mobile Footer */}
        <Mobile lang={lang} />
        {/* End of Mobile Footer */}

        {/* Start of Desktop Footer */}
        <PC lang={lang} />
        {/* End of Desktop Footer */}
      </div>
    </footer>
  )
}

export default Footer
