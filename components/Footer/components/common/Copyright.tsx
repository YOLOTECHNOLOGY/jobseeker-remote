import React from 'react'
import styles from '../../Footer.module.scss'

const Copyright = (props: any) => {
  const { data } = props
  const { technology, corporation, IndonesiaPT, JapanYolo, JapanAddress } = data?.foot || {}

  return (
    <div className={styles.footerCopyrightWrapper}>
      <div className={styles.copyrightCompanies}>
        Copyright © {new Date().getFullYear()}&nbsp;{technology}
        <br />
        <span>{corporation}</span>
        <br />
        <span>{IndonesiaPT}</span>
        <br />
        <span>
          {JapanYolo}
          {/* <i>|</i> {JapanAddress} */}
        </span>
      </div>
    </div>
  )
}

export default Copyright
