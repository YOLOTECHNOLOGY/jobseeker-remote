import React, { useState, useEffect, useRef } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import slugify from 'slugify'
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'
import { Tabs, Tab } from '@mui/material'

/* Redux Actions */
import { fetchSavedJobsListRequest } from 'store/actions/jobs/fetchSavedJobsList'
import { fetchSavedJobDetailRequest } from 'store/actions/jobs/fetchSavedJobDetail'

import { fetchAppliedJobsListRequest } from 'store/actions/jobs/fetchAppliedJobsList'
import { fetchAppliedJobDetailRequest } from 'store/actions/jobs/fetchAppliedJobDetail'

/* Components */
import Layout from 'components/Layout'
import SEO from 'components/SEO'
import Text from 'components/Text'
import AdSlot from 'components/AdSlot'
import Link from 'components/Link'
import JobCard from 'components/JobCard'
import JobDetail from 'components/JobDetail'
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'

import ModalShare from 'components/ModalShare'
import ModalWithdrawApplication from 'components/ModalWithdrawApplication'

import JobCardLoader from 'components/Loader/JobCard'
import JobDetailLoader from 'components/Loader/JobDetail'

/* Helpers */
import useWindowDimensions from 'helpers/useWindowDimensions'

/* Styles */
import styles from './MyJobs.module.scss'

interface IMyJobs {
  category?: string
}

