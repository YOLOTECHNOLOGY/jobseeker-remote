import React, { useState, useEffect, useRef } from 'react'
/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
// @ts-ignore
import { END } from 'redux-saga'
// import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'

// import moment from 'moment'
import slugify from 'slugify'

/* Action Creators */
import { wrapper } from 'store'

/* Redux Actions */
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchJobsListRequest } from 'store/actions/jobs/fetchJobsList'
import { fetchFeaturedCompaniesRequest } from 'store/actions/companies/fetchFeaturedCompanies'
import { fetchJobDetailRequest } from 'store/actions/jobs/fetchJobDetail'

import { fetchJobAlertsListRequest } from 'store/actions/alerts/fetchJobAlertsList'
import { deleteJobAlertRequest } from 'store/actions/alerts/deleteJobAlert'
import { updateJobAlertRequest } from 'store/actions/alerts/updateJobAlert'
import { createJobAlertRequest } from 'store/actions/alerts/createJobAlert'

import { postReportRequest } from 'store/actions/reports/postReport'

import { postSaveJobRequest} from 'store/actions/jobs/postSaveJob'

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
import styles from './jobsHiring.module.scss'
import breakpointStyles from 'styles/breakpoint.module.scss'

/* Helpers*/
import {
  categoryParser,
  conditionChecker,
  getPredefinedParamsFromUrl,
  getLocationList,
} from 'helpers/jobPayloadFormatter'
import { flat } from 'helpers/formatter'
import { useFirstRender } from 'helpers/useFirstRender'
import useWindowDimensions from 'helpers/useWindowDimensions'

/* Images */
import { FilterIcon } from 'images'

interface JobSearchPageProps {
  seoMetaTitle: string
  seoMetaDescription: string
  config: configObject
  topCompanies: companyObject[]
  defaultPage: number
  defaultValues: any
  predefinedQuery: any
  predefinedLocation: any
  predefinedCategory: any
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
  const { seoMetaTitle, seoMetaDescription, config, topCompanies, defaultPage, defaultValues, 
    // predefinedQuery, predefinedLocation, predefinedCategory
   } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const firstRender = useFirstRender()
  const { width } = useWindowDimensions()
  const prevScrollY = useRef(0)

