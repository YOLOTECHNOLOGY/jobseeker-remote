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
  TimelineDot
} from '@mui/lab'

/* Components */
import Layout from 'components/Layout'
import Text from 'components/Text'
import Link from 'components/Link'
import MaterialButton from 'components/MaterialButton'
import SEO from 'components/SEO'
import JobTag from 'components/JobTag'
import Image from 'next/image'
import ReadMore from 'components/ReadMore'

import ModalShare from 'components/ModalShare'
import ModalReportJob from 'components/ModalReportJob'

/* Helpers */
import { numberToThousands, truncateWords } from 'helpers/formatter'

/* Action Creators */
import { wrapper } from 'store'

/* Redux Actions */
import { fetchJobDetailRequest } from 'store/actions/jobs/fetchJobDetail'
import { fetchCompanyDetailRequest } from 'store/actions/companies/fetchCompanyDetail'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'

import { postReportRequest } from 'store/actions/reports/postReport'

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
  MoreIcon,
  ExpireIcon
} from 'images'

interface IJobDetail {
  jobDetail: any,
  config: any
}

const Job = ({
  jobDetail,
  config
}: IJobDetail) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [companyDetail, setCompanyDetail] = useState(null)
  const [isShowModalShare, setIsShowModalShare] = useState(false)
  const [isShowReportJob, setIsShowReportJob] = useState(false)
  const [jobDetailOption, setJobDetailOption] = useState(false)

  let jobDetailUrl = ''
  let companyUrl = ''
  if (typeof window !== 'undefined') {
    jobDetailUrl = `${window.location.origin}/job/${slugify(jobDetail?.['job_title'] || '', { lower: true, remove: /[*+~.()'"!:@]/g })}-${jobDetail?.['id']}`
    companyUrl = `${window.location.origin}/company/${slugify(companyDetail?.['name'] || '', { lower: true, remove: /[*+~.()'"!:@]/g })}-${companyDetail?.['id']}`
  }

  const companyDetailResponse = useSelector((store: any) => store.companies.companyDetail?.response?.data)
  const reportJobReasonList = config && config.inputs && config.inputs.report_job_reasons

  const handlePostReportJob = (payload) => dispatch(postReportRequest(payload))

  useEffect(() => {
    if (jobDetail) dispatch(fetchCompanyDetailRequest(jobDetail.company_id))
  }, [jobDetail])

  useEffect(() => {
    if (companyDetailResponse) setCompanyDetail(companyDetailResponse)
  }, [companyDetailResponse])

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

  const isAppliedQueryParam = router.query.isApplied
  const hasApplied = isAppliedQueryParam === 'true' ? true : false

  return (
    <Layout>
      <SEO title={jobDetail.job_title} description={jobDetail.job_description} />
      <div className={styles.JobDetail}>
        <div className={styles.JobDetailContent}>
          <div className={styles.LeaderBoard}/>
          <div className={styles.JobDetailPrimary}>
            <div 
              className={styles.JobDetailPrimaryOptions}
              onClick={() => setJobDetailOption(!jobDetailOption)}
            >
              <Image src={MoreIcon} width='20' height='20'></Image>
            </div>
            {/* TODO: Job Application status: SAVED JOBS / APPLIED JOBS */}
            {jobDetailOption && (
              <div className={styles.JobDetailOptionList}>
                <div className={styles.JobDetailOptionItem} onClick={() => setIsShowModalShare(true)}>
                  <Text textStyle='lg'>Share this job</Text>
                </div>
                <div className={styles.JobDetailOptionItem} onClick={() => setIsShowReportJob(true)}>
                  <Text textStyle='lg'>Report job</Text>
                </div>
              </div>
            )}
            <div className={styles.JobDetailPrimaryInfo}>
              <img src={jobDetail?.company_logo} className={styles.JobDetailPrimaryInfoImage} alt={`${jobDetail?.company_name} logo`}/>
              <Text textStyle='xxl' tagName='h1' bold className={styles.JobDetailPrimaryInfoTitle}>
                {jobDetail?.job_title}
              </Text>
            </div>
            <div className={styles.JobDetailPrimarySub}>
              <JobTag tag={jobDetail?.job_type}/>
              <Text textStyle='sm' className={styles.JobDetailPostedAt}>
                Posted on {moment(new Date(jobDetail?.published_at)).format('DD MMMM YYYY')}
              </Text>
            </div>
            <Link to={companyUrl}>
              <Text textStyle='xl' className={styles.JobDetailCompany}>
                {jobDetail?.company_name}
              </Text>
            </Link>
            {isAppliedQueryParam && !hasApplied && (
              <div className={styles.JobDetailPrimaryActionsCategory}>
                <Text textStyle='base' className={styles.JobDetailStatus}>
                  <Image src={ExpireIcon} height="16" width="16"/>
                  <span>This job is no longer hiring</span>
                </Text>
                <MaterialButton variant='outlined'>
                  Save Job
                </MaterialButton>
              </div>
            )}
            {!isAppliedQueryParam && (
              <div className={styles.JobDetailPrimaryActions}>
                <MaterialButton variant='contained'>
                  <Link to={jobDetail?.external_apply_url} external>Apply Now</Link>
                </MaterialButton>
                <MaterialButton variant='outlined'>
                  Save Job
                </MaterialButton>
              </div>
            )}
          </div>
          <div className={styles.JobDetailPref}>
            <ul className={styles.JobDetailPrefList}>
              <li className={styles.JobDetailPrefItem}>
                <Image src={LocationIcon} alt='logo' width='18' height='18' />
                <span className={styles.JobDetailPrefText}>
                  <Text
                    textStyle='base'
                    textColor='darkgrey'
                    className={styles.JobDetailPrefField}
                  >
                    Location
                  </Text>
                  <Link to={'/'}>
                    <Text textStyle='lg' bold className={styles.JobDetailPrefValue}>
                      {jobDetail?.job_location}
                    </Text>
                  </Link> 
                </span>
              </li>
              <li className={styles.JobDetailPrefItem}>
                <Image src={BriefcaseIcon} alt='logo' width='20' height='20' />
                <span className={styles.JobDetailPrefText}>
                  <Text
                    textStyle='base'
                    textColor='darkgrey'
                    className={styles.JobDetailPrefField}
                  >
                    Experience
                  </Text>
                  <Text textStyle='lg' bold className={styles.JobDetailPrefValue}>
                    {jobDetail?.xp_lvl}
                  </Text>
                </span>
              </li>
              <li className={styles.JobDetailPrefItem}>
                <Image src={EducationIcon} alt='logo' width='20' height='20' />
                <span className={styles.JobDetailPrefText}>
                  <Text
                    textStyle='base'
                    textColor='darkgrey'
                    className={styles.JobDetailPrefField}
                  >
                    Education
                  </Text>
                  <Text textStyle='lg' bold className={styles.JobDetailPrefValue}>
                    {jobDetail?.degree}
                  </Text>
                </span>
              </li>
              <li className={styles.JobDetailPrefItem}>
                <Image src={SalaryIcon} alt='logo' width='20' height='20' />
                <span className={styles.JobDetailPrefText}>
                  <Text
                    textStyle='base'
                    textColor='darkgrey'
                    className={styles.JobDetailPrefField}
                  >
                    Salary
                  </Text>
                  <Text textStyle='lg' bold className={styles.JobDetailPrefValue}>
                    {`${numberToThousands(jobDetail?.salary_range_from)}K - ${numberToThousands(jobDetail?.salary_range_to)}K` }
                  </Text>
                </span>
              </li>
            </ul>
          </div>
          {hasApplied && (
            <div className={styles.JobDetailApplicationWrapper}>
              <Text textStyle='lg' bold>Application History</Text>
              <Timeline className={styles.JobDetailApplicationTimeline}>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot className={styles.JobDetailApplicationTimelineFirst}/>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent><Text textStyle='base'>Application withdrawn -  1 month ago</Text></TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot />
                  </TimelineSeparator>
                  <TimelineContent><Text textStyle='base'>Application submitted - 3 months ago</Text></TimelineContent>
                </TimelineItem>
              </Timeline>
            </div>
          )}
          <div className={styles.JobDetailSection}>
            <Text textStyle='lg' tagName='h2' bold className={styles.JobDetailSectionTitle}>
              Job Description
            </Text>
            <div className={styles.JobDetailSectionBody} dangerouslySetInnerHTML={{ __html: jobDetail?.job_description_html }} />
          </div>
          <div className={styles.JobDetailSection}>
            <Text textStyle='lg' tagName='h2' bold className={styles.JobDetailSectionTitle}>
              Requirements
            </Text>
            <div className={styles.JobDetailSectionBody} dangerouslySetInnerHTML={{ __html: jobDetail?.job_requirements_html }} />
          </div>
          <div className={styles.JobDetailSection}>
            <Text textStyle='lg' tagName='h2' bold className={styles.JobDetailSectionTitle}>
              Benefits
            </Text>
            <ul className={styles.JobDetailBenefitsList}>
              {jobDetail?.benefits?.map((benefit) => (
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
            <Text textStyle='lg' tagName='h2' bold className={styles.JobDetailSectionTitle}>
              Skills/Software
            </Text>
            <ul className={styles.JobDetailSkillsList}>
              {jobDetail?.job_skills.split(',').map((skill) => (
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
            <Text textStyle='base' tagName='h2' bold className={styles.JobDetailSectionSubTitle}>
              Working Location
            </Text>
            <Text textStyle='base' className={styles.JobDetailSectionSubBody}>
              {`${jobDetail?.job_location}, ${jobDetail?.job_region}, ${jobDetail?.job_country}`}
            </Text>
            <Text textStyle='base' tagName='h2' bold className={styles.JobDetailSectionSubTitle}>
              Specialization
            </Text>
            {jobDetail?.categories.map((category) => (
              <Link to='/' key={category.id} className={styles.JobDetailSectionSubBody}>
                <Text textStyle='base' className={styles.JobDetailSectionSubBodyLink}>
                  {' '}{category.value}
                </Text>
              </Link>
            ))}
          </div>
          <div className={styles.JobDetailRecruiter}>
            <Text textStyle='base' bold>Connect directly to job poster after applying</Text>
            <div className={styles.JobDetailRecruiterInfo}>
              <div 
                className={styles.JobDetailRecruiterInfoImage}
                style={{ backgroundImage: `url(${jobDetail?.recruiter_avatar})` }}
              />
              <div className={styles.JobDetailRecruiterInfoText}>
                <Text textStyle='base' bold>{jobDetail?.recruiter_first_name} {jobDetail?.recruiter_last_name}</Text>
                <span>
                  <Text textStyle='base'>Marketing Manager {' '}</Text>
                  <Text textStyle='base'>{' '}- {jobDetail?.application_response_rate}% response rate, responds {jobDetail?.application_response_time} | Last active on {moment(jobDetail?.recruiter_last_active_at).format('MM/DD/YYYY')}</Text>
                </span>
              </div>
            </div>
          </div>
          <div className={styles.aboutCompany}>
            <Text bold textStyle='xl' className={styles.aboutCompanyHeader}>
              About the company
            </Text>
            <Link to={companyUrl} className={styles.aboutCompanyTitle}>
              <Text bold textStyle='xl' textColor='primaryBlue'>
                {companyDetail?.name}
              </Text>
            </Link>
            <div className={styles.aboutCompanyDetail}>
              <Text textStyle='base'>{companyDetail?.industry}</Text>
              <Text textStyle='base'>{companyDetail?.company_size} employees</Text>
            </div>
            <ReadMore
              size={352}
              text={companyDetail?.description}
            />
          </div>
        </div>
        <div className={styles.JobDetailSidebar}>
          <div className={styles.JobDetailSidebarSection}>
            <div className={styles.JobDetailSidebarTitle}>
              <Text textStyle='xxl' bold>Similar Jobs</Text>
            </div>
            <div className={styles.JobDetailSidebarCardList}>
              <Link external to={'/job/1'} className={styles.JobDetailSidebarCard}>
                <Text 
                  className={styles.JobDetailSidebarCardTitle} 
                  textStyle='xl' 
                  tagName='p' 
                  bold
                >
                  {truncateWords('Operation Manager Lorem Ipsum Manager Lorem IpsumManager Lorem IpsumManager Lorem IpsumManager Lorem Ipsum', 80)}
                </Text>
                <Text textStyle='base' tagName='p'>Loop Contact Solutions Inc.</Text>
                <Text textStyle='base' tagName='p' textColor='darkgrey'>Makati</Text>
                <Text textStyle='base' tagName='p' textColor='darkgrey'>₱75k - ₱80k</Text>
                <Text textStyle='xsm' tagName='p'>Posted on 23 August 2021</Text>
                <Link external to={'/job/1'}>
                  <Text 
                    textStyle='base' 
                    tagName='p' 
                    bold
                    className={styles.JobDetailSidebarCardCTA}
                  >
                    Apply Now
                  </Text>
                </Link>
              </Link>
            </div>
          </div>
          <div className={styles.JobDetailSidebarSection}>
            <div className={styles.JobDetailSidebarTitle}>
              <Text textStyle='xxl' bold>Recommended Courses</Text>
            </div>
            <div className={styles.JobDetailSidebarCardList}>
              <Link external to={'/'} className={styles.JobDetailSidebarCard}>
                <Text className={styles.JobDetailSidebarCardTitle} textStyle='xl' tagName='p' bold>{truncateWords('2022 Complete Python Bootcamp From Zero to Hero in Python', 80)}</Text>
                <Text textStyle='base' tagName='p'>Intermediate</Text>
                <Text textStyle='base' tagName='p' textColor='darkgrey'>Online Learning</Text>
                <Text textStyle='base' tagName='p' textColor='darkgrey'>₱80k</Text>
                <Link external to={'/'}>
                  <Text 
                    textStyle='base' 
                    tagName='p' 
                    bold
                    className={styles.JobDetailSidebarCardCTA}
                  >
                    Get Started
                  </Text>
                </Link>
              </Link>
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
      />

      <ModalShare
        jobDetailUrl={jobDetailUrl}
        isShowModalShare={isShowModalShare}
        handleShowModalShare={setIsShowModalShare}
      />
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query }) => {
  const { keyword } = query
  const keywordQuery:any = keyword
  const keywordQueryArray = keywordQuery?.split('-')
  const jobId = keywordQueryArray?.slice(-1)[0]

  // store actions
  store.dispatch(fetchJobDetailRequest(jobId))
  store.dispatch(fetchConfigRequest())

  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const jobDetail = storeState.job.jobDetail.response.data
  const config = storeState.config.config.response

  return {
    props: {
      jobDetail,
      config
    }
  }
})

export default Job