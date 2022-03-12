import { useEffect, useState } from 'react'
import slugify from 'slugify'
import classNames from 'classnames/bind'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// @ts-ignore
import { END } from 'redux-saga'

// Redux Actions
import { wrapper } from 'store'
import { fetchCompanyDetailRequest } from 'store/actions/companies/fetchCompanyDetail'
import { fetchJobsListRequest } from 'store/actions/jobs/fetchJobsList'

// Components
import Text from 'components/Text'
import Link from 'components/Link'
import CompanyJobsCard from 'components/Company/CompanyJobsCard'
import CompanyProfileLayout from 'components/Company/CompanyProfileLayout'

// Images
import {
  FacebookOutline,
  LinkedinOutline,
  InstagramOutline,
  YoutubeOutline
} from 'images'

// Helpers
import { formatSalaryRange } from 'helpers/formatter'

// Styles
import styles from '../Company.module.scss'
import breakpointStyles from 'styles/breakpoint.module.scss'

const CompanyDetail = (props: any) => {
  const router = useRouter()
  const dispatch = useDispatch()
  
  const { companyDetail } = props
  const company = companyDetail?.response.data
  const [companyJobs, setCompanyJobs] = useState(null)
  const [totalJobs, setTotalJobs] = useState(null)

  const fetchJobsListResponse = useSelector((store: any) => store.job.jobList.response)

  useEffect(() => {
    const payload = {
      companyIds: company.id,
      size: 30
    }

    dispatch(fetchJobsListRequest({...payload}))
  }, [])

  useEffect(() => {
    if (fetchJobsListResponse) {
      setCompanyJobs(fetchJobsListResponse.data?.jobs)
      setTotalJobs(fetchJobsListResponse.data?.total_num)
    }
  }, [fetchJobsListResponse])

  return (
    <CompanyProfileLayout
      company={company}
      currentTab='overview'
      totalJobs={totalJobs}
    >
      <div className={styles.companyTabsContent}>
        <div className={styles.companyOverview}>
          <div className={styles.companyOverviewContents}>
            <div className={styles.companyOverviewLeft}>
              <div className={styles.companyOverviewItem}>
                <Text textStyle='lg' bold>Company Size: </Text>
                <Text textStyle='lg'>{company.company_size} Employees</Text>
              </div>
              <div className={styles.companyOverviewItem}>
                <Text textStyle='lg' bold>Industry: </Text>
                <Text textStyle='lg'>{company.industry}</Text>
              </div>
              <div className={styles.companyOverviewItem}>
                <Text textStyle='lg' bold>Website: </Text>
                <Text textStyle='lg'>{company.website}</Text>
              </div>
            </div>
            <div className={styles.companyOverviewRight}>
              <div className={styles.companyOverviewItem}>
                <Text textStyle='lg' bold>Location: </Text>
                <Text textStyle='lg' className={styles.companyOverviewLocation}>{company.address}, {company.location}, {company.country}</Text>
              </div>
              <div className={styles.companyOverviewItem}>
                <Text textStyle='lg' bold>Social Media: </Text>
                <div className={styles.companyOverviewSocial}>
                  <Link external className={styles.companyOverviewSocialLink} to={company.facebook_url ? company.facebook_url : router.asPath}>
                    <img src={FacebookOutline} />
                  </Link>
                  <Link external className={styles.companyOverviewSocialLink} to={company.linkedin_url ? company.linkedin_url : router.asPath}>
                    <img src={LinkedinOutline} />
                  </Link>
                  <Link external className={styles.companyOverviewSocialLink} to={company.instagram_url ? company.instagram_url : router.asPath}>
                    <img src={InstagramOutline} />
                  </Link>
                  <Link external className={styles.companyOverviewSocialLink} to={company.youtube_url ? company.youtube_url : router.asPath}>
                    <img src={YoutubeOutline} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Text textStyle='lg' bold className={styles.companySectionTitle}>About the company</Text>
        <div className={styles.companyDescription} dangerouslySetInnerHTML={{ __html: company.description_html }} />

        <div className={styles.companyCulture}>
          <div className={styles.companyCultureHeading}>
            <Text textStyle='lg' bold>Culture & Benefits</Text>
            <Link to={`/company/${slugify(company.name)}-${company.id}/life`} className={classNames(styles.companyCultureHeadingLink, breakpointStyles.hideOnMobile)}>
              <Text textColor='primaryBlue' textStyle='base'>View all culture & benefits</Text>
            </Link>
          </div>
          <div className={styles.companyCultureContent}>
            <div className={styles.companyCultureTopImage}>
              {company.pictures?.length > 0 && (
                <img src={company.pictures[0].url} alt={company.name}/>
              )}
            </div>
            <div className={styles.companyCultureWrapper}>
              <div className={styles.companyCultureSection}>
                <Text className={styles.companyCultureSectionTitle} textStyle='lg' bold>Company Culture</Text>
                <div className={styles.companyCultureList}>
                  {company.cultures?.length > 0 && company.cultures.map((item) => (
                    <Text className={styles.companyCultureItem} textStyle='base' key={item.id}>{item.value}</Text>
                  ))}
                </div>
              </div>
              <div className={styles.companyCultureSection}>
                <Text className={styles.companyCultureSectionTitle} textStyle='lg' bold>Employee Benefits</Text>
                <div className={styles.companyCultureList}>
                  {company.benefits?.length > 0 && company.benefits.map((item) => (
                    <Text className={styles.companyCultureItem} textStyle='base' key={item.id}>{item.value}</Text>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Link to={`/company/${slugify(company.name)}-${company.id}/life`} className={classNames(styles.companyCultureHeadingLink, breakpointStyles.hideOnDesktop)}>
            <Text textColor='primaryBlue' textStyle='base'>View all culture & benefits</Text>
          </Link>
        </div>

        <div className={styles.companyCultureJobs}>
          <div className={styles.companyCultureHeading}>
            <Text textStyle='lg' bold>Jobs</Text>
            <Link to={`/company/${slugify(company.name)}-${company.id}/jobs`} className={styles.companyCultureHeadingLink}>
              <Text textColor='primaryBlue' textStyle='base'>See all Jobs</Text>
            </Link>
          </div>
          <div className={styles.companyCultureJobsList}>
            {companyJobs?.length > 0 && companyJobs.map((companyJob) => {
              const company = {
                id: companyJob.id,
                title: companyJob.job_title,
                location: companyJob.job_location,
                salary: `${formatSalaryRange(`${companyJob.salary_range_from}-${companyJob.salary_range_to}`)}`,
                availability: companyJob.job_type
              }

              return <CompanyJobsCard {...company} key={companyJob.id}/>
            })}
          </div>
        </div>
      </div>
    </CompanyProfileLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const companyPageUrl = req.url.split('/')
  const companyPath = companyPageUrl[companyPageUrl.length - 1].split('-')
  const companyId = Number(companyPath[companyPath.length - 1])

  store.dispatch(fetchCompanyDetailRequest(companyId))
  store.dispatch(END)

  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const companyDetail = storeState.companies.companyDetail

  return {
    props: {
      companyDetail
    }
  }
})

export default CompanyDetail