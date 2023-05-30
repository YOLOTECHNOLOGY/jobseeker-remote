import React from 'react'
import styles from '../../index.module.scss'

import { AppleIcon } from 'images'

export default function AppleLogin() {
  return (
    <div className={styles.login_item}>
        <img src={AppleIcon}></img>
        <span>Continue with Apple</span>
    </div>
  )
}
