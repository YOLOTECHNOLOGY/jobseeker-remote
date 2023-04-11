import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { isMobile } from 'react-device-detect'

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
  TimelineDot
} from '@mui/lab'
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'
import dynamic from 'next/dynamic'

/* Components */
import Layout from 'components/Layout'
import Text from 'components/Text'
import Link from 'components/Link'
import MaterialButton from 'components/MaterialButton'
// import SEO from 'components/SEO'
import JobTag from 'components/JobTag'
import ReadMore from 'components/ReadMore'
import JobDetailSidebarCard from 'components/Loader/JobDetailSidebarCard'
import MaterialTextFieldWithSuggestionList from 'components/MaterialTextFieldWithSuggestionList'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialDesktopTooltip from 'components/MaterialDesktopTooltip'
import MaterialMobileTooltip from 'components/MaterialMobileTooltip'
import UploadResumeButton from 'components/LncreaseUserConversion/UploadResumeButton/UploadResumeButton'
const ModalVerifyEmail = dynamic(() => import('components/ModalVerifyEmail'))
// import AdSlot from 'components/AdSlot'

const ModalShare = dynamic(() => import('components/ModalShare'))
const ModalReportJob = dynamic(() => import('components/ModalReportJob'))
import Dropdown from '../../components/Dropdown'
import AdSlot from '../../components/AdSlot'
const ModalWithdrawApplication = dynamic(() => import('components/ModalWithdrawApplication'))

/* Helpers */
import { getCookie, setCookie, removeCookie } from 'helpers/cookies'
import { numberWithCommas } from 'helpers/formatter'
import { userFilterSelectionDataParser, getApplyJobLink } from 'helpers/jobPayloadFormatter'
import useWindowDimensions from 'helpers/useWindowDimensions'
import { wrapper } from 'store'
import { fetchAppliedJobDetailRequest } from 'store/actions/jobs/fetchAppliedJobDetail'
import { fetchSimilarJobsRequest } from 'store/actions/jobs/fetchSimilarJobs'
// import { fetchRecommendedCoursesRequest } from 'store/actions/courses/fetchRecommendedCourses'
import { fetchJobDetailRequest } from 'store/actions/jobs/fetchJobDetail'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { postReportRequest } from 'store/actions/reports/postReport'
import { postSaveJobRequest } from 'store/actions/jobs/postSaveJob'
import { deleteSaveJobRequest } from 'store/actions/jobs/deleteSaveJob'
import { withdrawAppliedJobRequest } from 'store/actions/jobs/withdrawAppliedJob'
import { addExternalJobClickService } from 'store/services/jobs/addExternalJobClick'
import styles from './Job.module.scss'
import breakpointStyles from 'styles/breakpoint.module.scss'
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
  RateIcon,
  LocationPinIcon,
  BlueTickIcon,
  DefaultAvatar,
  CarIcon
} from 'images'
import RegisterModal from 'components/RegisterModal'
import { createChat } from 'helpers/interpreters/services/chat'
import { fetchSwitchJobService } from 'store/services/jobs/fetchSwitchJob'
import Modal from 'components/Modal'
import jobSource from 'helpers/jobSource'
import { updateImState } from 'store/actions/chat/imState'
interface IJobDetail {
  jobDetail: any
  applicationHistory: any
  // config: any
  accessToken: any
  // seoMetaTitle: string
  // seoMetaDescription: string
  // seoCanonicalUrl: string
}

