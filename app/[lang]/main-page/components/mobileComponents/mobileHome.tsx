import React from 'react'
import styles from 'app/[lang]/index.module.scss'
import JobCard from './jobsCard'
import { fetchCompanyTopService } from 'store/services/companies/fetchCompanyTop'
import Link from 'next/link'
import Image from 'next/image'
async function getCompanyData(location) {
  const res = await fetchCompanyTopService(location)
    .catch(e => console.log({ fetchCompanyTopService: e }))
  return res.data
}

const mobileHome = async ({ location, lang, location_id ,config}) => {
  const data = await getCompanyData(location_id)
  const comapny = data?.data?.featured_companies || []
  const { companyHiring, jobCard ,jobsHiring} = lang.home
  return (
    <div className={styles.mobileHome}>
      {comapny?.length ? (
        <>
          <h2>{companyHiring}</h2>
          <div className={styles.hiring}>
            <div className={styles.itemBox}>
              {comapny.map((item) => {
                const { id, logo_url, company_url, name, num_of_active_jobs } = item?.company || {}
                return (
                  <Link
                    prefetch={false}
                    href={`${company_url}/jobs`}
                    className={styles.item}
                    key={id}
                  >
                    <Image src={logo_url} alt='name' width={27} height={27} />
                    <div className={styles.info}>
                      <p className={styles.name}>{name}</p>
                      <p className={styles.num}> {num_of_active_jobs} {jobsHiring}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </>
      ) : null}

      <div className={styles.jobs}>
        <h2>{jobCard.jobForYou}</h2>
        <JobCard location={location} lang={lang.home}  config={config}/>
      </div>
    </div>
  )
}

export default mobileHome
