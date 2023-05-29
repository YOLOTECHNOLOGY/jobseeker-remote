import React from 'react'
import styles from '../index.module.scss'

function FactorEnable() {
  return (
    <div className={styles.enabled}>
      <h2>
        Two-factor <br />
        authentication enabled ✅
      </h2>
      <p className={styles.notice}>
        If we notice an attempted login from a device or browser that we don’t recognise, we will
        ask you for code sent to your email address.
      </p>
    </div>
  )
}

export default FactorEnable
