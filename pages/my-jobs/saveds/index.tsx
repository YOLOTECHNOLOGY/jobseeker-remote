import React, { useState, useEffect } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import moment from 'moment'
import slugify from 'slugify'
import classNamesCombined from 'classnames'

/* Redux Actions */
import { fetchAppliedJobsListRequest } from 'store/actions/jobs/fetchAppliedJobsList'
import { fetchJobDetailRequest } from 'store/actions/jobs/fetchJobDetail'
import { fetchCompanyDetailRequest } from 'store/actions/companies/fetchCompanyDetail'

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

/* Styles */
import styles from './SavedJob.module.scss'

/* Images */
import { NotificationIcon } from 'images'

const SavedJob = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [companyDetail, setCompanyDetail] = useState(null)
  const [isShowModalShare, setIsShowModalShare] = useState(false)
  const [isShowModalWithdrawApplication, setIsShowModalWithdrawApplication] = useState(false)

  const appliedJobsListResponse = useSelector((store: any) => store.job.appliedJobsList.response)
  const isAppliedJobsListFetching = useSelector((store: any) => store.job.appliedJobsList.fetching)
  
  const jobDetailResponse = useSelector((store: any) => store.job.jobDetail.response)
  const isJobDetailFetching = useSelector((store: any) => store.job.jobDetail.fetching)

  const companyDetailResponse = useSelector((store: any) => store.companies.companyDetail.response)

  useEffect(() => {
    const payload = {
      sort: router.query?.sort,
      page: router.query?.page ? Number(router.query.page) : 1,
    }
    dispatch(fetchAppliedJobsListRequest(payload))
  }, [router.query])

  useEffect(() => {
    if (appliedJobsListResponse?.data?.job_applications.length > 0) {
      handleFetchJobDetail(appliedJobsListResponse.data?.job_applications?.[0].job.job_id) 
      setSelectedJobId(appliedJobsListResponse.data?.job_applications?.[0].job.job_id)
    } 
  }, [appliedJobsListResponse])

  useEffect(() => {
    if (jobDetailResponse?.data) setSelectedJob(jobDetailResponse.data)
  }, [jobDetailResponse])

  useEffect(() => {
    if (selectedJobId) dispatch(handleFetchJobDetail(selectedJobId))
    if (selectedJob) dispatch(fetchCompanyDetailRequest(selectedJob.company_id))
  }, [selectedJobId])

  useEffect(() => {
    if (companyDetailResponse?.data) setCompanyDetail(companyDetailResponse.data)
  }, [companyDetailResponse])

  const handleSelectedJobId = (jobId) => setSelectedJobId(jobId)
  const handleFetchJobDetail = (jobId) => dispatch(fetchJobDetailRequest(jobId))
  const handleFetchCompanyDetail = (companyId) => dispatch(fetchCompanyDetailRequest(companyId))

  const handlePaginationClick = (event, val) => {
    router.query.page = val
    router.push(router, undefined, { shallow: true })
  }

  let jobDetailUrl = ''
  let companyUrl = ''
  if (typeof window !== 'undefined') {
    jobDetailUrl = `${window.location.origin}/job/${slugify(selectedJob?.['job_title'] || '', { lower: true, remove: /[*+~.()'"!:@]/g })}-${selectedJob?.['id']}`
    companyUrl = `${window.location.origin}/company/${slugify(companyDetail?.['name'] || '', { lower: true, remove: /[*+~.()'"!:@]/g })}-${companyDetail?.['id']}`
  }

  return (
    <Layout>
      <SEO title={"Job Title"} description={"Job Description"} />
      <div className={styles.AppliedJob}>
        <div className={styles.AppliedJobList}>
          <div className={classNamesCombined([styles.AppliedJobMenu])}>
            <Link to={'/my-jobs/saved?sort=2'} className={classNamesCombined([styles.AppliedJobMenuLink, styles.AppliedJobMenuLinkIsActive])}>
              <Text textStyle='xl' bold>
                Saved Jobs
              </Text>
            </Link>
            <Link to={'/my-jobs/applied?sort=2'} className={styles.AppliedJobMenuLink}>
              <Text textStyle='xl' bold>
                Applied Jobs
              </Text>
            </Link>
          </div>
          <div className={styles.AppliedJobListContent}>
            {isAppliedJobsListFetching && (
              <React.Fragment>
                <JobCardLoader />
                <JobCardLoader />
                <JobCardLoader />
                <JobCardLoader />
              </React.Fragment>
            )}
            {!isAppliedJobsListFetching && appliedJobsListResponse?.data?.job_applications.map((job_application) => (
              <JobCard
                key={job_application.job.job_id}
                id={job_application.job.job_id}
                image={job_application.company.logo}
                title={job_application.job.job_title}
                tag={job_application.job.job_type}
                company={job_application.company.name}
                location={job_application.job.job_location}
                salary={`${numberToThousands(job_application.job.salary_range_from)}K - ${numberToThousands(job_application.job.salary_range_to)}K` }
                postedAt={`${moment(new Date(job_application.created_at)).format('DD MMMM YYYY')}`}
                selectedId={selectedJobId}
                handleSelectedId={() => {
                  handleSelectedJobId(job_application.job.job_id)
                }}
              />
            ))}
          </div>
          <div className={styles.paginationWrapper}>
            <MaterialRoundedPagination onChange={handlePaginationClick} defaultPage={1} totalPages={appliedJobsListResponse?.data?.totalPages} />
          </div>
        </div>
        <div className={styles.AppliedJobDetailInfoSection}>
          {(isJobDetailFetching || isAppliedJobsListFetching) && (
            <JobDetailLoader />
          )}
          {!isJobDetailFetching && selectedJob && (
            <JobDetail 
              selectedJob={selectedJob}
              companyDetail={companyDetail}
              jobDetailUrl={jobDetailUrl}
              companyUrl={companyUrl}
              category='saved'
              setIsShowModalShare={setIsShowModalShare}
              setIsShowModalWithdrawApplication={setIsShowModalWithdrawApplication}
            />
          )}
        </div>
        <div className={styles.AppliedJobAds}>
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

export default SavedJob