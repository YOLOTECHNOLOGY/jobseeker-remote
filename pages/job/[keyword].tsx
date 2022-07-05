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
import ReadMore from 'components/ReadMore'
import JobDetailSidebarCard from 'components/Loader/JobDetailSidebarCard'
import MaterialTextFieldWithSuggestionList from 'components/MaterialTextFieldWithSuggestionList'
import MaterialLocationField from 'components/MaterialLocationField'
import ModalVerifyEmail from 'components/ModalVerifyEmail'
import AdSlot from 'components/AdSlot'

import ModalShare from 'components/ModalShare'
import ModalReportJob from 'components/ModalReportJob'
import QuickApplyModal from 'components/QuickApplyModal'

/* Helpers */
import { getCookie, setCookie } from 'helpers/cookies'
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
import { deleteSaveJobRequest } from 'store/actions/jobs/deleteSaveJob'

import { fetchUserOwnDetailService } from 'store/services/users/fetchUserOwnDetail'

/* Styles */
import styles from './Job.module.scss'
import breakpointStyles from 'styles/breakpoint.module.scss'

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
  DefaultAvatar,
} from 'images'

interface IJobDetail {
  jobDetail: any
  applicationHistory: any
  config: any
  accessToken: any
  seoMetaTitle: string
  seoMetaDescription: string
  seoCanonicalUrl: string
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
  const applyJobLink = getApplyJobLink(jobDetail, userCookie, accessToken)

  const [isSavedJob, setIsSavedJob] = useState(jobDetail?.is_saved)
  const [isShowModalShare, setIsShowModalShare] = useState(false)
  const [isShowReportJob, setIsShowReportJob] = useState(false)
  const [jobDetailOption, setJobDetailOption] = useState(false)
  const [suggestionList, setSuggestionList] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [locationValue, setLocationValue] = useState(null)
  const [isShowModal, setIsShowModal] = useState(false)

