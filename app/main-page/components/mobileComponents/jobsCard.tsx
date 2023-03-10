'use client'
import React, { useEffect, useState, useRef } from 'react';
import styles from './index.module.scss';
import { fetchJobsForYou } from 'store/services/jobs/fetchJobsForYou';
import {
  fetchJobsForYouLogin,
  fetchJobsPreferences
} from 'store/services/jobs/fetchJobsForYouLogin';
import { useRouter } from 'next/navigation';
import { getCookie } from 'helpers/cookies';
import ClearIcon from '@mui/icons-material/Clear';

const pageParams = {
  size: 20,
  sort: 1,
  source: 'web',
  job_locations: 'Manila'
}



const JobsCard = () => {
  const router = useRouter()
  const accessToken = getCookie('accessToken')
  const [current, setCurrent] = useState<number>(1)
  const [jobs, setJobs] = useState<Array<any>>([])
  const [isMore, setIsMore] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [totalPage, setTotalPage] = useState<number>(0)
  const isMoreRef = useRef<boolean>(null)
  const loadingRef = useRef<boolean>(null)
  const currentRef = useRef<number>(null)
  const dataRef = useRef<Array<any>>(null)
  const jobseekerPrefIdRef = useRef<number>(null)
  const [visibleStarted, setVisibleStarted] = useState<boolean>(false)

  useEffect(() => {
    getList({ page: current, ...pageParams })
    window.addEventListener('scroll', useFn)
    return () => {
      window.removeEventListener('scroll', useFn)
    }
  }, [])

  useEffect(() => {
    currentRef.current = current
  }, [current])
  useEffect(() => {
    loadingRef.current = loading
  }, [loading])
  useEffect(() => {
    isMoreRef.current = isMore
  }, [isMore])

  const getList = async (params: any) => {
    if (accessToken) {
      if (!jobseekerPrefIdRef.current) {
        const perData = await fetchJobsPreferences()
        jobseekerPrefIdRef.current = perData?.data?.data?.[0]?.id
        fetchJobsLogin(params)
      } else {
        fetchJobsLogin(params)
      }
    } else {
      fetchJobsForYou(params).then((res) => {
        const data = res?.data?.data
        changeData(data)
      })
    }
  }

  const fetchJobsLogin = (params) => {
    fetchJobsForYouLogin(
      {
        jobseekerPrefId: jobseekerPrefIdRef.current,
        page: params.page,
        size: params.size
      },
      accessToken
    ).then((res) => {
      const data = res?.data?.data
      changeData(data)
    })
  }

  const changeData = (data) => {
    if (data) {
      const oldData = dataRef.current ? dataRef.current.concat(data?.jobs) : data?.jobs
      dataRef.current = oldData
      setJobs([...oldData] || [])
      setTotalPage(data.total_pages)
      if (currentRef.current >= data.total_pages) {
        setIsMore(false)
      } else {
        setIsMore(true)
      }
      setLoading(false)
    }
  }

  const transTime = (time: string) => {
    return new Date().getTime() - new Date(time).getTime() > 1000 * 60 * 60 * 1
  }

  const handleLoadMore = () => {
    if (!loadingRef.current && isMoreRef.current) {
      const page = currentRef.current + 1
      setCurrent(page)
      setLoading(true)
      console.log('next page~')
      getList({ page, ...pageParams })
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
      
       const dom = document.getElementById('getStartedContainer'); 
       const domTopHeight = dom.offsetTop;
       // 页面高度 - dom距离顶部的高度
       const space =   scrollTopHeight - domTopHeight;
       const iscloseStrated = sessionStorage.getItem('closeStrated')
      if(space > -10 && !iscloseStrated){
        setVisibleStarted(true)
      }else{
        setVisibleStarted(false)
      }
    }
  }

  const throttle = (func, delay) => {
    let timer = null
    return function (...args) {
      if (!timer) {
        timer = setTimeout(() => {
          func.apply(this, args)
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

  const getStarted = () => {
    router.push('/get-started')
  }

  const tipsFun = <p className={styles.tips} >
  Want more accurate matches?
  <span className={styles.started} onClick={getStarted}>
    Get Started
  </span>
</p>
 

 const closeFun = () => {
    sessionStorage.setItem('closeStrated','1');
    setVisibleStarted(false);
 }

  return (
    <>
      <div id="getStartedContainer">
        {tipsFun}
      </div> 
      {jobs?.map((item, index) => {
        const {
          id: Id,
          job_title: jobTitle,
          salary_range_value: salaryRangeValue,
          job_location: jobLocation,
          job_url: jobUrl,
          job_type: jobType,
          xp_lvl: xpLvl,
          degree,
          recruiter_avatar: recruiterAvatar,
          recruiter_full_name: recruiterFullName,
          company_name: companyName,
          recruiter_last_active_at: recruiterLastActiveAt
        } = item || {}
        return (
          <div
            className={styles.jobCard}
            key={`${Id}-${index}`}
            onClick={() => goToJobDetail(jobUrl)}
          >
            <div className={styles.name}>
              <p>{jobTitle}</p>
              <span className={styles.salary}>{salaryRangeValue}</span>
            </div>
            <p className={styles.company}>{companyName}</p>
            <span className={styles.tag}>{jobType}</span>
            <span className={styles.tag}>{xpLvl}</span>
            <span className={styles.tag}>{degree}</span>
            <div className={styles.contact}>
              <div
                className={`${styles.avator}  ${
                  transTime(recruiterLastActiveAt) ? styles.avator2 : ''
                }`}
              >
                <img src={recruiterAvatar} alt={recruiterFullName} />
              </div>
              {recruiterFullName}
              <span className={styles.location}>{jobLocation}</span>
            </div>
          </div>
        )
      })}
      {
        visibleStarted ? (
          <div  className={styles.startedContainer}> 
          {<ClearIcon className={styles.close} onClick={closeFun} style={{color:"#fff"}}/>} {tipsFun}
       </div>
        ) : null
      }
      <p className={styles.load}>{loading ? 'Loading~' : current === totalPage ? 'No more' : ''}</p>
     
    </>
  )
}
export default JobsCard
