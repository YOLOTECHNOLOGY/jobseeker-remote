import React from 'react'
import styles from 'app/index.module.scss'
import Link from 'next/link'
import { HomePageChat } from 'images'
import Image from 'next/image'
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
            <Link prefetch={false} className={styles.header} href={companyUrl}>
              <Image className={styles.img} src={logoUrl} alt={name} width={44} height={44} quality={0}></Image>
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
                     <div className={styles.transBox}>
                      <div className={styles.salary}>{salaryRangeValue}</div>
                      <div className={styles.chat} >
                          <Image src={HomePageChat} alt='Boss job chat now' width='18' height='18' quality={0} style={{paddingRight:'4px'}}/> Chat now 
                      </div>
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
