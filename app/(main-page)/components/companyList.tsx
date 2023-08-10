'use client'
import React from 'react'
import styles from 'app/index.module.scss'
import Link from 'next/link'
import { HomePageChat } from 'images'
import { chatSVG } from 'images/svg'
import Image from 'next/image'
import { getValueById } from 'helpers/config/getValueById'
import { isMobile } from 'react-device-detect'
import { setCookie } from 'helpers/cookies'
import { getDeviceUuid } from 'helpers/guest'

const CompanyList = (props: any) => {
  const { featured_companies: companies } = props?.data?.data || {}
  const { config } = props
  const {
    lang: { home },
    langKey
  } = props
  return (
    <>
      {companies?.map((item) => {
        const { id: Id } = item || {}
        const {
          company_url: companyUrl,
          logo_url: logoUrl,
          name,
          // industry,
          industry_id,
          // company_size: companySize,
          company_size_id,
          // financing_stage: financingStage
          financing_stage_id
        } = item?.company || {}
        // const jobLocation = getValueById(config,detail?.job_location_id,'location_id')
        const financingStage = getValueById(
          config,
          financing_stage_id,
          'company_financing_stage_id'
        )

        const industry = getValueById(config, industry_id, 'industry_id')
        const companySize = getValueById(config, company_size_id, 'company_size_id')

        const sendViewCompany = async (item, url) => {
          const company = item?.company
          const device_udid = await getDeviceUuid()
          const params = {
            id: company?.id,
            payload: {
              source: 'company_reco',
              device: isMobile ? 'mobile_web' : 'web',
              reco_from: company?.reco_from || '',
              device_udid
            }
          }
          setCookie('view-company-buried', JSON.stringify(params))
          window.location.href = url
        }

        return (
          <div className={styles.card} key={Id}>
            <div
              onClick={() => sendViewCompany(item, '/' + langKey + companyUrl)}
              className={styles.header}
            >
              <Image
                className={styles.img}
                src={logoUrl}
                alt={name}
                width={44}
                height={44}
                quality={0}
              ></Image>
              <h5>{name}</h5>
              <p>
                {industry}
                {industry && companySize ? <span>|</span> : null}
                {companySize ? `${companySize} ${home.companyCard.employee}` : null}
                {(industry || companySize) && financingStage ? <span>|</span> : null}
                {financingStage}
              </p>
            </div>
            {(item?.company.jobs || item?.company.job)?.map((jobItem, index) => {
              const {
                job_title: jobTitle,
                salary_range_value: salaryRangeValue,
                // job_location: jobLocation,
                job_location_id: job_location_id,
                // xp_lvl: xpLvl,
                xp_lvl_id,
                // degree,
                degree_id,
                job_url: jobUrl
              } = jobItem || {}
              const jobLocation = getValueById(config, job_location_id, 'location_id')
              const xpLvl = getValueById(config, xp_lvl_id, 'xp_lvl_id')
              const degree = getValueById(config, degree_id, 'degree_id')

              return (
                <Link
                  href={'/' + langKey + jobUrl}
                  className={styles.list}
                  key={`${jobItem.id}-${index}`}
                >
                  <div className={styles.jobType}>
                    <p>{jobTitle}</p>
                    <div className={styles.transBox}>
                      <div className={styles.salary}>{salaryRangeValue}</div>
                      <div className={styles.chat}>
                        {/* <Image
                          src={HomePageChat}
                          alt='Boss job chat now'
                          width='18'
                          height='18'
                          quality={0}
                          style={{ paddingRight: '4px' }}
                        />{' '} */}
                        {chatSVG}
                        {home.companyCard.chatNow}
                      </div>
                    </div>
                  </div>
                  <span className={styles.tag}>
                    {jobLocation} <i>|</i>
                  </span>
                  <span className={styles.tag}>
                    {xpLvl}
                    <i>|</i>
                  </span>
                  <span className={styles.tag}>{degree}</span>
                </Link>
              )
            })}
            <div
              onClick={() => sendViewCompany(item, `/${langKey}${companyUrl}/jobs`)}
              className={styles.linkAddress}
            >
              {home.companyCard.moreJob}
            </div>
          </div>
        )
      })}
    </>
  )
}

export default CompanyList
