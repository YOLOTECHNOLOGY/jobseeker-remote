import React, { useState, useEffect, useRef } from 'react'

/* Vendors */
import { useRouter } from 'next/router'
import slugify from 'slugify'
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'

/* Components */
import Image from 'next/image'
import Text from 'components/Text'
import JobCard from 'components/JobCard'
import JobDetail from 'components/JobDetail'
// import AdSlot from 'components/AdSlot'

import JobCardLoader from 'components/Loader/JobCard'
import JobDetailLoader from 'components/Loader/JobDetail'

import ModalShare from 'components/ModalShare'
import ModalJobAlerts from 'components/ModalJobAlerts'
import ModalReportJob from 'components/ModalReportJob'

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
  config: any
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

  const [isSticky, setIsSticky] = useState(false)
  const [jobNumStart, setJobNumStart] = useState(0)
  const [jobNumEnd, setJobNumEnd] = useState(30)
  
  const [isShowModalShare, setIsShowModalShare] = useState(false)
  const [isShowModalEnableJobAlerts, setIsShowModalEnableJobAlerts] = useState(false)
  const [isShowModalManageJobAlerts, setIsShowModalManageJobAlerts] = useState(false)
  const [isShowReportJob, setIsShowReportJob] = useState(false)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
  const [selectedPage, setSelectedPage] = useState(page)

  const cx = classNames.bind(styles)
  const isStickyClass = cx({ isSticky: isSticky })

  useEffect(() => {
    setIsUserAuthenticated(accessToken ? true : false)
    window.addEventListener('scroll', updateScrollPosition)

    return () => window.removeEventListener('scroll', updateScrollPosition)
  }, [])

  useEffect(() => {
    setSelectedPage(router.query.page ? Number(router.query.page) : 1)
    document.documentElement.scrollTop = 0;
  }, [router.query.page])

  useEffect(() => {
    setJobNumStart(((jobList?.page - 1) * jobList?.size) + 1)
    setJobNumEnd(jobList?.jobs.length > 0 ? ((jobList?.page - 1) * jobList?.size) + jobList?.jobs.length : 30)
  }, [jobList])

  const handlePaginationClick = (event, val) => {
    router.query.page = val
    router.push(router, undefined, { shallow: true })
  }

  const handleCreateJobAlertData = (email) => {
    const { query } = router

    createJobAlert({
      email: email,
      keyword: formatKeywordAndLocation(query?.keyword, 'keyword'),
      location_key: formatKeywordAndLocation(query?.keyword, 'location'),
      job_category_key: query?.category ? query?.category : 'all',
      industry_key: query?.industry ? formatToUnderscore(query?.industry) : 'all',
      xp_lvl_key: query?.workExperience ? formatToReplace(query?.workExperience, 'to') : 'all',
      degree_key: query?.qualification ? formatToUnderscore(query?.qualification) : 'all',
      job_type_key: query?.jobType ? formatToReplace(query?.jobType, '_'): 'all',
      salary_range_key: query?.salary ? formatToReplace(query?.salary, 'to') : 'all',
      is_company_verified: 1,
      frequency_id: 1
    })
  }

  const formatToUnderscore = (data) => {
    return data.toLowerCase().replace(/ /g, '_')
  }

  const formatToReplace = (data, replacedTo) => {
    return formatToUnderscore(data).replace(/-/g, replacedTo)
  }

  const handleCreateJobAlert = (email?:any) => {
    handleCreateJobAlertData(email)
    setIsShowModalEnableJobAlerts(true)
  }

  const formatKeywordAndLocation = (data, keyword) => {
    let results = []
    if (data.includes('jobs-in')) {
      results = data.split('-jobs-in-')
    }

    if (keyword === 'keyword') {
      if (results[0]) return results[0]
      return data.split('-jobs')[0]
    }
    if (keyword === 'location') return results[1] ? results[1].replace(/-/g, '_') : 'all'
  }

  const updateScrollPosition = () => {
    if (width > 798) {
      prevScrollY.current = window.pageYOffset
      setIsSticky(prevScrollY.current >= 330 ? true : false)
    }
  }

  const handleFormatWindowUrl = (pathname, name, id) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/${pathname}/${slugify(name || '', { lower: true, remove: /[*+~.()'"!:@]/g })}-${id}`
    }
    return ''
  }

  const emptyResult = () => {
    return (
      <React.Fragment>
        <Text textStyle='xl' bold>We couldn't find any jobs matching your search.</Text>
        <Text textStyle='md'>Check the spelling and adjust the filter criteria.</Text>
      </React.Fragment>
    )
  }

  const jobDetailUrl = handleFormatWindowUrl('job', selectedJob?.['job_title'], selectedJob?.['id'])
  const companyUrl = handleFormatWindowUrl('company', selectedJob?.['company']?.['name'], selectedJob?.['company']?.['id'])

  return (
    <React.Fragment>
      <div className={styles.job}>
        <div className={classNamesCombined([styles.jobListOption, isStickyClass])}>
          <div className={styles.container}>
            {!isJobListFetching && (
              <div className={styles.jobListOptionContent}>
                <Text textStyle='lg'>
                  <Text textStyle='lg' bold>{jobNumStart.toLocaleString()}-{jobNumEnd.toLocaleString()}</Text> of {jobList?.total_num.toLocaleString()} jobs
                </Text>
                <div className={styles.jobListOptionAlerts}>
                  <div
                    className={styles.jobListOptionAlertsItem}
                    onClick={() => {
                      if (isUserAuthenticated) handleCreateJobAlert()
                      if (!isUserAuthenticated) handleCreateJobAlert(null)
                    }}
                  >
                    <Text textStyle='base'>{isUserAuthenticated} Enable job alert</Text>
                  </div>
                  {isUserAuthenticated && (
                    <div
                      className={styles.jobListOptionAlertsItem}
                      onClick={() => {
                        setIsShowModalManageJobAlerts(true)
                      }}
                    >
                      <Image src={BellIcon} width='20' height='20' />
                    </div>
                  )}
                </div>
              </div>
            )}
              
            <div className={styles.jobListOptionOtherContent}/>
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
                <div className={styles.emptyResultMobile}>
                  {emptyResult()}
                </div>
              )}  
              
              {!isJobListFetching && jobList?.jobs?.length > 0 && jobList.jobs.map((job) => (
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
                  selectedId={selectedJobId}
                  handleSelectedId={() => {
                    handleSelectedJobId(job.id, job.job_title)
                  }}
                />
              ))}
            </div>
            {jobList?.jobs?.length > 0 &&
              <div className={styles.paginationWrapper}>
                <MaterialRoundedPagination onChange={handlePaginationClick} page={selectedPage} totalPages={totalPages} />
              </div>
            }
          </div>
          <div className={styles.jobDetailInfoSection}>
            {(isJobDetailFetching || isJobListFetching) && (
              <JobDetailLoader />
            )}

            {!isJobDetailFetching && selectedJob?.['id'] && (
              <JobDetail 
                selectedJob={selectedJob}
                setIsShowModalShare={setIsShowModalShare}
                setIsShowReportJob={setIsShowReportJob}
                isSticky={isSticky}
                jobDetailUrl={jobDetailUrl}
                companyUrl={companyUrl}
                handlePostSaveJob={handlePostSaveJob}
                handleDeleteSavedJob={handleDeleteSavedJob}
                config={config}
              />
            )}

            {jobList?.jobs?.length === 0 && !isJobDetailFetching && (
              <div className={styles.emptyResult}>
                {emptyResult()}
              </div>
            )} 
          </div>
          <div className={styles.jobAds}>
            <div className={styles.skyscraperBanner}>
              {/* <AdSlot adSlot={'jobs-search/skyscraper-1'} /> */}
            </div>
            <div className={styles.skyscraperBanner}>
              {/* <AdSlot adSlot={'jobs-search/skyscraper-2'} /> */}
            </div>
            <div className={styles.skyscraperBanner}>
              {/* <AdSlot adSlot={'jobs-search/skyscraper-3'} /> */}
            </div>
          </div>
        </div>
      </div>

      <ModalJobAlerts
        query={query}
        location={location}
        isShowModalEnableJobAlerts={isShowModalEnableJobAlerts}
        handleShowModalEnableJobAlerts={setIsShowModalEnableJobAlerts}
        isShowModalManageJobAlerts={isShowModalManageJobAlerts}
        handleShowModalManageJobAlerts={setIsShowModalManageJobAlerts}
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
      <ModalReportJob 
        isShowReportJob={isShowReportJob} 
        handleShowReportJob={setIsShowReportJob} 
        reportJobReasonList={reportJobReasonList}
        selectedJobId={selectedJob?.['id']}
        handlePostReportJob={handlePostReportJob}
        isPostingReport={isPostingReport}
        postReportResponse={postReportResponse}
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