  // const [isSticky, setIsSticky] = useState(false)
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [urlQuery, setUrlQuery] = useState(defaultValues?.urlQuery)
  const [urlLocation, setUrlLocation] = useState(defaultValues?.urlLocation)
  const catList = config && config.inputs && config.inputs.job_category_lists
  const locList = getLocationList(config)
  const [jobAlertList, setJobAlertList] = useState(null)
  const [createdJobAlert, setCreatedJobAlert] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedJobId, setSelectedJobId] = useState(null)
  const { keyword, ...rest } = router.query
  const [displayQuickLinks, setDisplayQuickLinks ]= useState(keyword === 'job-search' && Object.entries(rest).length === 0)

  const reportJobReasonList = config && config.inputs && config.inputs.report_job_reasons

  const jobListResponse = useSelector((store: any) => store.job.jobList.response)
  const isJobListFetching = useSelector((store: any) => store.job.jobList.fetching)
  
  const jobDetailResponse = useSelector((store: any) => store.job.jobDetail.response)
  const isJobDetailFetching = useSelector((store: any) => store.job.jobDetail.fetching)

  const createdJobAlertResponse = useSelector((store: any) => store.alerts.createJobAlert)
  const isCreatingJobAlert = useSelector((store: any) => store.alerts.createJobAlert.fetching)
  const jobAlertListResponse = useSelector((store: any) => store.alerts.fetchJobAlertsList.response)
  const isDeletingJobAlert = useSelector((store: any) => store.alerts.deleteJobAlert.fetching)
  const isUpdatingJobAlert = useSelector((store: any) => store.alerts.updateJobAlert.fetching)

  const { predefinedQuery, predefinedLocation, predefinedCategory } = getPredefinedParamsFromUrl(
    router.query,
    catList,
    locList
  )

  // const cx = classNames.bind(styles)
  // const isStickyClass = cx({ isSticky: isSticky })

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('router query changed', router.query)
    if (!firstRender) setDisplayQuickLinks(false)
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
      page: router.query?.page ? Number(router.query.page) : 1,
    }
    dispatch(fetchJobsListRequest(payload))
  }, [router.query])

  useEffect(() => {
    window.addEventListener('scroll', updateScrollPosition)
    return () => window.removeEventListener('scroll', updateScrollPosition)
  }, [])

  useEffect(() => {
    if (jobAlertListResponse) setJobAlertList(jobAlertListResponse)
    if (createdJobAlertResponse) setCreatedJobAlert(createdJobAlertResponse)

  }, [jobAlertListResponse, createdJobAlertResponse])

  useEffect(() => {
    if (jobListResponse?.data?.jobs.length > 0) {
      handleFetchJobDetail(jobListResponse.data?.jobs?.[0].id) 
      setSelectedJobId(jobListResponse.data?.jobs?.[0].id)
    } 
  }, [jobListResponse])

  useEffect(() => {
    if (jobDetailResponse) setSelectedJob(jobDetailResponse)
  }, [jobDetailResponse])

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

  const onSortSelection = (selectedOption ) => {
    // NOTE: there is a different sort selection logic when selecting sort in Mobile, refer to JobSearchFilters
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
    const queryObject = Object.assign({}, { ...rest, sort: 1 })
    updateUrl(queryParam, queryObject)
  }

  // TODO: Check if User is LoggedIn then change status: 'protected'
  const handleFetchJobDetail = (jobId) => dispatch(fetchJobDetailRequest({jobId, status: 'public'}))

  const handleSelectedJobId = (jobId) => {
    setSelectedJobId(jobId)
    handleFetchJobDetail(jobId)
  }

  const handleUpdateJobAlert = (payload) => dispatch(updateJobAlertRequest(payload))

  const handleDeleteJobAlert = (alertId) => dispatch(deleteJobAlertRequest(alertId))

  const handlePostReportJob = (payload) => dispatch(postReportRequest(payload))

  const handleFetchJobAlertsList = () => dispatch(fetchJobAlertsListRequest())
  
  const handleCreateJobAlert = (payload) => dispatch(createJobAlertRequest(payload))

  const handlePostSaveJob = (payload) => dispatch(postSaveJobRequest(payload))

  const updateScrollPosition = () => {
    if (width > 798) {
      prevScrollY.current = window.pageYOffset
      // setIsSticky(prevScrollY.current > 70 ? true : false)
      setDisplayQuickLinks(
        prevScrollY.current > 70
          ? false
          : keyword === 'job-search' && Object.entries(rest).length === 0
      )
    }
  }

  return (
    <Layout>
      <SEO title={seoMetaTitle} description={seoMetaDescription} />
      <div
        className={classNamesCombined([
          displayQuickLinks ? styles.searchSectionExpanded : styles.searchSection,
          // isStickyClass,
        ])}
      >
        <div className={styles.searchAndLocationContainer}>
          <MaterialTextField
            id='search'
            label='Search for job title, keyword or company'
            variant='outlined'
            size='small'
            className={styles.searchField}
            defaultValue={urlQuery}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onKeywordSearch((e.target as HTMLInputElement).value)
              }
            }}
          />
          <MaterialLocationField
            className={styles.locationField}
            // defValue={defaultLocation}
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
            defaultValue={defaultValues?.sort}
          />
          <MaterialSelectCheckmarks
            id='jobtype'
            label='Job Type'
            options={jobTypeOption}
            className={styles.sortField}
            onSelect={onJobTypeSelection}
            greyBg
            defaultValue={defaultValues?.jobType}
          />
          <MaterialSelectCheckmarks
            id='salary'
            label='Salary'
            options={salaryRangeOption}
            className={styles.sortField}
            onSelect={onSalarySelection}
            greyBg
            defaultValue={defaultValues?.salary}
          />
          <MaterialButton
            variant='contained'
            className={styles.moreFiltersBtn}
            onClick={handleShowFilter}
            style={{ letterSpacing: '1px' }}
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
          urlDefaultValues={defaultValues}
          displayQuickLinks={displayQuickLinks}
          isShowFilter={isShowFilter}
          onResetFilter={handleResetFilter}
          onShowFilter={handleShowFilter}
          sortOptions={sortOptions}
        />
      </div>
      <div className={breakpointStyles.hideOnTabletAndDesktop}>
        <div className={styles.moreFiltersSection} onClick={() => handleShowFilter()}>
          <Image src={FilterIcon} alt='filter' width='15' height='15' />
          <Text className={styles.moreFiltersText}>More Filters</Text>
        </div>
      </div>
      <div style={{ display: 'block' }}>
        <JobListSection
          defaultPage={defaultPage}
          jobList={jobListResponse?.data || null}
          isJobListFetching={isJobListFetching}
          isJobDetailFetching={isJobDetailFetching}
          selectedJob={selectedJob}
          selectedJobId={selectedJobId}
          handleSelectedJobId={handleSelectedJobId}
          totalPages={jobListResponse?.data?.total_pages}
          query={predefinedQuery}
          location={urlLocation}
          jobAlertsList={jobAlertList}
          createdJobAlert={createdJobAlert}
          fetchJobAlertsList={handleFetchJobAlertsList}
          deleteJobAlert={handleDeleteJobAlert}
          updateJobAlert={handleUpdateJobAlert}
          createJobAlert={handleCreateJobAlert}
          isDeletingJobAlert={isDeletingJobAlert}
          isUpdatingJobAlert={isUpdatingJobAlert}
          isCreatingJobAlert={isCreatingJobAlert}
          reportJobReasonList={reportJobReasonList}
          handlePostReportJob={handlePostReportJob}

          handlePostSaveJob={handlePostSaveJob}
        />
      </div>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query }) => {
  const { keyword, page } = query
  // store actions
  store.dispatch(fetchConfigRequest())
  store.dispatch(fetchFeaturedCompaniesRequest())
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response
  const topCompanies = storeState.companies.featuredCompanies.response
  const catList = config && config.inputs && config.inputs.job_category_lists
  const locList = getLocationList(config) 
  const { predefinedQuery, predefinedLocation
    // , predefinedCategory
   } = getPredefinedParamsFromUrl(
    query,
    catList,
    locList
  )

  const queryJobType: any = query?.jobtype
  const querySalary: any = query?.salary

  const defaultValues: any = {
    urlQuery: '',
    urlLocation: [],
    sort: query?.sort ? query?.sort : 1,
    jobType: queryJobType ? queryJobType.split(',') : null,
    salary: querySalary ? querySalary.split(',') : null,
  }

  if (predefinedQuery) {
    defaultValues.urlQuery = predefinedQuery.toString()
  }
  if (predefinedLocation) {
    const matchedLocation = locList.filter((loc) => {
      return loc.value === predefinedLocation.toString()
    })
    defaultValues.urlLocation = matchedLocation[0]
  }
  if (query && query.category){
    let urlCategory:any = query?.category
    urlCategory = urlCategory.split(',')
    const matchedCategory = catList.filter((cat) => {
      return urlCategory.includes(cat.key)
    })
    defaultValues.category = matchedCategory
  }
  return {
    props: {
      config,
      topCompanies,
      key: keyword,
      defaultPage:page ? Number(page) : 1,
      defaultValues,
      // predefinedQuery,
      // predefinedLocation,
      // predefinedCategory,
    },
  }
})
export default JobSearchPage