const Job = ({
  jobDetail,
  applicationHistory,
  // config,
  accessToken,
  // seoMetaTitle,
  // seoMetaDescription,
  // seoCanonicalUrl
}: IJobDetail) => {
  const dispatch = useDispatch()
  const config = useSelector((store: any) => store?.config?.config?.response)
  useEffect(() => {
    dispatch(fetchConfigRequest())
  }, [])
  const router = useRouter()
  const { width } = useWindowDimensions()
  const prevScrollY = useRef(0)
  const userCookie = getCookie('user') || null
  const authCookie = accessToken
  const applyJobLink = getApplyJobLink(jobDetail, userCookie)

  const [isSticky, setIsSticky] = useState(false)
  const [openRegister, setOpenRegister] = useState(false)
  const [isSavedJob, setIsSavedJob] = useState(jobDetail?.is_saved)
  const [isShowModalShare, setIsShowModalShare] = useState(false)
  const [isShowReportJob, setIsShowReportJob] = useState(false)
  const [suggestionList, setSuggestionList] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)
  const [isWithdrawApplicationModal, setIsWithdrawApplicationModal] = useState(false)
  const jobDetailUrl = jobDetail?.['job_url'] || '/'
  const companyUrl = jobDetail?.['company']?.['company_url'] || '/'
  const [recommendedCourses, setRecommendedCourses] = useState([])
  const [similarJobs, setSimilarJobs] = useState(null)

  const cx = classNames.bind(styles)
  const isStickyClass = cx({ isSticky: isSticky })

  const reportJobReasonList = config && config && config.report_job_reasons

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
  const chatDetail = useMemo(() => {
    return jobDetail?.chat ?? {}
  }, [jobDetail])

  // Loading
  const isWithdrawAppliedJobFetching = useSelector(
    (store: any) => store.job.withdrawAppliedJob.fetching
  )

  // is Show Withdraw Application Button
  const isShowApplicationHistory = useSelector((store: any) => {
    const applicationHistory = store.job.appliedJobDetail.response?.application_histories
    if (applicationHistory?.length > 0) {
      return applicationHistory[0].value.includes('withdrawn')
    }
  })

  const isUnBingwithdrawAppliedStateSuccess = useSelector((store: any) => {
    const withdrawAppliedState = store.job.withdrawAppliedJob.response
    if (withdrawAppliedState.message === 'success') {
      return true
    }
    return false
  })

  useEffect(() => {
    window.addEventListener('scroll', updateScrollPosition)

    return () => window.removeEventListener('scroll', updateScrollPosition)
  }, [])

  useEffect(() => {
    // handleFetchRecommendedCourses()
    handleFetchSimilarJobs()
  }, [jobDetail])

  useEffect(() => {
    if (recommendedCoursesResponse?.data?.length > 0)
      setRecommendedCourses(recommendedCoursesResponse.data)
  }, [recommendedCoursesResponse])

  useEffect(() => {
    if (similarJobsResponse) setSimilarJobs(similarJobsResponse)
  }, [similarJobsResponse])

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
      case 'TransportAllowanceIcon':
        return <img src={CarIcon} alt='logo' width='22' height='22' />
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
          user_id: userCookie.id
        }

        dispatch(postSaveJobRequest(postSaveJobPayload))
      } else {
        setIsSavedJob(false)
        const deleteJobPayload = {
          jobId: jobDetail?.id
        }
        dispatch(deleteSaveJobRequest(deleteJobPayload))
      }
    } else {
      router.push(`/get-started?redirect=${router.asPath}`)
    }
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

  // const getJobDetailCategoryIds = () => {
  //   const jobCategoryIds = []
  //   jobDetail?.categories?.map((cat) => {
  //     jobCategoryIds.push(cat.id)
  //   })
  //   return jobCategoryIds?.length > 0 ? jobCategoryIds.join(',') : null
  // }

  // const handleFetchRecommendedCourses = () => {
  //   const payload = {
  //     size: 3,
  //     job_category_ids: getJobDetailCategoryIds(),
  //     xp_lvl_key: jobDetail?.xp_lvl.key
  //   }
  //   dispatch(fetchRecommendedCoursesRequest(payload))
  // }

  const handleFetchSimilarJobs = () => dispatch(fetchSimilarJobsRequest({ jobId: jobDetail.id }))

  const handleCoursePath = (title, id) => {
    return `${process.env.ACADEMY_CLIENT_URL}/course/${slugify(title || '', {
      lower: true,
      remove: /[*+~.()'"!:@]/g
    })}-${id}`
  }

  const handleSuggestionSearch = (val) => {
    if (val !== '') {
      fetch(`${process.env.JOB_BOSSJOB_URL}/suggested-search?size=5&query=${val}`)
        .then((resp) => resp.json())
        .then((data) => setSuggestionList(data.data.items))
    }
  }

  const updateScrollPosition = () => {
    if (width > 799) {
      prevScrollY.current = window.pageYOffset
      setIsSticky(prevScrollY.current >= 389 ? true : false)
    } else {
      prevScrollY.current = window.pageYOffset
      setIsSticky(prevScrollY.current >= 592 ? true : false)
    }
  }

  const updateUrl = (queryParam) => {
    const queryObject = {
      page: 1,
      sort: 2
    }

    router.push(
      {
        pathname: `/jobs-hiring/${queryParam ? slugify(queryParam) : 'job-search'}`,
        query: queryObject
      },
      undefined,
      { shallow: true }
    )
  }

  const onLocationSearch = (event, value) => {
    const isClear = !value
    const { searchQuery } = userFilterSelectionDataParser(
      'location',
      value,
      router.query,
      config,
      isClear
    )
    updateUrl(searchQuery)
  }

  const onSearch = (value = searchValue) => {
    // convert any value with '-' to '+' so that when it gets parsed from URL, we are able to map it back to '-'
    const sanitisedVal = value.replace('-', '+')
    const { searchQuery } = userFilterSelectionDataParser(
      'query',
      sanitisedVal,
      router.query,
      config
    )
    updateUrl(searchQuery)
  }

  const handleCloseModal = (isOTPVerified) => {
    setIsShowModal(false)
    if (isOTPVerified) {
      router.push(applyJobLink)
    }
  }

  const handleWithdrawApplication = async ({ jobId }) => {
    const payload = {
      jobId
    }
    // unbing withdrawApplied
    await dispatch(withdrawAppliedJobRequest(payload))
  }

  const handleReportJob = () => {
    if (authCookie && userCookie) {
      setIsShowReportJob(true)
    } else {
      // mobile get jobDetail is by url id
      setCookie('isMobileReportJob', true)
      router.push('/get-started?redirect=' + jobDetail.job_url)
    }
  }

  const handleChat = () => {
    if (!userCookie || !authCookie) {
      const source = jobSource()
      localStorage.setItem('isChatRedirect', `/chat-redirect/${jobDetail?.id}?source=${source}`)
      setOpenRegister(true)
    } else if (jobDetail?.external_apply_url) {
      addExternalJobClickService(jobDetail?.id)
      const link = getApplyJobLink(jobDetail, userCookie)
      window.open(link)
    } else if (chatDetail.is_exists) {
      if (chatDetail.job_id !== jobDetail?.id) {
        setShowModal(true)
      } else {
        router.push(`/chat/${chatDetail?.chat_id}`)
      }
    } else {
      setLoading(true)
      const source = jobSource()
      createChat(jobDetail?.id, { source })
        .then((result) => {
          const chatId = result.data.data.id
          const newData = {
            ...result.data?.data?.job_application,
            initiated_role: result.data?.data?.initiated_role,
            chatStatus: result.data?.data?.status
          }
          dispatch(updateImState({ chatId, imState: newData }))
          router.push(`/chat/${chatId}`)
        })
        .catch(() => {
          router.push(`/chat`)
        })
        .finally(() => setLoading(false))
    }
  }
  const requestSwitch = useCallback(() => {
    setLoading(true)
    fetchSwitchJobService({
      status: 'protected',
      job_id: jobDetail.id,
      applicationId: chatDetail.job_application_id
    })
      .then(() => {
        router.push(`/chat/${chatDetail.chat_id}`)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [jobDetail.id, chatDetail?.job_application_id, chatDetail?.chat_id])
  const renderSaveAndApplyActions = () => {
    return (
      <div
        className={classNamesCombined([
          styles.jobDetailCTA,
          breakpointStyles.hideOnMobileAndTablet
        ])}
      >
        {!isAppliedQueryParam && (
          <div className={classNamesCombined([styles.jobDetailPrimaryActions, isStickyClass])}>
            {jobDetail?.status_key === 'active' ? (
              <>
                <MaterialButton
                  variant='contained'
                  capitalize
                  className={styles.applyBtn}
                  isLoading={loading}
                  onClick={handleChat}
                >
                  <Text textColor='white' bold>
                    {(() => {
                      if (jobDetail?.external_apply_url) {
                        return 'Apply Now'
                      } else if (chatDetail.is_exists && chatDetail.job_id === jobDetail.id) {
                        return 'Continue Chat'
                      } else {
                        return 'Chat Now'
                      }
                    })()}
                  </Text>
                </MaterialButton>
                <MaterialButton variant='outlined' capitalize onClick={() => handlePostSaveJob()}>
                  <Text textColor='primary' bold>
                    {isSavedJob ? 'Saved' : 'Save'}
                  </Text>
                </MaterialButton>
              </>
            ) : (
              // <MaterialButton variant='outlined' capitalize onClick={() => handlePostSaveJob()}>
              //   <Text textColor='primary' bold>
              //     {isSavedJob ? 'Saved' : 'Save'}
              //   </Text>
              // </MaterialButton>
              <></>
            )}
          </div>
        )}
      </div>
    )
  }

  const mobileRenderSaveAndApplyActions = () => {
    if (jobDetail?.status_key === 'active') {
      return (
        <div className={classNamesCombined([styles.jobDetailPrimaryActions, isStickyClass])}>
          <MaterialButton
            variant='outlined'
            capitalize
            className={styles.saveBtn}
            onClick={() => handlePostSaveJob()}
          >
            <Text textColor='primary' bold>
              {isSavedJob ? 'Saved' : 'Save'}
            </Text>
          </MaterialButton>
          <MaterialButton
            variant='contained'
            capitalize
            isLoading={loading}
            className={styles.applyBtn}
            onClick={handleChat}
          >
            <Text textColor='white' bold>
              {(() => {
                if (jobDetail?.external_apply_url) {
                  return 'Apply Now'
                } else if (chatDetail.is_exists && chatDetail.job_id === jobDetail.id) {
                  return 'Continue Chat'
                } else {
                  return 'Chat Now'
                }
              })()}
            </Text>
          </MaterialButton>
        </div>
      )
    } else {
      return (
        <div className={classNamesCombined([styles.jobDetailPrimaryActions, isStickyClass])}>
          <MaterialButton
            variant='outlined'
            capitalize
            className={styles.saveBtn}
            onClick={() => handlePostSaveJob()}
          >
            <Text textColor='primary' bold>
              {isSavedJob ? 'Saved' : 'Save'}
            </Text>
          </MaterialButton>
        </div>
      )
    }
  }

  const renderJobDetailPrimarySection = () => {
    return (
      <div className={classNamesCombined([styles.jobDetailPrimaryInfo, isStickyClass])}>
        <Text
          textStyle='xl'
          tagName='h1'
          bold
          className={classNamesCombined([styles.jobDetailPrimaryInfoTitle, isStickyClass])}
        >
          {jobDetail?.job_title}
        </Text>
        <div className={classNamesCombined([styles.jobDetailCompany, isStickyClass])}>
          <Link to={`${process.env.HOST_PATH}${companyUrl}`} external>
            <Text textStyle='lg' className={styles.jobDetailCompanyName}>
              {jobDetail?.company?.name}
            </Text>
          </Link>
          {jobDetail?.company?.is_verify &&
            (isMobile ? (
              <MaterialMobileTooltip
                icon={BlueTickIcon}
                className={styles.companyIsVerifiedToolTip}
                title='Verified'
                style={{ marginTop: '7px' }}
              />
            ) : (
              <MaterialDesktopTooltip
                icon={BlueTickIcon}
                className={styles.companyIsVerifiedToolTip}
                title='Verified'
                style={{ marginTop: '7px' }}
              />
            ))}
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (getCookie('isMobileReportJob') && authCookie && userCookie) {
      setIsShowReportJob(true)
      removeCookie('isMobileReportJob')
    }
  }, [])

  const handleQuickUploadResumeClick = () => {
    router.push('/quick-upload-resume')
  }

  return (
    <Layout>
      {/* <SEO
        title={seoMetaTitle}
        description={seoMetaDescription}
        canonical={seoCanonicalUrl}
        jobDetail={jobDetail}
        imageUrl={jobDetail?.company?.logo}
      /> */}

      <Modal
        showModal={showModal}
        handleModal={() => setShowModal(false)}
        firstButtonIsClose={false}
        handleFirstButton={() => setShowModal(false)}
        handleSecondButton={requestSwitch}
        isFirstButtonLoading={loading}
        isSecondButtonLoading={loading}
        firstButtonText='Cancel'
        secondButtonText='Proceed'
        headerTitle={'Chat with ' + jobDetail?.recruiter?.full_name ?? ''}
      >
        <p>
          You are currently chatting with recruiter for the{' '}
          {chatDetail?.job?.job_title ?? chatDetail?.job?.function_job_title ?? 'this job'}{' '}
          position. Are you sure you want to switch job?
        </p>
      </Modal>
      {openRegister && (
        <RegisterModal openRegister={openRegister} setOpenRegister={setOpenRegister} />
      )}

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
            <div className={styles.jobDetailPrimaryOptions}>
              <Dropdown>
                {hasApplied &&
                  !isShowApplicationHistory &&
                  !isUnBingwithdrawAppliedStateSuccess && ( // !isShowApplicationHistory
                    <div
                      className={styles.jobDetailOptionItem}
                      onClick={() => setIsWithdrawApplicationModal(true)}
                    >
                      <Text>Withdraw Application</Text>
                    </div>
                  )}
                <div
                  className={styles.jobDetailOptionItem}
                  onClick={() => setIsShowModalShare(true)}
                >
                  <Text textStyle='lg'>Share this job</Text>
                </div>
                <div className={styles.jobDetailOptionItem} onClick={handleReportJob}>
                  <Text textStyle='lg'>Report job</Text>
                </div>
              </Dropdown>
            </div>
            <img
              src={jobDetail?.company?.logo}
              className={styles.jobDetailPrimaryInfoImage}
              alt={`${jobDetail?.company?.name} logo`}
            />
            {width > 799 && isSticky ? (
              <div
                className={classNamesCombined([styles.jobDetailPrimaryInfoWrapper, isStickyClass])}
              >
                <div className={styles.jobDetailPrimaryInfoWrapperContainer}>
                  {renderJobDetailPrimarySection()}
                  {renderSaveAndApplyActions()}
                </div>
              </div>
            ) : (
              <div className={styles.jobDetailPrimaryInfoWrapper}>
                {renderJobDetailPrimarySection()}
                {renderSaveAndApplyActions()}
              </div>
            )}

            <div className={styles.jobDetailPrimarySub}>
              {jobDetail?.is_featured && <JobTag tag='Featured' tagType='featured' />}
              {jobDetail?.is_urgent && <JobTag tag='Urgent' tagType='urgent' />}
              <JobTag tag={jobDetail?.job_type_value} />
            </div>
            <Text
              textStyle='base'
              textColor='darkgrey'
              className={classNamesCombined([
                styles.jobDetailPostedAt,
                breakpointStyles.hideOnMobileAndTablet
              ])}
            >
              Posted on {jobDetail?.published_at}
            </Text>
            {jobDetail?.status_key !== 'active' && (
              <Text
                textStyle='base'
                className={classNamesCombined([
                  styles.jobDetailStatus,
                  breakpointStyles.hideOnMobileAndTablet
                ])}
              >
                <img src={ExpireIcon} height='16' width='16' />
                <span>This job is no longer hiring</span>
              </Text>
            )}
          </div>
          <div
            className={classNamesCombined([styles.jobDetailCTA, breakpointStyles.hideOnDesktop])}
          >
            {!isAppliedQueryParam && mobileRenderSaveAndApplyActions()}
            <Text textStyle='base' textColor='darkgrey' className={styles.jobDetailPostedAt}>
              Posted on {jobDetail?.published_at}
            </Text>
            {jobDetail?.status_key !== 'active' && (
              <Text textStyle='base' className={styles.jobDetailStatus}>
                <img src={ExpireIcon} height='16' width='16' />
                <span>This job is no longer hiring</span>
              </Text>
            )}
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
                styles.jobDetailDescriptionSectionBody
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
                styles.jobDetailRequirementSectionBody
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
                    <Text textStyle='base' textColor='white'>
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
            {/* <Text textStyle='lg' tagName='h2' bold className={styles.jobDetailSectionSubTitle}>
              Specialization
            </Text>
            {jobDetail?.categories?.map((category, i) => (
              <span key={i}>
                <Link
                  to={`${process.env.HOST_PATH}/jobs-hiring/${category.key}-jobs`}
                  className={styles.jobDetailSectionSubBody}
                  external
                >
                  <Text textStyle='lg' className={styles.jobDetailSectionSubBodyLink}>
                    {' '}
                    {category.value}
                    {jobDetail.categories.length === i + 1 ? '' : ','}
                  </Text>
                </Link>
              </span>
            ))} */}
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
                    backgroundImage: `url(${jobDetail?.recruiter.avatar || DefaultAvatar})`
                  }}
                />
                <div className={styles.jobDetailRecruiterInfoText}>
                  <div className={styles.jobDetailRecruiterName}>
                    <Text textStyle='lg' bold>
                      {jobDetail?.recruiter.full_name},{' '}
                    </Text>
                    <Text textStyle='lg'>
                      &nbsp;{jobDetail?.recruiter?.work_experience?.job_title}
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
            <Link
              to={`${process.env.HOST_PATH}${companyUrl}`}
              external
              className={styles.aboutCompanyTitle}
            >
              <Text
                bold
                textStyle='lg'
                textColor='primaryBlue'
                className={styles.aboutCompanyTitleName}
              >
                {jobDetail?.company?.name}
                {jobDetail?.company?.is_verify &&
                  (isMobile ? (
                    <MaterialMobileTooltip
                      icon={BlueTickIcon}
                      className={styles.companyIsVerifiedToolTip}
                      title='Verified'
                    />
                  ) : (
                    <MaterialDesktopTooltip
                      icon={BlueTickIcon}
                      className={styles.companyIsVerifiedToolTip}
                      title='Verified'
                    />
                  ))}
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

          <div className={styles.quickCreateResume}>
            <UploadResumeButton
              isShowBtn={!accessToken}
              handleClick={handleQuickUploadResumeClick}
              isShowArrowIcon
            />
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
                  {similarJobs?.map((job) => (
                    <div key={job.id} className={styles.jobDetailSidebarCard}>
                      <Link to={`${process.env.HOST_PATH}${job.job_url}`} external>
                        <img
                          src={job?.company?.logo}
                          className={styles.jobDetailSidebarCardImage}
                          alt={`${job?.company?.name} logo`}
                        />
                      </Link>
                      <Link to={`${process.env.HOST_PATH}${job.job_url}`} aTag external>
                        <Text
                          className={styles.jobDetailSidebarCardTitle}
                          textStyle='lg'
                          tagName='p'
                          bold
                        >
                          {job.truncated_job_title || job.job_title}
                          <Text
                            className={styles.jobDetailSidebarCardCompanyName}
                            textStyle='lg'
                            tagName='span'
                          >
                            {job.company_name}
                            {jobDetail?.company?.is_verify &&
                              (isMobile ? (
                                <MaterialMobileTooltip
                                  icon={BlueTickIcon}
                                  className={styles.jobDetailSidebarCardTooltip}
                                  title='Verified'
                                />
                              ) : (
                                <MaterialDesktopTooltip
                                  icon={BlueTickIcon}
                                  className={styles.jobDetailSidebarCardTooltip}
                                  title='Verified'
                                />
                              ))}
                          </Text>
                        </Text>
                      </Link>

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
                      {job.published_at && (
                        <Text textStyle='sm' tagName='p'>
                          Posted on {job.published_at}
                        </Text>
                      )}
                      <Link to={job.job_url} className={styles.jobDetailSidebarCardApply}>
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
      {isShowReportJob && (
        <ModalReportJob
          isShowReportJob={isShowReportJob}
          handleShowReportJob={setIsShowReportJob}
          reportJobReasonList={reportJobReasonList}
          selectedJobId={jobDetail.id}
          handlePostReportJob={handlePostReportJob}
          isPostingReport={isPostingReport}
          postReportResponse={postReportResponse}
        />
      )}

      {isShowModalShare && (
        <ModalShare
          jobDetailUrl={jobDetailUrl}
          isShowModalShare={isShowModalShare}
          handleShowModalShare={setIsShowModalShare}
          selectedJob={jobDetail}
        />
      )}
      {isShowModal && (
        <ModalVerifyEmail
          email={userCookie ? userCookie.email : ''}
          isShowModal={isShowModal}
          handleModal={handleCloseModal}
        />
      )}

      {isWithdrawApplicationModal && (
        <ModalWithdrawApplication
          jobId={jobDetail?.['id']}
          isShowModalWithdrawApplication={isWithdrawApplicationModal}
          handleShowModalWithdrawApplication={setIsWithdrawApplicationModal}
          handleWithdrawApplication={handleWithdrawApplication}
          isWithdrawAppliedJobFetching={isWithdrawAppliedJobFetching}
          isWithdrawApplicationResult={isUnBingwithdrawAppliedStateSuccess}
        />
      )}
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query, req }) => {
  const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null
  const { keyword, isApplied } = query
  const keywordQuery: any = keyword
  const jobId = keywordQuery?.split('-').pop()

  if (jobId) {
    if (isApplied === 'true') {
      store.dispatch(fetchAppliedJobDetailRequest({ jobId, accessToken }))
    } else {
      store.dispatch(
        fetchJobDetailRequest({
          jobId,
          status: accessToken ? 'protected' : 'public',
          serverAccessToken: accessToken
        })
      )
    }
  } else {
    return {
      notFound: true
    }
  }

  // store.dispatch(fetchConfigRequest())
  store.dispatch(END)

  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  let jobDetail = storeState.job.jobDetail.response
  const appliedJobDetail = storeState.job.appliedJobDetail.response
  // const config = storeState.config.config.response

  if (Object.keys(jobDetail).length > 0 || Object.keys(appliedJobDetail).length > 0) {
    jobDetail = jobDetail?.id ? jobDetail : appliedJobDetail?.job

    const {
      id: jobId,
      job_title: jobTitle,
      company: { name },
      // categories,
      full_address: fullAddress,
      location,
      job_url: jobUrl
    } = jobDetail

    // let categoryMetaText = ''
    // categories.forEach((el) => {
    //   categoryMetaText += `${el.value}, `
    // })
    // categoryMetaText = categoryMetaText.slice(0, categoryMetaText.length - 2)
    // categoryMetaText += ' - related job opportunities'
    const categoryMetaText = 'jobs'
    const seoMetaTitle = `${name} is hiring ${jobTitle} - ${jobId} | Bossjob`
    const seoMetaDescription = encodeURI(
      `Apply for ${jobTitle} (${jobId}) at ${name}. Discover more ${categoryMetaText} in ${
        location.value
      }, ${fullAddress.split(',').pop()} on Bossjob now!`
    )
  //   <SEO
  //   title={seoMetaTitle}
  //   description={seoMetaDescription}
  //   canonical={seoCanonicalUrl}
  //   jobDetail={jobDetail}
  //   imageUrl={jobDetail?.company?.logo}
  // />
    return {
      props: {
        jobDetail: jobDetail?.id ? jobDetail : appliedJobDetail?.job,
        applicationHistory: appliedJobDetail?.application_histories || null,
        accessToken,
        seoMetaTitle,
        seoMetaDescription,
        canonicalUrl: jobUrl,
        imageUrl:jobDetail?.company?.logo
      }
    }
  } else {
    return {
      notFound: true
    }
  }
})

export default Job
