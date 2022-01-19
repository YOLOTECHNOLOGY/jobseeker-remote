import React, { useState, useEffect } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import moment from 'moment'
import slugify from 'slugify'
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'
import { Tabs, Tab } from '@mui/material'

/* Redux Actions */
import { fetchSavedJobsListRequest } from 'store/actions/jobs/fetchSavedJobsList'
import { fetchAppliedJobsListRequest } from 'store/actions/jobs/fetchAppliedJobsList'
import { fetchJobDetailRequest } from 'store/actions/jobs/fetchJobDetail'

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
import { numberToThousands } from 'helpers/formatter'
import useWindowDimensions from 'helpers/useWindowDimensions'

/* Styles */
import styles from './MyJobs.module.scss'

interface IMyJobs {
  category?: string
}

const MyJobs = ({
  category
}: IMyJobs) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const isAppliedCategory = category === 'applied'

  const cx = classNames.bind(styles)
  const isAppliedCategoryActive = cx({ MyJobsMenuLinkIsActive: isAppliedCategory})
  const isSavedCategoryActive = cx({ MyJobsMenuLinkIsActive: !isAppliedCategory})

  const [selectedJobId, setSelectedJobId] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [isShowModalShare, setIsShowModalShare] = useState(false)
  const [isShowModalWithdrawApplication, setIsShowModalWithdrawApplication] = useState(false)

  const appliedJobsListResponse = useSelector((store: any) => store.job.appliedJobsList.response)
  const isAppliedJobsListFetching = useSelector((store: any) => store.job.appliedJobsList.fetching)

  const savedJobsListResponse = useSelector((store: any) => store.job.savedJobsList.response)
  const isSavedJobsListFetching = useSelector((store: any) => store.job.savedJobsList.fetching)
  
  const jobDetailResponse = useSelector((store: any) => store.job.jobDetail.response)
  const isJobDetailFetching = useSelector((store: any) => store.job.jobDetail.fetching)


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
    if (appliedJobsListResponse?.data?.job_applications.length > 0) {
      handleFetchJobDetail(appliedJobsListResponse.data?.job_applications?.[0].job.job_id) 
      setSelectedJobId(appliedJobsListResponse.data?.job_applications?.[0].job.job_id)
    } 
  }, [appliedJobsListResponse])

  useEffect(() => {
    if (savedJobsListResponse?.data?.saved_jobs.length > 0) {
      handleFetchJobDetail(savedJobsListResponse.data?.saved_jobs?.[0].job.id) 
      setSelectedJobId(savedJobsListResponse.data?.saved_jobs?.[0].job.id)
    }
  }, [savedJobsListResponse])

  useEffect(() => {
    if (jobDetailResponse) setSelectedJob(jobDetailResponse)
  }, [jobDetailResponse])

  useEffect(() => {
    if (selectedJobId) dispatch(handleFetchJobDetail(selectedJobId))
  }, [selectedJobId])

  const handleSelectedJobId = (jobId) => {
    if (width < 768) {
      router.push(`/job/${slugify(selectedJob?.['job_title'] || '', { lower: true, remove: /[*+~.()'"!:@]/g })}-${selectedJob?.['id']}?isApplied=${isAppliedCategory}`)
      return
    }
    setSelectedJobId(jobId)
  }
  const handleFetchJobDetail = (jobId) => dispatch(fetchJobDetailRequest({jobId, status: 'protected'}))

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
            {!isSavedJobsListFetching && !isAppliedCategory && savedJobsListResponse?.data?.saved_jobs.map((jobSaved) => (
              <JobCard
                key={jobSaved.id}
                id={jobSaved.id}
                image={jobSaved.job.company_logo}
                title={jobSaved.job.job_title}
                company={jobSaved.job.company_name}
                location={jobSaved.job.location_value}
                salary={jobSaved.job.salary_range_value}
                postedAt={jobSaved.job.published_at}
                selectedId={selectedJobId}
                handleSelectedId={() => handleSelectedJobId(jobSaved.job.id)}
              />
            ))}
            {!isAppliedJobsListFetching && isAppliedCategory && appliedJobsListResponse?.data?.job_applications.map((jobApplication) => (
              <JobCard
                key={jobApplication.job.job_id}
                id={jobApplication.job.job_id}
                image={jobApplication.company.logo}
                title={jobApplication.job.job_title}
                company={jobApplication.company.name}
                location={jobApplication.job.job_location}
                salary={`${numberToThousands(jobApplication.job.salary_range_from)}K - ${numberToThousands(jobApplication.job.salary_range_to)}K` }
                postedAt={`${moment(new Date(jobApplication.created_at)).format('DD MMMM YYYY')}`}
                selectedId={selectedJobId}
                handleSelectedId={() => {
                  handleSelectedJobId(jobApplication.job.job_id)
                }}
              />
            ))}
          </div>
          <div className={styles.paginationWrapper}>
            <MaterialRoundedPagination onChange={handlePaginationClick} defaultPage={1} totalPages={appliedJobsListResponse?.data?.totalPages} />
          </div>
        </div>
        <div className={styles.MyJobsDetailInfoSection}>
          {(isJobDetailFetching || isAppliedJobsListFetching || isSavedJobsListFetching) && (
            <JobDetailLoader />
          )}
          {!isJobDetailFetching && selectedJob && (
            <JobDetail 
              selectedJob={selectedJob}
              jobDetailUrl={jobDetailUrl}
              companyUrl={companyUrl}
              category={category}
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