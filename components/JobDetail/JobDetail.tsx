import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import { isMobile } from 'react-device-detect'
import { createChat } from 'helpers/interpreters/services/chat'
/* Vendors */
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab'
import dynamic from 'next/dynamic'
import jobSource from 'helpers/jobSource'
/* Components */
import Link from 'components/Link'
import Text from 'components/Text'
import JobTag from 'components/JobTag'
import MaterialDesktopTooltip from 'components/MaterialDesktopTooltip'
import MaterialMobileTooltip from 'components/MaterialMobileTooltip'
import ReadMore from 'components/ReadMore'
const ModalVerifyEmail = dynamic(() => import('../ModalVerifyEmail'))

/* Material Components */
import MaterialButton from 'components/MaterialButton'
import Dropdown from '../Dropdown'

/* Helpers */
import { getCookie, setCookie, removeCookie, getSourceCookie } from 'helpers/cookies'

/* Styles */
import styles from './JobDetail.module.scss'

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
  TransportAllowanceIcon,
  OtherAllowancesIcon,
  ExpireIcon,
  LocationPinIcon,
  BlueTickIcon,
  OpenInNewTabIcon,
  DefaultAvatar
} from 'images'

/* Helpers */
import { getApplyJobLink } from 'helpers/jobPayloadFormatter'
import Modal from 'components/Modal'
import { fetchSwitchJobService } from 'store/services/jobs/fetchSwitchJob'
import RegisterModal from 'components/RegisterModal'
import { useDispatch } from 'react-redux'
import { addExternalJobClickService } from 'store/services/jobs/addExternalJobClick'
import { updateImState } from 'store/actions/chat/imState'
interface IJobDetailProps {
  selectedJob: any
  setIsShowModalShare?: Function
  setIsShowReportJob?: Function
  setIsShowModalWithdrawApplication?: Function
  isSticky?: Boolean
  companyUrl?: string
  jobDetailUrl?: string
  category?: string
  handlePostSaveJob?: Function
  handleDeleteSavedJob?: Function
  applicationHistory?: any
  isPostingSaveJob?: boolean
  config: any
  applicationUpdatedAt?: string
  isCompanyVerified?: boolean
  chatDetail?: any
  selectedJobId?: number
}