  const [jobDetailUrl, setJobDetailUrl] = useState('/')
  const [companyUrl, setCompanyUrl] = useState('/')
  const [recommendedCourses, setRecommendedCourses] = useState([])
  const [similarJobs, setSimilarJobs] = useState(null)
  const [quickApplyModalShow, setQuickApplyModalShow] = useState(false)

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
        remove: /[*+~.()'"!#:/@]/g,
      })}-${id}`
    }
    return ''
  }

  const handleBenefitIcon = (benefit) => {
    const Icon = `${benefit.replace(/ /g, '')}Icon`

    switch (Icon) {
      case 'EquityIncentiveIcon':
        return <img src={EquityIncentiveIcon} alt='logo' width='22' height='22' />
      case 'MealAllowanceIcon':
        return <img src={MealAllowanceIcon} alt='logo' width='22' height='22' />
      case 'EmployeeStockPurchaseIcon':
        return <img src={EmployeeStockPurchaseIcon} alt='logo' width='22' height='22' />
      case 'HousingAllowanceIcon':
        return <img src={HousingAllowanceIcon} alt='logo' width='22' height='22' />
      case 'CommissionIcon':
        return <img src={CommissionIcon} alt='logo' width='22' height='22' />
      case 'PerformanceBonusIcon':
        return <img src={PerformanceBonusIcon} alt='logo' width='22' height='22' />
      case 'TelecommunicationAllowanceIcon':
        return <img src={TelecommunicationAllowanceIcon} alt='logo' width='22' height='22' />
      default:
        return <img src={OtherAllowancesIcon} alt='logo' width='22' height='22' />
    }
  }

  const isAppliedQueryParam = router.query.isApplied
  const hasApplied = isAppliedQueryParam === 'true' ? true : false

  const handlePostSaveJob = () => {
    if (userCookie) {
      if (!isSavedJob) {
        setIsSavedJob(true)

        const postSaveJobPayload = {
          jobId: jobDetail?.id,
          user_id: userCookie.id,
        }

        dispatch(postSaveJobRequest(postSaveJobPayload))
      } else {
        setIsSavedJob(false)

        const deleteJobPayload = {
          jobId: jobDetail?.id,
        }

        dispatch(deleteSaveJobRequest(deleteJobPayload))
      }
    } else {
      router.push(`/login/jobseeker?redirect=${router.asPath}`)
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
      size: 3,
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
      pathname: `/jobs-hiring/${queryParam ? queryParam : 'job-search'}`,
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

  const handleCloseModal = () => {
    setIsShowModal(false)
  }

  const handleVerifyEmailClick = async () => {
    // revalidate verify email status
    const response = await fetchUserOwnDetailService({ accessToken: accessToken })
    const userDetails = response?.data?.data
    const isVerifiedEmail = userDetails?.is_email_verify

    if (!isVerifiedEmail) {
      // email is not verified
      setIsShowModal(true)
    } else {
      // email is verified and user cookie is outdated
      const userCookie = {
        active_key: userDetails.active_key,
        id: userDetails.id,
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        email: userDetails.email,
        phone_num: userDetails.phone_num,
        is_mobile_verified: userDetails.is_mobile_verified,
        avatar: userDetails.avatar,
        additional_info: userDetails.additional_info,
        is_email_verify: true,
        notice_period_id: userDetails.notice_period_id,
        is_profile_completed: userDetails.is_profile_completed,
      }

      setCookie('user', userCookie)
      router.reload()
    }
  }

  return (
    <Layout>
      <SEO
        title={seoMetaTitle}
        description={seoMetaDescription}
        canonical={seoCanonicalUrl}
        jobDetail={jobDetail}
      />
      <div className={styles.searchAndLocationContainer}>
        <MaterialTextFieldWithSuggestionList
          id='search'
          label='Search for job title or company name'
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
              setSuggestionList([])
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
          <Text bold textColor='white'>
            Search
          </Text>
        </MaterialButton>
      </div>
      <div className={styles.jobDetail}>
        <div className={styles.jobDetailContent}>
          <div className={styles.jobDetailPrimary}>
            <div
              className={styles.jobDetailPrimaryOptions}
              onClick={() => setJobDetailOption(!jobDetailOption)}
            >
              <img src={MoreIcon} width='20' height='20' />
            </div>

            {jobDetailOption && (
              <div className={styles.jobDetailOptionList}>
                <div
                  className={styles.jobDetailOptionItem}
                  onClick={() => setIsShowModalShare(true)}
                >
                  <Text textStyle='lg'>Share this job</Text>
                </div>
                <div
                  className={styles.jobDetailOptionItem}
                  onClick={() => setIsShowReportJob(true)}
                >
                  <Text textStyle='lg'>Report job</Text>
                </div>
              </div>
            )}
            <img
              src={jobDetail?.company?.logo}
              className={styles.jobDetailPrimaryInfoImage}
              alt={`${jobDetail?.company?.name} logo`}
            />
            <div className={styles.jobDetailPrimaryInfoWrapper}>
              <div className={styles.jobDetailPrimaryInfo}>
                <Text textStyle='xl' tagName='h1' bold className={styles.jobDetailPrimaryInfoTitle}>
                  {jobDetail?.job_title}
                </Text>
                <Link to={companyUrl}>
                  <Text textStyle='lg' className={styles.jobDetailCompany}>
                    {jobDetail?.company?.name}
                  </Text>
                </Link>
              </div>
              <div
                className={classNamesCombined([
                  styles.jobDetailCTA,
                  breakpointStyles.hideOnMobileAndTablet,
                ])}
              >
                {!isAppliedQueryParam && (
                  <div className={styles.jobDetailPrimaryActions}>
                    {jobDetail?.status_key === 'active' && (
                      <>
                        {jobDetail?.is_applied ? (
                          <MaterialButton variant='contained' capitalize disabled>
                            <Text textColor='white' bold>
                              Applied
                            </Text>
                          </MaterialButton>
                        ) : (
                          <MaterialButton
                            variant='contained'
                            capitalize
                            onClick={(e) => {
                              if (!userCookie) {
                                e.preventDefault()
                                setQuickApplyModalShow(true)
                              } else {
                                if (!userCookie.is_email_verify) {
                                  handleVerifyEmailClick()
                                } else {
                                  router.push(applyJobLink)
                                }
                              }
                            }}
                          >
                            <Text textColor='white' bold>
                              Apply Now
                            </Text>
                          </MaterialButton>
                        )}
                      </>
                    )}
                    {jobDetail?.status_key !== 'active' && (
                      <Text textStyle='base' className={styles.jobDetailStatus}>
                        <img src={ExpireIcon} height='16' width='16' />
                        <span>This job is no longer hiring</span>
                      </Text>
                    )}
                    <MaterialButton
                      variant='outlined'
                      capitalize
                      onClick={() => handlePostSaveJob()}
                    >
                      <Text textColor='primary' bold>
                        {isSavedJob ? 'Saved' : 'Save Job'}
                      </Text>
                    </MaterialButton>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.jobDetailPrimarySub}>
              {jobDetail?.is_featured && <JobTag tag='Featured' tagType='featured' />}
              {jobDetail?.is_urgent && <JobTag tag='Urgent' tagType='urgent' />}
              <JobTag tag={jobDetail?.job_type_value} />
            </div>
            <Text textStyle='base' textColor='darkgrey' className={classNamesCombined([styles.jobDetailPostedAt, breakpointStyles.hideOnMobileAndTablet])}>
              Posted on {jobDetail?.published_at}
            </Text>
          </div>
          <div
            className={classNamesCombined([styles.jobDetailCTA, breakpointStyles.hideOnDesktop])}
          >
            {!isAppliedQueryParam && (
              <div className={styles.jobDetailPrimaryActions}>
                {jobDetail?.status_key === 'active' && (
                  <>
                    {jobDetail?.is_applied ? (
                      <MaterialButton variant='contained' capitalize disabled>
                        <Text textColor='white' bold>
                          Applied
                        </Text>
                      </MaterialButton>
                    ) : (
                      <MaterialButton
                        variant='contained'
                        capitalize
                        onClick={(e) => {
                          if (!userCookie) {
                            e.preventDefault()
                            setQuickApplyModalShow(true)
                          } else {
                            if (!userCookie.is_email_verify) {
                              handleVerifyEmailClick()
                            } else {
                              router.push(applyJobLink)
                            }
                          }
                        }}
                      >
                        <Text textColor='white' bold>
                          Apply Now
                        </Text>
                      </MaterialButton>
                    )}
                  </>
                )}
                {jobDetail?.status_key !== 'active' && (
                  <Text textStyle='base' className={styles.jobDetailStatus}>
                    <img src={ExpireIcon} height='16' width='16' />
                    <span>This job is no longer hiring</span>
                  </Text>
                )}
                <MaterialButton variant='outlined' capitalize onClick={() => handlePostSaveJob()}>
                  <Text textColor='primary' bold>
                    {isSavedJob ? 'Saved' : 'Save Job'}
                  </Text>
                </MaterialButton>
              </div>
            )}
            <Text textStyle='base' textColor='darkgrey' className={styles.jobDetailPostedAt}>
              Posted on {jobDetail?.published_at}
            </Text>
          </div>
          <div className={styles.jobDetailPref}>
            <ul className={styles.jobDetailPrefList}>
              <li className={styles.jobDetailPrefItem}>
                <img src={LocationIcon} alt='logo' width='18' height='18' />
                <span className={styles.jobDetailPrefText}>
                  <Text textStyle='lg' className={styles.jobDetailPrefField}>
                    Location
                  </Text>
                  <Link to={'/'} className={styles.jobDetailHoverItem}>
                    <Text textStyle='lg' bold className={styles.jobDetailPrefValue}>
                      {jobDetail?.location?.value}
                    </Text>
                  </Link>
                </span>
              </li>
              <li className={styles.jobDetailPrefItem}>
                <img src={BriefcaseIcon} alt='logo' width='20' height='20' />
                <span className={styles.jobDetailPrefText}>
                  <Text textStyle='lg' className={styles.jobDetailPrefField}>
                    Experience
                  </Text>
                  <Text textStyle='lg' bold className={styles.jobDetailPrefValue}>
                    {jobDetail?.xp_lvl?.value}
                  </Text>
                </span>
              </li>
              <li className={styles.jobDetailPrefItem}>
                <img src={EducationIcon} alt='logo' width='20' height='20' />
                <span className={styles.jobDetailPrefText}>
                  <Text textStyle='lg' className={styles.jobDetailPrefField}>
                    Education
                  </Text>
                  <Text textStyle='lg' bold className={styles.jobDetailPrefValue}>
                    {jobDetail?.degree?.value}
                  </Text>
                </span>
              </li>
              <li className={styles.jobDetailPrefItem}>
                <img src={SalaryIcon} alt='logo' width='20' height='20' />
                <span className={styles.jobDetailPrefText}>
                  <Text textStyle='lg' className={styles.jobDetailPrefField}>
                    Salary
                  </Text>
                  <Text textStyle='lg' bold className={styles.jobDetailPrefValue}>
                    {jobDetail?.salary_range_value}
                  </Text>
                </span>
              </li>
            </ul>
          </div>
          {hasApplied && (
            <div className={styles.jobDetailApplicationWrapper}>
              <Text textStyle='lg' bold>
                Application History
              </Text>
              <Timeline className={styles.jobDetailApplicationTimeline}>
                {applicationHistory?.map((history, i) => (
                  <TimelineItem key={i}>
                    <TimelineSeparator>
                      <TimelineDot
                        className={i === 0 ? styles.jobDetailApplicationTimelineFirst : ''}
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
          <div className={styles.jobDetailSection}>
            <Text textStyle='xl' tagName='h2' bold className={styles.jobDetailSectionTitle}>
              Job Description
            </Text>
            <div
              className={classNamesCombined([
                styles.jobDetailSectionBody,
                styles.jobDetailDescriptionSectionBody,
              ])}
              dangerouslySetInnerHTML={{ __html: jobDetail?.job_description_html }}
            />
          </div>
          <div className={styles.jobDetailSection}>
            <Text textStyle='xl' tagName='h2' bold className={styles.jobDetailSectionTitle}>
              Requirements
            </Text>
            <div
              className={classNamesCombined([
                styles.jobDetailSectionBody,
                styles.jobDetailRequirementSectionBody,
              ])}
              dangerouslySetInnerHTML={{ __html: jobDetail?.job_requirements_html }}
            />
          </div>

          {jobDetail?.benefits.length > 0 && (
            <div className={styles.jobDetailSection}>
              <Text textStyle='xl' tagName='h2' bold className={styles.jobDetailSectionTitle}>
                Benefits
              </Text>
              <ul className={styles.jobDetailBenefitsList}>
                {jobDetail?.benefits?.map((benefit, i) => (
                  <li className={styles.jobDetailBenefitsItem} key={i}>
                    {handleBenefitIcon(benefit.name)}
                    <Text textStyle='lg' className={styles.jobDetailBenefitsText}>
                      {benefit.name}
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {jobDetail?.skills.length > 0 && (
            <div className={styles.jobDetailSection}>
              <Text textStyle='xl' tagName='h2' bold className={styles.jobDetailSectionTitle}>
                Skills/Software
              </Text>
              <ul className={styles.jobDetailSkillsList}>
                {jobDetail?.skills?.map((skill, i) => (
                  <li className={styles.jobDetailSkillsItem} key={i}>
                    <Text textStyle='sm' className={styles.jobDetailSkillsText}>
                      {skill.value}
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.jobDetailSection}>
            <Text textStyle='xl' bold className={styles.jobDetailSectionTitle}>
              Additional Information
            </Text>
            <Text textStyle='lg' tagName='h2' bold className={styles.jobDetailSectionSubTitle}>
              Working Location
            </Text>
            <Text textStyle='lg' className={styles.jobDetailSectionSubBody}>
              {jobDetail?.full_address}
            </Text>
            <Text textStyle='lg' tagName='h2' bold className={styles.jobDetailSectionSubTitle}>
              Specialization
            </Text>
            {jobDetail?.categories?.map((category, i) => (
              <span key={i}>
                <Link
                  to={`/jobs-hiring/${category.key}-jobs`}
                  className={styles.jobDetailSectionSubBody}
                  external
                >
                  <Text textStyle='base' className={styles.jobDetailSectionSubBodyLink}>
                    {' '}
                    {category.value}
                    {jobDetail.categories.length === i + 1 ? '' : ','}
                  </Text>
                </Link>
              </span>
            ))}
          </div>
          {jobDetail?.recruiter && (
            <div className={styles.jobDetailRecruiter}>
              <Text textStyle='xl' bold>
                Connect directly to recruiter after applying
              </Text>
              <div className={styles.jobDetailRecruiterInfo}>
                <div
                  className={styles.jobDetailRecruiterInfoImage}
                  style={{
                    backgroundImage: `url(${jobDetail?.recruiter.avatar || DefaultAvatar})`,
                  }}
                />
                <div className={styles.jobDetailRecruiterInfoText}>
                  <div className={styles.jobDetailRecruiterName}>
                    <Text textStyle='lg' bold>
                      {jobDetail?.recruiter.full_name},{' '}
                    </Text>
                    <Text textStyle='lg'>
                      &nbsp;{jobDetail?.recruiter.work_experience.job_title}
                    </Text>
                  </div>
                  <div className={styles.jobDetailRecruiterContent}>
                    <Text textStyle='lg' textColor='darkgrey'>
                      <img src={RateIcon} height='14' width='15' />
                      {jobDetail?.recruiter.response_rate}% response rate, responds{' '}
                      {jobDetail?.recruiter.response_time}
                    </Text>
                    <Text textStyle='lg' textColor='darkgrey'>
                      <img src={LocationPinIcon} height='14' width='15' />
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
        <div className={styles.jobDetailSidebar}>
          <div className={styles.sideSquareBanner}>
            <AdSlot adSlot='job-detail/square-banner-1' />
          </div>
          {!isSimilarJobsFetching && similarJobs?.length > 0 ? (
            <div className={styles.jobDetailSidebarContent}>
              <div className={styles.jobDetailSidebarSection}>
                <div className={styles.jobDetailSidebarTitle}>
                  <Text textStyle='xl' bold>
                    Similar Jobs
                  </Text>
                </div>
                <div className={styles.jobDetailSidebarCardList}>
                  {similarJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => handleRedirectToJob(job.truncated_job_title, job.id)}
                      className={styles.jobDetailSidebarCard}
                    >
                      <Link
                        to={`${handleFormatWindowUrl('job', job.truncated_job_title, job.id)}`}
                        aTag
                        external
                      >
                        <img
                          src={job?.company_logo}
                          className={styles.jobDetailSidebarCardImage}
                          alt={`${job?.company_name} logo`}
                        />
                      </Link>
                      <Link
                        to={`${handleFormatWindowUrl('job', job.truncated_job_title, job.id)}`}
                        aTag
                        external
                      >
                        <Text
                          className={styles.jobDetailSidebarCardTitle}
                          textStyle='lg'
                          tagName='p'
                          bold
                        >
                          {job.truncated_job_title || job.job_title}
                        </Text>
                      </Link>
                      <Text textStyle='lg' tagName='p'>
                        {job.company_name}
                      </Text>
                      <Text textStyle='lg' tagName='p'>
                        {job.location_value}
                      </Text>
                      <Text
                        textStyle='lg'
                        tagName='p'
                        className={styles.jobDetailSidebarCardSalary}
                      >
                        {job.salary_range_value}
                      </Text>
                      {job.refreshed_at && (
                        <Text textStyle='sm' tagName='p'>
                          Posted on {job.refreshed_at}
                        </Text>
                      )}
                      <Link
                        to={`${handleFormatWindowUrl('job', job.truncated_job_title, job.id)}`}
                        className={styles.jobDetailSidebarCardApply}
                      >
                        {job.published_at && (
                          <Text textStyle='sm' tagName='p'>
                            Posted on {job.published_at}
                          </Text>
                        )}
                      </Link>
                      <Link
                        to={`${handleFormatWindowUrl('job', job.truncated_job_title, job.id)}`}
                        className={styles.jobDetailSidebarCardApply}
                      >
                        <Text
                          textStyle='base'
                          tagName='p'
                          bold
                          className={styles.jobDetailSidebarCardCTA}
                        >
                          Apply Now
                        </Text>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : isSimilarJobsFetching ? (
            <div className={styles.jobDetailSidebarContent}>
              <JobDetailSidebarCard />
              <JobDetailSidebarCard />
              <JobDetailSidebarCard />
              <JobDetailSidebarCard />
              <JobDetailSidebarCard />
            </div>
          ) : null}

          {!isRecommendedCoursesFetching && recommendedCourses?.length > 0 ? (
            <div className={styles.jobDetailSidebarContent}>
              <div className={styles.jobDetailSidebarSection}>
                <div className={styles.jobDetailSidebarTitle}>
                  <Text textStyle='xl' bold>
                    Suggested Courses
                  </Text>
                </div>
                <div className={styles.jobDetailSidebarCardList}>
                  {recommendedCourses.map((course) => (
                    <div key={course.id} className={styles.jobDetailSidebarCard}>
                      <Link
                        key={course.id}
                        external
                        to={`${handleCoursePath(course.truncated_name, course.id)}`}
                      >
                        <img
                          src={course?.image}
                          className={styles.jobDetailSidebarCardImage}
                          alt={`${course?.truncated_name} logo`}
                        />
                      </Link>
                      <Link
                        key={course.id}
                        external
                        to={`${handleCoursePath(course.truncated_name, course.id)}`}
                      >
                        <Text
                          className={styles.jobDetailSidebarCardTitle}
                          textStyle='lg'
                          tagName='p'
                          bold
                        >
                          {course.truncated_name}
                        </Text>
                      </Link>
                      <div className={styles.jobDetailSidebarCardCourseDetail}>
                        <Text textStyle='lg' tagName='p'>
                          {course.level_value}
                        </Text>
                        <Text textStyle='lg' tagName='p'>
                          {course.method_value}
                        </Text>
                        <Text textStyle='lg' tagName='p'>
                          {course.price != '0.00' ? numberWithCommas(course.price) : 'Free'}
                        </Text>
                      </div>
                      <div>
                        <Link
                          key={course.id}
                          external
                          to={`${handleCoursePath(course.truncated_name, course.id)}`}
                        >
                          <Text
                            textStyle='base'
                            tagName='p'
                            bold
                            className={styles.jobDetailSidebarCardCTA}
                          >
                            Start now
                          </Text>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : isRecommendedCoursesFetching ? (
            <div className={styles.jobDetailSidebarContent}>
              <JobDetailSidebarCard />
              <JobDetailSidebarCard />
              <JobDetailSidebarCard />
              <JobDetailSidebarCard />
              <JobDetailSidebarCard />
            </div>
          ) : null}
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

      <QuickApplyModal
        jobDetails={jobDetail}
        applyJobLink={applyJobLink}
        modalShow={quickApplyModalShow}
        handleModalShow={setQuickApplyModalShow}
        config={config}
      />

      <ModalVerifyEmail
        email={userCookie ? userCookie.email : ''}
        isShowModal={isShowModal}
        handleModal={handleCloseModal}
        redirectLink={applyJobLink}
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
      store.dispatch(fetchAppliedJobDetailRequest({ jobId, accessToken }))
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
  console.log('jobDetail', jobDetail)
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