const MyJobs = ({
  category
}: IMyJobs) => {
  const prevScrollY = useRef(0)
  const router = useRouter()
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const isAppliedCategory = category === 'applied'
  
  const [isSticky, setIsSticky] = useState(false)

  const cx = classNames.bind(styles)
  const isAppliedCategoryActive = cx({ MyJobsMenuLinkIsActive: isAppliedCategory})
  const isSavedCategoryActive = cx({ MyJobsMenuLinkIsActive: !isAppliedCategory})

  const [selectedJobId, setSelectedJobId] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)

  const [jobsList, setJobsList] = useState([])
  const [totalPages, setTotalPages] = useState(null)
  const [applicationHistories, setApplicationHistories] = useState([])

  const [isShowModalShare, setIsShowModalShare] = useState(false)
  const [isShowModalWithdrawApplication, setIsShowModalWithdrawApplication] = useState(false)

  const appliedJobsListResponse = useSelector((store: any) => store.job.appliedJobsList.response)
  const isAppliedJobsListFetching = useSelector((store: any) => store.job.appliedJobsList.fetching)

  const appliedJobDetailResponse = useSelector((store: any) => store.job.appliedJobDetail.response)
  const isAppliedJobDetailFetching = useSelector((store: any) => store.job.appliedJobDetail.fetching)

  const savedJobsListResponse = useSelector((store: any) => store.job.savedJobsList.response)
  const isSavedJobsListFetching = useSelector((store: any) => store.job.savedJobsList.fetching)

  const savedJobDetailResponse = useSelector((store: any) => store.job.savedJobDetail.response)
  const isSavedJobDetailFetching = useSelector((store: any) => store.job.savedJobDetail.fetching)
  
  useEffect(() => {
    window.addEventListener('scroll', updateScrollPosition)
    return () => window.removeEventListener('scroll', updateScrollPosition)
  }, [])

  useEffect(() => {
    const payload = {
      size: router.query?.size,
      page: router.query?.page ? Number(router.query.page) : 1,
    }
    if (isAppliedCategory) {
      dispatch(fetchAppliedJobsListRequest(payload))
      return
    }

    dispatch(fetchSavedJobsListRequest(payload))
  }, [router.query])

  useEffect(() => {
    if (appliedJobsListResponse?.data?.applied_jobs.length > 0) {
      setJobsList(appliedJobsListResponse.data?.applied_jobs)
      setTotalPages(appliedJobsListResponse.data?.total_pages)
    } 
  }, [appliedJobsListResponse])

  useEffect(() => {
    if (appliedJobDetailResponse) {
      setSelectedJob(appliedJobDetailResponse?.job)
      setApplicationHistories(appliedJobDetailResponse?.application_histories)
    }
  }, [appliedJobDetailResponse])

  useEffect(() => {
    if (savedJobsListResponse?.data?.saved_jobs.length > 0) {
      setJobsList(savedJobsListResponse.data?.saved_jobs)
      setTotalPages(savedJobDetailResponse.data?.total_pages)
    }
  }, [savedJobsListResponse])

  useEffect(() => {
    if (savedJobDetailResponse) setSelectedJob(savedJobDetailResponse?.job)
  }, [savedJobDetailResponse])

  useEffect(() => {
    if (jobsList?.length > 0) {
      handleFetchJobDetail(jobsList?.[0].id, category) 
      setSelectedJobId(jobsList?.[0].id)
    }
  }, [jobsList])

  useEffect(() => {
    handleFetchJobDetail(selectedJobId, category) 
  }, [selectedJobId])

  const updateScrollPosition = () => {
    if (width > 798) {
      prevScrollY.current = window.pageYOffset
      setIsSticky(prevScrollY.current >= 69 ? true : false)
    }
  }

  const handleSelectedJobId = (jobId) => {
    if (width < 768) {
      router.push(`/job/${slugify(selectedJob?.['job_title'] || '', { lower: true, remove: /[*+~.()'"!:@]/g })}-${selectedJob?.['id']}?isApplied=${isAppliedCategory}`)
      return
    }
    setSelectedJobId(jobId)
  }

  const handleFetchJobDetail = (id, source) => {
    if (source === 'applied') {
      dispatch(fetchAppliedJobDetailRequest(id))
      return
    }
    
    dispatch(fetchSavedJobDetailRequest(id))
  }

  const handlePaginationClick = (event, val) => {
    router.query.page = val
    router.push(router, undefined, { shallow: true })
  }

  const handleFormatWindowUrl = (pathname, name, id) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/${pathname}/${slugify(name || '', { lower: true, remove: /[*+~.()'"!:@]/g })}-${id}`
    }
    return ''
  }

  const jobDetailUrl = handleFormatWindowUrl('job', selectedJob?.['job_title'], selectedJob?.['id'])
  const companyUrl = handleFormatWindowUrl('company', selectedJob?.['company']?.['name'], selectedJob?.['company']?.['id'])

  return (
    <Layout>
      <SEO title={"Job Title"} description={"Job Description"} />
      <div className={styles.MyJobs}>
        <div className={styles.MyJobsList}>
          <Tabs
            value={category}
            className={classNamesCombined([styles.MyJobsMenu])}
          >
            <Tab 
              className={styles.MyJobsMenuTab}
              value="saved" 
              label={
                <Link 
                  to={'/my-jobs/saved?page=1&size=10'}
                  className={classNamesCombined([styles.MyJobsMenuLink, isSavedCategoryActive])}
                >
                  <Text bold>
                    Saved Jobs
                  </Text>
                </Link>
              }
            />
            <Tab 
              className={styles.MyJobsMenuTab}
              value="applied" 
              label={
                <Link 
                  to={'/my-jobs/applied?page=1&size=10'}
                  className={classNamesCombined([styles.MyJobsMenuLink, isAppliedCategoryActive])}
                >
                  <Text bold>
                    Applied Jobs
                  </Text>
                </Link>
              }
            />
          </Tabs>
          <div className={styles.MyJobsListContent}>
            {isAppliedJobsListFetching || isSavedJobsListFetching && (
              <React.Fragment>
                <JobCardLoader />
                <JobCardLoader />
                <JobCardLoader />
                <JobCardLoader />
              </React.Fragment>
            )}
            {(!isSavedJobsListFetching || !isAppliedJobsListFetching) && jobsList?.map((jobs) => (
              <JobCard
                key={jobs.id}
                id={jobs.id}
                image={jobs.job.company_logo}
                title={jobs.job.job_title}
                company={jobs.job.company_name}
                location={jobs.job.location_value}
                salary={jobs.job.salary_range_value}
                postedAt={jobs.job.published_at}
                selectedId={selectedJobId}
                handleSelectedId={() => handleSelectedJobId(jobs.id)}
              />
            ))}
          </div>
          <div className={styles.paginationWrapper}>
            <MaterialRoundedPagination onChange={handlePaginationClick} defaultPage={1} totalPages={totalPages} />
          </div>
        </div>
        <div className={styles.MyJobsDetailInfoSection}>
          {(isAppliedJobDetailFetching || isSavedJobDetailFetching) || (isAppliedJobsListFetching || isSavedJobsListFetching) && (
            <JobDetailLoader />
          )}
          {(!isAppliedJobDetailFetching || !isSavedJobDetailFetching) && selectedJob?.id && (
            <JobDetail 
              selectedJob={selectedJob}
              jobDetailUrl={jobDetailUrl}
              companyUrl={companyUrl}
              isSticky={isSticky}
              category={category}
              applicationHistory={applicationHistories}
              setIsShowModalShare={setIsShowModalShare}
              setIsShowModalWithdrawApplication={setIsShowModalWithdrawApplication}
            />
          )}
        </div>
        <div className={styles.MyJobsAds}>
          <div className={styles.skyscraperBanner}>
            <AdSlot adSlot={'job-page-skyscraper-1'} />
          </div>
          <div className={styles.skyscraperBanner}>
            <AdSlot adSlot={'job-page-skyscraper-2'} />
          </div>
          <div className={styles.skyscraperBanner}>
            <AdSlot adSlot={'job-page-skyscraper-3'} />
          </div>
        </div>
      </div>

      <ModalShare
        jobDetailUrl={jobDetailUrl}
        isShowModalShare={isShowModalShare}
        handleShowModalShare={setIsShowModalShare}
      />
      <ModalWithdrawApplication
        isShowModalWithdrawApplication={isShowModalWithdrawApplication}
        handleShowModalWithdrawApplication={setIsShowModalWithdrawApplication}
      />
    </Layout>
  )
}

export default MyJobs