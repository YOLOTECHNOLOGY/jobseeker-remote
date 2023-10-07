import React from 'react'
import styles from 'app/index.module.scss'
// import CompanyCardList from './companyList'
import { fetchFeaturedRemoteCompanies } from 'store/services/companies2/fetchCompanyRemote'
import Link from 'next/link'
import { recordTime } from 'helpers/analizeTools'
import CompanyCardList from 'app/(companies)/[lang]/companies/components/CompanyCardList'

async function getCompanyData() {
  const res = await fetchFeaturedRemoteCompanies()
  return res.data
}

export default async function Companies({ location_id, lang, config, langKey }: any) {
  const stop = recordTime('main-page featured-companies')
  const data: any = await getCompanyData()
  stop()
  const { home, companies } = lang
  return (
    <div className={styles.companiesRemote}>
      <div className={styles.companies}>
        <h2>Popular Remote Company</h2>
        <div className={styles.companyContainer}>
          <CompanyCardList
            companiesList={data?.data?.featured_companies || []}
            langKey={langKey}
            lang={lang}
            config={config}
            isLoading={false}
            transitions={companies.popularCompany}
            page={1}
            showLogin={false}
          />
        </div>
        {data?.data?.featured_companies?.length ? (
          <Link prefetch={true} href={'/' + langKey + '/companies'} className={styles.moreBtn}>
            {home.seeMoreBtn}
          </Link>
        ) : null}
      </div>
    </div>
  )
}