const JobDetail = ({
  selectedJob,
  setIsShowModalShare,
  selectedJobId,
  setIsShowReportJob,
  setIsShowModalWithdrawApplication,
  isSticky,
  jobDetailUrl,
  companyUrl,
  category,
  handlePostSaveJob,
  handleDeleteSavedJob,
  applicationHistory,
  applicationUpdatedAt,
  isCompanyVerified
}: IJobDetailProps) => {
  const router = useRouter()
  const detailHeaderRef = useRef(null)
  const [detailHeaderHeight, setDetailHeaderHeight] = useState(
    detailHeaderRef?.current?.clientHeight || 0
  )
  const dispatch = useDispatch()
  const chatDetail = useMemo(() => {
    return selectedJob?.chat ?? {}
  }, [selectedJob])
  const userCookie = getCookie('user') || null
  const authCookie = getCookie('accessToken') || null
  const [openRegister, setOpenRegister] = useState(false)

  const [isSaveClicked, setIsSaveClicked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isSavedJob, setIsSavedJob] = useState(false)
  const [isShowModal, setIsShowModal] = useState(false)
  const applyJobLink = getApplyJobLink(selectedJob, userCookie)

  const cx = classNames.bind(styles)
  const isStickyClass = cx({ isSticky: isSticky })

  useEffect(() => {
    setIsSavedJob(selectedJob?.is_saved)
  }, [selectedJob])

  useEffect(() => {
    setDetailHeaderHeight(detailHeaderRef?.current?.clientHeight)
  }, [detailHeaderHeight])

  const handleBenefitIcon = (benefit) => {
    const Icon = `${benefit.replace(/ /g, '')}Icon`

    switch (Icon) {
      case 'EquityIncentiveIcon':
        return <img src={EquityIncentiveIcon} alt='logo' width='20' height='20' />
      case 'MealAllowanceIcon':
        return <img src={MealAllowanceIcon} alt='logo' width='20' height='20' />
      case 'EmployeeStockPurchaseIcon':
        return <img src={EmployeeStockPurchaseIcon} alt='logo' width='20' height='20' />
      case 'HousingAllowanceIcon':
        return <img src={HousingAllowanceIcon} alt='logo' width='20' height='20' />
      case 'CommissionIcon':
        return <img src={CommissionIcon} alt='logo' width='20' height='20' />
      case 'PerformanceBonusIcon':
        return <img src={PerformanceBonusIcon} alt='logo' width='20' height='20' />
      case 'TelecommunicationAllowanceIcon':
        return <img src={TelecommunicationAllowanceIcon} alt='logo' width='20' height='20' />
      case 'TransportAllowanceIcon':
        return <img src={TransportAllowanceIcon} alt='logo' width='20' height='20' />
      default:
        return <img src={OtherAllowancesIcon} alt='logo' width='20' height='20' />
    }
  }

  const handleCloseModal = (isOTPVerified) => {
    setIsShowModal(false)
    if (isOTPVerified) {
      router.push(applyJobLink)
    }
  }

  const isCategoryApplied = category === 'applied'
  const isCategorySaved = category === 'saved'
  const publicJobUrl = isCategoryApplied ? `${jobDetailUrl}?isApplied=true` : `${jobDetailUrl}`

  const checkHasApplicationWithdrawn = () => {
    if (isCategoryApplied && applicationHistory?.length > 0) {
      return applicationHistory[0].value.includes('withdrawn')
    }
    return false
  }

  const handleShowReportJob = () => {
    if (authCookie && userCookie) {
      setIsShowReportJob(true)
    } else {
      setCookie('isReportJob', true)
      setCookie('reportJobId', selectedJob.id)
      router.push('/get-started?redirect=/jobs-hiring/job-search')
    }
  }
  const requestSwitch = useCallback(() => {
    setLoading(true)
    fetchSwitchJobService({
      status: 'protected',
      job_id: selectedJob.id,
      applicationId: chatDetail.job_application_id
    })
      .then(() => {
        router.push(`/chat/${chatDetail.chat_id}`)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [selectedJob.id, chatDetail?.job_application_id, chatDetail?.chat_id])
  const handleChat = () => {
    if (!userCookie || !authCookie) {
      const source = jobSource()
      localStorage.setItem('isChatRedirect', `/chat-redirect/${selectedJob.id}?source=${source}`)
      setOpenRegister(true)
    } else if (selectedJob?.external_apply_url) {
      addExternalJobClickService(selectedJob?.id)
      const link = getApplyJobLink(selectedJob, userCookie)
      window.open(link)
    } else if (chatDetail.is_exists) {
      if (chatDetail.job_id !== selectedJobId) {
        setShowModal(true)
      } else {
        router.push(`/chat/${chatDetail.chat_id}`)
      }
    } else {
      setLoading(true)
      const source = getSourceCookie()
      createChat(selectedJob?.id, {
        source,
        job_title_id: null,
        device: isMobile ? 'mobile_web' : 'web'
      })
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
  useEffect(() => {
    if (getCookie('isReportJob') && authCookie && userCookie) {
      setIsShowReportJob(true)
      removeCookie('isReportJob')
      removeCookie('reportJobId')
    }
  }, [])

  const handleLastActiveState = useMemo(() => {
    const lastActiveAt = moment(selectedJob?.recruiter.last_active_at)
    const currentActiveAt = moment()
    const minutes = currentActiveAt.diff(lastActiveAt, 'm')
    const hours = currentActiveAt.diff(lastActiveAt, 'h')

    
    if (minutes <= 5) {
      return 'Online'
    } else if (hours < 8) {
      return 'Active recently'
    } else if (hours < 24) {
      return 'Active today'
    } else if (hours < 168) {
      return 'Active this week'
    } else {
      return 'Active this month'
    }
  }, [selectedJob?.recruiter.last_active_at])

  return (
    <React.Fragment>
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
        headerTitle={'Chat with ' + selectedJob?.recruiter?.full_name ?? ''}
      >
        <p>
          You are currently chatting with recruiter for the{' '}
          {chatDetail?.job?.job_title ?? chatDetail?.job?.function_job_title ?? 'this job'}{' '}
          position. Are you sure you want to switch job?
        </p>
      </Modal>
      {openRegister ? (
        <RegisterModal openRegister={openRegister} setOpenRegister={setOpenRegister} />
      ) : null}

      <div className={styles.jobDetail}>
        <div className={classNamesCombined([styles.jobDetailContent])}>
          <div
            className={classNamesCombined([isStickyClass, styles.jobDetailHeader])}
            ref={detailHeaderRef}
          >
            <div className={classNamesCombined([isStickyClass, styles.jobDetailOptions])}>
              <Link to={publicJobUrl} className={styles.jobDetailOptionNewTab}>
                <img src={OpenInNewTabIcon} width='10' height='10' />
                <Text
                  textStyle='base'
                  textColor='primaryBlue'
                  className={styles.jobDetailOptionNewTab}
                >
                  View details
                </Text>
              </Link>
              <div className={styles.jobDetailButtons}>
                <MaterialButton
                  variant='contained'
                  capitalize
                  onClick={handleChat}
                  isLoading={loading}
                >
                  <Text textColor='white' bold>
                    {(() => {
                      if (selectedJob?.external_apply_url) {
                        return 'Apply Now'
                      } else if (chatDetail.is_exists) {
                        return 'Continue Chat'
                      } else {
                        return 'Chat Now'
                      }
                    })()}
                  </Text>
                </MaterialButton>
                <MaterialButton
                  variant='outlined'
                  capitalize
                  isLoading={(!userCookie && isSaveClicked) || loading}
                  onClick={() => {
                    if (userCookie) {
                      if (!isCategorySaved && !isSavedJob) {
                        handlePostSaveJob({ jobId: selectedJob?.id })
                        setIsSavedJob(true)
                      }

                      if (isSavedJob) {
                        handleDeleteSavedJob({ jobId: selectedJob?.id })
                        setIsSavedJob(false)
                      }
                    }

                    if (!userCookie) {
                      setIsSaveClicked(true)
                      router.push('/get-started?redirect=/jobs-hiring/job-search')
                    }
                  }}
                >
                  <Text textColor='primaryBlue' bold>
                    {isSavedJob || isCategorySaved ? 'Saved' : 'Save'}
                  </Text>
                </MaterialButton>
              </div>

              <div className={styles.jobDetailOptionImage}>
                <Dropdown>
                  <div
                    className={styles.jobDetailOptionItem}
                    onClick={() => setIsShowModalShare(true)}
                  >
                    <Text textStyle='lg'>Share this job</Text>
                  </div>
                  {isCategoryApplied && !checkHasApplicationWithdrawn() && (
                    <div
                      className={styles.jobDetailOptionItem}
                      onClick={() => setIsShowModalWithdrawApplication(true)}
                    >
                      <Text textStyle='lg'>Withdraw Application</Text>
                    </div>
                  )}
                  {selectedJob?.status_key === 'active' && (
                    <div className={styles.jobDetailOptionItem} onClick={handleShowReportJob}>
                      <Text textStyle='lg'>Report job</Text>
                    </div>
                  )}
                </Dropdown>
              </div>
            </div>
          </div>
          <div
            className={classNamesCombined([styles.jobDetailBody, isStickyClass])}
            style={{ top: isSticky ? detailHeaderHeight : '' }}
          >
            <div className={styles.jobDetailImageInfoWrapper}>
              <div
                className={styles.jobDetailImage}
                style={{ backgroundImage: `url(${selectedJob?.company?.logo})` }}
              />
              <div className={styles.jobDetailInfo}>
                <Link to={publicJobUrl} external>
                  <Text textStyle='lg' bold className={styles.jobDetailTitle}>
                    {selectedJob?.job_title}
                  </Text>
                </Link>
                <Text textStyle='lg' className={styles.jobDetailCompanyName}>
                  <Link to={`${process.env.HOST_PATH}${companyUrl}`} external>
                    {selectedJob?.company?.name}
                  </Link>
                  {isCompanyVerified &&
                    (isMobile ? (
                      <MaterialMobileTooltip
                        icon={BlueTickIcon}
                        className={styles.jobDetailCompanyTooltip}
                        title='Verified'
                      />
                    ) : (
                      <MaterialDesktopTooltip
                        icon={BlueTickIcon}
                        className={styles.jobDetailCompanyTooltip}
                        title='Verified'
                      />
                    ))}
                </Text>
                <Text textStyle='sm' textColor='darkgrey' className={styles.jobDetailPostedAt}>
                  {applicationUpdatedAt
                    ? `Last updated on ${applicationUpdatedAt}`
                    : `Posted on ${selectedJob?.refreshed_at}`}
                </Text>
                <div style={{ height: '16px' }}></div>
                {selectedJob?.is_featured && <JobTag tag='Featured' tagType='featured' />}
                {selectedJob?.is_urgent && <JobTag tag='Urgent' tagType='urgent' />}
                <JobTag tag={selectedJob?.job_type_value} />
                <div className={styles.jobDetailButtonsWrapper}>
                  {selectedJob?.status_key !== 'active' && (
                    <Text textStyle='base' className={styles.jobDetailStatus}>
                      <img src={ExpireIcon} height='16' width='16' />
                      <span>This job is no longer hiring</span>
                    </Text>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.jobDetailPref}>
              <ul className={styles.jobDetailPrefList}>
                <li className={styles.jobDetailPrefItem}>
                  <img src={LocationIcon} width='20' height='20' />
                  <span className={styles.jobDetailPrefText}>
                    <Text textStyle='lg' textColor='darkgrey' className={styles.jobDetailPrefField}>
                      Location
                    </Text>
                    <Text textStyle='lg' bold className={styles.jobDetailPrefValue}>
                      {selectedJob?.location?.value}
                    </Text>
                  </span>
                </li>
                <li className={styles.jobDetailPrefItem}>
                  <img src={BriefcaseIcon} width='22' height='22' />
                  <span className={styles.jobDetailPrefText}>
                    <Text textStyle='lg' textColor='darkgrey' className={styles.jobDetailPrefField}>
                      Experience
                    </Text>
                    <Text textStyle='lg' bold className={styles.jobDetailPrefValue}>
                      {selectedJob?.xp_lvl?.value}
                    </Text>
                  </span>
                </li>
                <li className={styles.jobDetailPrefItem}>
                  <img src={EducationIcon} width='22' height='22' />
                  <span className={styles.jobDetailPrefText}>
                    <Text textStyle='lg' textColor='darkgrey' className={styles.jobDetailPrefField}>
                      Education
                    </Text>
                    <Text textStyle='lg' bold className={styles.jobDetailPrefValue}>
                      {selectedJob?.degree?.value}
                    </Text>
                  </span>
                </li>
                <li className={styles.jobDetailPrefItem}>
                  <img src={SalaryIcon} width='22' height='22' />
                  <span className={styles.jobDetailPrefText}>
                    <Text textStyle='lg' textColor='darkgrey' className={styles.jobDetailPrefField}>
                      Salary
                    </Text>
                    <Text textStyle='lg' bold className={styles.jobDetailPrefValue}>
                      {selectedJob?.salary_range_value}
                    </Text>
                  </span>
                </li>
              </ul>
            </div>
            {isCategoryApplied && applicationHistory?.length > 0 && (
              <div className={styles.jobDetailApplicationWrapper}>
                <Text textStyle='lg' bold>
                  Application History
                </Text>
                <Timeline className={styles.jobDetailApplicationTimeline}>
                  {applicationHistory.map((history, i) => (
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
              <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>
                Job Description
              </Text>
              <div
                className={classNamesCombined([
                  styles.jobDetailSectionBody,
                  styles.jobDetailDescriptionSectionBody
                ])}
                dangerouslySetInnerHTML={{ __html: selectedJob?.job_description_html }}
              />
            </div>
            <div className={styles.jobDetailSection}>
              <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>
                Requirements
              </Text>
              <div
                className={classNamesCombined([
                  styles.jobDetailSectionBody,
                  styles.jobDetailRequirementSectionBody
                ])}
                dangerouslySetInnerHTML={{ __html: selectedJob?.job_requirements_html }}
              />
            </div>
            {selectedJob?.benefits.length > 0 && (
              <div className={styles.jobDetailSection}>
                <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>
                  Benefits
                </Text>
                <ul className={styles.jobDetailBenefitsList}>
                  {selectedJob?.benefits?.map((benefit, i) => (
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
            {selectedJob?.skills.length > 0 && (
              <div className={styles.jobDetailSection}>
                <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>
                  Skills/Software
                </Text>
                <ul className={styles.jobDetailSkillsList}>
                  {selectedJob?.skills?.map((skill, i) => (
                    <li className={styles.jobDetailSkillsItem} key={i}>
                      <Text textStyle='sm' className={styles.jobDetailSkillsText} textColor='white'>
                        {skill.value}
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className={styles.jobDetailSection}>
              <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>
                Additional Information
              </Text>
              <Text textStyle='lg' bold className={styles.jobDetailSectionSubTitle}>
                Working Location
              </Text>
              <Text textStyle='lg' className={styles.jobDetailSectionSubBody}>
                {`${selectedJob?.full_address}`}
              </Text>
              {/* {selectedJob?.categories.length > 0 && (
                <>
                  <Text textStyle='lg' bold className={styles.jobDetailSectionSubTitle}>
                    Specialization
                  </Text>
                  {selectedJob?.categories?.map((category, i) => (
                    <span key={i}>
                      <Link
                        to={`/jobs-hiring/${category.key}-jobs`}
                        className={styles.jobDetailSectionSubBody}
                      >
                        <Text textStyle='base' className={styles.jobDetailSectionSubBodyLink}>
                          {' '}
                          {category.value}
                          {selectedJob.categories.length === i + 1 ? '' : ','}
                        </Text>
                      </Link>
                    </span>
                  ))}
                </>
              )} */}
            </div>
            {selectedJob?.recruiter && (
              <div className={styles.jobDetailRecruiter}>
                <Text textStyle='xl' bold>
                  Connect directly to recruiter after applying
                </Text>
                <div className={styles.jobDetailRecruiterInfo}>
                  <div
                    className={styles.jobDetailRecruiterInfoImage}
                    style={{
                      backgroundImage: `url(${selectedJob?.recruiter.avatar || DefaultAvatar})`
                    }}
                  />
                  <div className={styles.jobDetailRecruiterInfoText}>
                    <div className={styles.jobDetailRecruiterName}>
                      <Text textStyle='lg' bold>
                        {selectedJob?.recruiter.full_name},{' '}
                      </Text>
                      <Text textStyle='lg'>
                        &nbsp;{selectedJob?.recruiter.work_experience.job_title}
                      </Text>
                    </div>
                    <div className={styles.jobDetailRecruiterContent}>
                      <Text textStyle='lg' textColor='darkgrey'>
                        <img src={LocationPinIcon} height='14' width='15' />
                        {handleLastActiveState}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className={styles.aboutCompany}>
              <Text bold textStyle='lg' className={styles.aboutCompanyHeader}>
                About the company
              </Text>
              <Link to={companyUrl} className={styles.aboutCompanyTitle}>
                <Text
                  bold
                  textStyle='lg'
                  textColor='primaryBlue'
                  className={styles.jobDetailCompanyIsVerify}
                >
                  <span>{selectedJob?.company?.name}</span>
                  {isCompanyVerified &&
                    (isMobile ? (
                      <MaterialMobileTooltip
                        icon={BlueTickIcon}
                        className={styles.jobDetailCompanyTooltip}
                        title='Verified'
                      />
                    ) : (
                      <MaterialDesktopTooltip
                        icon={BlueTickIcon}
                        className={styles.jobDetailCompanyTooltip}
                        title='Verified'
                      />
                    ))}
                </Text>
              </Link>
              <div className={styles.aboutCompanyDetail}>
                <Text textStyle='base'>{selectedJob?.company?.industry}</Text>
                <Text textStyle='base'>{selectedJob?.company?.company_size} employees</Text>
              </div>
              <ReadMore size={352} text={selectedJob?.company?.description_html} />
            </div>
          </div>
        </div>
      </div>

      {isShowModal && (
        <ModalVerifyEmail
          email={userCookie ? userCookie.email : ''}
          isShowModal={isShowModal}
          handleModal={handleCloseModal}
        />
      )}
    </React.Fragment>
  )
}

export default JobDetail
