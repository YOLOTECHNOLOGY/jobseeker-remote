'use client'
import React, { useEffect, useRef } from 'react';
import styles from './index.module.scss';
import Image from 'next/image'
import { isSameDay, transDate } from 'helpers/utilities'
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import { getValueById } from 'helpers/config/getValueById';
import { cloneDeep } from 'lodash-es'
const  jobseekerDisplayStatusObject = {
  "Pending":'#D2030F',
  "Accepted":'#136FD3',
  "Upcoming":'#136FD3',
  "In progress":'#136FD3',
  "Declined":'#707070',
  "Cancelled":'#707070',
  "Not accepted":'#707070',
  "Completed": "#0EBD5C",
  "Not checked in":'#D2030F',
};
interface cardProps {
  data: Array<any>,
  onChange: Function,
  page: number,
  loadingList: boolean,
  totalPage: number,
  tabValue: string
  lang:any
  config:any
}

const translateData = (data, config) => {
  if(!data || !config || !Array.isArray(data)) return data;
  return cloneDeep(data).map((item) => {
    item.company.industry = getValueById(config, item.company.industry_id, 'industry_id');
    item.job.job_type_value = getValueById(config, item.job.job_type_id, 'job_type_id');
    item.job.xp_lvl.value = getValueById(config, item.job.xp_lvl?.id, 'xp_lvl_id');
    item.job.degree.value = getValueById(config,item.job.degree.id,'degree_id')
    item.job.location.value = getValueById(config,item.job.location.id,'location_id')
    return item
  });
}

const JobsCard = ({
  data,
  onChange,
  page,
  loadingList,
  totalPage,
  tabValue,
  lang,
  config
}: cardProps) => {
  const loading = useRef(null)
  const pageRef = useRef(null)
  const totalPageRef = useRef(null)
  useEffect(() => {
    loading.current = loadingList;
    pageRef.current = page;
    totalPageRef.current = totalPage;
  }, [page, loadingList, totalPage])

  useEffect(() => {
    window.addEventListener('scroll', useFn)
    return () => {
      window.removeEventListener('scroll', useFn)
    }
  }, [])

  // translate Data
 // const translatedData = (data) => translateData(data, config)

  const transTime = (time: string) => {
    return new Date().getTime() - new Date(time).getTime() > 1000 * 60 * 60 * 1
  }

  const handleLoadMore = () => {
    if (!loading.current && pageRef.current < totalPageRef.current) {
      onChange(pageRef.current + 1)
    }
  }

  const isTouchBottom = (handler) => {

    const width = document.body.clientWidth
    if (width < 751) {
      const showHeight = window.innerHeight
      const scrollTopHeight = document.body.scrollTop || document.documentElement.scrollTop
      const allHeight = document.body.scrollHeight
      if (allHeight <= showHeight + scrollTopHeight + 200) {
        handler()
      }
    }
  }

  const throttle = (func, delay) => {
    let timer = null
    return function () {
      if (!timer) {
        timer = setTimeout(() => {
          func()
          timer = null
        }, delay)
      }
    }
  }

  const useFn = throttle(() => {
    isTouchBottom(handleLoadMore)
  }, 300)


  const card = (data) => {
    return data?.map((item, index) => {
      const {
        name,
        industry
      } = item.company || {};
      const {
        job_title: jobTitle,
        salary_range_value: salaryRangeValue,
        job_type_value: jobType,
        status_key: status,
        job_url:jobUrl
      } = item.job || {};
      const { value: xpLvl } = item.job?.xp_lvl || {};
      const { value: location } = item.job?.location || {};
      const { value: degree } = item.job?.degree || {};
      const {
        avatar,
        full_name: fullName,
        last_active_at: lastActiveAt
      } = item.recruiter || {};
      const workJobTitle = item.recruiter?.work_experience?.job_title ;
      const same = isSameDay(item.created_at, data[index - 1]?.created_at)
      return (
        <div key={`${item.id}`}>
          {
            !same && item.created_at && <p className={styles.time}>{transDate(item.created_at?.substr(0, 10))}</p>
          }
          <div
            className={`${styles.jobCard}`} >
            {
              status === 'closed' ? <div className={styles.closed}></div> : null
            }

            <div className={styles.name}>
             {
               status === 'closed'  ? <a onClick={(e) => e.preventDefault()} >{jobTitle}</a> :  <Link  href={jobUrl || ''} >{jobTitle}</Link>
             }
              <span className={styles.salary}>{salaryRangeValue}</span>
            </div>
            <p className={styles.company}>{name}. {industry}</p>
            <span className={styles.tag}>{jobType}</span>
            <span className={styles.tag}>{xpLvl}</span>
            <span className={styles.tag}>{degree}</span>
            <div className={styles.contact}>
              <div
                className={`${styles.avator}  ${transTime(lastActiveAt) ? styles.avator2 : ''
                  }`}
              >
                <Image src={avatar} alt={fullName} width={20} height={20} />
              </div>
              <div className={styles.bottmBox}>
              <span className={styles.workJob}> {fullName} · {workJobTitle}</span>
              <span className={styles.location}>{location}</span>
              </div>
            </div>
          </div>
        </div>
      )
    })
  }

  const interviewCard = (data) => {
    return data?.map((item, index) => {
      const {jobseeker_display_status:status} = item
      const {
        name,
        logo_url:logoUrl
      } = item.company || {};
      const {
        salary_range_value: salaryRangeValue,
        status_key: statusJob,
        job_url:jobUrl,
        job_title:jobTitle
      } = item.job || {};
      const same = isSameDay(item.interviewed_at, data[index - 1]?.interviewed_at)
      return (
        <div key={`${item.id}`} className={styles.interviewed}>
          {
            !same && item.interviewed_at && <p className={styles.time}>{transDate(item.interviewed_at?.substr(0, 10))}</p>
          }
          <div
            className={`${styles.jobCard}`}
          >
            {
              statusJob === 'closed' ? <div className={styles.closed}></div> : null
            }
            <div className={styles.content}>
              <div className={styles.left}>
                <div className={styles.company}>
                <Image src={logoUrl} alt={name} width={24} height={24} />
                <span className={styles.name}>{name}</span>
                <span className={styles.status} style={{color : jobseekerDisplayStatusObject[status] || '#136FD3'}}>{status}</span>
                </div>
               <p className={styles.developer}>
                 <div className={styles.info}>
                 {
                   status === 'closed'  ? <a onClick={(e) => e.preventDefault()} >{jobTitle}</a> :  <Link  href={jobUrl || ''} >{jobTitle}</Link>
                 }
                 <span className={styles.salary}> {salaryRangeValue} </span>
                </div>
                <span  className={styles.times}>{item.interviewed_at?.substr(11, 5)}</span>
               </p>            
              </div>
            </div>
          </div>
        </div>
      )
    })
  }
console.log({tabValue},data)
  return (
    <>
      {
        tabValue === 'interview' ? interviewCard(data) : card( translateData(data,config))
      }
      <p className={styles.load}>{loadingList ? <CircularProgress  style={{margin:'10px 0'}}/> : page === totalPage ? lang?.noMore : ''}</p>

    </>
  )
}
export default JobsCard
