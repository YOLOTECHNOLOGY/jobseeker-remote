'use client'
import React, { useEffect, useRef } from 'react';
import styles from './index.module.scss';
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { isSameDay, transDate } from 'helpers/utilities'
import CircularProgress from '@mui/material/CircularProgress';

interface cardProps {
  data: Array<any>,
  onChange: Function,
  page: number,
  loadingList: boolean,
  totalPage: number,
  tabValue: string
}

const JobsCard = ({
  data,
  onChange,
  page,
  loadingList,
  totalPage,
  tabValue,
}: cardProps) => {
  console.log(data, 77777888)
  const loading = useRef(null)
  const pageRef = useRef(null)
  const totalPageRef = useRef(null)
  const router = useRouter()
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


  const transTime = (time: string) => {
    return new Date().getTime() - new Date(time).getTime() > 1000 * 60 * 60 * 1
  }

  const handleLoadMore = () => {
    console.log(loading.current, pageRef.current, totalPageRef, 99999)
    if (!loading.current && pageRef.current < totalPageRef.current) {
      console.log('next page~')
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

  const goToJobDetail = (url: string) => {
    router.push(url)
  }

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
      } = item.job || {};
      const { value: xpLvl } = item.job?.xp_lvl || {};
      const { value: location } = item.job?.location || {};
      const { value: degree } = item.job?.degree || {};
      const {
        avatar,
        full_name: fullName,
        last_active_at: lastActiveAt
      } = item.recruiter || {};
      const same = isSameDay(item.created_at, data[index - 1]?.created_at)
      return (
        <div key={`${item.id}`} className={styles.communicated}>
          {
            !same && item.created_at && <p className={styles.time}>{transDate(item.created_at?.substr(0, 10))}</p>
          }
          <div
            className={`${styles.jobCard}`}

            onClick={() => goToJobDetail('')}
          >
            {
              status === 'closed' ? <div className={styles.closed}></div> : null
            }

            <div className={styles.name}>
              <p>{jobTitle}</p>
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
              {fullName}
              <span className={styles.location}>{location}</span>
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
      } = item.job || {};
      const same = isSameDay(item.interviewed_at, data[index - 1]?.interviewed_at)
      return (
        <div key={`${item.id}`} className={styles.interviewed}>
          {
            !same && item.interviewed_at && <p className={styles.time}>{transDate(item.interviewed_at?.substr(0, 10))}</p>
          }
          <div
            className={`${styles.jobCard}`}
            onClick={() => goToJobDetail('')}
          >
            {
              statusJob === 'closed' ? <div className={styles.closed}></div> : null
            }
            <div className={styles.content}>
              <div className={styles.left}>
                <div className={styles.company}>
                <Image src={logoUrl} alt={name} width={24} height={24} />
                <span className={styles.name}>{name}</span>
                <span className={styles.status}>{status}</span>
                </div>
               <p className={styles.developer}>
                 <div className={styles.info}>
                 <span className={styles.job}>Java Developer (work from home)...Java Developer (work from home)...</span>
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


  return (
    <>
      {
        tabValue === 'interview' ? interviewCard(data) : card(data)
      }
      <p className={styles.load}>{loadingList ? <CircularProgress /> : page === totalPage ? 'No more' : ''}</p>

    </>
  )
}
export default JobsCard
