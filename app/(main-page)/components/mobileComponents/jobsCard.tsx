'use client'
import React, { useEffect, useState, useRef } from 'react'
import styles from 'app/index.module.scss'
import { fetchJobsForYou } from 'store/services/jobs/fetchJobsForYou'
import {
  fetchJobsForYouLogin,
  fetchJobsPreferences
} from 'store/services/jobs/fetchJobsForYouLogin'
import { useRouter } from 'next/navigation'
import { getCookie, setCookie } from 'helpers/cookies'
import Image from 'next/image'
import ClearIcon from '@mui/icons-material/Clear'
import { getValueById } from 'helpers/config/getValueById'
import { addJobViewService } from 'store/services/jobs/addJobView'
import { isMobile } from 'react-device-detect'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
const pageParams = {
  size: 20,
  sort: 1,
  source: 'web'
}

const JobsCard = ({ lang, config, langKey, location_id }: any) => {
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
  const jobseekerPrefIdRef = useRef(null)
  const [visibleStarted, setVisibleStarted] = useState<boolean>(false)

  useEffect(() => {
    dataRef.current = []
    getList({ page: current, job_location_ids: location_id, ...pageParams })
    window.addEventListener('scroll', useFn)
    return () => {
      window.removeEventListener('scroll', useFn)
    }
  }, [location_id])

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
        jobseekerPrefIdRef.current = perData?.data?.data
        fetchJobsLogin(params)
      } else {
        fetchJobsLogin(params)
      }
    } else {
      fetchJobsForYouFun(params)
    }
  }

  const fetchJobsLogin = (params) => {
    const id = jobseekerPrefIdRef.current?.[0]?.id
    if (id) {
      fetchJobsForYouLogin(
        {
          jobseekerPrefId: id,
          page: params.page,
          size: params.size
          // sort: 2
        },
        accessToken
      ).then((res) => {
        const data = res?.data?.data
        changeData(data)
      })
    } else {
      fetchJobsForYouFun(params)
    }
  }

  const fetchJobsForYouFun = (params) => {
    fetchJobsForYou(params).then((res) => {
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

      const dom = document.getElementById('getStartedContainer')
      const domTopHeight = dom.offsetTop
      // 页面高度 - dom距离顶部的高度
      const space = scrollTopHeight - domTopHeight
      const iscloseStrated = sessionStorage.getItem('closeStrated')
      if (space > -10 && !iscloseStrated && !accessToken) {
        setVisibleStarted(true)
      } else {
        setVisibleStarted(false)
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

  const handleAddJobView = async (url: string, id: any, reco_from) => {
    const params = {
      jobId: id,
      source: 'home', // this is usually used in search result
      status: accessToken ? 'protected' : 'public',
      device: isMobile ? 'mobile_web' : 'web',
      reco_from: reco_from ? reco_from : null
    }
    setCookie('source', 'home')
    setCookie('reco_from', reco_from)
    // await addJobViewService(params)
    await goToJobDetail(url)
  }

  const goToJobDetail = (url: string) => {
    router.push('/' + langKey + url)
  }

  const getStarted = () => {
    router.push('/' + langKey + '/get-started')
  }

  const getPreference = () => {
    router.push('/' + langKey + '/manage-profile?tab=job-preferences')
  }

  const tipsFun = (
    <p className={styles.tips}>
      {accessToken ? (
        <>
          {lang.jobCard.basedOnYou}{' '}
          <span className={styles.preference} onClick={getPreference}>
            {lang.jobPrefer}
          </span>
        </>
      ) : (
        <>
          {lang.jobCard.needMatches}
          <span className={styles.started} onClick={getStarted}>
            {lang.jobCard.getStart}
          </span>
        </>
      )}
    </p>
  )

  const closeFun = () => {
    sessionStorage.setItem('closeStrated', '1')
    setVisibleStarted(false)
  }

  return (
    <>
      <div id='getStartedContainer'>{tipsFun}</div>
      {jobs?.map((item, index) => {
        const {
          id: Id,
          job_title: jobTitle,
          local_salary_range_value: salaryRangeValue,
          // job_location: jobLocation,
          job_location_id: job_location_id,
          job_url: jobUrl,
          //  job_type: jobType,
          job_type_id,
          // xp_lvl: xpLvl,
          xp_lvl_id,
          // degree,
          degree_id,
          recruiter_avatar: recruiterAvatar,
          recruiter_full_name: recruiterFullName,
          company_name: companyName,
          recruiter_last_active_at: recruiterLastActiveAt,
          recruiter_job_title: recruiterJobTitle,
          reco_from
        } = item || {}
        const jobLocation = getValueById(config, job_location_id, 'location_id')
        const jobType = getValueById(config, job_type_id, 'job_type_id')
        const xpLvlValue = getValueById(config, xp_lvl_id, 'xp_lvl_id')
        const degreeValue = getValueById(config, degree_id, 'degree_id')
        // const industry =  getValueById(config,detail?.company_industry_id,'industry_id')
        return (
          <div
            className={styles.jobCard}
            key={`${Id}-${index}`}
            onClick={() => handleAddJobView(jobUrl, Id, reco_from)}
          >
            <div className={styles.name}>
              <p className={styles.jobName}>{jobTitle}</p>
              <span className={styles.salary}>{salaryRangeValue}</span>
            </div>
            <p className={styles.company}>{companyName}</p>
            <span className={styles.tag}>{jobType}</span>
            <span className={styles.tag}>{xpLvlValue}</span>
            <span className={styles.tag}>{degreeValue}</span>
            <div className={styles.contact}>
              <div className={styles.hrFullInfo}>
                <div
                  className={`${styles.avator}  ${
                    transTime(recruiterLastActiveAt) ? styles.avator2 : ''
                  }`}
                >
                  <Image src={recruiterAvatar} alt={recruiterFullName} width={20} height={20} />
                </div>
                <span>{[recruiterFullName, recruiterJobTitle].filter((a) => a).join(' · ')}</span>
              </div>
              <span className={styles.location}>{jobLocation}</span>
            </div>
          </div>
        )
      })}
      {visibleStarted ? (
        <div className={styles.startedContainer}>
          {<ClearIcon className={styles.close} onClick={closeFun} style={{ color: '#fff' }} />}{' '}
          {tipsFun}
        </div>
      ) : null}
      <p className={styles.load}>{loading ?  <Box sx={{ display: 'flex',justifyContent:'center',marginTop:'20px' }}>
      <CircularProgress size={24}/>
    </Box> : current === totalPage ? 'No more' : ''}</p>
    </>
  )
}
export default JobsCard
