import React, { useState, useEffect } from 'react'
/* Vendors */
import { useDispatch } from 'react-redux'
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
import JobListSection from 'components/JobListSection'

/* Styles */
import styles from './JobsHiring.module.scss'

/* Helpers*/
import {
  categoryParser,
  conditionChecker,
  getPredefinedParamsFromUrl,
  getLocationList,
} from 'helpers/jobPayloadFormatter'
import { flat } from 'helpers/formatter'
import { useFirstRender } from 'helpers/useFirstRender'

interface JobSearchPageProps {
  seoMetaTitle: string
  seoMetaDescription: string
  config: configObject
  topCompanies: companyObject[]
  defaultPage: number
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
  const { seoMetaTitle, seoMetaDescription, config, topCompanies, defaultPage } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const firstRender = useFirstRender()
  // const jobsList = useSelector((store: any) => store.job.jobsList)
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [urlQuery, setUrlQuery] = useState()
  const [urlLocation, setUrlLocation] = useState([])
  const catList = config && config.inputs && config.inputs.job_category_lists
  const locList = getLocationList(config)

  const displayQuickLinks = router.query.keyword === 'job-search'
  const { predefinedQuery, predefinedLocation, predefinedCategory } = getPredefinedParamsFromUrl(
    router.query,
    catList,
    locList
  )
  useEffect(() => {
    console.log('router query changed', router.query)
    if (predefinedQuery) setUrlQuery(predefinedQuery.toString())
    if (predefinedLocation) {
      const matchedLocation = locList.filter((loc) => {
        return loc.value === predefinedLocation.toString()
      })
      setUrlLocation(matchedLocation[0])
    }
    const payload = {
      query: predefinedQuery ? predefinedQuery[0] : null,
      jobLocation: predefinedLocation ? predefinedLocation[0] : null,
      jobCategories:
        firstRender && predefinedCategory ? predefinedCategory[0] : router.query?.category,
      salary: router.query?.salary,
      jobType: router.query?.jobtype,
      industry: router.query?.industry,
      education: router.query?.qualification,
      workExperience: router.query?.workExperience,
      sort: router.query?.sort,
      page:router.query?.page ? Number(router.query.page) : 1,
    }
    dispatch(fetchJobsListRequest(payload))
  }, [router.query])

  const sortOptions = [
    { label: 'Newest', value: 1 },
    { label: 'Relevance', value: 2 },
    { label: 'Highest Salary', value: 3 },
  ]

  const handleShowFilter = () => {
    setIsShowFilter(!isShowFilter)
  }
  const jobTypeOption = flat(config.inputs.job_types.map((jobType) => Object.values(jobType)))

  const salaryRangeOption = flat(
    config.filters.salary_range_filters.map((range) => {
      return Object.values(range)[0] === '10K - 30K' ? 'Below 30K' : Object.values(range)
    })
  )

  const updateUrl = (queryParam, queryObject) => {
    router.push(
      {
        pathname: `${process.env.HOST_PATH}/jobs-hiring/${queryParam ? queryParam : 'job-search'}`,
        query: queryObject,
      },
      undefined,
      { shallow: true }
    )
  }

  const onKeywordSearch = (val) => {
    // eslint-disable-next-line
    const { keyword, ...rest } = router.query
    let queryObject = {}
    queryObject = Object.assign({}, { ...rest, sort: val.length > 0 ? 2 : 1 })
    const queryParam = conditionChecker(val, predefinedLocation, predefinedCategory)
    updateUrl(queryParam, queryObject)
  }

  const onLocationSearch = (event, value) => {
    // eslint-disable-next-line
    const { keyword, ...rest } = router.query
    const queryObject = Object.assign({}, { ...rest })
    let queryParam = 'job-search'
    if (value) {
      const sanitisedLocValue = categoryParser(value.value)
      queryParam = conditionChecker(predefinedQuery, sanitisedLocValue, predefinedCategory)
    } else {
      queryParam = conditionChecker(predefinedQuery, null, predefinedCategory)
    }
    updateUrl(queryParam, queryObject)
  }

