import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

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

/* Components */
import Image from 'next/image'
import Link from 'components/Link'
import Text from 'components/Text'
import JobTag from 'components/JobTag'
import ReadMore from 'components/ReadMore'
import QuickApplyModal from 'components/QuickApplyModal'

/* Material Components */
import MaterialButton from 'components/MaterialButton'

/* Helpers */
import { getCookie } from 'helpers/cookies'

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
  MoreIcon,
  ExpireIcon,
} from 'images'

/* Helpers */
import { getApplyJobLink } from 'helpers/jobPayloadFormatter'
import ModalVerifyEmail from '../ModalVerifyEmail'

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
  const userCookie = getCookie('user') || null
  const [jobDetailOption, setJobDetailOption] = useState(false)
  const [isSaveClicked, setIsSaveClicked] = useState(false)
  const [quickApplyModalShow, setQuickApplyModalShow] = useState(false)
  const [isSavedJob, setIsSavedJob] = useState(false)
  const [isShowModal, setIsShowModal] = useState(false)
  const applyJobLink = getApplyJobLink(selectedJob, userCookie)

  const cx = classNames.bind(styles)
  const isStickyClass = cx({ isSticky: isSticky })

  useEffect(() => {
    setIsSavedJob(selectedJob?.is_saved)
    setJobDetailOption(false)
  }, [selectedJob])

  const handleBenefitIcon = (benefit) => {
    const Icon = `${benefit.replace(/ /g, '')}Icon`

    switch (Icon) {
      case 'EquityIncentiveIcon':
        return <Image src={EquityIncentiveIcon} alt='logo' width='20' height='20' />
      case 'MealAllowanceIcon':
        return <Image src={MealAllowanceIcon} alt='logo' width='20' height='20' />
      case 'EmployeeStockPurchaseIcon':
        return <Image src={EmployeeStockPurchaseIcon} alt='logo' width='20' height='20' />
      case 'HousingAllowanceIcon':
        return <Image src={HousingAllowanceIcon} alt='logo' width='20' height='20' />
      case 'CommissionIcon':
        return <Image src={CommissionIcon} alt='logo' width='20' height='20' />
      case 'PerformanceBonusIcon':
        return <Image src={PerformanceBonusIcon} alt='logo' width='20' height='20' />
      case 'TelecommunicationAllowanceIcon':
        return <Image src={TelecommunicationAllowanceIcon} alt='logo' width='20' height='20' />
      case 'TransportAllowanceIcon':
        return <Image src={TransportAllowanceIcon} alt='logo' width='20' height='20' />
      default:
        return <Image src={OtherAllowancesIcon} alt='logo' width='20' height='20' />
    }
  }

  const handleQuickApplyClick = (e) => {
    if (!userCookie) {
      e.preventDefault()
      setQuickApplyModalShow(true)
    } else if (userCookie && !userCookie.is_email_verify) {
      e.preventDefault()
      setIsShowModal(true);
    }
  }

  const handleCloseModal = () => {
    setIsShowModal(false)
    router.reload()
  }

  const isCategoryApplied = category === 'applied'
  const isCategorySaved = category === 'saved'
  const publicJobUrl = isCategoryApplied ? `${jobDetailUrl}?isApplied=true` : jobDetailUrl

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
          <div className={classNamesCombined([isStickyClass, styles.JobDetailHeader])}>
            <div>
              <div
                className={styles.JobDetailOptionImage}
                onClick={() => setJobDetailOption(!jobDetailOption)}
              >
                <Image src={MoreIcon} width='30' height='30'></Image>
              </div>

              {/* TODO: Job Application status: SAVED JOBS / APPLIED JOBS */}
              {jobDetailOption && (
                <div className={styles.JobDetailOptionList}>
                  {selectedJob?.status_key === 'active' && (
                    <>
                      <Link to={publicJobUrl} external className={styles.JobDetailOptionItem}>
                        <Text textStyle='lg'>View in new tab</Text>
                      </Link>
                      <div
                        className={styles.JobDetailOptionItem}
                        onClick={() => {
                          setIsShowReportJob(true)
                          setJobDetailOption(false)
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

                  {/* <div className={styles.JobDetailOptionItem} onClick={() => console.log('View Resume')}>
                    <Text textStyle='lg'>View Resume</Text>
                  </div> */}
                </div>
              )}
            </div>
            <div
              className={styles.JobDetailImage}
              style={{ backgroundImage: `url(${selectedJob?.company?.logo})` }}
            />
            <div className={styles.JobDetailInfo}>
              <Text textStyle='xl' bold className={styles.JobDetailTitle}>
                {selectedJob?.job_title}
              </Text>
              <Text textStyle='lg' className={styles.JobDetailCompany}>
                {selectedJob?.company?.name}
              </Text>
              {selectedJob?.is_featured && <JobTag tag='Featured' tagType='featured' />}
              {selectedJob?.is_urgent && <JobTag tag='Urgent' tagType='urgent' />}
              <JobTag tag={selectedJob?.job_type_value} />
              <div className={styles.JobDetailButtonsWrapper}>
                <div className={styles.JobDetailButtons}>
                  {!isCategoryApplied && (
                    <>
                      {selectedJob?.status_key === 'active' && (
                        <>
                          {!selectedJob?.is_applied ? (
                            <Link to={applyJobLink} external>
                              <MaterialButton
                                variant='contained'
                                capitalize
                                onClick={handleQuickApplyClick}
                              >
                                <Text textStyle='lg' textColor='white' bold>
                                  Apply Now
                                </Text>
                              </MaterialButton>
                            </Link>
                          ) : (
                            <MaterialButton variant='contained' capitalize disabled>
                              <Text textStyle='lg' textColor='white' bold>
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
                        <Text textStyle='lg' textColor='primaryBlue' bold>
                          {isSavedJob || isCategorySaved ? 'Saved' : 'Save Job'}
                        </Text>
                      </MaterialButton>
                    </>
                  )}
                  {selectedJob?.status_key !== 'active' && (
                    <Text textStyle='base' className={styles.JobDetailStatus}>
                      <Image src={ExpireIcon} height='16' width='16' />
                      <span>This job is no longer hiring</span>
                    </Text>
                  )}
                </div>
                {(!isCategoryApplied || !isCategorySaved) && (
                  <Text textStyle='lg' textColor='darkgrey' className={styles.JobDetailPostedAt}>
                    Posted on {selectedJob?.refreshed_at}
                  </Text>
                )}
              </div>
            </div>
          </div>
          <div className={classNamesCombined([styles.JobDetailBody, isStickyClass])}>
            <div className={styles.JobDetailPref}>
              <ul className={styles.JobDetailPrefList}>
                <li className={styles.JobDetailPrefItem}>
                  <Image src={LocationIcon} width='20' height='20' />
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
                  <Image src={BriefcaseIcon} width='22' height='22' />
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
                  <Image src={EducationIcon} width='22' height='22' />
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
                  <Image src={SalaryIcon} width='22' height='22' />
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
              <Text textStyle='xl' bold className={styles.JobDetailSectionTitle}>
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
              <Text textStyle='xl' bold className={styles.JobDetailSectionTitle}>
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
            <div className={styles.JobDetailSection}>
              <Text textStyle='xl' bold className={styles.JobDetailSectionTitle}>
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
            <div className={styles.JobDetailSection}>
              <Text textStyle='xl' bold className={styles.JobDetailSectionTitle}>
                Additional Information
              </Text>
              <Text textStyle='lg' bold className={styles.JobDetailSectionSubTitle}>
                Working Location
              </Text>
              <Text textStyle='lg' className={styles.JobDetailSectionSubBody}>
                {`${selectedJob?.location?.value}`}
              </Text>
              <Text textStyle='lg' bold className={styles.JobDetailSectionSubTitle}>
                Specialization
              </Text>
              {selectedJob?.categories?.map((category, i) => (
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
            <div className={styles.aboutCompany}>
              <Text bold textStyle='xl' className={styles.aboutCompanyHeader}>
                About the company
              </Text>
              <Link to={companyUrl} className={styles.aboutCompanyTitle}>
                <Text bold textStyle='xl' textColor='primaryBlue'>
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

      <QuickApplyModal
        jobDetails={selectedJob}
        applyJobLink={applyJobLink}
        modalShow={quickApplyModalShow}
        handleModalShow={setQuickApplyModalShow}
        config={config}
      />
      <ModalVerifyEmail
        email={userCookie ? userCookie.email : ''}
        isShowModal={isShowModal}
        handleModal={handleCloseModal}
      />
    </React.Fragment>
  )
}

export default JobDetail
