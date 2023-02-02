import React, { useState, useEffect, useRef } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Tabs, Tab } from '@mui/material'
import dynamic from 'next/dynamic'

/* Redux Actions */
import { fetchSavedJobsListRequest } from 'store/actions/jobs/fetchSavedJobsList'
import { fetchSavedJobDetailRequest } from 'store/actions/jobs/fetchSavedJobDetail'
import { deleteSaveJobRequest } from 'store/actions/jobs/deleteSaveJob'
import { postSaveJobRequest } from 'store/actions/jobs/postSaveJob'

import { fetchAppliedJobsListRequest } from 'store/actions/jobs/fetchAppliedJobsList'
import { fetchAppliedJobDetailRequest } from 'store/actions/jobs/fetchAppliedJobDetail'

import { withdrawAppliedJobRequest } from 'store/actions/jobs/withdrawAppliedJob'

import { postReportRequest } from 'store/actions/reports/postReport'

/* Components */
import Layout from 'components/Layout'
import SEO from 'components/SEO'
import Text from 'components/Text'
// import AdSlot from 'components/AdSlot'
import Link from 'components/Link'
import JobCard from 'components/JobCard'
import JobDetail from 'components/JobDetail'
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'

const ModalShare = dynamic(() => import('components/ModalShare'))
const ModalWithdrawApplication = dynamic(() => import('components/ModalWithdrawApplication'))
const ModalReportJob = dynamic(() => import('components/ModalReportJob'))

import JobCardLoader from 'components/Loader/JobCard'
import JobDetailLoader from 'components/Loader/JobDetail'

/* Helpers */
import { titleCase } from 'helpers/formatter'
import { getCookie } from 'helpers/cookies'
import useWindowDimensions from 'helpers/useWindowDimensions'

/* Styles */
import styles from './MyJobs.module.scss'
import MaterialButton from 'components/MaterialButton'

const theme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '79px',
          '&.MultiTab-root': {
            minHeight: '79px',
            textTransform: 'capitalize'
          }
        },
        scroller: {
          height: '55px'
        },
        flexContainer: {
          height: '55px'
        }
      }
    }
  }
})

interface IMyJobs {
  category?: string
  accessToken: string
  config: any
}

