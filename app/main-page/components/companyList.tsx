'use client'
import React from 'react'
import styles from './company.module.scss'
import Link from 'next/link'
import { Button } from '@mui/material'
import { HomePageChat } from 'images'

const CompanyList = (props: any) => {
  const { featured_companies: companies } = props?.data?.data || {}
  console.log(companies,'companies')
  return (
    <>
      {companies?.map((item) => {
        const { id: Id } = item || {}
        const {
          company_url: companyUrl,
          logo_url: logoUrl,
          name,
          industry,
          company_size: companySize,
          financing_stage: financingStage,
        } = item?.company || {}
        return (
          <div className={styles.card} key={Id}>
            <Link className={styles.header} href={companyUrl}>
              <img src={logoUrl} alt={name}></img>
              <h5>{name}</h5>
              <p>
                {industry}
                {industry && companySize ? ' | ' : null}
                {companySize ? `${companySize} Employee` : null}
                {(industry || companySize) && financingStage ? ' | ' : null}
                {financingStage}
              </p>
            </Link>
            {(item?.company.jobs || item?.company.job)?.map((jobItem, index) => {
              const {
                job_title: jobTitle,
                salary_range_value: salaryRangeValue,
                job_location: jobLocation,
                xp_lvl: xpLvl,
                degree,
                job_url: jobUrl
              } = jobItem || {}
              return (
                <Link href={jobUrl} className={styles.list} key={`${jobItem.id}-${index}`}>
                  <div className={styles.jobType}>
                    <p>{jobTitle}</p>
                     <div className={styles.salary}>{salaryRangeValue}</div>
                      <div className={styles.chat} >
                        <img src={HomePageChat} alt='Boss job chat now' width='18' height='18' style={{position:"relative",top:'-1px'}}/> Chat now
                      </div>
                  </div>
                  <span className={styles.tag}>{jobLocation}</span>
                  <span className={styles.tag}>{xpLvl}</span>
                  <span className={styles.tag}>{degree}</span>
                </Link>
              )
            })}
            <Link href={`${companyUrl}/jobs`} className={styles.linkAddress}>
              More jobs
            </Link>
          </div>
        )
      })}
    </>
  )
}

export default CompanyList
