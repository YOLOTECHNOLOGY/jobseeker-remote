import React from 'react'

import styles from '../../Footer.module.scss'

import CompanyInfo from '../common/CompanyInfo'

const Company = (props: any) => {
  const { data } = props

  return (
    <div className={styles.footerDesktopLeftTop}>
      <CompanyInfo data={data} />
    </div>
  )
}

export default Company
