import React from 'react'
import styles from 'app/[lang]/index.module.scss'
import CompanyCardList from './companyList'
import { fetchCompanyTopService } from '../../../../store/services/companies2/fetchCompanyTop'
import Link from 'next/link'
async function getCompanyData(location) {
  const res = await fetchCompanyTopService(location)
  console.log({ res })
  return res.data
}

export default async function Companies({ location_id, lang, config, langKey }: any) {
  const data: any = await getCompanyData(location_id)
  const { home } = lang
  return (
    <div className={styles.companies}>
      {data?.data?.featured_companies?.length ? <h2>{home.topCompany}</h2> : null}
      <div className={styles.companyContainer}>
        <CompanyCardList data={data} langKey={langKey} lang={lang} config={config} />
      </div>
      {data?.data?.featured_companies?.length ? (
        <Link prefetch={false} href={'/' + langKey + '/companies'} className={styles.moreBtn}>
          {home.seeMoreBtn}
        </Link>
      ) : null}
    </div>
  )
}
