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
import { fetchFeaturedCompaniesListRequest } from 'store/actions/companies/fetchFeaturedCompaniesList'
import { fetchJobDetailRequest } from 'store/actions/jobs/fetchJobDetail'

import { fetchJobAlertsListRequest } from 'store/actions/alerts/fetchJobAlertsList'
import { deleteJobAlertRequest } from 'store/actions/alerts/deleteJobAlert'
import { updateJobAlertRequest } from 'store/actions/alerts/updateJobAlert'
import { createJobAlertRequest } from 'store/actions/alerts/createJobAlert'

import { postReportRequest } from 'store/actions/reports/postReport'

import { postSaveJobRequest} from 'store/actions/jobs/postSaveJob'
import { deleteSaveJobRequest } from 'store/actions/jobs/deleteSaveJob'

/* Material Components */
import MaterialButton from 'components/MaterialButton'
import MaterialTextFieldWithSuggestionList from 'components/MaterialTextFieldWithSuggestionList'
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
import { getCookie } from 'helpers/cookies'

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
  accessToken: string
}

type configObject = {
  inputs: any
  filters: any
}

type companyObject = {
  id: number
  logoUrl: string
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
        to={`${jobsPageLink}/job-search/?category=audit-taxation,banking-financial,corporate-finance-investment,sales-financial-services,general-cost-accounting`}
        title='Finance jobs'
        aTag
      >
        <Text textStyle='sm'>Finance jobs</Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?category=sales-corporate,sales-eng-tech-it,sales-financial-services,marketing-business-dev`}
        title='Sales jobs'
        aTag
      >
        <Text textStyle='sm'>Sales jobs</Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?category=digital-marketing,marketing-business-dev,telesales-telemarketing`}
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
        to={`${jobsPageLink}/job-search/?category=it-hardware,it-network-sys-db-admin,it-software-engineering,sales-eng-tech-it,tech-helpdesk-support`}
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
        to={`${jobsPageLink}/job-search/?category=customer-service,tech-helpdesk-support`}
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
  const { accessToken, seoMetaTitle, seoMetaDescription, config, topCompanies, defaultPage, defaultValues, 
    // predefinedQuery, predefinedLocation, predefinedCategory
   } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const firstRender = useFirstRender()
  const { width } = useWindowDimensions()
  const prevScrollY = useRef(0)
  const userCookie = getCookie('user') || null

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
  const [hasMoreFilters, setHasMoreFilters] = useState(false)
  const [suggestionList, setSuggestionList] = useState([])

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
    const {industry, education, workExperience, category, jobtype, salary} = router.query
    let isWithJobTypeAndSalary
    if (width < 799) {
      isWithJobTypeAndSalary = jobtype || salary
    }
    setHasMoreFilters(industry || education || workExperience || category || isWithJobTypeAndSalary ? true : false)

    if (!firstRender) setDisplayQuickLinks(false)
    if (predefinedQuery) setUrlQuery(predefinedQuery.toString())
    if (predefinedLocation) {
      const matchedLocation = locList.filter((loc) => {
        return loc.value === predefinedLocation.toString()
      })
      setUrlLocation(matchedLocation[0])
    }

    let jobCategories = []

    const routerCategories: any = router.query?.category

    if (routerCategories) {
      catList.forEach(cat => {
        if (routerCategories.split(',').includes(cat.key)) {
          jobCategories.push(cat.value)
        }
      });
    }

    const payload = {
      query: predefinedQuery ? predefinedQuery[0] : null,
      jobLocation: predefinedLocation ? predefinedLocation[0] : null,
      jobCategories:
        firstRender && predefinedCategory ? predefinedCategory[0] : jobCategories.join(','),
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

  const jobTypeOption = flat(config.inputs.job_types.map((jobType) => jobType.value))

  const salaryRangeOption = flat(
    config.filters.salary_range_filters.map((range) => {
      return range.value === '10K - 30K' ? 'Below 30K': range.value 
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

  const onRemoveProperty = (propertyName, object) => {
    // eslint-disable-next-line
    const { [propertyName]: propertyValue, ...newObject } = { ...object }
    return { ...newObject }
  }

  const onKeywordSearch = (val) => {
    // eslint-disable-next-line
    const { keyword, ...rest } = router.query
    let queryObject = {}
    queryObject = Object.assign({}, { ...rest, sort: val.length > 0 ? 2 : 1 })
    const queryParam = conditionChecker(val, predefinedLocation, predefinedCategory)
    updateUrl(queryParam, queryObject)
  }

  const handleSuggestionSearch = (val) => {
      if (val !== '') {
        fetch(
          `${
            process.env.JOB_BOSSJOB_URL
          }/suggested-search?size=5&query=${val}`
        ).then((resp)=>resp.json())
        .then((data)=>setSuggestionList(data.data.items))
    }
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
    const removedProperty = onRemoveProperty('salary', {...rest})
    const queryObject = selectedOptions?.length > 0 
                        ? Object.assign({}, { ...rest, salary: selectedOptions.join(',') }) 
                        : Object.assign({}, { ...removedProperty })
    updateUrl(queryParam, queryObject)
  }

  const onJobTypeSelection = (selectedOptions) => {
    // eslint-disable-next-line
    const { keyword, ...rest } = router.query
    const queryParam = conditionChecker(predefinedQuery, predefinedLocation, predefinedCategory)
    const removedProperty = onRemoveProperty('jobtype', {...rest})
    const queryObject = selectedOptions?.length > 0 
                        ? Object.assign({}, { ...rest, jobtype: selectedOptions.join(',') }) 
                        : Object.assign({}, { ...removedProperty })
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
    let queryObject
    if (width < 799) {
    // eslint-disable-next-line
      const { keyword, category, industry, qualification, education, workExperience, salary, jobtype, ...rest } = router.query
      queryObject = Object.assign({}, { ...rest, sort: 1 })
      updateUrl(queryParam, queryObject)
      return
    }
    // eslint-disable-next-line
    const { keyword, category, industry, qualification, education, workExperience, salary, jobtype, ...rest } = router.query
    queryObject = Object.assign({}, { ...rest, sort: 1 })
    updateUrl(queryParam, queryObject)
  }

  const handleFetchJobDetail = (jobId) => dispatch(fetchJobDetailRequest({jobId, status: userCookie ? 'protected' : 'public'}))

  const handleSelectedJobId = (jobId, jobTitle) => {
    if (width < 799) {
      router.push(`/job/${slugify(jobTitle.toLowerCase())}-${jobId}`)
      return
    }
    setSelectedJobId(jobId)
    handleFetchJobDetail(jobId)
  }

  const handleUpdateJobAlert = (updateJobAlertData) => {
    const updateJobAlertPayload = {
      updateJobAlertData,
      accessToken
    }
    dispatch(updateJobAlertRequest(updateJobAlertPayload))
  }

  const handleDeleteJobAlert = (jobAlertId) => {
    const deleteJobAlertPayload = {
      jobAlertId,
      accessToken
    }
    dispatch(deleteJobAlertRequest(deleteJobAlertPayload))
  }

  const handlePostReportJob = (reportJobData) => {
    const postReportJobPayload = {
      reportJobData,
      accessToken
    }
    dispatch(postReportRequest(postReportJobPayload))
  }

  const handleFetchJobAlertsList = () => dispatch(fetchJobAlertsListRequest({accessToken}))
  
  const handleCreateJobAlert = (jobAlertData) => {
    const createJobAlertPayload = {
      jobAlertData,
      accessToken,
      user_id: userCookie.id
    }
    dispatch(createJobAlertRequest(createJobAlertPayload))
  }

  const handlePostSaveJob = ({ jobId }) => {
    const postSaveJobPayload = {
      jobId,
      user_id: userCookie.id
    }
    dispatch(postSaveJobRequest(postSaveJobPayload))
  }

  const handleDeleteSavedJob = ({jobId}) => {
    const deleteJobPayload = {
      jobId
    }
    dispatch(deleteSaveJobRequest(deleteJobPayload))
  }

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
          <MaterialTextFieldWithSuggestionList
            id='search'
            label='Search for job title, keyword or company'
            variant='outlined'
            size='small'
            className={styles.searchField}
            defaultValue={urlQuery}
            searchFn={handleSuggestionSearch}
            onSelect={(val) => {
                onKeywordSearch(val)
              }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onKeywordSearch((e.target as HTMLInputElement).value)
              }
            }}
            options={suggestionList}
          />
          <MaterialLocationField
            className={styles.locationField}
            // defValue={defaultLocation}
            defaultValue={urlLocation}
            onChange={onLocationSearch}
          />
          <MaterialButton variant='contained' capitalize>
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
            defaultValue={defaultValues?.sort}
          />
          <MaterialSelectCheckmarks
            id='jobtype'
            label='Job Type'
            options={jobTypeOption}
            className={styles.sortField}
            onSelect={onJobTypeSelection}
            defaultValue={defaultValues?.jobType}
          />
          <MaterialSelectCheckmarks
            id='salary'
            label='Salary'
            options={salaryRangeOption}
            className={styles.sortField}
            onSelect={onSalarySelection}
            defaultValue={defaultValues?.salary}
          />
          <MaterialButton
            variant='contained'
            className={styles.moreFiltersBtn}
            onClick={handleShowFilter}
            capitalize
          >
            More Filters
          </MaterialButton>

          {hasMoreFilters && (
            <MaterialButton
              variant='text'
              className={styles.moreFiltersBtn}
              onClick={handleResetFilter}
              capitalize
            >
              Reset Filters
            </MaterialButton>
          )}
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
                    <Image src={company.logoUrl} alt={company.name} width='30' height='30' />
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
        {hasMoreFilters && (
          <div className={styles.resetFilterBtnMobile}>
            <MaterialButton
            variant='text'
            className={styles.moreFiltersBtn}
            onClick={handleResetFilter}
            capitalize
          >
            Reset Filters
          </MaterialButton>
          </div>
        )}

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
          handleDeleteSavedJob={handleDeleteSavedJob}
          accessToken={accessToken}
        />
      </div>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query, req }) => {
  const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null
  
  const { keyword, page } = query
  // store actions
  store.dispatch(fetchConfigRequest())
  store.dispatch(fetchFeaturedCompaniesListRequest({ size: 21, page: 1}))
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response
  const featuredCompanies = storeState.companies.fetchFeaturedCompaniesList.response?.featured_companies?.map((featuredCompany) => featuredCompany.company)
  const topCompanies = featuredCompanies?.map((featuredCompany) => {
    const logoUrl = featuredCompany.logo_url
    delete featuredCompany.logo_url
    return {...featuredCompany, logoUrl}
  })
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
      accessToken,
      // predefinedQuery,
      // predefinedLocation,
      // predefinedCategory,
    },
  }
})
export default JobSearchPage
