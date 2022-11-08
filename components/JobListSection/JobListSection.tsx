import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

/* Vendors */
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'
import dynamic from 'next/dynamic'

/* Redux Actions */
import { openManageJobAlertsModal } from 'store/actions/modals/manageJobAlertsModal'

/* Components */
import Text from 'components/Text'
import JobCard from 'components/JobCard'
import JobDetail from 'components/JobDetail'
import AdSlot from 'components/AdSlot'
import UploadResumeButton from 'components/LncreaseUserConversion/UploadResumeButton/UploadResumeButton'

import JobCardLoader from 'components/Loader/JobCard'
import JobDetailLoader from 'components/Loader/JobDetail'

const ModalShare = dynamic(() => import('components/ModalShare'))
const ModalJobAlerts = dynamic(() => import('components/ModalJobAlerts'))
const ModalReportJob = dynamic(() => import('components/ModalReportJob'))

/* Material Components */
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'

/* Helpers */
import useWindowDimensions from 'helpers/useWindowDimensions'

/* Styles */
import styles from './JobListSection.module.scss'

/* Images */
import { BellIcon } from 'images'

interface JobListSectionProps {
  page: number
  jobList?: any
  query?: string
  jobAlertsList?: any
  createdJobAlert?: Object
  fetchJobAlertsList?: Function
  deleteJobAlert?: Function
  isDeletingJobAlert?: boolean
  updateJobAlert?: Function
  isUpdatingJobAlert?: boolean
  createJobAlert?: Function
  isCreatingJobAlert?: boolean
  location?: any
  isJobListFetching?: boolean
  selectedJob?: Object
  selectedJobId?: number
  handleSelectedJobId?: Function
  totalPages?: number
  isJobDetailFetching?: boolean
  reportJobReasonList?: any
  handlePostReportJob?: Function
  handlePostSaveJob?: Function
  handleDeleteSavedJob?: Function
  accessToken: string
  postReportResponse?: any
  isPostingReport?: boolean
  config: any,
}

