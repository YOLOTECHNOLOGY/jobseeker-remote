import React from 'react'

import CompanyInfo from '../common/CompanyInfo'

import styles from '../../Footer.module.scss'

const Company = (props: any) => {
  const { data } = props

  return (
    <div className={styles.footerMobileCompany}>
      <CompanyInfo data={data} />
    </div>
  )
}

export default Company
