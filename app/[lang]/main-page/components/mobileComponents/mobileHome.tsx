import React from 'react'
import styles from 'app/[lang]/index.module.scss'
import JobCard from './jobsCard'
import { fetchCompanyTopService } from 'store/services/companies2/fetchCompanyTop'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowForwardIosIcon } from 'app/[lang]/components/MuiIcons'
import { getValueById } from 'helpers/config/getValueById'

async function getCompanyData(location) {
  const res = await fetchCompanyTopService(location).catch((e) =>
    console.log({ fetchCompanyTopService: e })
  )
  return res?.data
}

const mobileHome = async ({ location, lang, location_id, config, langKey }) => {
  const data = await getCompanyData(location_id)
  const comapny = data?.data?.featured_companies || []
  const { companyHiring, jobCard, jobs, companyCard, seeMoreBtn } = lang.home
  return (
    <div className={styles.mobileHome}>
      {comapny?.length ? (
        <>
          <h2>{companyHiring}</h2>
          <div className={styles.hiring}>
            <div className={styles.itemBox}>
              {comapny.map((item, index) => {
                if (index > 2) {
                  return
                }

                const {
                  id,
                  logo_url,
                  company_url,
                  name,
                  num_of_active_jobs, // industry,
                  industry_id,
                  // company_size: companySize,
                  company_size_id,
                  // financing_stage: financingStage
                  financing_stage_id
                } = item?.company || {}

                const financingStage = getValueById(
                  config,
                  financing_stage_id,
                  'company_financing_stage_id'
                )

                const industry = getValueById(config, industry_id, 'industry_id')
                const companySize = getValueById(config, company_size_id, 'company_size_id')

                return (
                  <Link
                    prefetch={false}
                    href={`/${langKey}${company_url}/jobs`}
                    className={styles.item}
                    key={id}
                  >
                    <Image src={logo_url} alt='name' width={27} height={27} />
                    <div className={styles.info}>
                      <p className={styles.name}>{name}</p>
                      <p className={styles.companyInfo}>
                        {industry}
                        {industry && companySize ? ' | ' : null}
                        {companySize ? `${companySize} ${companyCard.employee}` : null}
                        {(industry || companySize) && financingStage ? ' | ' : null}
                        {financingStage}
                      </p>
                      <p className={styles.num}>
                        {num_of_active_jobs} {jobs}{' '}
                        <ArrowForwardIosIcon
                          sx={{
                            transform: 'translateY(1px)',
                            marginLeft: '6px',
                            color: '#2378E5',
                            fontSize: '11px'
                          }}
                        />
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </>
      ) : null}

      <Link prefetch={false} href={'/' + langKey + '/companies'} className={styles.moreBtn}>
        {seeMoreBtn}
      </Link>

      <div className={styles.jobs}>
        <h2>{jobCard.jobForYou}</h2>
        <JobCard
          location={location}
          lang={lang.home}
          langKey={langKey}
          config={config}
          location_id={location_id}
        />
      </div>
    </div>
  )
}

export default mobileHome
