import React, { useState, useEffect } from 'react'
/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
// import { useRouter } from 'next/router'
import { END } from 'redux-saga'

// import moment from 'moment'
import slugify from 'slugify'

/* Action Creators */
import { wrapper } from 'store'

/* Redux Actions */
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchJobsListRequest } from 'store/actions/jobs/fetchJobsList'
import { fetchFeaturedCompaniesRequest } from 'store/actions/companies/fetchFeaturedCompanies'

/* Material Components */
import MaterialButton from 'components/MaterialButton'
import MaterialTextField from 'components/MaterialTextField'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialSelectCheckmarks from 'components/MaterialSelectCheckmarks'

/* Components */
import Image from 'next/image'
import Layout from 'components/Layout'
import Text from 'components/Text'
import Link from 'components/Link'
import SEO from 'components/SEO'
import JobSearchFilters from 'components/JobSearchFilters'

/* Styles */
import styles from './jobsHiring.module.scss'
// import { formatLocationConfig } from 'helpers/jobPayloadFormatter'
// import breakpointStyles from 'styles/breakpoint.module.scss'
// import classNames from 'classnames'

interface JobSearchPageProps {
  seoMetaTitle: string
  seoMetaDescription: string
  config: configObject
  topCompanies: companyObject[]
}

type configObject = {
  inputs: any
  filters: any
}

type companyObject = {
  id: number
  logo: string
  name: string
}

