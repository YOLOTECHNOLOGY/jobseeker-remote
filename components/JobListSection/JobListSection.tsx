import React, { useState, useEffect, useRef } from 'react'

/* Vendors */
import { Radio, RadioGroup, FormControlLabel } from '@mui/material'
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

/* Components */
import Image from 'next/image'
import Link from 'components/Link'
import Button from 'components/Button'
import Text from 'components/Text'
import JobTag from 'components/JobTag'
import JobCard from 'components/JobCard'
import Modal from 'components/Modal'

/* Material Components */
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'

/* Styles */
import styles from './JobListSection.module.scss'

/* Images */
import {
  BriefcaseIcon,
  LocationIcon,
  EducationIcon,
  SalaryIcon,
  EquityIcon,
  MealAllowanceIcon,
  EmployeeStockIcon,
  HousingAllowanceIcon,
  MoreIcon,
  NotificationIcon,
  CreateIcon,
  DeleteIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  CopyIcon,
  ArrowForwardIcon
} from 'images'

interface JobListSectionProps {
  defaultPage: number
  query?: string
  fetchJobAlertsList?: Function
}

const JobListSection = ({ 
  defaultPage,
  query,
  fetchJobAlertsList
}: JobListSectionProps) => {
  const router = useRouter()
  const dummyCompanyDetail =
    "Loop Contact Solutions is a contact center uniquely designed to help subscription businesses acquire and keep more customers who purchase more products over longer periods of time. The result is the achievement of Loop's core value proposition to significantly improve recurring revenues, profits and market share for our subscription business clients. Loop Contact Solutions is a contact center uniquely designed to help subscription businesses acquire and keep more customers who purchase more products over longer periods of time. The result is the achievement of Loop's core value proposition to significantly improve recurring revenues, profits and market share for our subscription business clients."
  
  const reportOptions = [
    [
      {
        label: 'I think it\'s a scam, phishing or malware',
        subLabel: 'Ex: someone asks for personal information or money or posts suspicious links',
        value: 'scam_1'
      },
      {
        
        label: 'I think it\'s promotional or spam',
        subLabel: 'Ex: someone advertises a product for monetary gain or posts irrelevant content for high visibility',
        value: 'scam_2'
      },
    ],
    [
      {
        label: 'I think it\'s discriminatory, or advocates, or supports discrimination',
        subLabel: 'Ex: discriminates based off of age or sex',
        value: 'discrimination_1'
      },
      {
        label: 'I think it\'s offensive or harassing',
        subLabel: 'Ex: threats of violence or unwelcome advances',
        value: 'discrimination_2'
      },
      {
        label: 'I think it shows or promotes extreme violence or terrorism',
        subLabel: 'Ex: torture, rape or abuse, terrorist acts, or recruitment for terrorism',
        value: 'discrimination_3'
      },
    ],
    [
      {
        label: 'The job is closed',
        subLabel: 'Ex: it’s no longer accepting applicants',
        value: 'broken_1'
      },
      {
        label: 'The job has an incorrect company',
        subLabel: 'Ex: the job has the wrong company name or page display',
        value: 'broken_2'
      },
      {
        label: 'This job has an incorrect location',
        subLabel: 'Ex: the city, state, province or country is incorrect',
        value: 'broken_3'
      },
      {
        label: 'The job has incorrect formatting',
        subLabel: 'Ex: its job details has missing text, gramatical errors, or other formatting mistakes',
        value: 'broken_4'
      },
      {
        label: 'This job does not belong on Bossjob',
        subLabel: 'Ex: the job from this page should not be posted on Bossjob',
        value: 'broken_5'
      },
    ]
  ]
  
  const [companyDetail, setCompanyDetail] = useState(dummyCompanyDetail)
  const [isFullDetail, setIsFullDetail] = useState(false)
  const [jobSelectedId, setJobSelectedId] = useState(null)
  const [jobDetailOption, setJobDetailOption] = useState(false)

  const [modalEnableJobAlert, setModalEnableJobAlert] = useState(false)
  const [modalJobAlertList, setModalJobAlertList] = useState(false)
  const [modalManageJobAlert, setModalManageJobAlert] = useState(false)
  const [modalDeleteJobAlert, setModalDeleteJobAlert] = useState(false)
  const [modalShare, setModalShare] = useState(false)
  const [modalReport, setModalReport] = useState(false)
  const [modalReportDetail, setModalReportDetail] = useState(false)
  const [modalReportSelected, setModalReportSelected] = useState(null)
  const [modalReportSelectedItem, setModalReportSelectedItem] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [notifiedAt, setNotifiedAt] = useState('email')
  const [isDoneCopy, setIsDoneCopy] = useState(false)

  const jobLinkRef = useRef(null)
  const jobDetailUrl = `/job/1`

  useEffect(() => {
    handleCompanyDisplay()
  }, [isFullDetail])

  const handleCompanyDisplay = () => {
    if (!isFullDetail && dummyCompanyDetail.length > 352) {
      setCompanyDetail(`${dummyCompanyDetail.slice(0, 352)}...`)
      return
    }
    setCompanyDetail(dummyCompanyDetail)
  }
  const handleJobSelection = (id) => setJobSelectedId(id)
  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link)
    setIsDoneCopy(true)
    setTimeout(() => {
      setIsDoneCopy(false)
    }, 5000)
  }

  const handlePaginationClick = (event, val) => {
    router.query.page = val
    router.push(router, undefined, { shallow: true })
  }

  const ModalEnableJobAlert = () => {
    return (
      <Modal
        showModal={modalEnableJobAlert}
        handleModal={() => setModalEnableJobAlert(false)}
        headerTitle='Enable Job Alert'
        handleFirstButton={() => {
          setModalEnableJobAlert(false)
        }}
        handleSecondButton={() => {
          setModalEnableJobAlert(false)
          setModalDeleteJobAlert(true)
        }}
        firstButtonText='Keep'
        secondButtonText='Delete'
      >
        <div className={styles.jobModalBody}>
          <Text textStyle='base'>
            {
              query?.[0]
                ? <span>Job alert for ‘<Text textStyle='base' bold>{query[0]}</Text>’ enabled.</span>
                : <span>No selected keyword.</span>
            }
            
            <Text
              className={styles.jobModalEnableAlert}
              textColor='primaryBlue'
              onClick={() => {
                setModalEnableJobAlert(false)
                setModalJobAlertList(true)
              }}
            >
              {' '}
              Manage alert.
            </Text>
          </Text>
        </div>
      </Modal>
    )
  }

  const ModalJobAlerts = () => {
    return (
      <Modal
        headerTitle='Job Alerts'
        showModal={modalJobAlertList}
        handleModal={() => setModalJobAlertList(false)}
        firstButtonText='Done'
        handleFirstButton={() => setModalJobAlertList(false)}
      >
        <div className={styles.jobModalBody}>
          <ul className={styles.jobAlertsList}>
            <li className={styles.jobAlertsItem}>
              <div className={styles.jobAlertsItemHeader}>
                <Text textStyle='lg' bold>
                  Marketing
                </Text>
                <div className={styles.jobAlertsItemAction}>
                  <Image
                    src={CreateIcon}
                    width='18'
                    height='18'
                    onClick={() => {
                      setModalJobAlertList(false)
                      setModalManageJobAlert(true)
                    }}
                    className={styles.jobAlertsItemButton}
                  />
                  <Image
                    src={DeleteIcon}
                    width='18'
                    height='18'
                    onClick={() => {
                      setModalJobAlertList(false)
                      setModalDeleteJobAlert(true)
                    }}
                    className={styles.jobAlertsItemButton}
                  />
                </div>
              </div>
              <div className={styles.jobAlertsItemBody}>
                <Text textStyle='base'>Manila</Text>
                <Text textStyle='base'>Filters: Full-time, Marketing/Business Dev </Text>
                <Text textStyle='base'>Frequency: Daily via email</Text>
              </div>
            </li>
            <li className={styles.jobAlertsItem}>
              <div className={styles.jobAlertsItemHeader}>
                <Text textStyle='lg' bold>
                  Marketing
                </Text>
                <div className={styles.jobAlertsItemAction}>
                  <Image
                    src={CreateIcon}
                    width='20'
                    height='20'
                    onClick={() => {
                      setModalJobAlertList(false)
                      setModalManageJobAlert(true)
                    }}
                    className={styles.jobAlertsItemButton}
                  />
                  <Image
                    src={DeleteIcon}
                    width='20'
                    height='20'
                    onClick={() => {
                      setModalJobAlertList(false)
                      setModalDeleteJobAlert(true)
                    }}
                    className={styles.jobAlertsItemButton}
                  />
                </div>
              </div>
              <div className={styles.jobAlertsItemBody}>
                <Text textStyle='base'>Manila</Text>
                <Text textStyle='base'>Filters: Full-time, Marketing/Business Dev </Text>
                <Text textStyle='base'>Frequency: Daily via email</Text>
              </div>
            </li>
          </ul>
        </div>
      </Modal>
    )
  }

  const ModalManageJobAlert = () => {
    const handleChange = (event, isFrequency) => {
      if (isFrequency) {
        setFrequency(event.target.value)
        return
      }
      setNotifiedAt(event.target.value)
    }

    return (
      <Modal
        headerTitle='Manage Job Alert'
        showModal={modalManageJobAlert}
        handleModal={() => setModalManageJobAlert(false)}
        firstButtonText='Back'
        handleFirstButton={() => {
          setModalManageJobAlert(false)
          setModalJobAlertList(true)
        }}
        secondButtonText='Done'
        handleSecondButton={() => {
          setModalManageJobAlert(false)
          setModalJobAlertList(true)
        }}
      >
        <div className={styles.jobModalBody}>
          <div className={styles.jobManageJobAlert}>
            <div className={styles.jobManageJobAlertHeader}>
              <Text textStyle='lg' bold>
                Marketing
              </Text>
              <Image
                src={DeleteIcon}
                width='18'
                height='18'
                onClick={() => {
                  setModalJobAlertList(false)
                  setModalManageJobAlert(false)
                  setModalDeleteJobAlert(true)
                }}
              />
            </div>
            <div className={styles.jobManageJobAlertBody}>
              <div className={styles.jobManageJobAlertGroup}>
                <Text textStyle='base' className={styles.jobManageJobAlertGroupHeader}>
                  Alert Frequency
                </Text>
                <RadioGroup
                  aria-label='frequency'
                  name='controlled-radio-buttons-group'
                  value={frequency}
                  onChange={(e) => handleChange(e, true)}
                >
                  <FormControlLabel
                    value='daily'
                    control={<Radio />}
                    label={<Text textStyle='base'>Daily</Text>}
                  />
                  <FormControlLabel
                    value='weekly'
                    control={<Radio />}
                    label={<Text textStyle='base'>Weekly</Text>}
                  />
                </RadioGroup>
              </div>

              <div className={styles.jobManageJobAlertGroup}>
                <Text textStyle='base' className={styles.jobManageJobAlertGroupHeader}>
                  Get notified via:
                </Text>
                <RadioGroup
                  aria-label='frequency'
                  name='controlled-radio-buttons-group'
                  value={notifiedAt}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value='email'
                    control={<Radio />}
                    label={<Text textStyle='base'>Email</Text>}
                  />
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  const ModalDeleteJobAlert = () => {
    return (
      <Modal
        headerTitle='Delete Job Alert'
        showModal={modalDeleteJobAlert}
        handleModal={() => setModalDeleteJobAlert(false)}
        firstButtonText='Keep'
        handleFirstButton={() => {
          setModalDeleteJobAlert(false)
          setModalJobAlertList(true)
        }}
        secondButtonText='Delete'
        handleSecondButton={() => {
          setModalDeleteJobAlert(false)
          setModalJobAlertList(true)
        }}
      >
        <div className={styles.jobModalBody}>
          <Text textStyle='base'>
            You are about to delete the job alert for “Marketing, Manila”.
            <br /> This cannot be undone
          </Text>
        </div>
      </Modal>
    )
  }

  const ModalShare = () => {
    return (
      <Modal
        headerTitle='Share this job'
        showModal={modalShare}
        handleModal={() => setModalShare(false)}
      >
        <div className={styles.share}>
          <div className={styles.shareList}>
            <div className={styles.shareItem}>
              <FacebookShareButton url={jobDetailUrl} className={styles.shareItemLink}>
                <img
                  src={FacebookIcon}
                  alt='facebook'
                  height='56px'
                  width='56px'
                  className={styles.shareItemImg}
                />
                <Text textStyle='base'>Facebook</Text>
              </FacebookShareButton>
            </div>
            <div className={styles.shareItem}>
              <TwitterShareButton url={jobDetailUrl} className={styles.shareItemLink}>
                <img
                  src={TwitterIcon}
                  alt='twitter'
                  height='56px'
                  width='56px'
                  className={styles.shareItemImg}
                />
                <Text textStyle='base' textColor='warmgrey'>
                  Twitter
                </Text>
              </TwitterShareButton>
            </div>
            <div className={styles.shareItem}>
              <LinkedinShareButton url={jobDetailUrl} className={styles.shareItemLink}>
                <img
                  src={LinkedinIcon}
                  alt='linkedIn'
                  height='56px'
                  width='56px'
                  className={styles.shareItemImg}
                />
                <Text textStyle='base' textColor='warmgrey'>
                  Linkedin
                </Text>
              </LinkedinShareButton>
            </div>
          </div>
          <div className={styles.shareFooter}>
            <Text textStyle='lg'>Page Link</Text>
            {isDoneCopy ? (
              <div className={styles.shareFooterTooltip}>
                <Text textStyle='sm' textColor='white'>
                  Link copied
                </Text>
              </div>
            ) : null}
            <div className={styles.shareFooterLink}>
              <input
                value={jobDetailUrl}
                ref={jobLinkRef}
                onClick={() => jobLinkRef.current.select()}
                className={styles.shareFooterLinkText}
                readOnly
              />
              <div onClick={() => handleCopyLink(jobDetailUrl)} className={styles.shareFooterCopy}>
                <img src={CopyIcon} alt='close' height='18px' width='18px' />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  const ModalReport = () => {
    const reportList = [
      'I think it’s spam or scam',
      'I think it’s discriminatory or offensive',
      'I think something is broken'
    ]
    return (
      <Modal
        className={styles.ModalReport}
        headerTitle='Why are you reporting this job?'
        showModal={modalReport}
        handleModal={() => setModalReport(false)}
      >
        <div className={styles.report}>
          {reportList.map((report, i) => (
            <div 
              key={i}
              className={styles.reportItem} 
              onClick={() => {
                setModalReport(false)
                setModalReportDetail(true)
                setModalReportSelected(i)
                setModalReportSelectedItem(reportOptions[i][0].value)
              }}
            >
              <Text>{report}</Text>
              <div className={styles.reportItemIcon}>
                <Image src={ArrowForwardIcon} width='20' height='20'/>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    )
  }

  const ModalReportDetail = () => {
    const { register, handleSubmit } = useForm()
    const onSubmit = (data) => {
      console.log(data)
      setModalReportDetail(false)
    }

    const handleChange = (event) => {
      setModalReportSelectedItem(event.target.value)
    }

    return (
      <Modal
        headerTitle='Tell us a little more'
        showModal={modalReportDetail}
        handleModal={() => setModalReportDetail(false)}
        firstButtonText='Back'
        handleFirstButton={() => {
          setModalReportDetail(false)
          setModalReport(true)
          setModalReportSelected(0)
        }}
        secondButtonText='Submit'
        handleSecondButton={handleSubmit(onSubmit)}
      >
        <div className={styles.reportDetail}>
          {reportOptions[modalReportSelected]?.map((option, i) => (
            <div className={styles.reportDetailItem} key={i}>
              <RadioGroup
                aria-label="reportDetail"
                name="controlled-radio-buttons-group"
                value={modalReportSelectedItem}
                onChange={handleChange}
                className={styles.reportDetailRadioGroup}
              >
                <FormControlLabel 
                  {...register('reportDetail')}
                  value={option.value} 
                  control={<Radio />} 
                  label={
                    <div className={styles.reportDetailLabel}>
                      <Text textStyle='lg'>{option.label}</Text>
                      <Text textStyle='base' textColor='lightgrey'>{option.subLabel}</Text>
                    </div>
                  } 
                />
              </RadioGroup>
            </div>
          ))}
        </div>
      </Modal>
    )
  }

  return (
    <React.Fragment>
      <div className={styles.job}>
        <div className={styles.jobList}>
          <div className={styles.jobListOption}>
            <Text textStyle='xl' bold>
              5,777 jobs found
            </Text>
            <div className={styles.jobListOptionAlerts}>
              <div
                className={styles.jobListOptionAlertsItem}
                onClick={() => setModalEnableJobAlert(true)}
              >
                <Text textStyle='base'>Enable job alerts</Text>
              </div>
              <div
                className={styles.jobListOptionAlertsItem}
                onClick={() => {
                  setModalJobAlertList(true)
                  fetchJobAlertsList()
                }}
              >
                <Image src={NotificationIcon} width='20' height='20' />
              </div>
            </div>
          </div>
          <div className={styles.jobListContent}>
            <JobCard
              id={0}
              image='https://wallpaperaccess.com/full/6133725.jpg'
              title='Operation Manager Lorem Ipsum'
              tag='urgent'
              company='Loop Contact Solutions Inc.'
              location='Makati'
              salary='₱75k - ₱80k'
              postedAt='23 August 2021'
              selectedId={jobSelectedId}
              handleSelection={handleJobSelection}
            />
            <JobCard
              id={2}
              image='https://wallpaperaccess.com/full/6133725.jpg'
              title='Operation Manager Lorem Ipsum'
              tag='fullTime'
              company='Loop Contact Solutions Inc.'
              location='Makati'
              salary='₱75k - ₱80k'
              postedAt='23 August 2021'
              selectedId={jobSelectedId}
              handleSelection={handleJobSelection}
            />
            <JobCard
              id={3}
              image='https://wallpaperaccess.com/full/6133725.jpg'
              title='Operation Manager Lorem Ipsum'
              tag='featured'
              company='Loop Contact Solutions Inc.'
              location='Makati'
              salary='₱75k - ₱80k'
              postedAt='23 August 2021'
              selectedId={jobSelectedId}
              handleSelection={handleJobSelection}
            />
          </div>
          <div className={styles.paginationWrapper}>
            <MaterialRoundedPagination onChange={handlePaginationClick} defaultPage={defaultPage} totalPages={105} />
          </div>
        </div>
        <div className={styles.jobDetail}>
          <div
            className={styles.jobDetailOption}
            onClick={() => setJobDetailOption(!jobDetailOption)}
          >
            <div className={styles.jobDetailOptionImage}>
              <Image src={MoreIcon} width='20' height='20'></Image>
            </div>

            {jobDetailOption && (
              <div className={styles.jobDetailOptionList}>
                <Link to='/' external className={styles.jobDetailOptionItem}>
                  <Text textStyle='lg'>View in new tab</Text>
                </Link>
                <div className={styles.jobDetailOptionItem} onClick={() => setModalShare(true)}>
                  <Text textStyle='lg'>Share this job</Text>
                </div>
                <div className={styles.jobDetailOptionItem} onClick={() => setModalReport(true)}>
                  <Text textStyle='lg'>Report job</Text>
                </div>
              </div>
            )}
          </div>
          <div className={styles.jobDetailHeader}>
            <div
              className={styles.jobDetailImage}
              style={{ backgroundImage: `url(${'https://wallpaperaccess.com/full/6133725.jpg'})` }}
            />
            <div className={styles.jobDetailInfo}>
              <Text textStyle='xxl' bold className={styles.jobDetailTitle}>
                Operation Manager lorem ipsum dolor sit amet lorem ipsum dolor sit amet
              </Text>
              <Text textStyle='lg' className={styles.jobDetailCompany}>
                Loop Contact Solutions Inc.
              </Text>
              <JobTag tag='featured' />
              <div className={styles.jobDetailButtons}>
                <Button primary>Apply Now</Button>
                <Button secondary>Save Job</Button>
              </div>
              <Text textStyle='xsm' className={styles.jobDetailPostedAt}>
                Posted on 23 August 2021
              </Text>
            </div>
          </div>
          <div className={styles.jobDetailPref}>
            <ul className={styles.jobDetailPrefList}>
              <li className={styles.jobDetailPrefItem}>
                <Image src={LocationIcon} alt='logo' width='18' height='18' />
                <span className={styles.jobDetailPrefText}>
                  <Text
                    textStyle='base'
                    textColor='lightgrey'
                    className={styles.jobDetailPrefField}
                  >
                    Location
                  </Text>
                  <Text textStyle='base' bold className={styles.jobDetailPrefValue}>
                    Makati
                  </Text>
                </span>
              </li>
              <li className={styles.jobDetailPrefItem}>
                <Image src={BriefcaseIcon} alt='logo' width='20' height='20' />
                <span className={styles.jobDetailPrefText}>
                  <Text
                    textStyle='base'
                    textColor='lightgrey'
                    className={styles.jobDetailPrefField}
                  >
                    Experience
                  </Text>
                  <Text textStyle='base' bold className={styles.jobDetailPrefValue}>
                    1 - 3 years
                  </Text>
                </span>
              </li>
              <li className={styles.jobDetailPrefItem}>
                <Image src={EducationIcon} alt='logo' width='20' height='20' />
                <span className={styles.jobDetailPrefText}>
                  <Text
                    textStyle='base'
                    textColor='lightgrey'
                    className={styles.jobDetailPrefField}
                  >
                    Education
                  </Text>
                  <Text textStyle='base' bold className={styles.jobDetailPrefValue}>
                    Bachelor
                  </Text>
                </span>
              </li>
              <li className={styles.jobDetailPrefItem}>
                <Image src={SalaryIcon} alt='logo' width='20' height='20' />
                <span className={styles.jobDetailPrefText}>
                  <Text
                    textStyle='base'
                    textColor='lightgrey'
                    className={styles.jobDetailPrefField}
                  >
                    Salary
                  </Text>
                  <Text textStyle='base' bold className={styles.jobDetailPrefValue}>
                    ₱75k - ₱80k
                  </Text>
                </span>
              </li>
            </ul>
          </div>
          <div className={styles.jobDetailSection}>
            <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>
              Job Description
            </Text>
            <Text textStyle='base' className={styles.jobDetailSectionBody}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at diam ante. Cras
              varius mauris lectus, vitae cursus turpis malesuada ut. Proin imperdiet faucibus
              dolor, gravida vestibulum nibh ultricies sodales. Duis ultricies metus ultrices
              laoreet pretium. Praesent augue orci, mollis ut libero at, malesuada cursus neque.
              Mauris accumsan libero eu felis hendrerit, at congue augue pulvinar. Vivamus ligula
              tortor, auctor et finibus id, lobortis et turpis. Sed rhoncus dapibus neque vel
              tempor.
            </Text>
          </div>
          <div className={styles.jobDetailSection}>
            <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>
              Requirements
            </Text>
            <Text textStyle='base' className={styles.jobDetailSectionBody}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at diam ante. Cras
              varius mauris lectus, vitae cursus turpis malesuada ut. Proin imperdiet faucibus
              dolor, gravida vestibulum nibh ultricies sodales. Duis ultricies metus ultrices
              laoreet pretium. Praesent augue orci, mollis ut libero at, malesuada cursus neque.
              Mauris accumsan libero eu felis hendrerit, at congue augue pulvinar. Vivamus ligula
              tortor, auctor et finibus id, lobortis et turpis. Sed rhoncus dapibus neque vel
              tempor.
            </Text>
          </div>
          <div className={styles.jobDetailSection}>
            <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>
              Benefits
            </Text>
            <ul className={styles.jobDetailBenefitsList}>
              <li className={styles.jobDetailBenefitsItem}>
                <Image src={EquityIcon} alt='logo' width='22' height='22' />
                <Text textStyle='base' className={styles.jobDetailBenefitsText}>
                  Equity Incentive
                </Text>
              </li>
              <li className={styles.jobDetailBenefitsItem}>
                <Image src={MealAllowanceIcon} alt='logo' width='22' height='22' />
                <Text textStyle='base' className={styles.jobDetailBenefitsText}>
                  Meal Allowance
                </Text>
              </li>
              <li className={styles.jobDetailBenefitsItem}>
                <Image src={EmployeeStockIcon} alt='logo' width='22' height='22' />
                <Text textStyle='base' className={styles.jobDetailBenefitsText}>
                  Employee Stock Purchase
                </Text>
              </li>
              <li className={styles.jobDetailBenefitsItem}>
                <Image src={HousingAllowanceIcon} alt='logo' width='22' height='22' />
                <Text textStyle='base' className={styles.jobDetailBenefitsText}>
                  Housing Allowance
                </Text>
              </li>
            </ul>
          </div>
          <div className={styles.jobDetailSection}>
            <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>
              Skills/Software
            </Text>
            <ul className={styles.jobDetailSkillsList}>
              <li className={styles.jobDetailSkillsItem}>
                <Text bold textStyle='base' className={styles.jobDetailSkillsText}>
                  Javascript
                </Text>
              </li>
              <li className={styles.jobDetailSkillsItem}>
                <Text bold textStyle='base' className={styles.jobDetailSkillsText}>
                  CSS
                </Text>
              </li>
              <li className={styles.jobDetailSkillsItem}>
                <Text bold textStyle='base' className={styles.jobDetailSkillsText}>
                  Javascript
                </Text>
              </li>
              <li className={styles.jobDetailSkillsItem}>
                <Text bold textStyle='base' className={styles.jobDetailSkillsText}>
                  CSS
                </Text>
              </li>
              <li className={styles.jobDetailSkillsItem}>
                <Text bold textStyle='base' className={styles.jobDetailSkillsText}>
                  Javascript
                </Text>
              </li>
              <li className={styles.jobDetailSkillsItem}>
                <Text bold textStyle='base' className={styles.jobDetailSkillsText}>
                  CSS
                </Text>
              </li>
              <li className={styles.jobDetailSkillsItem}>
                <Text bold textStyle='base' className={styles.jobDetailSkillsText}>
                  Javascript
                </Text>
              </li>
              <li className={styles.jobDetailSkillsItem}>
                <Text bold textStyle='base' className={styles.jobDetailSkillsText}>
                  CSS
                </Text>
              </li>
            </ul>
          </div>
          <div className={styles.jobDetailSection}>
            <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>
              Additional Information
            </Text>
            <Text textStyle='base' bold className={styles.jobDetailSectionSubTitle}>
              Working Location
            </Text>
            <Text textStyle='base' className={styles.jobDetailSectionSubBody}>
              111 Paseo de Roxas Building Legazpi Village, Makati City, Philippines
            </Text>
            <Text textStyle='base' bold className={styles.jobDetailSectionSubTitle}>
              Specialization
            </Text>
            <Link to='/' className={styles.jobDetailSectionSubBody}>
              <Text textStyle='base' className={styles.jobDetailSectionSubBodyLink}>
                Telesales/Telemarketing, Sales - Financial Services, Marketing/Business Dev
              </Text>
            </Link>
          </div>
          <div className={styles.aboutCompany}>
            <Text bold textStyle='xl' className={styles.aboutCompanyHeader}>
              About the company
            </Text>
            <Link to='/' className={styles.aboutCompanyTitle}>
              <Text bold textStyle='xl' textColor='primaryBlue'>
                Loop Contact Solutions Inc.
              </Text>
            </Link>
            <div className={styles.aboutCompanyDetail}>
              <Text textStyle='base'>BPO</Text>
              <Text textStyle='base'>0 - 50 employees</Text>
            </div>
            <div className={styles.aboutCompanyInfo}>
              <Text textStyle='base'>{companyDetail}</Text>
            </div>
            <div className={styles.aboutCompanyMore}>
              <span
                onClick={() => {
                  handleCompanyDisplay()
                  setIsFullDetail(!isFullDetail)
                }}
              >
                <Text textStyle='base' textColor='primaryBlue'>
                  {!isFullDetail ? '...read more' : '...read less'}
                </Text>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.jobAds}></div>
      </div>

      <ModalEnableJobAlert />
      <ModalJobAlerts />
      <ModalManageJobAlert />
      <ModalDeleteJobAlert />
      <ModalShare />
      <ModalReport />
      <ModalReportDetail />
    </React.Fragment>
  )
}

export default JobListSection