const MyJobs = ({ category, accessToken, config }: IMyJobs) => {
  const userCookie = getCookie('user') || null
  const prevScrollY = useRef(0)
  const router = useRouter()
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(width < 768)
  }, [width])
  // const isMobile = width < 768 ? true : false
  const isAppliedCategory = category === 'applied'
  const reportJobReasonList = config && config.inputs && config.inputs.report_job_reasons

  const [isSticky, setIsSticky] = useState(false)
  const [isShowReportJob, setIsShowReportJob] = useState(false)
  const [jobNumStart, setJobNumStart] = useState(1)
  const [jobNumEnd, setJobNumEnd] = useState(10)

  const cx = classNames.bind(styles)
  const isAppliedCategoryActive = cx({
    MyJobsMenuLinkIsActive: isAppliedCategory
  })
  const isSavedCategoryActive = cx({
    MyJobsMenuLinkIsActive: !isAppliedCategory
  })
  const isStickyClass = cx({ isSticky: isSticky })
  const [isLoadingJobDetails, setIsLoadingJobDetails] = useState(false)
  const [isLoadingJobList, setIsLoadingJobList] = useState(true)
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)

  const [jobsList, setJobsList] = useState<any>([])
  const [page, setPage] = useState(Number(router?.query?.page) || 1)
  const [totalPages, setTotalPages] = useState(null)
  const [totalNum, setTotalNum] = useState(0)
  const [applicationHistories, setApplicationHistories] = useState([])
  const [applicationUpdatedAt, setApplicationUpdatedAt] = useState(null)
  const [withdrawApplicationResult, setWithdrawApplicationResult] = useState(false)

  const [isShowModalShare, setIsShowModalShare] = useState(false)
  const [isShowModalWithdrawApplication, setIsShowModalWithdrawApplication] = useState(false)

  const appliedJobsListResponse = useSelector((store: any) => store.job.appliedJobsList.response)
  const isAppliedJobsListFetching = useSelector((store: any) => store.job.appliedJobsList.fetching)

  const appliedJobDetailResponse = useSelector((store: any) => store.job.appliedJobDetail.response)
  const isAppliedJobDetailFetching = useSelector(
    (store: any) => store.job.appliedJobDetail.fetching
  )
  const savedJobsListResponse = useSelector((store: any) => store.job.savedJobsList.response)
  const isSavedJobsListFetching = useSelector((store: any) => store.job.savedJobsList.fetching)

  const savedJobDetailResponse = useSelector((store: any) => store.job.savedJobDetail.response)
  const isSavedJobDetailFetching = useSelector((store: any) => store.job.savedJobDetail.fetching)

  const withdrawAppliedJobResponse = useSelector(
    (store: any) => store.job.withdrawAppliedJob.response
  )
  const isWithdrawAppliedJobFetching = useSelector(
    (store: any) => store.job.withdrawAppliedJob.fetching
  )

  const postReportResponse = useSelector((store: any) => store.reports.postReport.response)
  const isPostingReport = useSelector((store: any) => store.reports.postReport.fetching)

  useEffect(() => {
    window.addEventListener('scroll', updateScrollPosition)

    handleFetchMyJobsList()

    return () => window.removeEventListener('scroll', updateScrollPosition)
  }, [])

  useEffect(() => {
    const jobLength = jobsList?.length
    const size = Number(router?.query?.size) || 10

    setJobNumStart(jobLength > 0 ? (page - 1) * size + 1 : 1)
    setJobNumEnd(jobLength > 0 ? (page - 1) * size + jobLength : 10)
  }, [jobsList])

  useEffect(() => {
    handleFetchMyJobsList()
  }, [router.query])

  useEffect(() => {
    setIsLoadingJobDetails(
      isAppliedCategory ? isAppliedJobDetailFetching : isSavedJobDetailFetching
    )
  }, [isAppliedJobDetailFetching, isSavedJobDetailFetching])

  useEffect(() => {
    setIsLoadingJobList(isAppliedCategory ? isAppliedJobsListFetching : isSavedJobsListFetching)
  }, [isAppliedJobsListFetching, isSavedJobsListFetching])

  useEffect(() => {
    setJobsList(appliedJobsListResponse.data?.job_applications)
    setTotalPages(appliedJobsListResponse.data?.total_pages)
    setTotalNum(appliedJobsListResponse.data?.total_num)
  }, [appliedJobsListResponse])

  useEffect(() => {
    if (appliedJobDetailResponse) {
      setSelectedJob(appliedJobDetailResponse?.job)
      setApplicationUpdatedAt(appliedJobDetailResponse?.updated_at)
      setApplicationHistories(appliedJobDetailResponse?.application_histories)
    }
  }, [appliedJobDetailResponse])

  useEffect(() => {
    setJobsList(savedJobsListResponse.data?.saved_jobs)
    setTotalPages(savedJobsListResponse.data?.total_pages)
    setTotalNum(savedJobsListResponse.data?.total_num)

    if (savedJobsListResponse.data?.saved_jobs.length === 0) {
      setSelectedJob(null)
    }
  }, [savedJobsListResponse])

  useEffect(() => {
    savedJobDetailResponse ? setSelectedJob(savedJobDetailResponse?.job) : setSelectedJob(null)
  }, [savedJobDetailResponse])

  useEffect(() => {
    if (jobsList?.length > 0) {
      handleFetchJobDetail(jobsList?.[0].job.id, category)
      setSelectedJobId(jobsList?.[0].job.id)
    } else {
      setSelectedJobId(null)
    }
  }, [jobsList])

  useEffect(() => {
    if (withdrawAppliedJobResponse?.message === 'success') {
      handleFetchJobDetail(selectedJobId, category)
      setWithdrawApplicationResult(true)
    }
  }, [withdrawAppliedJobResponse])

  const updateScrollPosition = () => {
    if (!isMobile) {
      prevScrollY.current = window.pageYOffset
      setIsSticky(prevScrollY.current >= 201 ? true : false)
    }
  }

  const handleFetchMyJobsList = () => {
    const payload = {
      size: router.query?.size,
      page: router.query?.page ? Number(router.query.page) : 1
    }
    if (isAppliedCategory) {
      dispatch(fetchAppliedJobsListRequest(payload))
      return
    }

    dispatch(fetchSavedJobsListRequest(payload))
  }

  const handleSelectedJobId = (jobId, jobUrl, status) => {
    setSelectedJobId(jobId)
    handleFetchJobDetail(jobId, category)

    if (isMobile && status === 'active') {
      if (isAppliedCategory) {
        router.push(`${jobUrl}?isApplied=${isAppliedCategory}`)
      } else {
        router.push(jobUrl)
      }

      return
    }
  }

  const handleFetchJobDetail = (jobId, source) => {
    if (source === 'applied') {
      const appliedJobPayload = {
        jobId
      }
      dispatch(fetchAppliedJobDetailRequest(appliedJobPayload))
      return
    }

    const savedJobPayload = {
      jobId
    }

    dispatch(fetchSavedJobDetailRequest(savedJobPayload))
  }

  const handleWithdrawApplication = ({ jobId }) => {
    const payload = {
      jobId
    }
    dispatch(withdrawAppliedJobRequest(payload))
  }

  const handlePaginationClick = (event, val) => {
    setPage(val)

    router.query.page = val
    router.push(router, undefined, { shallow: true })

    document.documentElement.scrollTop = 0
  }

  const handlePostReportJob = (reportJobData) => {
    if (accessToken) {
      const postReportJobPayload = {
        reportJobData,
        accessToken
      }
      dispatch(postReportRequest(postReportJobPayload))
    }
  }

  const handlePostSaveJob = ({ jobId }) => {
    const postSaveJobPayload = {
      jobId,
      user_id: userCookie.id
    }
    dispatch(postSaveJobRequest(postSaveJobPayload))
  }

  const handleDeleteSavedJob = ({ jobId }) => {
    const deleteJobPayload = {
      jobId
    }
    dispatch(deleteSaveJobRequest(deleteJobPayload))
    handleFetchMyJobsList()
  }

  const emptyResult = () => {
    return (
      <div>
        <Text textStyle='xl' bold>
          You have not {category} for any job yet.
        </Text>

        <MaterialButton variant='contained' capitalize>
          <Link to='/jobs-hiring/job-search'>
            <Text bold textColor='white'>
              Back to job search
            </Text>
          </Link>
        </MaterialButton>
      </div>
    )
  }

  return (
    <Layout>
      <SEO
        title={`${titleCase(category)} Jobs - Career Platform for Professionals in Philippines`}
        description={'Bossjob - Career Platform for Professionals in Philippines'}
      />
      <div className={styles.myJobsMenuContent}>
        <div className={styles.container}>
          <ThemeProvider theme={theme}>
            <Tabs value={category}>
              <Tab
                className={styles.myJobsMenuTab}
                value='saved'
                label={
                  <Link
                    to={'/my-jobs/saved?page=1&size=10'}
                    className={classNamesCombined([styles.myJobsMenuLink, isSavedCategoryActive])}
                  >
                    <Text bold textStyle='lg'>
                      Saved Jobs
                    </Text>
                  </Link>
                }
              />
              <Tab
                className={styles.myJobsMenuTab}
                value='applied'
                label={
                  <Link
                    to={'/my-jobs/applied?page=1&size=10'}
                    className={classNamesCombined([styles.myJobsMenuLink, isAppliedCategoryActive])}
                  >
                    <Text bold textStyle='lg'>
                      Applied Jobs
                    </Text>
                  </Link>
                }
              />
            </Tabs>
          </ThemeProvider>
        </div>
      </div>

      <div className={styles.myJobs}>
        <div className={classNamesCombined([styles.myJobsMenu, isStickyClass])}>
          <div className={styles.container}>
            <div className={styles.myJobsListOptionContent}>
              {!isMobile && (
                <Text textStyle='base' bold>
                  {jobNumStart.toLocaleString()}-{jobNumEnd.toLocaleString()} of{' '}
                  {totalNum ? totalNum : 0} jobs
                </Text>
              )}
            </div>
          </div>
        </div>

        <div className={classNamesCombined([styles.container, styles.myJobsContent])}>
          <div className={styles.myJobsList}>
            <div className={styles.myJobsListContent}>
              {isLoadingJobList && (
                <React.Fragment>
                  <JobCardLoader />
                  <JobCardLoader />
                  <JobCardLoader />
                  <JobCardLoader />
                </React.Fragment>
              )}

              {jobsList?.length === 0 && !isLoadingJobList && (
                <div className={styles.myJobsDetailInfoEmptyMobile}>{emptyResult()}</div>
              )}

              {!isLoadingJobList &&
                jobsList?.map((jobs, i) => (
                  <JobCard
                    key={i}
                    id={jobs.id}
                    image={jobs?.company?.logo_url}
                    title={jobs?.job?.job_title}
                    company={jobs?.company?.name}
                    location={jobs?.job?.location?.value}
                    salary={jobs?.job?.salary_range_value}
                    postedAt={jobs?.job?.refreshed_at}
                    selectedId={selectedJobId}
                    status={jobs?.job?.status_key}
                    applicationStatus={jobs.status}
                    applicationUpdatedAt={jobs.updated_at}
                    handleSelectedId={() =>
                      handleSelectedJobId(jobs.job_id, jobs?.job?.job_url, jobs?.job?.status_key)
                    }
                    isCompanyVerified={jobs?.company?.is_verify}
                  />
                ))}
            </div>
            {selectedJob && (
              <div className={styles.paginationWrapper}>
                <MaterialRoundedPagination
                  onChange={handlePaginationClick}
                  defaultPage={1}
                  page={page}
                  totalPages={totalPages || 1}
                />
              </div>
            )}
          </div>
          <div className={styles.myJobsDetailInfoSection}>
            {isLoadingJobDetails && <JobDetailLoader />}
            {!isLoadingJobDetails && selectedJob && (
              <JobDetail
                selectedJob={selectedJob}
                jobDetailUrl={selectedJob?.['job_url']}
                companyUrl={selectedJob?.['company']?.['company_url']}
                isSticky={isSticky}
                category={category}
                applicationHistory={applicationHistories}
                applicationUpdatedAt={applicationUpdatedAt}
                setIsShowModalShare={setIsShowModalShare}
                setIsShowModalWithdrawApplication={setIsShowModalWithdrawApplication}
                setIsShowReportJob={setIsShowReportJob}
                handleDeleteSavedJob={handleDeleteSavedJob}
                handlePostSaveJob={handlePostSaveJob}
                config={config}
                isCompanyVerified={selectedJob.company.is_verify}
              />
            )}
            {jobsList?.length === 0 && !isLoadingJobList && (
              <div className={styles.myJobsDetailInfoEmpty}>{emptyResult()}</div>
            )}
          </div>

          {/* <div className={styles.myJobsAds}>
            <div className={styles.skyscraperBanner}>
              <AdSlot adSlot={'job-page-skyscraper-1'} />
            </div>
            <div className={styles.skyscraperBanner}>
              <AdSlot adSlot={'job-page-skyscraper-2'} />
            </div>
            <div className={styles.skyscraperBanner}>
              <AdSlot adSlot={'job-page-skyscraper-3'} />
            </div>
          </div> */}
        </div>
      </div>

      {isShowModalShare && (
        <ModalShare
          jobDetailUrl={selectedJob?.['job_url']}
          isShowModalShare={isShowModalShare}
          handleShowModalShare={setIsShowModalShare}
          selectedJob={selectedJob}
        />
      )}

      {isShowReportJob && (
        <ModalReportJob
          isShowReportJob={isShowReportJob}
          handleShowReportJob={setIsShowReportJob}
          reportJobReasonList={reportJobReasonList}
          selectedJobId={selectedJob?.['id']}
          handlePostReportJob={handlePostReportJob}
          isPostingReport={isPostingReport}
          postReportResponse={postReportResponse}
        />
      )}

      {isShowModalWithdrawApplication && (
        <ModalWithdrawApplication
          jobId={selectedJob?.['id']}
          isShowModalWithdrawApplication={isShowModalWithdrawApplication}
          handleShowModalWithdrawApplication={setIsShowModalWithdrawApplication}
          handleWithdrawApplication={handleWithdrawApplication}
          isWithdrawAppliedJobFetching={isWithdrawAppliedJobFetching}
          isWithdrawApplicationResult={withdrawApplicationResult}
        />
      )}
    </Layout>
  )
}

export default MyJobs
