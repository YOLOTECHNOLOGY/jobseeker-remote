import React, { useState, useEffect, useRef } from 'react'
/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
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
import styles from './JobsHiring.module.scss'

/* Helpers*/
import {
  categoryParser,
  conditionChecker,
  getPayload,
  getPredefinedParamsFromUrl,
  urlQueryParser,
} from 'helpers/jobPayloadFormatter'
import { flat } from 'helpers/formatter'
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

const getLocationList = (config) => {
  const locList =
    config &&
    config.inputs &&
    config.inputs.location_lists
      .map((region) =>
        region.locations.map((loc) => ({
          ...loc,
          // loc value all lower case
          value: loc.value.toLowerCase(),
        }))
      )
      .reduce((a, c) => a.concat(c), [])

  return locList
}

const JobSearchPage = (props: JobSearchPageProps) => {
  const { seoMetaTitle, seoMetaDescription, config, topCompanies } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const jobsList = useSelector((store: any) => store.job.jobsList)
  const [isShowFilter, setIsShowFilter] = useState(false)
  const prevPayload = useRef(null)
  const catList = config && config.inputs && config.inputs.job_category_lists
  const locList = getLocationList(config)

  // filters config
  // const locationList = formatLocationConfig(config.inputs.location_lists)

  useEffect(() => {
    // predefined data from url
    const { predefinedQuery, predefinedLocation, predefinedCategory } = getPredefinedParamsFromUrl(
      router.query,
      catList,
      locList
    )
    console.log('router query changed', router.query)
    const abc = getPredefinedParamsFromUrl(router.query, catList, locList)
    // get payload to fetch
    const payload = {
      query: predefinedQuery[0],
      jobLocation:predefinedLocation[0],
    }
    // const payload = getPayload(router.query)
    console.log('payload abc', abc)
    console.log('payload getPayload', payload)
    // get defaultValue of keyword search

    dispatch(fetchJobsListRequest(payload))
  }, [router.query])

  const sortOptions = [
    { label: 'Relevance', value: 1 },
    { label: 'Latest', value: 2 },
    { label: 'Ascending', value: 3 },
  ]

  // console.log('locationList', locationList)
  const handleShowFilter = () => {
    setIsShowFilter(!isShowFilter)
    console.log('triggered')
  }
  const jobTypeOption = flat(config.inputs.job_types.map((jobType) => Object.values(jobType)))

  const salaryRangeOption = flat(
    config.filters.salary_range_filters.map((range) => {
      return Object.values(range)[0] === '10K - 30K' ? 'Below 30K' : Object.values(range)
    })
  )
  console.log('jobTypeOption', jobTypeOption)
  console.log('salaryRangeOption', salaryRangeOption)

  // const onSearchSubmit = () => {

  // }

  const onKeywordSearch = (val) => {
    const { predefinedLocation, predefinedCategory } = getPredefinedParamsFromUrl(
      router.query,
      catList,
      locList
    )
    console.log('search val', val)
    // const queryParam = conditionChecker(val)

    console.log('router', router)
    console.log('process.env.HOST_PATH', process.env.HOST_PATH)

    const { keyword, ...rest } = router.query
    const queryObject = Object.assign({}, { ...rest })
    console.log('onKeywordSearch keyword', keyword)
    console.log('onKeywordSearch queryObject', queryObject)

    const queryParam = conditionChecker(val, predefinedLocation, predefinedCategory)
    console.log('onKeywordSearch queryParam', queryParam)
    router.push(
      {
        pathname: `${process.env.HOST_PATH}/jobs-hiring/${queryParam}`,
        query: queryObject,
        //  query: {
        //    ...router.query,
        //    page: Number(prevSort) !== Number(sortOption) ? 1 : page,
        //  },
      },
      undefined,
      { shallow: true }
    )
    console.log('queryParam', queryParam)
  }

  const onLocationSearch = (event, value) => {
    const { predefinedQuery, predefinedCategory } = getPredefinedParamsFromUrl(
      router.query,
      catList,
      locList
    )
    const { keyword, ...rest } = router.query
    const queryObject = Object.assign({}, { ...rest })
    console.log('onLocationSearch value', value)
    const sanitisedLocValue = categoryParser(value.value)
    console.log('sanitisedLocValue', sanitisedLocValue)
    const queryParam = conditionChecker(predefinedQuery, sanitisedLocValue, predefinedCategory)
    console.log('onLocationSearch queryParam', queryParam)
    router.push(
      {
        pathname: `${process.env.HOST_PATH}/jobs-hiring/${queryParam}`,
        query: queryObject,
      },
      undefined,
      { shallow: true }
    )
    console.log('queryParam', queryParam)
  }

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
            // defaultValue={}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onKeywordSearch((e.target as HTMLInputElement).value)
              }
            }}
          />
          <MaterialLocationField className={styles.locationField} onChange={onLocationSearch} />
          <MaterialButton variant='contained'>
            {/* <MaterialButton variant='contained' onClick={onSearchSubmit}> */}
            Search
          </MaterialButton>
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
          <MaterialButton
            variant='contained'
            className={styles.moreFiltersBtn}
            onClick={handleShowFilter}
          >
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
