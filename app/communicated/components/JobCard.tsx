"use client"
import React from 'react'
import styles from '../index.module.scss'
import { JoinUs } from 'images'
import Image from 'next/image'

interface cardProps {
  data: Array<any>
}

const Card = ({data}:cardProps) => {

  const isSameDay = (startTime, endTime) => {
    if(!endTime) return true
    const startTimeMs = new Date(startTime).setHours(0, 0, 0, 0);
    const endTimeMs = new Date(endTime).setHours(0, 0, 0, 0);
    return startTimeMs === endTimeMs
  }
 
  return (
    <>
      {
        data?.length ? (<>
          {
            data?.map((e,index)=> { 
              const { industry, 
                company_size:companySize, 
                financing_stage:financingStage,
                name,
                logo_url:logoUrl
              } = e.company || {};
              const { job_title: jobTitle , 
                salary_range_value: salaryRangeValue,
                degree:{
                  value
                },
                location:{
                  value:locationValue
                },
                xp_lvl:xpLvl
              } = e.job;
              const {
                avatar,
                full_name:fullName,
                work_experience:{
                job_title
              }
            } = e.recruiter;
            const same = isSameDay(e.created_at,data[index+1]?.created_at )
              return (       
               <>
               {
               !same &&  <p className={styles.time}>{e.created_at?.substr(0,10)}</p>
               }   
                <div className={`${styles.detail}`} >
                  <div className={styles.header}>
                    <img src={avatar} className={styles.avator} />
                    <span className={styles.name}>{fullName}
                      <span className={styles.nameLine}> |</span>{job_title}</span>
                    <div className={styles.chatBox}> </div>
                  </div>
                  <div className={styles.info}>
                    <div className={styles.leftContent}>
                      <div className={styles.developer}>
                        <p className={styles.title}>{jobTitle}</p>
                        <p className={styles.salary}>{salaryRangeValue}</p>
                      </div>
                      <span className={styles.tag}>{locationValue}</span>
                      <span className={styles.tag}>{xpLvl?.value}</span>
                      <span className={styles.tag}>{value}</span>
                    </div>
                    <div className={styles.rightContent}>
                      <div className={styles.company}>
                        <img src={logoUrl} className={styles.logo}  alt={name}/>
                        {name}
                      </div>
                      <span className={styles.tag}>{industry}</span>
                      <span className={styles.tag}>{companySize} Employees</span>
                      {
                        financingStage &&  <span className={styles.tag}>{financingStage}</span>
                      }    
                    </div>
                  </div>
                </div>
                </>
              )
            }

            )
          }


        </>
        ) : <div className={styles.noData}>
          <Image className={styles.noDataImg} src={JoinUs} alt='暂无数据' width={362} height={247} />
          <button className={styles.seeJob}>See job reco</button>
        </div>
      }

    </>
  )
}

export default Card
