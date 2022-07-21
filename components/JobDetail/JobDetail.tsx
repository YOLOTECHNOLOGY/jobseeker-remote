import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'

/* Vendors */
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab'
import dynamic from 'next/dynamic'

/* Components */
import Link from 'components/Link'
import Text from 'components/Text'
import JobTag from 'components/JobTag'
import ReadMore from 'components/ReadMore'
const QuickApplyModal = dynamic(() => import('components/QuickApplyModal'))
const ModalVerifyEmail = dynamic(() => import('../ModalVerifyEmail'))

/* Material Components */
import MaterialButton from 'components/MaterialButton'
import Dropdown from '../Dropdown'

/* Helpers */
import { getCookie, setCookie } from 'helpers/cookies'

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
  RateIcon,
  DefaultAvatar,
} from 'images'

/* Helpers */
import { getApplyJobLink } from 'helpers/jobPayloadFormatter'
import { fetchUserOwnDetailService } from '../../store/services/users/fetchUserOwnDetail'

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
}

const JobDetail = ({
  selectedJob,
  setIsShowModalShare,
  setIsShowReportJob,
  setIsShowModalWithdrawApplication,
  isSticky,
  jobDetailUrl,
  companyUrl,
  category,
  handlePostSaveJob,
  handleDeleteSavedJob,
  applicationHistory,
  config,
}: IJobDetailProps) => {
  const router = useRouter()
  const detailHeaderRef = useRef(null);
  const [detailHeaderHeight, setDetailHeaderHeight] = useState(detailHeaderRef?.current?.clientHeight || 0);

  const userCookie = getCookie('user') || null
  const authCookie = getCookie('accessToken') || null;

  const [isSaveClicked, setIsSaveClicked] = useState(false)
  const [quickApplyModalShow, setQuickApplyModalShow] = useState(false)
  const [isSavedJob, setIsSavedJob] = useState(false)
  const [isShowModal, setIsShowModal] = useState(false)
  const applyJobLink = getApplyJobLink(selectedJob, userCookie)

  const cx = classNames.bind(styles)
  const isStickyClass = cx({ isSticky: isSticky })

  useEffect(() => {
    setIsSavedJob(selectedJob?.is_saved)
  }, [selectedJob])

  useEffect(() => {
    setDetailHeaderHeight(detailHeaderRef?.current?.clientHeight);
  }, [detailHeaderHeight]);

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

  const handleVerifyEmailClick = async () => {
    // revalidate verify email status
    const response = await fetchUserOwnDetailService({accessToken: authCookie})
    const userDetails = response?.data?.data
    const isVerifiedEmail = userDetails?.is_email_verify
    if (!isVerifiedEmail) { // email is not verified
      setIsShowModal(true);
    } else { // email is verified and user cookie is outdated
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

  const handleQuickApplyClick = (e) => {
    if (!userCookie) { // user not logged in
      e.preventDefault()
      setQuickApplyModalShow(true)
    } else if (userCookie && !userCookie.is_email_verify) { // user email not verified
      e.preventDefault()
      handleVerifyEmailClick()
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
  const publicJobUrl = isCategoryApplied
    ? `${process.env.HOST_PATH}${jobDetailUrl}?isApplied=true`
    : `${process.env.HOST_PATH}${jobDetailUrl}`

  const checkHasApplicationWithdrawn = () => {
    if (isCategoryApplied && applicationHistory?.length > 0) {
      return applicationHistory[0].value.includes('withdrawn')
    }
    return false
  }

  return (
    <React.Fragment>
      <div className={styles.JobDetail}>
        <div className={classNamesCombined([styles.JobDetailContent])}>
          <div className={classNamesCombined([isStickyClass, styles.JobDetailHeader])} ref={detailHeaderRef}>
            <div>
              <div
                className={styles.JobDetailOptionImage}
              >
                <Dropdown>
                    {selectedJob?.status_key === 'active' && (
                      <>
                        <Link to={publicJobUrl} external className={styles.JobDetailOptionItem}>
                          <Text textStyle='lg'>View in new tab</Text>
                        </Link>
                        <div
                          className={styles.JobDetailOptionItem}
                          onClick={() => {
                            setIsShowReportJob(true)
                          }}
                        >
                          <Text textStyle='lg'>Report job</Text>
                        </div>
                      </>
                    )}
                    {isCategoryApplied && !checkHasApplicationWithdrawn() && (
                      <div
                        className={styles.JobDetailOptionItem}
                        onClick={() => setIsShowModalWithdrawApplication(true)}
                      >
                        <Text textStyle='lg'>Withdraw Application</Text>
                      </div>
                    )}

                    <div
                      className={styles.JobDetailOptionItem}
                      onClick={() => setIsShowModalShare(true)}
                    >
                      <Text textStyle='lg'>Share this job</Text>
                    </div>
                </Dropdown>
              </div>

              {/* TODO: Job Application status: SAVED JOBS / APPLIED JOBS */}
            </div>
            <div
              className={styles.JobDetailImage}
              style={{ backgroundImage: `url(${selectedJob?.company?.logo})` }}
            />
            <div className={styles.JobDetailInfo}>
              <Link
                to={publicJobUrl}
                external
              >
                <Text textStyle='lg' bold className={styles.JobDetailTitle}>
                  {selectedJob?.job_title}
                </Text>
              </Link>
              <Link to={`${process.env.HOST_PATH}${companyUrl}`} external>
                <Text textStyle='lg' className={styles.JobDetailCompany}>
                  {selectedJob?.company?.name}
                </Text>
              </Link>
              {selectedJob?.is_featured && <JobTag tag='Featured' tagType='featured' />}
              {selectedJob?.is_urgent && <JobTag tag='Urgent' tagType='urgent' />}
              <JobTag tag={selectedJob?.job_type_value} />
              <div className={styles.JobDetailButtonsWrapper}>
                  {!isCategoryApplied && (
                    <div className={styles.JobDetailButtons}>
                      {selectedJob?.status_key === 'active' && (
                        <>
                          {!selectedJob?.is_applied ? (
                            <Link to={applyJobLink} external>
                              <MaterialButton
                                variant='contained'
                                capitalize
                                onClick={handleQuickApplyClick}
                              >
                                <Text textColor='white' bold>
                                  Apply Now
                                </Text>
                              </MaterialButton>
                            </Link>
                          ) : (
                            <MaterialButton variant='contained' capitalize disabled>
                              <Text textColor='white' bold>
                                Applied
                              </Text>
                            </MaterialButton>
                          )}
                        </>
                      )}
                      <MaterialButton
                        variant='outlined'
                        capitalize
                        isLoading={!userCookie && isSaveClicked}
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
                            router.push('/login/jobseeker?redirect=/jobs-hiring/job-search')
                          }
                        }}
                      >
                        <Text textColor='primaryBlue' bold>
                          {isSavedJob || isCategorySaved ? 'Saved' : 'Save Job'}
                        </Text>
                      </MaterialButton>
                    </div>
                  )}

                {selectedJob?.status_key !== 'active' && (
                  <Text textStyle='base' className={styles.JobDetailStatus}>
                    <img src={ExpireIcon} height='16' width='16' />
                    <span>This job is no longer hiring</span>
                  </Text>
                )}
                
                {(!isCategoryApplied || !isCategorySaved) && (
                  <Text textStyle='sm' textColor='darkgrey' className={styles.JobDetailPostedAt}>
                    Posted on {selectedJob?.refreshed_at}
                  </Text>
                )}
              </div>
            </div>
          </div>
          <div className={classNamesCombined([styles.JobDetailBody, isStickyClass])} style={{ top: detailHeaderHeight }}>
            <div className={styles.JobDetailPref}>
              <ul className={styles.JobDetailPrefList}>
                <li className={styles.JobDetailPrefItem}>
                  <img src={LocationIcon} width='20' height='20' />
                  <span className={styles.JobDetailPrefText}>
                    <Text textStyle='lg' textColor='darkgrey' className={styles.JobDetailPrefField}>
                      Location
                    </Text>
                    <Text textStyle='lg' bold className={styles.JobDetailPrefValue}>
                      {selectedJob?.location?.value}
                    </Text>
                  </span>
                </li>
                <li className={styles.JobDetailPrefItem}>
                  <img src={BriefcaseIcon} width='22' height='22' />
                  <span className={styles.JobDetailPrefText}>
                    <Text textStyle='lg' textColor='darkgrey' className={styles.JobDetailPrefField}>
                      Experience
                    </Text>
                    <Text textStyle='lg' bold className={styles.JobDetailPrefValue}>
                      {selectedJob?.xp_lvl?.value}
                    </Text>
                  </span>
                </li>
                <li className={styles.JobDetailPrefItem}>
                  <img src={EducationIcon} width='22' height='22' />
                  <span className={styles.JobDetailPrefText}>
                    <Text textStyle='lg' textColor='darkgrey' className={styles.JobDetailPrefField}>
                      Education
                    </Text>
                    <Text textStyle='lg' bold className={styles.JobDetailPrefValue}>
                      {selectedJob?.degree?.value}
                    </Text>
                  </span>
                </li>
                <li className={styles.JobDetailPrefItem}>
                  <img src={SalaryIcon} width='22' height='22' />
                  <span className={styles.JobDetailPrefText}>
                    <Text textStyle='lg' textColor='darkgrey' className={styles.JobDetailPrefField}>
                      Salary
                    </Text>
                    <Text textStyle='lg' bold className={styles.JobDetailPrefValue}>
                      {selectedJob?.salary_range_value}
                    </Text>
                  </span>
                </li>
              </ul>
            </div>
            {isCategoryApplied && applicationHistory?.length > 0 && (
              <div className={styles.JobDetailApplicationWrapper}>
                <Text textStyle='lg' bold>
                  Application History
                </Text>
                <Timeline className={styles.JobDetailApplicationTimeline}>
                  {applicationHistory.map((history, i) => (
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
              <Text textStyle='lg' bold className={styles.JobDetailSectionTitle}>
                Job Description
              </Text>
              <div
                className={classNamesCombined([
                  styles.JobDetailSectionBody,
                  styles.JobDetailDescriptionSectionBody,
                ])}
                dangerouslySetInnerHTML={{ __html: selectedJob?.job_description_html }}
              />
            </div>
            <div className={styles.JobDetailSection}>
              <Text textStyle='lg' bold className={styles.JobDetailSectionTitle}>
                Requirements
              </Text>
              <div
                className={classNamesCombined([
                  styles.JobDetailSectionBody,
                  styles.JobDetailRequirementSectionBody,
                ])}
                dangerouslySetInnerHTML={{ __html: selectedJob?.job_requirements_html }}
              />
            </div>
            {selectedJob?.benefits.length > 0 && (
              <div className={styles.JobDetailSection}>
                <Text textStyle='lg' bold className={styles.JobDetailSectionTitle}>
                  Benefits
                </Text>
                <ul className={styles.JobDetailBenefitsList}>
                  {selectedJob?.benefits?.map((benefit, i) => (
                    <li className={styles.JobDetailBenefitsItem} key={i}>
                      {handleBenefitIcon(benefit.name)}
                      <Text textStyle='lg' className={styles.JobDetailBenefitsText}>
                        {benefit.name}
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {selectedJob?.skills.length > 0 && (
              <div className={styles.JobDetailSection}>
                <Text textStyle='lg' bold className={styles.JobDetailSectionTitle}>
                  Skills/Software
                </Text>
                <ul className={styles.JobDetailSkillsList}>
                  {selectedJob?.skills?.map((skill, i) => (
                    <li className={styles.JobDetailSkillsItem} key={i}>
                      <Text textStyle='sm' className={styles.JobDetailSkillsText} textColor='white'>
                        {skill.value}
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className={styles.JobDetailSection}>
              <Text textStyle='lg' bold className={styles.JobDetailSectionTitle}>
                Additional Information
              </Text>
              <Text textStyle='lg' bold className={styles.JobDetailSectionSubTitle}>
                Working Location
              </Text>
              <Text textStyle='lg' className={styles.JobDetailSectionSubBody}>
                {`${selectedJob?.location?.value}`}
              </Text>
              {selectedJob?.categories.length > 0 && (
                <>
                  <Text textStyle='lg' bold className={styles.JobDetailSectionSubTitle}>
                    Specialization
                  </Text>
                  {selectedJob?.categories?.map((category, i) => (
                    <span key={i}>
                      <Link
                        to={`/jobs-hiring/${category.key}-jobs`}
                        className={styles.JobDetailSectionSubBody}
                      >
                        <Text textStyle='base' className={styles.JobDetailSectionSubBodyLink}>
                          {' '}
                          {category.value}
                          {selectedJob.categories.length === i + 1 ? '' : ','}
                        </Text>
                      </Link>
                    </span>
                  ))}
                </>
              )}
            </div>
            {selectedJob?.recruiter && (
            <div className={styles.JobDetailRecruiter}>
              <Text textStyle='xl' bold>
                Connect directly to recruiter after applying
              </Text>
              <div className={styles.JobDetailRecruiterInfo}>
                <div
                  className={styles.JobDetailRecruiterInfoImage}
                  style={{
                    backgroundImage: `url(${selectedJob?.recruiter.avatar || DefaultAvatar})`,
                  }}
                />
                <div className={styles.JobDetailRecruiterInfoText}>
                  <div className={styles.JobDetailRecruiterName}>
                    <Text textStyle='lg' bold>
                      {selectedJob?.recruiter.full_name},{' '}
                    </Text>
                    <Text textStyle='lg'>
                      &nbsp;{selectedJob?.recruiter.work_experience.job_title}
                    </Text>
                  </div>
                  <div className={styles.JobDetailRecruiterContent}>
                    <Text textStyle='lg' textColor='darkgrey'>
                      <img src={RateIcon} height='14' width='15' />
                      {selectedJob?.recruiter.response_rate}% response rate, responds{' '}
                      {selectedJob?.recruiter.response_time}
                    </Text>
                    <Text textStyle='lg' textColor='darkgrey'>
                      <img src={LocationPinIcon} height='14' width='15' />
                      Last active on{' '}
                      {moment(selectedJob?.recruiter.last_active_at).format('MM/DD/YYYY')}
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
                <Text bold textStyle='lg' textColor='primaryBlue'>
                  {selectedJob?.company?.name}
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

      {quickApplyModalShow && <QuickApplyModal
        jobDetails={selectedJob}
        applyJobLink={applyJobLink}
        modalShow={quickApplyModalShow}
        handleModalShow={setQuickApplyModalShow}
        config={config}
      />}

      {isShowModal && <ModalVerifyEmail
        email={userCookie ? userCookie.email : ''}
        isShowModal={isShowModal}
        handleModal={handleCloseModal}
      />}
    </React.Fragment>
  )
}

export default JobDetail
