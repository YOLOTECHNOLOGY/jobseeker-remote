import React from 'react'
import styles from '../index.module.scss'

function FactorEnable(props:any) {
  const { newGetStarted } = props.lang

  return (
    <div className={styles.enabled}>
      <h2>
        {newGetStarted.enableTwoFactor} <br />
        {newGetStarted.authenticationEnabled} ✅
      </h2>
      <p className={styles.notice}>
        {newGetStarted.factorTip}
      </p>
    </div>
  )
}

export default FactorEnable