const renderPopularSearch = () => {
  // To refactor when authentication is handled
  // const jobsPageLink = cookies.get('user')
  //   ? '/dashboard/jobs-hiring'
  //   : '/jobs-hiring'
  const jobsPageLink = '/jobs-hiring'
  return (
    <div className={styles.popularSearch}>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?jobCategory=audit-taxation,banking-financial,corporate-finance-investment,sales-financial-services,general-cost-accounting`}
        title='Finance jobs'
        aTag
      >
        <Text textStyle='sm'>Finance jobs</Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?jobCategory=sales-corporate,sales-eng-tech-it,sales-financial-services,marketing-business-dev`}
        title='Sales jobs'
        aTag
      >
        <Text textStyle='sm'>Sales jobs</Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?jobCategory=digital-marketing,marketing-business-dev,telesales-telemarketing`}
        title='Marketing jobs'
        aTag
      >
        <Text textStyle='sm'>Marketing jobs</Text>
      </Link>
      <Link className={styles.link} to={`${jobsPageLink}/makati-jobs`} title='Makati jobs' aTag>
        <Text textStyle='sm'>Makati jobs</Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?jobCategory=it-hardware,it-network-sys-db-admin,it-software-engineering,sales-eng-tech-it,tech-helpdesk-support`}
        title='IT jobs'
        aTag
      >
        <Text textStyle='sm'>IT jobs</Text>
      </Link>
      <Link className={styles.link} to={`${jobsPageLink}/overseas-jobs`} title='Overseas jobs' aTag>
        <Text textStyle='sm'>Overseas jobs</Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?jobCategory=customer-service,tech-helpdesk-support`}
        title='Customer Service jobs'
        aTag
      >
        <Text textStyle='sm'>Customer Service jobs</Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?salary=30K_to_60K,60K_to_80K,80K_to_100K,Above_200K`}
        title='₱30K + jobs'
        aTag
      >
        <Text textStyle='sm'>₱30K + jobs</Text>
      </Link>
      <Link className={styles.link} to={`${jobsPageLink}/manila-jobs`} title='Manila jobs' aTag>
        <Text textStyle='sm'>Manila jobs</Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?jobtype=full_time`}
        title='Full Time jobs'
        aTag
      >
        <Text textStyle='sm'>Full Time jobs</Text>
      </Link>
    </div>
  )
}

const JobSearchPage = (props: JobSearchPageProps) => {
  const { seoMetaTitle, seoMetaDescription, config, topCompanies } = props
  const dispatch = useDispatch()
  const jobsList = useSelector((store: any) => store.job.jobsList)
  const [isShowFilter, setIsShowFilter] = useState(false)


  // filters config
  // const locationList = formatLocationConfig(config.inputs.location_lists)

  useEffect(() => {
    console.log('1')
    const payload = {
      query: 'test',
      // query: payloadQuery ? payloadQuery.toLowerCase() : payloadQuery,
      //    page: isNaN(page) ? 1 : Number(page),
      //    salary: salaryRange,
      //    workExperience: workExperience,
      //    education: education,
      //    jobType: jobType,
      //    industry: industry,
      //    isVerified: isVerified,
      //    sort: sortParam,
      //    applicationStatus: applicationStatus,
      //    viewPage: activeView,
      //    jobCategory: payloadJobCategory,
      //    jobLocation: payloadJobLocation,
      //    companyName,
    }
    dispatch(fetchJobsListRequest(payload))
    console.log('2')
  }, [])

  const sortOptions = [
    { label: 'Relevance', value: 1 },
    { label: 'Latest', value: 2 },
    { label: 'Ascending', value: 3 },
  ]
  //   const sampleJobType = ['Relevance', 'Latest', 'Ascending']
  console.log('config from server', config)
  console.log('jobsList', jobsList)
  // console.log('locationList', locationList)
  const handleShowFilter = () => {
    setIsShowFilter(!isShowFilter)
    console.log('triggered')
  }
  const jobTypeOption = config.inputs.job_types.map((jobType) => Object.values(jobType)).flat(2)
  const salaryRangeOption = config.filters.salary_range_filters
    .map((range) => {
      return Object.values(range)[0] === '10K - 30K' ? 'Below 30K' : Object.values(range)
    })
    .flat(2)
  console.log('jobTypeOption', jobTypeOption)
  console.log('salaryRangeOption', salaryRangeOption)
  
  return (
    <Layout>
      <SEO title={seoMetaTitle} description={seoMetaDescription} />
      <div className={styles.searchSection}>
        <div className={styles.searchAndLocationContainer}>
          <MaterialTextField
            id='search'
            label='Search for job title, keyword or company'
            variant='outlined'
            size='small'
            className={styles.searchField}
          />
          <MaterialLocationField className={styles.locationField} />
          <MaterialButton variant='contained'>Search</MaterialButton>
        </div>
        <div className={styles.filtersContainer}>
          <MaterialBasicSelect
            id='sort'
            label='Sort by'
            options={sortOptions}
            className={styles.sortField}
            greyBg
          />
          <MaterialSelectCheckmarks
            id='job-type'
            label='Job Type'
            options={jobTypeOption}
            className={styles.sortField}
            greyBg
          />
          <MaterialSelectCheckmarks
            id='salary'
            label='Salary'
            options={salaryRangeOption}
            className={styles.sortField}
            greyBg
          />
          <MaterialButton variant='contained' className={styles.moreFiltersBtn} onClick={
            handleShowFilter}>
            More Filters
          </MaterialButton>
        </div>
        <div className={styles.quickLinkSection}>
          <div className={styles.popularSearchContainer}>
            <Text textStyle='sm' bold textColor='lightgrey' className={styles.quickLinkTitle}>
              Popular Search:
            </Text>
            {renderPopularSearch()}
          </div>
          <div className={styles.topCompaniesContainer}>
            <Text textStyle='sm' bold textColor='lightgrey' className={styles.quickLinkTitle}>
              Top Companies:
            </Text>
            <div className={styles.topCompanies}>
              {topCompanies &&
                topCompanies.map((company) => (
                  <Link
                    key={company.id}
                    className={styles.topCompaniesLogo}
                    to={`/company/${slugify(company.name.toLowerCase())}-${company.id}/jobs`}
                    external
                  >
                    <Image src={company.logo} alt={company.name} width='30' height='30' />
                  </Link>
                ))}
            </div>
          </div>
        </div>
      <JobSearchFilters
        isShowFilter={isShowFilter}
        // onApplyFilter={handleApplyFilter}
        // onResetFilter={handleResetFilter}
        onShowFilter={handleShowFilter}
      />
      </div>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query }) => {
  const { keyword } = query
  console.log('keyword', keyword)
  // const courseDetailId = unslugifyAndGetId(id)
  store.dispatch(fetchConfigRequest())
  store.dispatch(fetchFeaturedCompaniesRequest())
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  //   let courseName
  // let courseProvider
  //   let courseCategories
  const storeState = store.getState()
  //   console.log('storeState', storeState)
  const config = storeState.config.config.response
  const topCompanies = storeState.companies.featuredCompanies.response
  return {
    props: {
      config,
      topCompanies,
      key: keyword,
    },
  }
})
export default JobSearchPage