  const onSortSelection = (selectedOption) => {
    // eslint-disable-next-line
    const { keyword, ...rest } = router.query
    const queryParam = conditionChecker(predefinedQuery, predefinedLocation, predefinedCategory)
    const queryObject = Object.assign({}, { ...rest, sort: selectedOption })
    updateUrl(queryParam, queryObject)
  }

  const onSalarySelection = (selectedOptions) => {
    // eslint-disable-next-line
    const { keyword, ...rest } = router.query
    const queryParam = conditionChecker(predefinedQuery, predefinedLocation, predefinedCategory)
    const queryObject = Object.assign({}, { ...rest, salary: selectedOptions.join(',') })
    updateUrl(queryParam, queryObject)
  }

  const onJobTypeSelection = (selectedOptions) => {
    // eslint-disable-next-line
    const { keyword, ...rest } = router.query
    const queryParam = conditionChecker(predefinedQuery, predefinedLocation, predefinedCategory)
    const queryObject = Object.assign({}, { ...rest, jobtype: selectedOptions.join(',') })
    updateUrl(queryParam, queryObject)
  }

  const handleResetFilter = () => {
    const { predefinedQuery, predefinedLocation, predefinedCategory } = getPredefinedParamsFromUrl(
      router.query,
      catList,
      locList
    )
    const queryParam = conditionChecker(predefinedQuery, predefinedLocation, predefinedCategory)
    // exclude all filters in jobSearchFilters
    // eslint-disable-next-line
    const { keyword, category, industry, education, workExperience, ...rest } = router.query
    const queryObject = Object.assign({}, { ...rest })
    updateUrl(queryParam, queryObject)
  }

  return (
    <Layout>
      <SEO title={seoMetaTitle} description={seoMetaDescription} />
      <div className={displayQuickLinks ? styles.searchSectionExpanded : styles.searchSection}>
        <div className={styles.searchAndLocationContainer}>
          <MaterialTextField
            id='search'
            label='Search for job title, keyword or company'
            variant='outlined'
            size='small'
            className={styles.searchField}
            defaultValue={urlQuery}
            onChange={(e: any) => setUrlQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onKeywordSearch((e.target as HTMLInputElement).value)
              }
            }}
          />
          <MaterialLocationField
            className={styles.locationField}
            defValue={urlLocation}
            onChange={onLocationSearch}
          />
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
            onSelect={onSortSelection}
            greyBg
            defaultValue={router.query?.sort ? router.query?.sort : 1}
          />
          <MaterialSelectCheckmarks
            id='jobtype'
            label='Job Type'
            options={jobTypeOption}
            className={styles.sortField}
            onSelect={onJobTypeSelection}
            greyBg
            defaultValue={router.query?.jobtype ? router.query.jobtype.split(',') : null}
          />
          <MaterialSelectCheckmarks
            id='salary'
            label='Salary'
            options={salaryRangeOption}
            className={styles.sortField}
            onSelect={onSalarySelection}
            greyBg
            defaultValue={router.query?.salary ? router.query.salary.split(',') : null}
          />
          <MaterialButton
            variant='contained'
            className={styles.moreFiltersBtn}
            onClick={handleShowFilter}
          >
            More Filters
          </MaterialButton>
        </div>
        <div
          className={displayQuickLinks ? styles.quickLinkSectionExpanded : styles.quickLinkSection}
        >
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
          displayQuickLinks={displayQuickLinks}
          isShowFilter={isShowFilter}
          onResetFilter={handleResetFilter}
          onShowFilter={handleShowFilter}
        />
        <div style={{ display: 'block' }}>
          <JobListSection defaultPage={defaultPage}/>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query }) => {
  const { keyword, page } = query
  store.dispatch(fetchConfigRequest())
  store.dispatch(fetchFeaturedCompaniesRequest())
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response
  const topCompanies = storeState.companies.featuredCompanies.response
  return {
    props: {
      config,
      topCompanies,
      key: keyword,
      defaultPage:Number(page),
    },
  }
})
export default JobSearchPage