const JobListSection = ({
  page,
  jobList,
  query,
  fetchJobAlertsList,
  jobAlertsList,
  createdJobAlert,
  deleteJobAlert,
  isDeletingJobAlert,
  updateJobAlert,
  isUpdatingJobAlert,
  createJobAlert,
  isCreatingJobAlert,
  location,
  isJobListFetching,
  selectedJob,
  selectedJobId,
  handleSelectedJobId,
  totalPages,
  isJobDetailFetching,
  reportJobReasonList,
  handlePostReportJob,
  handlePostSaveJob,
  handleDeleteSavedJob,
  accessToken,
  postReportResponse,
  isPostingReport,
  config
}: JobListSectionProps) => {
  const { width } = useWindowDimensions()
  const router = useRouter()
  const prevScrollY = useRef(0)
  const dispatch = useDispatch()

  const [isSticky, setIsSticky] = useState(false)
  const [jobNumStart, setJobNumStart] = useState(0)
  const [jobNumEnd, setJobNumEnd] = useState(30)

  const [isShowModalShare, setIsShowModalShare] = useState(false)
  const [isShowReportJob, setIsShowReportJob] = useState(false)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
  const [selectedPage, setSelectedPage] = useState(page)

  const cx = classNames.bind(styles)
  const isStickyClass = cx({ isSticky: isSticky })

  const filterJobPayload = useSelector((store: any) => store.job.jobList.payload)

  useEffect(() => {
    setIsUserAuthenticated(accessToken ? true : false)
    window.addEventListener('scroll', updateScrollPosition)

    return () => window.removeEventListener('scroll', updateScrollPosition)
  }, [])

  useEffect(() => {
    setSelectedPage(router.query.page ? Number(router.query.page) : 1)
    document.documentElement.scrollTop = 0
  }, [router.query.page])

  useEffect(() => {
    setJobNumStart((jobList?.page - 1) * jobList?.size + 1)
    setJobNumEnd(
      jobList?.jobs.length > 0 ? (jobList?.page - 1) * jobList?.size + jobList?.jobs.length : 30
    )
  }, [jobList])

  const handlePaginationClick = (event, val) => {
    router.query.page = val
    router.push(router, undefined, { shallow: true })
  }

  const handleCreateJobAlertData = (email) => {
    const createJobAlertPayload = {
      email: email,
      keyword: filterJobPayload?.query ? filterJobPayload.query : '',
      location_values: filterJobPayload?.location ? filterJobPayload.location : 'all',
      job_type_values: filterJobPayload?.jobType ? filterJobPayload.jobType : 'all',
      salary_range_values: filterJobPayload?.salary ? filterJobPayload.salary : 'all',
      job_category_values: filterJobPayload?.category ? filterJobPayload.category : 'all',
      industry_values: filterJobPayload?.industry ? filterJobPayload.industry : 'all',
      xp_lvl_values: filterJobPayload?.workExperience ? filterJobPayload.workExperience : 'all',
      degree_values: filterJobPayload?.qualification ? filterJobPayload.qualification : 'all',
      is_company_verified: 'all',
      frequency_id: 1
    }

    createJobAlert(createJobAlertPayload)
  }

  const handleCreateJobAlert = (email?: any) => {
    handleCreateJobAlertData(email)
  }

  const updateScrollPosition = () => {
    if (width > 798) {
      prevScrollY.current = window.pageYOffset
      setIsSticky(prevScrollY.current >= 256 ? true : false)
    }
  }

  const handleQuickUploadResumeClick = () => {
    router.push('/quick-upload-resume')
  }

  const emptyResult = () => {
    return (
      <React.Fragment>
        <Text textStyle='xl' bold>
          We couldn't find any jobs matching your search.
        </Text>
        <Text textStyle='md'>Check the spelling and adjust the filter criteria.</Text>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <div className={styles.job}>
        <div className={classNamesCombined([styles.jobListOption, isStickyClass])}>
          <div className={styles.container}>
            {!isJobListFetching && (
              <div className={styles.jobListOptionContent}>
                <Text textStyle='base' bold>
                  {jobNumStart.toLocaleString()}-{jobNumEnd.toLocaleString()} of{' '}
                  {jobList?.total_num.toLocaleString()} jobs{' '}
                </Text>
                <div className={styles.jobListOptionAlerts}>
                  <div
                    className={styles.jobListOptionAlertsItem}
                    onClick={() => {
                      if (isUserAuthenticated) handleCreateJobAlert()
                      else {
                        const lastSearch = sessionStorage.getItem('search-job-last-keyword')
                        if (lastSearch) {
                          sessionStorage.setItem('should-show-alert', '1')
                        }
                        router.push('/get-started?redirect=/jobs-hiring/job-search')
                      }
                    }}
                  >
                    <Text textStyle='base'>{isUserAuthenticated} Enable job alert</Text>
                  </div>
                  {isUserAuthenticated && (
                    <div
                      className={styles.jobListOptionAlertsItem}
                      onClick={() => {
                        dispatch(openManageJobAlertsModal())
                      }}
                    >
                      <img src={BellIcon} width='20' height='20' />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={styles.jobListOptionOtherContent} />
          </div>
        </div>
        <div className={classNamesCombined([styles.container, styles.jobContent])}>
          <div className={styles.jobList}>
            <div className={styles.jobListContent}>
              {isJobListFetching && (
                <React.Fragment>
                  <JobCardLoader />
                  <JobCardLoader />
                  <JobCardLoader />
                  <JobCardLoader />
                </React.Fragment>
              )}

              {jobList?.jobs?.length === 0 && !isJobDetailFetching && (
                <div className={styles.emptyResultMobile}>{emptyResult()}</div>
              )}

              {!isJobListFetching &&
                jobList?.jobs?.length > 0 &&
                jobList.jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    image={job.company_logo}
                    title={job.job_title}
                    jobType={job.job_type}
                    isFeatured={Boolean(job.is_featured)}
                    isUrgent={Boolean(job.highlighted)}
                    company={job.company_name}
                    location={job.job_location}
                    salary={job.salary_range_value}
                    postedAt={job.refreshed_at}
                    status={job.status_key}
                    selectedId={selectedJobId}
                    handleSelectedId={() => {
                      handleSelectedJobId(job.id, job.job_url)
                    }}
                    isCompanyVerified={job.is_company_verify}
                  />
                ))}
            </div>
            {jobList?.jobs?.length > 0 && (
              <div className={styles.paginationWrapper}>
                <MaterialRoundedPagination
                  onChange={handlePaginationClick}
                  page={selectedPage}
                  totalPages={totalPages}
                />
              </div>
            )}
          </div>
          <div className={styles.jobDetailInfoSection}>
            {(isJobDetailFetching || isJobListFetching) && <JobDetailLoader />}

            {!isJobDetailFetching && selectedJob?.['id'] && (
              <JobDetail
                selectedJob={selectedJob}
                setIsShowModalShare={setIsShowModalShare}
                setIsShowReportJob={setIsShowReportJob}
                isSticky={isSticky}
                jobDetailUrl={selectedJob?.['job_url']}
                companyUrl={selectedJob?.['company']?.['company_url']}
                handlePostSaveJob={handlePostSaveJob}
                handleDeleteSavedJob={handleDeleteSavedJob}
                config={config}
                isCompanyVerified={selectedJob?.['company']?.['is_verify']}
              />
            )}

            {jobList?.jobs?.length === 0 && !isJobDetailFetching && (
              <div className={styles.emptyResult}>{emptyResult()}</div>
            )}
          </div>
          <div className={styles.jobAds}>
            {!accessToken && (
              <div className={styles.jobAds_quickCreateResume}>
                <UploadResumeButton
                  isShowBtn={!accessToken}
                  handleClick={handleQuickUploadResumeClick}
                />
              </div>
            )}

            <div className={styles.skyscraperBanner}>
              <AdSlot adSlot={'jobs-search/skyscraper-1'} />
            </div>
            <div className={styles.skyscraperBanner}>
              <AdSlot adSlot={'jobs-search/skyscraper-2'} />
            </div>
            <div className={styles.skyscraperBanner}>
              <AdSlot adSlot={'jobs-search/skyscraper-3'} />
            </div>
          </div>
        </div>
      </div>

      <ModalJobAlerts
        query={query}
        location={location}
        jobAlertsList={jobAlertsList}
        createdJobAlert={createdJobAlert}
        handleFetchJobAlertsList={fetchJobAlertsList}
        handleDeleteJobAlert={deleteJobAlert}
        handleUpdateJobAlert={updateJobAlert}
        handleCreateJobAlert={handleCreateJobAlertData}
        isUpdatingJobAlert={isUpdatingJobAlert}
        isDeletingJobAlert={isDeletingJobAlert}
        isCreatingJobAlert={isCreatingJobAlert}
        isPublicPostReportJob={!isUserAuthenticated}
      />

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

      {isShowModalShare && (
        <ModalShare
          jobDetailUrl={selectedJob?.['job_url']}
          isShowModalShare={isShowModalShare}
          handleShowModalShare={setIsShowModalShare}
        />
      )}
    </React.Fragment>
  )
}

export default JobListSection
