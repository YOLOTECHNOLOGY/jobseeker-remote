import React, { useState, useEffect, useRef } from 'react'

/* Vendors */
import { useRouter } from 'next/router'
import moment from 'moment'
import slugify from 'slugify'
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'

/* Components */
import Image from 'next/image'
import Text from 'components/Text'
import JobCard from 'components/JobCard'
import JobDetail from 'components/JobDetail'
import AdSlot from 'components/AdSlot'

import JobCardLoader from 'components/Loader/JobCard'
import JobDetailLoader from 'components/Loader/JobDetail'

import ModalShare from 'components/ModalShare'
import ModalJobAlerts from 'components/ModalJobAlerts'
import ModalReportJob from 'components/ModalReportJob'

/* Material Components */
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'

/* Helpers */
import { numberToThousands } from 'helpers/formatter'
import useWindowDimensions from 'helpers/useWindowDimensions'

/* Styles */
import styles from './JobListSection.module.scss'

/* Images */
import { NotificationIcon } from 'images'

interface JobListSectionProps {
  defaultPage: number
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
  location?: any
  isJobListFetching?: boolean
  selectedJob?: Object
  selectedJobId?: number
  handleSelectedJobId?: Function
  totalPages?: number
  handleCompanyDetail?: Function
  companyDetail?: Object
  isJobDetailFetching?: boolean
  reportJobReasonList?: any
  handlePostReportJob?: Function
}

const JobListSection = ({ 
  defaultPage,
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
  location,
  isJobListFetching,
  selectedJob,
  selectedJobId,
  handleSelectedJobId,
  totalPages,
  companyDetail,
  isJobDetailFetching,
  reportJobReasonList,
  handlePostReportJob
}: JobListSectionProps) => {  
  const { width } = useWindowDimensions()
  const router = useRouter()
  const prevScrollY = useRef(0)

  const [isSticky, setIsSticky] = useState(false)
  
  const [isShowModalShare, setIsShowModalShare] = useState(false)
  const [isShowModalEnableJobAlerts, setIsShowModalEnableJobAlerts] = useState(false)
  const [isShowModalManageJobAlerts, setIsShowModalManageJobAlerts] = useState(false)
  const [isShowReportJob, setIsShowReportJob] = useState(false)

  let jobDetailUrl = ''
  let companyUrl = ''
  if (typeof window !== 'undefined') {
    jobDetailUrl = `${window.location.origin}/job/${slugify(selectedJob?.['job_title'] || '', { lower: true, remove: /[*+~.()'"!:@]/g })}-${selectedJob?.['id']}`
    companyUrl = `${window.location.origin}/company/${slugify(companyDetail?.['name'] || '', { lower: true, remove: /[*+~.()'"!:@]/g })}-${companyDetail?.['id']}`
  }

  const cx = classNames.bind(styles)
  const isStickyClass = cx({ isSticky: isSticky })

  useEffect(() => {
    window.addEventListener('scroll', updateScrollPosition)
    return () => window.removeEventListener('scroll', updateScrollPosition)
  }, [])

  const handlePaginationClick = (event, val) => {
    router.query.page = val
    router.push(router, undefined, { shallow: true })
  }

  const handleCreateJobAlert = () => {
    createJobAlert({
      keyword: query?.[0],
      frequency_id: 1,
      is_active: 1,
      job_category_key: 'all',
      location_key: location?.length > 0 ? location.key : 'all'
    })
    setIsShowModalEnableJobAlerts(true)
  }

  const updateScrollPosition = () => {
    if (width > 798) {
      prevScrollY.current = window.pageYOffset
      setIsSticky(prevScrollY.current >= 70 ? true : false)
    }
  }

  return (
    <React.Fragment>
      <div className={styles.job}>
        <div className={styles.jobList}>
          <div className={classNamesCombined([styles.jobListOption, isStickyClass])}>
            <Text textStyle='xl' bold>
              {jobList?.total_num} jobs found
            </Text>
            <div className={styles.jobListOptionAlerts}>
              <div
                className={styles.jobListOptionAlertsItem}
                onClick={() => handleCreateJobAlert()}
              >
                <Text textStyle='base'>Enable job alert</Text>
              </div>
              <div
                className={styles.jobListOptionAlertsItem}
                onClick={() => {
                  setIsShowModalManageJobAlerts(true)
                }}
              >
                <Image src={NotificationIcon} width='20' height='20' />
              </div>
            </div>
          </div>
          <div className={styles.jobListContent}>
            {isJobListFetching && (
              <React.Fragment>
                <JobCardLoader />
                <JobCardLoader />
                <JobCardLoader />
                <JobCardLoader />
              </React.Fragment>
            )}
            {!isJobListFetching && jobList?.jobs?.length > 0 && jobList.jobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                image={job.company_logo}
                title={job.job_title}
                tag={job.job_type}
                company={job.company_name}
                location={job.company_location}
                salary={`${numberToThousands(job?.salary_range_from)}K - ${numberToThousands(job?.salary_range_to)}K` }
                postedAt={`${moment(new Date(job.updated_at)).format('DD MMMM YYYY')}`}
                selectedId={selectedJobId}
                handleSelectedId={() => {
                  handleSelectedJobId(job.id)
                }}
              />
            ))}
          </div>
          <div className={styles.paginationWrapper}>
            <MaterialRoundedPagination onChange={handlePaginationClick} defaultPage={defaultPage} totalPages={totalPages} />
          </div>
        </div>
        <div className={styles.jobDetailInfoSection}>
          {(isJobDetailFetching || isJobListFetching) && (
            <JobDetailLoader />
          )}
          {!isJobDetailFetching && selectedJob && (
            <JobDetail 
              selectedJob={selectedJob}
              companyDetail={companyDetail}
              setIsShowModalShare={setIsShowModalShare}
              setIsShowReportJob={setIsShowReportJob}
              isSticky={isSticky}
              jobDetailUrl={jobDetailUrl}
              companyUrl={companyUrl}
            />
          )}
        </div>
        <div className={styles.jobAds}>
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

      <ModalJobAlerts
        query={query}
        isShowModalEnableJobAlerts={isShowModalEnableJobAlerts}
        handleShowModalEnableJobAlerts={setIsShowModalEnableJobAlerts}
        isShowModalManageJobAlerts={isShowModalManageJobAlerts}
        handleShowModalManageJobAlerts={setIsShowModalManageJobAlerts}
        jobAlertsList={jobAlertsList}
        createdJobAlert={createdJobAlert}
        handleFetchJobAlertsList={fetchJobAlertsList}
        handleDeleteJobAlert={deleteJobAlert}
        handleUpdateJobAlert={updateJobAlert}
        isUpdatingJobAlert={isUpdatingJobAlert}
        isDeletingJobAlert={isDeletingJobAlert}
      />
      <ModalReportJob 
        isShowReportJob={isShowReportJob} 
        handleShowReportJob={setIsShowReportJob} 
        reportJobReasonList={reportJobReasonList}
        selectedJobId={selectedJob?.['id']}
        handlePostReportJob={handlePostReportJob}
      />
      <ModalShare
        jobDetailUrl={jobDetailUrl}
        isShowModalShare={isShowModalShare}
        handleShowModalShare={setIsShowModalShare}
      />
    </React.Fragment>
  )
}

export default JobListSection
