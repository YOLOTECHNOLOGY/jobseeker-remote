/* eslint-disable react/no-unknown-property */
'use client'
import React, { useMemo } from 'react'
import styles from '../../index.module.scss'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getValueById } from 'helpers/config/getValueById'
import { useSelector } from 'react-redux'
import { transState } from 'helpers/utilities'
import common_styles from 'app/index.module.scss'
const JobCard = (props: any) => {
  const {
    job_title,
    // job_region,
    salary_range_value,
    //  job_type,
    // job_location,
    // xp_lvl,
    // degree,
    recruiter_full_name,
    recruiter_job_title,
    company_logo,
    company_name,
    company_size,
    id,
    job_url,
    job_type_id,
    job_location_id,
    xp_lvl_id,
    degree_id,
    is_urgent,
    recruiter_last_active_at: recruiterLastActiveAt
  } = props
  // const labels = [job_type, xp_lvl, degree].filter(a => a)
  const config = useSelector((store: any) => store.config.config.response)
  const labels = [
    getValueById(config, job_type_id, 'job_type_id'),

    getValueById(config, xp_lvl_id, 'xp_lvl_id'),
    getValueById(config, degree_id, 'degree_id')
  ].filter((a) => a)
  const router = useRouter()

  return (
    <div className={styles.jobCardMoblie}>
      <div
        id={'job_card_container_' + id}
        className={styles.container}
        onClick={(e) => {
          e.stopPropagation()
          router.push(job_url, { forceOptimisticNavigation: true })
        }}
      >
        <div key={job_title + id} className={styles.titleContainer} title={`${job_title}`}>
          <div className={styles.title}>
            {is_urgent ? <span className={styles.urgent}>Urgent</span> : null} {`${job_title}`}
          </div>
          <div className={styles.salary}>{salary_range_value}</div>
        </div>
        <div className={styles.companyInfo}>
          <span className={styles.companyName}>{company_name}</span>
          {company_size ? (
            <>
              <span className={styles.companyInfoSpread}></span>
              <span className={styles.companySize}>{company_size}</span>
            </>
          ) : null}
        </div>
        <div className={styles.labelContainer}>
          {labels.map((label) => (
            <div key={label} className={styles.label}>
              {label}
            </div>
          ))}
        </div>

        {/* line */}
        <div className={styles.recruiterLine}></div>

        <div className={styles.recruiterContainer}>
          <div className={styles.info}>
            <div
              className={`${common_styles.avator}  ${
                transState(recruiterLastActiveAt).state === 1 ? '' : common_styles.avator2
              }`}
            >
              <Image src={company_logo} height={24} width={24} alt={''} />
            </div>
            <div
              className={styles.hrTitle}
              title={`${[recruiter_full_name, recruiter_job_title].filter((a) => a).join(' · ')}`}
            >
              {`${[recruiter_full_name, recruiter_job_title].filter((a) => a).join(' · ')}`}
            </div>
          </div>
          <div className={styles.fullName}>
            {getValueById(config, job_location_id, 'location_id')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobCard
