import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// @ts-ignore
import { END } from 'redux-saga'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import slugify from 'slugify'
import moment from 'moment'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab'
import classNamesCombined from 'classnames'

/* Components */
import Layout from 'components/Layout'
import Text from 'components/Text'
import Link from 'components/Link'
import MaterialButton from 'components/MaterialButton'
import SEO from 'components/SEO'
import JobTag from 'components/JobTag'
import Image from 'next/image'
import ReadMore from 'components/ReadMore'
import JobDetailSidebarCard from 'components/Loader/JobDetailSidebarCard'
import MaterialTextFieldWithSuggestionList from 'components/MaterialTextFieldWithSuggestionList'
import MaterialLocationField from 'components/MaterialLocationField'
import AdSlot from 'components/AdSlot'

import ModalShare from 'components/ModalShare'
import ModalReportJob from 'components/ModalReportJob'

/* Helpers */
import { getCookie } from 'helpers/cookies'
import { numberWithCommas } from 'helpers/formatter'
import { categoryParser, conditionChecker, getApplyJobLink } from 'helpers/jobPayloadFormatter'

/* Action Creators */
import { wrapper } from 'store'

/* Redux Actions */
import { fetchAppliedJobDetailRequest } from 'store/actions/jobs/fetchAppliedJobDetail'
import { fetchSimilarJobsRequest } from 'store/actions/jobs/fetchSimilarJobs'
import { fetchRecommendedCoursesRequest } from 'store/actions/courses/fetchRecommendedCourses'

import { fetchJobDetailRequest } from 'store/actions/jobs/fetchJobDetail'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'

import { postReportRequest } from 'store/actions/reports/postReport'
import { postSaveJobRequest } from 'store/actions/jobs/postSaveJob'

/* Styles */
import styles from './Job.module.scss'

/* Images */
import {
  BriefcaseIcon,
  LocationIcon,
  EducationIcon,
  SalaryIcon,
  EquityIncentiveIcon,
  MealAllowanceIcon,
  EmployeeStockPurchaseIcon,
  HousingAllowanceIcon,
  CommissionIcon,
  PerformanceBonusIcon,
  TelecommunicationAllowanceIcon,
  OtherAllowancesIcon,
  ExpireIcon,
  MoreIcon,
  RateIcon,
  LocationPinIcon,
} from 'images'

interface IJobDetail {
  jobDetail: any
  applicationHistory: any
  config: any
  accessToken: any
  seoMetaTitle: string
  seoMetaDescription: string
  seoCanonicalUrl
}

const Job = ({
  jobDetail,
  applicationHistory,
  config,
  accessToken,
  seoMetaTitle,
  seoMetaDescription,
  seoCanonicalUrl,
}: IJobDetail) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const userCookie = getCookie('user') || null
  const applyJobLink = getApplyJobLink(jobDetail, userCookie)

  const [isShowModalShare, setIsShowModalShare] = useState(false)
  const [isShowReportJob, setIsShowReportJob] = useState(false)
  const [jobDetailOption, setJobDetailOption] = useState(false)
  const [suggestionList, setSuggestionList] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [locationValue, setLocationValue] = useState(null)

  const [jobDetailUrl, setJobDetailUrl] = useState('/')
  const [companyUrl, setCompanyUrl] = useState('/')
  const [recommendedCourses, setRecommendedCourses] = useState([])
  const [similarJobs, setSimilarJobs] = useState(null)

  const reportJobReasonList = config && config.inputs && config.inputs.report_job_reasons
  const categoryLists = config && config.inputs && config.inputs.job_category_lists

  const recommendedCoursesResponse = useSelector(
    (store: any) => store.courses.recommendedCourses.response
  )
  const isRecommendedCoursesFetching = useSelector(
    (store: any) => store.courses.recommendedCourses.fetching
  )

  const similarJobsResponse = useSelector((store: any) => store.job.similarJobs.response)
  const isSimilarJobsFetching = useSelector((store: any) => store.job.similarJobs.fetching)

  const postReportResponse = useSelector((store: any) => store.reports.postReport.response)
  const isPostingReport = useSelector((store: any) => store.reports.postReport.fetching)

  useEffect(() => {
    setJobDetailUrl(handleFormatWindowUrl('job', jobDetail?.['job_title'], jobDetail?.['id']))
    setCompanyUrl(
      handleFormatWindowUrl(
        'company',
        jobDetail?.['company']?.['name'],
        jobDetail?.['company']?.['id']
      )
    )

    handleFetchRecommendedCourses()
    handleFetchSimilarJobs()
  }, [jobDetail])

  useEffect(() => {
    if (recommendedCoursesResponse?.data?.length > 0)
      setRecommendedCourses(recommendedCoursesResponse.data)
  }, [recommendedCoursesResponse])

  useEffect(() => {
    if (similarJobsResponse) setSimilarJobs(similarJobsResponse)
  }, [similarJobsResponse])

  const handleFormatWindowUrl = (pathname, name, id) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/${pathname}/${slugify(name || '', {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
      })}-${id}`
    }
    return ''
  }

  const handleBenefitIcon = (benefit) => {
    const Icon = `${benefit.replace(/ /g, '')}Icon`

    switch (Icon) {
      case 'EquityIncentiveIcon':
        return <Image src={EquityIncentiveIcon} alt='logo' width='22' height='22' />
      case 'MealAllowanceIcon':
        return <Image src={MealAllowanceIcon} alt='logo' width='22' height='22' />
      case 'EmployeeStockPurchaseIcon':
        return <Image src={EmployeeStockPurchaseIcon} alt='logo' width='22' height='22' />
      case 'HousingAllowanceIcon':
        return <Image src={HousingAllowanceIcon} alt='logo' width='22' height='22' />
      case 'CommissionIcon':
        return <Image src={CommissionIcon} alt='logo' width='22' height='22' />
      case 'PerformanceBonusIcon':
        return <Image src={PerformanceBonusIcon} alt='logo' width='22' height='22' />
      case 'TelecommunicationAllowanceIcon':
        return <Image src={TelecommunicationAllowanceIcon} alt='logo' width='22' height='22' />
      default:
        return <Image src={OtherAllowancesIcon} alt='logo' width='22' height='22' />
    }
  }

  const isAppliedQueryParam = router.query.isApplied
  const hasApplied = isAppliedQueryParam === 'true' ? true : false

  const handlePostSaveJob = ({ jobId, isSaved }) => {
    if (isSaved) return

    if (accessToken) {
      const postSaveJobPayload = {
        jobId,
        accessToken,
      }
      dispatch(postSaveJobRequest(postSaveJobPayload))
    }
  }

  const handlePostReportJob = (reportJobData) => {
    if (accessToken) {
      const postReportJobPayload = {
        reportJobData,
        accessToken,
      }
      dispatch(postReportRequest(postReportJobPayload))
    }
  }

  const handleRedirectToJob = (jobTitle, jobId) => {
    if (typeof window !== 'undefined') {
      window.open(handleFormatWindowUrl('job', jobTitle, jobId), '_blank')
    }
  }

  const getJobDetailCategoryIds = () => {
    const jobCategoryIds = []
    jobDetail?.categories?.map((cat) => {
      categoryLists.filter((catList) => {
        if (catList.value === cat.value) {
          jobCategoryIds.push(catList.id)
        }
      })
    })
    return jobCategoryIds?.length > 0 ? jobCategoryIds.join(',') : null
  }

  const handleFetchRecommendedCourses = () => {
    const payload = {
      size: 5,
      job_category_ids: getJobDetailCategoryIds(),
      xp_lvl_key: jobDetail?.xp_lvl.key,
    }
    dispatch(fetchRecommendedCoursesRequest(payload))
  }

  const handleFetchSimilarJobs = () => dispatch(fetchSimilarJobsRequest({ jobId: jobDetail.id }))

  const handleCoursePath = (title, id) => {
    return `${process.env.ACADEMY_CLIENT_URL}/course/${slugify(title || '', {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    })}-${id}`
  }

  const handleSuggestionSearch = (val) => {
    if (val !== '') {
      fetch(`${process.env.JOB_BOSSJOB_URL}/suggested-search?size=5&query=${val}`)
        .then((resp) => resp.json())
        .then((data) => setSuggestionList(data.data.items))
    }
  }

  const updateUrl = (queryParam, queryObject) => {
    router.push({
      pathname: `${process.env.HOST_PATH}/jobs-hiring/${queryParam ? queryParam : 'job-search'}`,
      query: queryObject,
    })
  }

  const onLocationSearch = (event, value) => {
    setLocationValue(value)
  }

  const onSearch = (value = searchValue) => {
    let queryParam = null
    if (locationValue) {
      const sanitisedLocValue = categoryParser(locationValue.value)
      queryParam = conditionChecker(value, sanitisedLocValue)
    } else if (value) {
      queryParam = conditionChecker(value)
    }
    updateUrl(queryParam, { sort: 2 })
  }

  return (
    <Layout>
      <SEO title={seoMetaTitle} description={seoMetaDescription} canonical={seoCanonicalUrl} />
      <div className={styles.searchAndLocationContainer}>
        <MaterialTextFieldWithSuggestionList
          id='search'
          label='Search for job title, keyword or company'
          variant='outlined'
          size='small'
          className={styles.searchField}
          searchFn={handleSuggestionSearch}
          updateSearchValue={setSearchValue}
          onSelect={(val: any) => {
            setSearchValue(val)
            onSearch(val)
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSearch()
            }
          }}
          options={suggestionList}
        />
        <MaterialLocationField
          className={styles.locationField}
          // defValue={defaultLocation}
          // defValue={urlLocation}
          onChange={onLocationSearch}
        />
        <MaterialButton variant='contained' capitalize onClick={() => onSearch()}>
          <Text textStyle='lg' bold textColor='white'>
            Search
          </Text>
        </MaterialButton>
      </div>
      <div className={styles.JobDetail}>
        <div className={styles.JobDetailContent}>
          <div className={styles.LeaderBoard}>
            <AdSlot adSlot={'job-detail/top-leaderboard'} />
          </div>
          <div className={styles.JobDetailPrimary}>
            <div
              className={styles.JobDetailPrimaryOptions}
              onClick={() => setJobDetailOption(!jobDetailOption)}
            >
              <Image src={MoreIcon} width='30' height='30'></Image>
            </div>
            {/* TODO: Job Application status: SAVED JOBS / APPLIED JOBS */}
            {jobDetailOption && (
              <div className={styles.JobDetailOptionList}>
                <div
                  className={styles.JobDetailOptionItem}
                  onClick={() => setIsShowModalShare(true)}
                >
                  <Text textStyle='lg'>Share this job</Text>
                </div>
                <div
                  className={styles.JobDetailOptionItem}
                  onClick={() => setIsShowReportJob(true)}
                >
                  <Text textStyle='lg'>Report job</Text>
                </div>
              </div>
            )}
            <div className={styles.JobDetailPrimaryInfo}>
              <img
                src={jobDetail?.company?.logo}
                className={styles.JobDetailPrimaryInfoImage}
                alt={`${jobDetail?.company?.name} logo`}
              />
              <Text textStyle='xl' tagName='h1' bold className={styles.JobDetailPrimaryInfoTitle}>
                {jobDetail?.job_title}
              </Text>
            </div>
            <Link to={companyUrl}>
              <Text textStyle='lg' className={styles.JobDetailCompany}>
                {jobDetail?.company?.name}
              </Text>
            </Link>
            <div className={styles.JobDetailPrimarySub}>
              {jobDetail?.is_featured && <JobTag tag='Featured' tagType='featured' />}
              {jobDetail?.is_urgent && <JobTag tag='Urgent' tagType='urgent' />}
              <JobTag tag={jobDetail?.job_type_value} />
            </div>
            {!isAppliedQueryParam && (
              <div className={styles.JobDetailPrimaryActions}>
                {jobDetail?.status_key === 'active' && (
                  <>
                    {jobDetail?.is_applied ? (
                      <MaterialButton variant='contained' capitalize disabled>
                        <Text textColor='white' bold>
                          Applied
                        </Text>
                      </MaterialButton>
                    ) : (
                      <Link to={applyJobLink} external>
                        <MaterialButton variant='contained' capitalize>
                          <Text textStyle='lg' textColor='white' bold>
                            Apply Now
                          </Text>
                        </MaterialButton>
                      </Link>
                    )}
                  </>
                )}
                {jobDetail?.status_key !== 'active' && (
                  <Text textStyle='base' className={styles.JobDetailStatus}>
                    <Image src={ExpireIcon} height='16' width='16' />
                    <span>This job is no longer hiring</span>
                  </Text>
                )}
                <MaterialButton
                  variant='outlined'
                  capitalize
                  onClick={() =>
                    handlePostSaveJob({ jobId: jobDetail?.id, isSaved: jobDetail?.is_saved })
                  }
                >
                  {jobDetail?.is_saved ? 'Saved' : 'Save'} Job
                </MaterialButton>
              </div>
            )}
            <Text textStyle='lg' textColor='darkgrey' className={styles.JobDetailPostedAt}>
              Posted on {jobDetail?.published_at}
            </Text>
          </div>
          <div className={styles.JobDetailPref}>
            <ul className={styles.JobDetailPrefList}>
              <li className={styles.JobDetailPrefItem}>
                <Image src={LocationIcon} alt='logo' width='18' height='18' />
                <span className={styles.JobDetailPrefText}>
                  <Text textStyle='base' textColor='darkgrey' className={styles.JobDetailPrefField}>
                    Location
                  </Text>
                  <Link to={'/'} className={styles.JobDetailHoverItem}>
                    <Text textStyle='lg' bold className={styles.JobDetailPrefValue}>
                      {jobDetail?.location?.value}
                    </Text>
                  </Link>
                </span>
              </li>
              <li className={styles.JobDetailPrefItem}>
                <Image src={BriefcaseIcon} alt='logo' width='20' height='20' />
                <span className={styles.JobDetailPrefText}>
                  <Text textStyle='base' textColor='darkgrey' className={styles.JobDetailPrefField}>
                    Experience
                  </Text>
                  <Text textStyle='lg' bold className={styles.JobDetailPrefValue}>
                    {jobDetail?.xp_lvl?.value}
                  </Text>
                </span>
              </li>
              <li className={styles.JobDetailPrefItem}>
                <Image src={EducationIcon} alt='logo' width='20' height='20' />
                <span className={styles.JobDetailPrefText}>
                  <Text textStyle='base' textColor='darkgrey' className={styles.JobDetailPrefField}>
                    Education
                  </Text>
                  <Text textStyle='lg' bold className={styles.JobDetailPrefValue}>
                    {jobDetail?.degree?.value}
                  </Text>
                </span>
              </li>
              <li className={styles.JobDetailPrefItem}>
                <Image src={SalaryIcon} alt='logo' width='20' height='20' />
                <span className={styles.JobDetailPrefText}>
                  <Text textStyle='base' textColor='darkgrey' className={styles.JobDetailPrefField}>
                    Salary
                  </Text>
                  <Text textStyle='lg' bold className={styles.JobDetailPrefValue}>
                    {jobDetail?.salary_range_value}
                  </Text>
                </span>
              </li>
            </ul>
          </div>
          {hasApplied && (
            <div className={styles.JobDetailApplicationWrapper}>
              <Text textStyle='lg' bold>
                Application History
              </Text>
              <Timeline className={styles.JobDetailApplicationTimeline}>
                {applicationHistory?.map((history, i) => (
                  <TimelineItem key={i}>
                    <TimelineSeparator>
                      <TimelineDot
                        className={i === 0 ? styles.JobDetailApplicationTimelineFirst : ''}
                      />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Text textStyle='base'>
                        {history.value} - {history.elapsed_time}
                      </Text>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </div>
          )}
          <div className={styles.JobDetailSection}>
            <Text textStyle='lg' tagName='h2' bold className={styles.JobDetailSectionTitle}>
              Job Description
            </Text>
            <div
              className={classNamesCombined([
                styles.JobDetailSectionBody,
                styles.JobDetailDescriptionSectionBody,
              ])}
              dangerouslySetInnerHTML={{ __html: jobDetail?.job_description_html }}
            />
          </div>
          <div className={styles.JobDetailSection}>
            <Text textStyle='lg' tagName='h2' bold className={styles.JobDetailSectionTitle}>
              Requirements
            </Text>
            <div
              className={classNamesCombined([
                styles.JobDetailSectionBody,
                styles.JobDetailRequirementSectionBody,
              ])}
              dangerouslySetInnerHTML={{ __html: jobDetail?.job_requirements_html }}
            />
          </div>
          <div className={styles.JobDetailSection}>
            <Text textStyle='lg' tagName='h2' bold className={styles.JobDetailSectionTitle}>
              Benefits
            </Text>
            <ul className={styles.JobDetailBenefitsList}>
              {jobDetail?.benefits?.map((benefit, i) => (
                <li className={styles.JobDetailBenefitsItem} key={i}>
                  {handleBenefitIcon(benefit.name)}
                  <Text textStyle='base' className={styles.JobDetailBenefitsText}>
                    {benefit.name}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.JobDetailSection}>
            <Text textStyle='lg' tagName='h2' bold className={styles.JobDetailSectionTitle}>
              Skills/Software
            </Text>
            <ul className={styles.JobDetailSkillsList}>
              {jobDetail?.skills?.map((skill, i) => (
                <li className={styles.JobDetailSkillsItem} key={i}>
                  <Text textStyle='sm' className={styles.JobDetailSkillsText}>
                    {skill.value}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.JobDetailSection}>
            <Text textStyle='lg' bold className={styles.JobDetailSectionTitle}>
              Additional Information
            </Text>
            <Text textStyle='base' tagName='h2' bold className={styles.JobDetailSectionSubTitle}>
              Working Location
            </Text>
            <Text textStyle='base' className={styles.JobDetailSectionSubBody}>
              {jobDetail?.full_address}
            </Text>
            <Text textStyle='base' tagName='h2' bold className={styles.JobDetailSectionSubTitle}>
              Specialization
            </Text>
            {jobDetail?.categories?.map((category, i) => (
              <span key={i}>
                <Link to='/' className={styles.JobDetailSectionSubBody}>
                  <Text textStyle='base' className={styles.JobDetailSectionSubBodyLink}>
                    {' '}
                    {category.value},
                  </Text>
                </Link>
              </span>
            ))}
          </div>
          {jobDetail?.recruiter && (
            <div className={styles.JobDetailRecruiter}>
              <Text textStyle='xl' bold>
                Connect directly to job poster after applying
              </Text>
              <div className={styles.JobDetailRecruiterInfo}>
                <div
                  className={styles.JobDetailRecruiterInfoImage}
                  style={{ backgroundImage: `url(${jobDetail?.recruiter.avatar})` }}
                />
                <div className={styles.JobDetailRecruiterInfoText}>
                  <div className={styles.JobDetailRecruiterName}>
                    <Text textStyle='lg' bold>
                      {jobDetail?.recruiter.full_name},{' '}
                    </Text>
                    <Text textStyle='lg'>
                      &nbsp;{jobDetail?.recruiter.work_experience.job_title}
                    </Text>
                  </div>
                  <div className={styles.JobDetailRecruiterContent}>
                    <Text textStyle='lg' textColor='darkgrey'>
                      <Image src={RateIcon} height='14' width='15' />
                      {jobDetail?.recruiter.response_rate}% response rate, responds{' '}
                      {jobDetail?.recruiter.response_time}
                    </Text>
                    <Text textStyle='lg' textColor='darkgrey'>
                      <Image src={LocationPinIcon} height='14' width='15' />
                      Last active on{' '}
                      {moment(jobDetail?.recruiter.last_active_at).format('MM/DD/YYYY')}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className={styles.aboutCompany}>
            <Text bold textStyle='xl' className={styles.aboutCompanyHeader}>
              About the company
            </Text>
            <Link to={companyUrl || '/'} className={styles.aboutCompanyTitle}>
              <Text bold textStyle='xl' textColor='primaryBlue'>
                {jobDetail?.company?.name}
              </Text>
            </Link>
            <div className={styles.aboutCompanyDetail}>
              <Text textStyle='base'>{jobDetail?.company?.industry}</Text>
              <Text textStyle='base'>{jobDetail?.company?.company_size} employees</Text>
            </div>
            <ReadMore size={352} text={jobDetail?.company?.description_html} />
          </div>
        </div>
        <div className={styles.JobDetailSidebar}>
          <div className={styles.JobDetailSidebarContent}>
            <div className={styles.JobDetailSidebarSection}>
              <div className={styles.JobDetailSidebarTitle}>
                <Text textStyle='xxl' bold>
                  Similar Jobs
                </Text>
              </div>
              <div className={styles.JobDetailSidebarCardList}>
                {isSimilarJobsFetching && (
                  <>
                    <JobDetailSidebarCard />
                    <JobDetailSidebarCard />
                    <JobDetailSidebarCard />
                    <JobDetailSidebarCard />
                    <JobDetailSidebarCard />
                  </>
                )}
                {!isSimilarJobsFetching &&
                  similarJobs?.length > 0 &&
                  similarJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => handleRedirectToJob(job.truncated_job_title, job.id)}
                      className={styles.JobDetailSidebarCard}
                    >
                      <Link
                        to={`${handleFormatWindowUrl('job', job.truncated_job_title, job.id)}`}
                        aTag
                        external
                      >
                        <Text
                          className={styles.JobDetailSidebarCardTitle}
                          textStyle='base'
                          tagName='p'
                          bold
                        >
                          {job.truncated_job_title || job.job_title}
                        </Text>
                      </Link>
                      <Text textStyle='base' tagName='p'>
                        {job.company_name}
                      </Text>
                      <Text textStyle='base' tagName='p'>
                        {job.company_name}
                      </Text>
                      <Text textStyle='base' textColor='darkgrey'>
                        {job.location_value}
                      </Text>
                      <Text
                        textStyle='base'
                        tagName='p'
                        textColor='darkgrey'
                        className={styles.JobDetailSidebarCardSalary}
                      >
                        {job.salary_range_value}
                      </Text>
                      {job.refreshed_at && (
                        <Text textStyle='xsm' tagName='p'>
                          Posted on {job.refreshed_at}
                        </Text>
                      )}
                      <Link
                        to={`${handleFormatWindowUrl('job', job.truncated_job_title, job.id)}`}
                        className={styles.JobDetailSidebarCardApply}
                      >
                        <Text
                          textStyle='base'
                          tagName='p'
                          bold
                          className={styles.JobDetailSidebarCardCTA}
                        >
                          {job.salary_range_value}
                        </Text>
                        {job.published_at && (
                          <Text textStyle='xsm' tagName='p'>
                            Posted on {job.published_at}
                          </Text>
                        )}
                      </Link>
                      <Link
                        to={`${handleFormatWindowUrl('job', job.truncated_job_title, job.id)}`}
                        className={styles.JobDetailSidebarCardApply}
                      >
                        <Text
                          textStyle='base'
                          tagName='p'
                          bold
                          className={styles.JobDetailSidebarCardCTA}
                        >
                          Apply Now
                        </Text>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className={styles.JobDetailSidebarContent}>
            <div className={styles.JobDetailSidebarSection}>
              <div className={styles.JobDetailSidebarTitle}>
                <Text textStyle='xxl' bold>
                  Suggested Courses
                </Text>
              </div>
              <div className={styles.JobDetailSidebarCardList}>
                {isRecommendedCoursesFetching && (
                  <>
                    <JobDetailSidebarCard />
                    <JobDetailSidebarCard />
                    <JobDetailSidebarCard />
                    <JobDetailSidebarCard />
                    <JobDetailSidebarCard />
                  </>
                )}
                {!isRecommendedCoursesFetching &&
                  recommendedCourses?.length > 0 &&
                  recommendedCourses.map((course) => (
                    <Link
                      key={course.id}
                      external
                      to={`${handleCoursePath(course.truncated_name, course.id)}`}
                      className={styles.JobDetailSidebarCard}
                    >
                      <Text
                        className={styles.JobDetailSidebarCardTitle}
                        textStyle='base'
                        tagName='p'
                        bold
                      >
                        {course.truncated_name}
                      </Text>
                      <div className={styles.JobDetailSidebarCardCourseDetail}>
                        <Text textStyle='base' textColor='darkgrey'>
                          {course.level_value}
                        </Text>
                        <Text textStyle='base' textColor='darkgrey'>
                          {course.method_value}
                        </Text>
                        <Text textStyle='base' textColor='darkgrey'>
                          {numberWithCommas(course.price)}
                        </Text>
                      </div>
                      <div>
                        <Text
                          textStyle='base'
                          tagName='p'
                          bold
                          className={styles.JobDetailSidebarCardCTA}
                        >
                          Start now
                        </Text>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalReportJob
        isShowReportJob={isShowReportJob}
        handleShowReportJob={setIsShowReportJob}
        reportJobReasonList={reportJobReasonList}
        selectedJobId={jobDetail.id}
        handlePostReportJob={handlePostReportJob}
        isPostingReport={isPostingReport}
        postReportResponse={postReportResponse}
      />

      <ModalShare
        jobDetailUrl={jobDetailUrl}
        isShowModalShare={isShowModalShare}
        handleShowModalShare={setIsShowModalShare}
      />
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query, req }) => {
  const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null
  const { keyword, isApplied } = query
  const keywordQuery: any = keyword
  const jobId = keywordQuery?.split('-').pop()

  if (jobId) {
    // store actions
    if (isApplied === 'true') {
      store.dispatch(fetchAppliedJobDetailRequest(jobId))
    } else {
      store.dispatch(
        fetchJobDetailRequest({
          jobId,
          status: accessToken ? 'protected' : 'public',
          serverAccessToken: accessToken,
        })
      )
    }
  }

  store.dispatch(fetchConfigRequest())
  store.dispatch(END)

  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const jobDetail = storeState.job?.jobDetail
  const appliedJobDetail = storeState.job?.appliedJobDetail
  const config = storeState.config.config.response

  if (jobDetail || appliedJobDetail) {
    if (jobDetail.error || appliedJobDetail.error) {
      return {
        notFound: true,
      }
    }
    const {
      id: jobId,
      job_title: jobTitle,
      company: { name },
      categories,
      full_address: fullAddress,
      location,
    } = jobDetail?.response?.id ? jobDetail?.response : appliedJobDetail?.response?.job
    let categoryMetaText = ''
    categories.forEach((el) => {
      categoryMetaText += `${el.value}, `
    })
    categoryMetaText = categoryMetaText.slice(0, categoryMetaText.length - 2)
    categoryMetaText += ' - related job opportunities'
    const seoMetaTitle = `${name} is hiring ${jobTitle} - ${jobId} | Bossjob`
    const seoMetaDescription = `Apply for ${jobTitle} (${jobId}) at ${name}. Discover more ${categoryMetaText} in ${
      location.value
    }, ${fullAddress.split(',').pop()} on Bossjob now!`
    return {
      props: {
        config,
        jobDetail: jobDetail?.response?.id ? jobDetail?.response : appliedJobDetail?.response?.job,
        applicationHistory: appliedJobDetail?.response?.application_histories || null,
        accessToken,
        seoMetaTitle,
        seoMetaDescription,
        seoCanonicalUrl: `/job/${keywordQuery}`,
      },
    }
  }
})

export default Job
