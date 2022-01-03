import React, { useState } from 'react'

/* Vendors */
import moment from 'moment'
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'

/* Components */
import Image from 'next/image'
import Link from 'components/Link'
import Text from 'components/Text'
import JobTag from 'components/JobTag'

/* Material Components */
import MaterialButton from 'components/MaterialButton'

/* Helpers */
import { numberToThousands } from 'helpers/formatter'

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
  OtherAllowancesIcon,  
  MoreIcon,
} from 'images'

interface IJobDetailProps {
  selectedJob: any
  companyDetail: any
  setIsShowModalShare: Function
  setIsShowReportJob: Function
  isSticky?: Boolean
  companyDescription?: string
  setCompanyDescription?: Function
  isFullDescription?: Boolean
  setIsFullDescription?: Function
  companyUrl?: string
  jobDetailUrl?: string
}

const JobDetail = ({
  selectedJob,
  companyDetail,
  setIsShowModalShare,
  setIsShowReportJob,
  isSticky,
  companyDescription,
  setCompanyDescription,
  isFullDescription,
  setIsFullDescription,
  jobDetailUrl,
  companyUrl
}: IJobDetailProps) => {
  const [jobDetailOption, setJobDetailOption] = useState(false)
  
  const cx = classNames.bind(styles)
  const isStickyClass = cx({ isSticky: isSticky })

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

  const handleCompanyDescription = () => {
    if (!isFullDescription && companyDetail?.['description']?.length > 352) {
      setCompanyDescription(`${companyDetail?.['description'].slice(0, 352)}...`)
      return
    }
    setCompanyDescription(companyDetail?.['description'])
  }

  return (
    <div className={styles.JobDetail}>
      <div className={classNamesCombined([styles.JobDetailOption, isStickyClass])}>
        <div 
          className={styles.JobDetailOptionImage}
          onClick={() => setJobDetailOption(!jobDetailOption)}
        >
          <Image src={MoreIcon} width='20' height='20'></Image>
        </div>
        
        {/* TODO: Job Application status: SAVED JOBS / APPLIED JOBS */}
        {jobDetailOption && (
          <div className={styles.JobDetailOptionList}>
            <Link to={jobDetailUrl} external className={styles.JobDetailOptionItem}>
              <Text textStyle='lg'>View in new tab</Text>
            </Link>
            <div className={styles.JobDetailOptionItem} onClick={() => setIsShowModalShare(true)}>
              <Text textStyle='lg'>Share this job</Text>
            </div>
            <div className={styles.JobDetailOptionItem} onClick={() => setIsShowReportJob(true)}>
              <Text textStyle='lg'>Report job</Text>
            </div>
            <div className={styles.JobDetailOptionItem} onClick={() => console.log('View Resume')}>
              <Text textStyle='lg'>View Resume</Text>
            </div>
          </div>
        )}
      </div>
      <div className={classNamesCombined([styles.JobDetailContent, isStickyClass])}>
        <div className={styles.JobDetailHeader}>
          <div
            className={styles.JobDetailImage}
            style={{ backgroundImage: `url(${selectedJob?.['company_logo']})` }}
          />
          <div className={styles.JobDetailInfo}>
            <Text textStyle='xxl' bold className={styles.JobDetailTitle}>
              {selectedJob?.['job_title']}
            </Text>
            <Text textStyle='lg' className={styles.JobDetailCompany}>
              {selectedJob?.['company_name']}
            </Text>
            <JobTag tag={selectedJob?.['job_type']} />
            <div className={styles.JobDetailButtons}>
              <MaterialButton variant='contained'>
                <Link to={selectedJob?.['external_apply_url']} external>Apply Now</Link>
              </MaterialButton>
              <MaterialButton variant='outlined'>
                Save Job
              </MaterialButton>
            </div>
            <Text textStyle='xsm' className={styles.JobDetailPostedAt}>
              Posted on {moment(new Date(selectedJob?.['published_at'])).format('DD MMMM YYYY')}
            </Text>
          </div>
        </div>
        <div className={styles.JobDetailPref}>
          <ul className={styles.JobDetailPrefList}>
            <li className={styles.JobDetailPrefItem}>
              <Image src={LocationIcon} alt='logo' width='18' height='18' />
              <span className={styles.JobDetailPrefText}>
                <Text
                  textStyle='base'
                  textColor='lightgrey'
                  className={styles.JobDetailPrefField}
                >
                  Location
                </Text>
                <Text textStyle='base' bold className={styles.JobDetailPrefValue}>
                  {selectedJob?.['job_location']}
                </Text>
              </span>
            </li>
            <li className={styles.JobDetailPrefItem}>
              <Image src={BriefcaseIcon} alt='logo' width='20' height='20' />
              <span className={styles.JobDetailPrefText}>
                <Text
                  textStyle='base'
                  textColor='lightgrey'
                  className={styles.JobDetailPrefField}
                >
                  Experience
                </Text>
                <Text textStyle='base' bold className={styles.JobDetailPrefValue}>
                  {selectedJob?.['xp_lvl']}
                </Text>
              </span>
            </li>
            <li className={styles.JobDetailPrefItem}>
              <Image src={EducationIcon} alt='logo' width='20' height='20' />
              <span className={styles.JobDetailPrefText}>
                <Text
                  textStyle='base'
                  textColor='lightgrey'
                  className={styles.JobDetailPrefField}
                >
                  Education
                </Text>
                <Text textStyle='base' bold className={styles.JobDetailPrefValue}>
                  {selectedJob?.['degree']}
                </Text>
              </span>
            </li>
            <li className={styles.JobDetailPrefItem}>
              <Image src={SalaryIcon} alt='logo' width='20' height='20' />
              <span className={styles.JobDetailPrefText}>
                <Text
                  textStyle='base'
                  textColor='lightgrey'
                  className={styles.JobDetailPrefField}
                >
                  Salary
                </Text>
                <Text textStyle='base' bold className={styles.JobDetailPrefValue}>
                  {`${numberToThousands(selectedJob?.['salary_range_from'])}K - ${numberToThousands(selectedJob?.['salary_range_to'])}K` }
                </Text>
              </span>
            </li>
          </ul>
        </div>
        <div className={styles.JobDetailSection}>
          <Text textStyle='lg' bold className={styles.JobDetailSectionTitle}>
            Job Description
          </Text>
          <div className={styles.JobDetailSectionBody} dangerouslySetInnerHTML={{ __html: selectedJob?.['job_description_html'] }} />
        </div>
        <div className={styles.JobDetailSection}>
          <Text textStyle='lg' bold className={styles.JobDetailSectionTitle}>
            Requirements
          </Text>
          <div className={styles.JobDetailSectionBody} dangerouslySetInnerHTML={{ __html: selectedJob?.['job_requirements_html'] }} />
        </div>
        <div className={styles.JobDetailSection}>
          <Text textStyle='lg' bold className={styles.JobDetailSectionTitle}>
            Benefits
          </Text>
          <ul className={styles.JobDetailBenefitsList}>
            {selectedJob?.['benefits']?.map((benefit) => (
              <li className={styles.JobDetailBenefitsItem} key={benefit.id}>
                {handleBenefitIcon(benefit.name)}
                <Text textStyle='base' className={styles.JobDetailBenefitsText}>
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
            {selectedJob?.['job_skills'].split(',').map((skill) => (
              <li className={styles.JobDetailSkillsItem} key={skill}>
                <Text bold textStyle='base' className={styles.JobDetailSkillsText}>
                  {skill}
                </Text>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.JobDetailSection}>
          <Text textStyle='lg' bold className={styles.JobDetailSectionTitle}>
            Additional Information
          </Text>
          <Text textStyle='base' bold className={styles.JobDetailSectionSubTitle}>
            Working Location
          </Text>
          <Text textStyle='base' className={styles.JobDetailSectionSubBody}>
            {`${selectedJob?.['job_location']}, ${selectedJob?.['job_region']}, ${selectedJob?.['job_country']}`}
          </Text>
          <Text textStyle='base' bold className={styles.JobDetailSectionSubTitle}>
            Specialization
          </Text>
          {selectedJob?.['categories'].map((category) => (
            <Link to='/' key={category.id} className={styles.JobDetailSectionSubBody}>
              <Text textStyle='base' className={styles.JobDetailSectionSubBodyLink}>
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
  )
}

export default JobDetail