import React, { useState, useEffect, useRef } from 'react'

/* Vendors */
import { useRouter } from 'next/router'
import moment from 'moment'
import slugify from 'slugify'
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'

/* Components */
import Image from 'next/image'
import Link from 'components/Link'
import Button from 'components/Button'
import Text from 'components/Text'
import JobTag from 'components/JobTag'
import JobCard from 'components/JobCard'
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
  MoreIcon,
  NotificationIcon
} from 'images'

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
  isJobDetailFetching
}: JobListSectionProps) => {  
  const { width } = useWindowDimensions()
  const router = useRouter()
  const prevScrollY = useRef(0)

  const [isSticky, setIsSticky] = useState(false)
  const [companyDescription, setCompanyDescription] = useState('')
  const [isFullDescription, setIsFullDescription] = useState(false)
  const [jobDetailOption, setJobDetailOption] = useState(false)
  
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
    handleCompanyDescription()
  }, [companyDetail, isFullDescription])

  useEffect(() => {
    window.addEventListener('scroll', updateScrollPosition)
    return () => window.removeEventListener('scroll', updateScrollPosition)
  }, [])

  const handleCompanyDescription = () => {
    if (!isFullDescription && companyDetail?.['description']?.length > 352) {
      setCompanyDescription(`${companyDetail?.['description'].slice(0, 352)}...`)
      return
    }
    setCompanyDescription(companyDetail?.['description'])
  }

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

  const handleBenefitIcon = (benefit) => {
    const Icon = `${benefit.replace(/ /g,'')}Icon`

    switch(Icon) {
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

  const updateScrollPosition = () => {
    if (width > 798) {
      prevScrollY.current = window.pageYOffset
      setIsSticky(prevScrollY.current > 70 ? true : false)
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
                  setIsFullDescription(false)
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
            <div className={styles.jobDetail}>
              <div className={classNamesCombined([styles.jobDetailOption, isStickyClass])}>
                <div 
                  className={styles.jobDetailOptionImage}
                  onClick={() => setJobDetailOption(!jobDetailOption)}
                >
                  <Image src={MoreIcon} width='20' height='20'></Image>
                </div>

                {jobDetailOption && (
                  <div className={styles.jobDetailOptionList}>
                    <Link to={jobDetailUrl} external className={styles.jobDetailOptionItem}>
                      <Text textStyle='lg'>View in new tab</Text>
                    </Link>
                    <div className={styles.jobDetailOptionItem} onClick={() => setIsShowModalShare(true)}>
                      <Text textStyle='lg'>Share this job</Text>
                    </div>
                    <div className={styles.jobDetailOptionItem} onClick={() => setIsShowReportJob(true)}>
                      <Text textStyle='lg'>Report job</Text>
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.jobDetailContent}>
                <div className={styles.jobDetailHeader}>
                  <div
                    className={styles.jobDetailImage}
                    style={{ backgroundImage: `url(${selectedJob?.['company_logo']})` }}
                  />
                  <div className={styles.jobDetailInfo}>
                    <Text textStyle='xxl' bold className={styles.jobDetailTitle}>
                      {selectedJob?.['job_title']}
                    </Text>
                    <Text textStyle='lg' className={styles.jobDetailCompany}>
                      {selectedJob?.['company_name']}
                    </Text>
                    <JobTag tag={selectedJob?.['job_type']} />
                    <div className={styles.jobDetailButtons}>
                      <Button primary>
                        <Link to={selectedJob?.['external_apply_url']} external>Apply Now</Link>
                      </Button>
                      <Button secondary>Save Job</Button>
                    </div>
                    <Text textStyle='xsm' className={styles.jobDetailPostedAt}>
                      Posted on {moment(new Date(selectedJob?.['published_at'])).format('DD MMMM YYYY')}
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
                          {selectedJob?.['job_location']}
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
                          {selectedJob?.['xp_lvl']}
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
                          {selectedJob?.['degree']}
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
                          {`${numberToThousands(selectedJob?.['salary_range_from'])}K - ${numberToThousands(selectedJob?.['salary_range_to'])}K` }
                        </Text>
                      </span>
                    </li>
                  </ul>
                </div>
                <div className={styles.jobDetailSection}>
                  <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>
                    Job Description
                  </Text>
                  <div className={styles.jobDetailSectionBody} dangerouslySetInnerHTML={{ __html: selectedJob?.['job_description_html'] }} />
                </div>
                <div className={styles.jobDetailSection}>
                  <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>
                    Requirements
                  </Text>
                  <div className={styles.jobDetailSectionBody} dangerouslySetInnerHTML={{ __html: selectedJob?.['job_requirements_html'] }} />
                </div>
                <div className={styles.jobDetailSection}>
                  <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>
                    Benefits
                  </Text>
                  <ul className={styles.jobDetailBenefitsList}>
                    {selectedJob?.['benefits']?.map((benefit) => (
                      <li className={styles.jobDetailBenefitsItem} key={benefit.id}>
                        {handleBenefitIcon(benefit.name)}
                        <Text textStyle='base' className={styles.jobDetailBenefitsText}>
                          {benefit.name}
                        </Text>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.jobDetailSection}>
                  <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>
                    Skills/Software
                  </Text>
                  <ul className={styles.jobDetailSkillsList}>
                    {selectedJob?.['job_skills'].split(',').map((skill) => (
                      <li className={styles.jobDetailSkillsItem} key={skill}>
                        <Text bold textStyle='base' className={styles.jobDetailSkillsText}>
                          {skill}
                        </Text>
                      </li>
                    ))}
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
                    {`${selectedJob?.['job_location']}, ${selectedJob?.['job_region']}, ${selectedJob?.['job_country']}`}
                  </Text>
                  <Text textStyle='base' bold className={styles.jobDetailSectionSubTitle}>
                    Specialization
                  </Text>
                  {selectedJob?.['categories'].map((category) => (
                    <Link to='/' key={category.id} className={styles.jobDetailSectionSubBody}>
                      <Text textStyle='base' className={styles.jobDetailSectionSubBodyLink}>
                        {' '}{category.value}
                      </Text>
                    </Link>
                  ))}
                </div>
                <div className={styles.aboutCompany}>
                  <Text bold textStyle='xl' className={styles.aboutCompanyHeader}>
                    About the company
                  </Text>
                  <Link to={companyUrl} className={styles.aboutCompanyTitle}>
                    <Text bold textStyle='xl' textColor='primaryBlue'>
                      {companyDetail?.['name']}
                    </Text>
                  </Link>
                  <div className={styles.aboutCompanyDetail}>
                    <Text textStyle='base'>{companyDetail?.['industry']}</Text>
                    <Text textStyle='base'>{companyDetail?.['company_size']} employees</Text>
                  </div>
                  <div className={styles.aboutCompanyInfo}>
                    <Text textStyle='base'>{companyDescription || ''}</Text>
                  </div>
                  {companyDetail?.['description']?.length > 352 && (
                    <div className={styles.aboutCompanyMore}>
                      <span
                        onClick={() => {
                          setIsFullDescription(!isFullDescription)
                          handleCompanyDescription()
                        }}
                      >
                        <Text textStyle='base' textColor='primaryBlue'>
                          {isFullDescription ? '...read less' : '...read more'}
                        </Text>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.jobAds}></div>
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
