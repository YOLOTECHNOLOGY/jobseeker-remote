import React from 'react'
import styles from 'app/index.module.scss'
import CompanyCardList from './companyList'
import { fetchCompanyTopService } from '../../../store/services/companies2/fetchCompanyTop'
import Link from 'next/link'
import { recordTime } from 'helpers/analizeTools'
async function getCompanyData(location) {
  const res = await fetchCompanyTopService(location)
  return res.data
}

export default async function Companies({ location_id, lang, config, langKey }: any) {
  const stop = recordTime('main-page featured-companies')
  const data: any = await getCompanyData(location_id)
  stop()
  const { home } = lang
  return (
    <div className={styles.companies}>
      {data?.data?.featured_companies?.length ? <h2>{home.topCompany}</h2> : null}
      <div className={styles.companyContainer}>
        <CompanyCardList data={data} langKey={langKey} lang={lang} config={config} />
      </div>
      {data?.data?.featured_companies?.length ? (
        <Link prefetch={true} href={'/' + langKey + '/companies'} className={styles.moreBtn}>
          {home.seeMoreBtn}
        </Link>
      ) : null}
    </div>
  )
}
