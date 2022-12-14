/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import slugify from 'slugify'
import dynamic from 'next/dynamic'
// @ts-ignore
import { END } from 'redux-saga'

import classNamesCombined from 'classnames'

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
import { postSaveJobRequest } from 'store/actions/jobs/postSaveJob'
import { deleteSaveJobRequest } from 'store/actions/jobs/deleteSaveJob'

/* Material Components */
import MaterialButton from 'components/MaterialButton'
import MaterialTextFieldWithSuggestionList from 'components/MaterialTextFieldWithSuggestionList'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialSelectCheckmarksCustomSEO from 'components/MaterialSelectCheckmarksCustomSEO'
import Tooltip from '@mui/material/Tooltip'

/* Components */
import Layout from 'components/Layout'
import Text from 'components/Text'
import Link from 'components/Link'
import SEO from 'components/SEO'
const JobSearchFilters = dynamic(() => import('components/JobSearchFilters'))
import JobListSection from 'components/JobListSection'
import LazyLoad from '../../components/LazyLoad'

/* Styles */
import styles from './jobsHiring.module.scss'
import breakpointStyles from 'styles/breakpoint.module.scss'

/* Helpers*/
import {
  checkFilterMatch,
  userFilterSelectionDataParser,
  mapSeoValueToGetValue
} from 'helpers/jobPayloadFormatter'
import { flat, unslugify, getCurrentMonthYear } from 'helpers/formatter'
import { useFirstRender } from 'helpers/useFirstRender'
import { getCookie } from 'helpers/cookies'
import useWindowDimensions from 'helpers/useWindowDimensions'
import useSearchHistory from 'helpers/useSearchHistory'
import JobFunctionMultiSelector from 'components/JobFunctionMultiSelector'
import { fetchConfigService } from 'store/services/config/fetchConfig'
import classNames from 'classnames'
import { fetchUserDetailRequest } from 'store/actions/users/fetchUserDetail'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'

interface JobSearchPageProps {
  seoMetaTitle: string
  seoMetaDescription: string
  seoCanonical: string
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
  companyUrl: string
}

const renderPopularSearch = () => {
  const jobsPageLink = '/jobs-hiring'

  return (
    <div className={styles.popularSearch}>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/finance-accounting-jobs`}
        title='Accounting jobs'
      >
        <Text textStyle='base' textColor='darkgrey'>
          Accounting jobs
        </Text>
      </Link>
      <Link className={styles.link} to={`${jobsPageLink}/sales-marketing-jobs`} title='Sales jobs'>
        <Text textStyle='base' textColor='darkgrey'>
          Sales jobs
        </Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/sales-marketing-jobs`}
        title='Marketing jobs'
      >
        <Text textStyle='base' textColor='darkgrey'>
          Marketing jobs
        </Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/computer-information-technology-jobs`}
        title='IT jobs'
      >
        <Text textStyle='base' textColor='darkgrey'>
          IT jobs
        </Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/customer-service-jobs`}
        title='Customer Service jobs'
      >
        <Text textStyle='base' textColor='darkgrey'>
          Customer Service jobs
        </Text>
      </Link>
      <Link className={styles.link} to={`${jobsPageLink}/hr-recruitment-jobs`} title='HR jobs'>
        <Text textStyle='base' textColor='darkgrey'>
          HR jobs
        </Text>
      </Link>
      <Link className={styles.link} to={`${jobsPageLink}/bpo-team-lead-jobs`} title='BPO Team Lead'>
        <Text textStyle='base' textColor='darkgrey'>
          BPO Team Lead
        </Text>
      </Link>
      <Link className={styles.link} to={`${jobsPageLink}/homebased-jobs`} title='WFH'>
        <Text textStyle='base' textColor='darkgrey'>
          WFH
        </Text>
      </Link>
      <Link className={styles.link} to={`${jobsPageLink}/manager-jobs`} title='Manager'>
        <Text textStyle='base' textColor='darkgrey'>
          Manager
        </Text>
      </Link>
      <Link className={styles.link} to={`${jobsPageLink}/manila-jobs`} title='Manila jobs'>
        <Text textStyle='base' textColor='darkgrey'>
          Manila jobs
        </Text>
      </Link>
    </div>
  )
}

const useJobAlert = () => {
  const accessToken = getCookie('accessToken')
  const userCookie = getCookie('user')
  const isLogin = useMemo(() => {
    return getCookie('accessToken') ? true : false
  }, [getCookie])
  const dispatch = useDispatch()
  // const filterJobPayload = useSelector((store: any) => store.job.jobList.payload)

  const showJobAlert = useCallback(
    (filterJobPayload) => {
      const jobAlertData = {
        keyword: filterJobPayload?.query ? filterJobPayload.query : '',
        location_values: filterJobPayload?.location ? filterJobPayload.location : 'all',
        job_type_values: filterJobPayload?.jobType ? filterJobPayload.jobType : 'all',
        salary_range_values: filterJobPayload?.salary ? filterJobPayload.salary : 'all',
        job_category_values: filterJobPayload?.category ? filterJobPayload.category : 'all',
        industry_values: filterJobPayload?.industry ? filterJobPayload.industry : 'all',
        xp_lvl_values: filterJobPayload?.workExperience ? filterJobPayload.workExperience : 'all',
        degree_values: filterJobPayload?.qualification ? filterJobPayload.qualification : 'all',
        main_functions: filterJobPayload?.mainFunctions ?? 'all',
        job_functions: filterJobPayload?.jobFunctions ?? 'all',
        function_titles: filterJobPayload?.functionTitles ?? 'all',
        is_company_verified: 'all',
        frequency_id: 1
      }
      const createJobAlertPayload = {
        jobAlertData,
        accessToken,
        user_id: userCookie.id
      }
      dispatch(createJobAlertRequest(createJobAlertPayload))
    },
    [userCookie]
  )
  const router = useRouter()

  const setLastSearch = useCallback(
    (search) => {
      if (!isLogin) {
        sessionStorage.setItem('search-job-last-keyword', search)
      }
    },
    [isLogin]
  )

  useEffect(() => {
    if (!isLogin) {
      return
    } else {
      const lastSearch = JSON.parse(sessionStorage.getItem('search-job-last-keyword'))
      const shouldShowAlert = sessionStorage.getItem('should-show-alert')
      const hasRedirect = sessionStorage.getItem('has-redirect')
      if (lastSearch && shouldShowAlert && !hasRedirect) {
        if (lastSearch) {
          sessionStorage.setItem('has-redirect', '1')
          router.push(lastSearch?.searchParams)
        }
      } else if (shouldShowAlert && hasRedirect) {
        sessionStorage.removeItem('should-show-alert')
        sessionStorage.removeItem('has-redirect')
        sessionStorage.removeItem('search-job-last-keyword')
        showJobAlert(lastSearch?.filterJobPayload)
      }
    }
  }, [])
  return setLastSearch
}

const JobSearchPage = (props: JobSearchPageProps) => {
  const {
    accessToken,
    seoMetaTitle,
    seoMetaDescription,
    seoCanonical,

    topCompanies,
    defaultPage,
    defaultValues
  } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const firstRender = useFirstRender()
  const { width } = useWindowDimensions()
  const isMobile = width < 768 ? true : false
  const userCookie = getCookie('user') || null
  const config = useSelector((store: any) => store?.config?.config?.response)
  const [clientDefaultValues, setClientDefaultValues] = useState(defaultValues || {})
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [urlLocation, setUrlLocation] = useState(defaultValues?.location)
  const [sort, setSort] = useState(defaultValues?.sort)
  const [moreFilterReset, setMoreFilterReset] = useState(false)
  const [jobAlertList, setJobAlertList] = useState(null)
  const [createdJobAlert, setCreatedJobAlert] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [searchValue, setSearchValue] = useState(defaultValues?.urlQuery || '')
  const [isCategoryReset, setIsCategoryReset] = useState(false)
  const [jobTypes, setJobTypes] = useState(defaultValues?.jobType || [])
  const [salaries, setSalaries] = useState(defaultValues?.salary || [])
  const { keyword, ...rest } = router.query
  const [displayQuickLinks, setDisplayQuickLinks] = useState(
    keyword === 'job-search' && Object.entries(rest).length === 0
  )
  const [hasMoreFilters, setHasMoreFilters] = useState(false)
  const [searchHistories, addSearchHistory] = useSearchHistory()
  const [suggestionList, setSuggestionList] = useState(searchHistories)

  const [mainFunctions, setMainfunctions] = useState(defaultValues.mainFunctions ?? [])
  const [jobFunctions, setJobFunctions] = useState(defaultValues.jobFunctions ?? [])
  const [functionTitles, setFunctionTitles] = useState(defaultValues.functionTitles ?? [])

  const jobFunctionValue = useMemo(() => {
    return { mainFunctions, jobFunctions, functionTitles }
  }, [mainFunctions, jobFunctions, functionTitles])

  const functionTitleList = config?.inputs?.function_titles ?? []
  const reportJobReasonList = config?.inputs?.report_job_reasons ?? []

  const jobListResponse = useSelector((store: any) => store.job.jobList.response)
  const isJobListFetching = useSelector((store: any) => store.job.jobList.fetching)

  const jobDetailResponse = useSelector((store: any) => store.job.jobDetail.response)
  const isJobDetailFetching = useSelector((store: any) => store.job.jobDetail.fetching)
  const filterJobPayload = useSelector((store: any) => store.job.jobList.payload)
  const createdJobAlertResponse = useSelector((store: any) => store.alerts.createJobAlert)
  const isCreatingJobAlert = useSelector((store: any) => store.alerts.createJobAlert.fetching)
  const jobAlertListResponse = useSelector((store: any) => store.alerts.fetchJobAlertsList.response)
  const isDeletingJobAlert = useSelector((store: any) => store.alerts.deleteJobAlert.fetching)
  const isUpdatingJobAlert = useSelector((store: any) => store.alerts.updateJobAlert.fetching)

  const postReportResponse = useSelector((store: any) => store.reports.postReport.response)
  const isPostingReport = useSelector((store: any) => store.reports.postReport.fetching)
  const { searchQuery, predefinedQuery, predefinedLocation, filterCount } = checkFilterMatch(
    router.query,
    config,
    isMobile
  )
  const [selectedPage, setSelectedPage] = useState(defaultPage)

  useEffect(() => {
    const { industry, workExperience, category, jobType, salary, qualification, verifiedCompany, mainFunctions, functionTitles } = router.query
    const hasActiveFilters = !!(
      industry ||
      workExperience ||
      category ||
      qualification ||
      jobType ||
      salary ||
      verifiedCompany ||
      predefinedLocation ||
      predefinedQuery ||
      mainFunctions ||
      jobFunctions ||
      functionTitles
    )
    setHasMoreFilters(hasActiveFilters)
    if (firstRender) {
      return
    }
    if (!firstRender) setDisplayQuickLinks(false)
      ; (async () => {
        const { payload } = await initPagePayLoad(router.query, config)
        dispatch(fetchJobsListRequest(payload, accessToken))
        setIsCategoryReset(false)
        setMoreFilterReset(false)
      })()
  }, [router.query])

  useEffect(() => {
    if (jobAlertListResponse) setJobAlertList(jobAlertListResponse)
    if (createdJobAlertResponse) setCreatedJobAlert(createdJobAlertResponse)
  }, [jobAlertListResponse, createdJobAlertResponse])

  useEffect(() => {
    if (jobListResponse?.data?.jobs.length > 0) {
      // default init job detail
      const isReportJob = getCookie('isReportJob') || null
      const reportJobId = getCookie('reportJobId') || null
      if (isReportJob && reportJobId) {
        handleFetchJobDetail(reportJobId)
        setSelectedJobId(reportJobId)
      } else {
        handleFetchJobDetail(jobListResponse.data?.jobs?.[0].id)
        setSelectedJobId(jobListResponse.data?.jobs?.[0].id)
      }
    } else {
      setSelectedJobId(null)
      setSelectedJob(null)
    }
  }, [jobListResponse])

  useEffect(() => {
    if (jobDetailResponse) {
      setSelectedJob(jobDetailResponse)
    }
  }, [jobDetailResponse])

  const sortOptions = [
    { label: 'Newest', value: 1 },
    { label: 'Relevance', value: 2 },
    { label: 'Highest Salary', value: 3 }
  ]

  const handleShowFilter = () => {
    setIsShowFilter(false)
  }
  const setLastSearch = useJobAlert()
  useEffect(() => {
    setLastSearch(JSON.stringify({
      filterJobPayload,
      searchParams: { pathname: router.pathname, query: router.query }
    }))
  }, [filterJobPayload, router.pathname, router.query])
  const jobTypeList = config?.inputs?.job_types ?? []
  const salaryRangeList = config?.filters?.salary_range_filters ?? []

  const updateUrl = (queryParam, queryObject) => {
    queryObject['page'] = '1'
    setSelectedPage(Number(queryObject['page']))
    const pushObject = {
      pathname: `/jobs-hiring/${queryParam ? slugify(queryParam) : 'job-search'}`,
      query: queryObject
    }
    router.push(pushObject, undefined, { shallow: true })

  }
  const onKeywordSearch = (val) => {
    addSearchHistory(val)
    // convert any value with '-' to '+' so that when it gets parsed from URL, we are able to map it back to '-'
    const sanitisedVal = val.replace('-', '+')

    // eslint-disable-next-line
    const { keyword } = router.query
    const sortOption = val.length > 0 ? 2 : 1
    const isClear = val.length === 0

    const {
      searchQuery,
      filterParamsObject = {},
      matchedConfig,

    } = userFilterSelectionDataParser('query', sanitisedVal, router.query, config, isClear)
    for (const [key, value] of Object.entries(matchedConfig)) {
      const newDefaultValue = { ...defaultValues, [key]: [value[0]['seo-value']] }
      switch (key) {
        case 'jobType':
          setJobTypes([value[0]['seo-value']])
          setSearchValue('')
          break
        case 'salary':
          setSalaries([value[0]['seo-value']])
          setSearchValue('')
          break
        case 'qualification':
          setClientDefaultValues(newDefaultValue)
          setSearchValue('')
          break
        case 'industry':
          setClientDefaultValues(newDefaultValue)
          setSearchValue('')
          break
        case 'workExperience':
          setClientDefaultValues(newDefaultValue)
          setSearchValue('')
          break
        case 'verifiedCompany':
          setClientDefaultValues(newDefaultValue)
          setSearchValue('')
          break
        case 'location':
          setUrlLocation(value[0])
          setSearchValue('')
          break
        case 'mainFunctions':
          if (!mainFunctions.includes(value[0]?.seo_value)) {
            setMainfunctions([value[0]?.seo_value, ...mainFunctions])
            setSearchValue('')
          }
          break
        case 'jobFunctions':
          if (!jobFunctions.includes(value[0]?.seo_value)) {
            setJobFunctions([value[0]?.seo_value, ...jobFunctions])
            setSearchValue('')
          }
          break
        // case 'functionTitles':
        //   if (filterParamsObject.functionTitles?.includes?.(value[0]?.function_title_value)) {
        //     console.log({ filterParamsObject, value, searchQuery })
        //     filterParamsObject.functionTitles = filterParamsObject
        //       .functionTitles?.split(',')
        //       ?.filter(item => item !== value[0]?.function_title_value)?.join(',')
        //     // setFunctionTitles([value[0]?.seo_value, ...functionTitles])
        //     if (!filterParamsObject?.functionTitles) {
        //       delete filterParamsObject['functionTitles']
        //     }
        //   }
        //   break
        default:
          break
      }
    }
    setSort(sortOption)
    updateUrl(searchQuery, filterParamsObject)
  }

  const handleSuggestionSearch = (val) => {
    const valueLength = val?.length ?? 0
    if (valueLength === 0) {
      setSuggestionList(searchHistories as any)
    } else if (valueLength === 1) {
      setSuggestionList([])
    } else if ((val?.length ?? 0) > 1) {
      fetch(`${process.env.JOB_BOSSJOB_URL}/suggested-search?size=5&query=${val}`)
        .then((resp) => resp.json())
        .then((data) => setSuggestionList(data.data.items))
    }
  }

  const jobFunctionChange = useCallback(data => {
    setMainfunctions(data.mainFunctions)
    setJobFunctions(data.jobFunctions)
    setFunctionTitles(data.functionTitles)
    // if (!data?.main_functions?.length && !data?.jobFunction?.length && data?.functionTitles?.length === 1) {
    //   const value = functionTitleList.find(item => item.seo_value === data.functionTitles[0]).value
    //   setSearchValue(value)
    //   onKeywordSearch(value)
    //   return
    // }
    const { searchQuery, filterParamsObject = {} } = userFilterSelectionDataParser(
      'jobFunctions',
      data,
      router.query,
      config,
    )
    updateUrl(searchQuery, filterParamsObject)

  }, [router.query, functionTitleList, config])
  // console.log({ jobFunctionValue })
  const onLocationSearch = (event, value) => {
    addSearchHistory(searchValue)
    const isClear = !value
    const { searchQuery, filterParamsObject } = userFilterSelectionDataParser(
      'location',
      value,
      router.query,
      config,
      isClear
    )
    setUrlLocation(value)
    updateUrl(searchQuery, filterParamsObject)
  }

  const onSortSelection = (selectedOption) => {
    const { searchQuery, filterParamsObject } = userFilterSelectionDataParser(
      'sort',
      selectedOption,
      router.query,
      config
    )
    setSort(selectedOption)
    updateUrl(searchQuery, filterParamsObject)
  }

  const onSalarySelection = (selectedOptions) => {
    const isClear = selectedOptions && selectedOptions.length === 0
    const { searchQuery, filterParamsObject } = userFilterSelectionDataParser(
      'salary',
      selectedOptions,
      router.query,
      config,
      isClear
    )
    setSalaries(selectedOptions)
    updateUrl(searchQuery, filterParamsObject)
  }

  const onJobTypeSelection = (selectedOptions) => {
    const isClear = selectedOptions && selectedOptions.length === 0
    const { searchQuery, filterParamsObject } = userFilterSelectionDataParser(
      'jobType',
      selectedOptions,
      router.query,
      config,
      isClear
    )
    setJobTypes(selectedOptions)
    updateUrl(searchQuery, filterParamsObject)
  }

  const handleResetFilter = () => {
    const { searchMatch, locationMatch, searchQuery, predefinedLocation } = checkFilterMatch(
      router.query,
      config,
      isMobile
    )

    const queryObject = []

    setUrlLocation([])
    setJobTypes([])
    setSalaries([])
    setIsCategoryReset(true)
    if (searchMatch) setSearchValue('')
    setMoreFilterReset(true)
    setClientDefaultValues({})
    setMainfunctions([])
    setJobFunctions([])
    setFunctionTitles([])
    // if query matches filter, on reset, remove it from query
    if ((searchMatch && locationMatch) || (searchMatch && !locationMatch)) {
      updateUrl(null, queryObject)
    } else if (!searchMatch && locationMatch) {
      if (searchQuery === predefinedLocation) {
        updateUrl(null, queryObject)
      } else {
        updateUrl(searchQuery ? `${searchQuery}-jobs` : null, queryObject)
      }
    } else {
      updateUrl(keyword, queryObject)
    }
  }

  const handleFetchJobDetail = (jobId) =>
    dispatch(fetchJobDetailRequest({ jobId, status: userCookie ? 'protected' : 'public' }))

  const handleSelectedJobId = (jobId, jobUrl = '/') => {
    // Open new tab in mobile
    if (isMobile && typeof window !== 'undefined') {
      window.open(jobUrl)

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

  const handleFetchJobAlertsList = () => dispatch(fetchJobAlertsListRequest({ accessToken }))

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

  const handleDeleteSavedJob = ({ jobId }) => {
    const deleteJobPayload = {
      jobId
    }

    dispatch(deleteSaveJobRequest(deleteJobPayload))
  }

  return (
    <Layout>
      <SEO title={seoMetaTitle} description={seoMetaDescription} canonical={seoCanonical} />
      <div
        className={classNamesCombined([
          displayQuickLinks ? styles.searchSectionExpanded : styles.searchSection
          // isStickyClass,
        ])}
      >
        <div className={styles.searchAndLocationContainer}>
          <MaterialTextFieldWithSuggestionList
            id='search'
            label='Search for job title or company name'
            variant='outlined'
            size='small'
            className={styles.searchField}
            defaultValue={defaultValues?.urlQuery}
            value={searchValue}
            maxLength={255}
            searchFn={handleSuggestionSearch}
            updateSearchValue={setSearchValue}
            onSelect={(val) => {
              setSearchValue(val)
              onKeywordSearch(val)
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                setSuggestionList([])
                setSearchValue((e.target as HTMLInputElement).value)
                onKeywordSearch((e.target as HTMLInputElement).value)
              }
            }}
            options={suggestionList}
          />
          <MaterialLocationField
            className={styles.locationField}
            defaultValue={urlLocation}
            value={urlLocation}
            onChange={onLocationSearch}
          />
          <MaterialButton
            variant='contained'
            capitalize
            className={styles.searchButton}
            onClick={() => onKeywordSearch(searchValue)}
          >
            <Text textStyle='base' textColor='white' bold>
              Search
            </Text>
          </MaterialButton>
          <div className={classNames(breakpointStyles.hideOnDesktop, styles.jobFunctionFilters)}>
            <JobFunctionMultiSelector
              className={classNames(styles.jobFunction)}
              id='jobFunction'
              label='Job Function'
              value={jobFunctionValue}
              onChange={jobFunctionChange}
            />
            <MaterialButton
              variant='outlined'
              capitalize
              className={styles.filtersButton}
              onClick={() => setIsShowFilter(true)}
            >
              <Text textStyle='base' textColor='primaryBlue' bold>
                Filters
              </Text>
              {filterCount > 0 && (
                <Text textStyle='base' textColor='white' className={styles.searchFilterCount}>
                  {filterCount}
                </Text>
              )}
            </MaterialButton>
          </div>
        </div>
        <div className={styles.filtersContainer}>
          <MaterialBasicSelect
            id='sort'
            label='Sort by'
            options={sortOptions}
            className={styles.sortField}
            onSelect={onSortSelection}
            value={sort}
            defaultValue={defaultValues?.sort}
          />

          <JobFunctionMultiSelector
            className={styles.sortField}
            id='jobFunction'
            label='Job Function'
            value={jobFunctionValue}
            onChange={jobFunctionChange}
          />

          <MaterialSelectCheckmarksCustomSEO
            id='salary'
            label='Salary'
            options={salaryRangeList}
            className={styles.sortField}
            onSelect={onSalarySelection}
            value={salaries}
          />
          <MaterialSelectCheckmarksCustomSEO
            id='jobType'
            label='Job Type'
            options={jobTypeList}
            className={styles.sortField}
            onSelect={onJobTypeSelection}
            value={jobTypes}
          />

          <MaterialButton
            variant='outlined'
            className={styles.moreFiltersBtn}
            onClick={() => setIsShowFilter(true)}
            capitalize
          >
            <Text className={styles.moreFilters} textColor='primaryBlue' textStyle='base' bold>
              More Filters
            </Text>
            {filterCount > 0 && (
              <Text textStyle='base' textColor='white' className={styles.searchFilterCount}>
                {filterCount}
              </Text>
            )}
          </MaterialButton>

          {hasMoreFilters && (
            <MaterialButton
              variant='text'
              className={styles.moreFiltersBtn}
              onClick={handleResetFilter}
              capitalize
            >
              <Text textColor='primaryBlue' textStyle='base' bold>
                Reset Filters
              </Text>
            </MaterialButton>
          )}
        </div>
        <div
          className={displayQuickLinks ? styles.quickLinkSectionExpanded : styles.quickLinkSection}
        >
          <div className={styles.popularSearchContainer}>
            <div>
              <Text textStyle='base' bold className={styles.quickLinkTitle}>
                Popular Search:
              </Text>
            </div>
            {renderPopularSearch()}
          </div>
          <div className={styles.topCompaniesContainer}>
            <Text textStyle='base' bold className={styles.quickLinkTitle}>
              Top Companies:
            </Text>
            <div className={styles.topCompanies}>
              {topCompanies &&
                topCompanies.map((company, i) => {
                  if (i < 15) {
                    return (
                      <Link
                        key={company.id}
                        className={styles.topCompaniesLogo}
                        to={`${process.env.HOST_PATH}${company?.companyUrl}/jobs`}
                        external
                      >
                        <Tooltip
                          title={company.name}
                          placement='top'
                          className={styles.toolTip}
                          arrow
                        >
                          <span>
                            <LazyLoad>
                              <img
                                src={company.logoUrl}
                                alt={company.name}
                                width='30'
                                height='30'
                              />
                            </LazyLoad>
                          </span>
                        </Tooltip>
                      </Link>
                    )
                  }
                })}
            </div>
          </div>
        </div>
      </div>
      {isShowFilter && (
        <JobSearchFilters
          urlDefaultValues={clientDefaultValues}
          // categories={categories}
          isShowFilter={isShowFilter}
          onResetFilter={handleResetFilter}
          handleShowFilter={handleShowFilter}
          moreFilterReset={moreFilterReset}
          isShowingEmailAlert={accessToken && !userCookie?.is_email_verify}
          setClientDefaultValues={setClientDefaultValues}
        />
      )}

      <div style={{ display: 'block' }} className={styles.jobListSection}>
        <JobListSection
          page={selectedPage}
          jobList={jobListResponse?.data || null}
          isJobListFetching={isJobListFetching}
          isJobDetailFetching={isJobDetailFetching}
          selectedJob={selectedJob}
          selectedJobId={selectedJobId}
          handleSelectedJobId={handleSelectedJobId}
          totalPages={jobListResponse?.data?.total_pages}
          query={searchQuery ? unslugify(searchQuery) : unslugify(predefinedQuery)}
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
          postReportResponse={postReportResponse}
          isPostingReport={isPostingReport}
          config={config}
        />
      </div>
    </Layout>
  )
}

const initPagePayLoad = async (query, config = null) => {
  const { page, industry, workExperience, category, jobType, salary, location, qualification, verifiedCompany } =
    query
  if (!config) {
    const result = await fetchConfigService()
    config = result
  }

  const formatLocationConfig = (locationList) => {
    const locationConfig = locationList?.map((region) => region.locations)
    return locationConfig
  }
  const industryList = config.inputs.industry_lists
  const expLvlList = config.inputs.xp_lvls
  const eduLevelList = config.filters.educations
  const locationList = config.inputs.location_lists
  const formattedLocationList = flat(formatLocationConfig(locationList))
  const catList = config && config.inputs && config.inputs.job_category_lists
  const jobTypeList = config.inputs.job_types
  const salaryRangeList = config.filters.salary_range_filters
  const mainFunctionList = config.inputs.main_functions
  const jobFunctionList = config.inputs.job_functions
  const functionsTitleList = config.inputs.function_titles
  // query parameters
  const queryJobType: any = query?.jobType
  const querySalary: any = query?.salary
  const queryQualification: any = query?.qualification
  const queryLocation: any = query?.location
  const queryIndustry: any = query?.industry
  const queryWorkExp: any = query?.workExperience
  const queryCategory: any = query?.category
  const queryVerifiedCompany: any = query?.verifiedCompany

  const { searchQuery, matchedLocation, matchedConfigFromUrl } = checkFilterMatch(query, config)

  const defaultValues: any = {
    urlQuery: searchQuery,
    // if sort param exist, follow sort defined in param, otherwise if search exist, sort default to 2 'Relevance'
    sort: query?.sort ? query?.sort : searchQuery ? 2 : 1,
    jobType: queryJobType?.split?.(',') || null,
    salary: querySalary?.split?.(',') || null,
    qualification: queryQualification?.split?.(',') || null,
    location: queryLocation?.split?.(',') || null,
    industry: queryIndustry?.split?.(',') || null,
    workExperience: queryWorkExp?.split?.(',') || null,
    category: queryCategory?.split?.(',') || null,
    verifiedCompany: queryVerifiedCompany?.split?.(',') || null,
    mainFunctions: query?.mainFunctions?.split?.(',') ?? null,
    jobFunctions: query?.jobFunctions?.split?.(',') ?? null,
    functionTitles: query?.functionTitles?.split?.(',') ?? null
  }

  for (const [key, value] of Object.entries(matchedConfigFromUrl)) {
    defaultValues[key] = [value[0]['seo-value'] || value[0]['seo_value']]
  }
  for (const [key, value] of Object.entries(matchedLocation)) {
    defaultValues[key] = value[0]
    // to prevent cases where /jobs-hiring/makati-jobs, whereby the query & location is populated with values
    if (defaultValues.urlQuery === value[0]['seo_value']) {
      defaultValues.urlQuery = ''
    }
  }
  // sanitise searchQuery
  defaultValues.urlQuery = defaultValues.urlQuery ? unslugify(searchQuery).replace('+', '-') : ''
  const sort = defaultValues?.sort

  let payload = {
    query: defaultValues?.urlQuery,
    location: location
      ? mapSeoValueToGetValue((location as string).split?.(','), formattedLocationList, false, true)
      : null,
    category: category
      ? mapSeoValueToGetValue((category as string).split?.(','), catList, true)
      : null,
    salary: salary ? mapSeoValueToGetValue((salary as string).split?.(','), salaryRangeList) : null,
    jobType: jobType ? mapSeoValueToGetValue((jobType as string).split?.(','), jobTypeList) : null,
    industry: industry
      ? mapSeoValueToGetValue((industry as string).split?.(','), industryList)
      : null,
    qualification: qualification
      ? mapSeoValueToGetValue((qualification as string).split?.(','), eduLevelList)
      : null,
    workExperience: workExperience
      ? mapSeoValueToGetValue((workExperience as string).split?.(','), expLvlList)
      : null,
    verifiedCompany: Boolean(verifiedCompany),
    mainFunctions: query?.mainFunctions?.split?.(',')?.map?.(seo => mainFunctionList.find(item => item.seo_value === seo)?.value)?.join?.(',') ?? null,
    jobFunctions: query?.jobFunctions?.split?.(',')?.map?.(seo => jobFunctionList.find(item => item.seo_value === seo)?.id)?.join?.(',') ?? null,
    functionTitles: query?.functionTitles?.split?.(',')?.map?.(seo => functionsTitleList.find(item => item.seo_value === seo)?.id)?.join?.(',') ?? null,
    sort,
    page: page ? Number(page) : 1
  }

  for (const [key, value] of Object.entries(matchedConfigFromUrl)) {
    if (key === 'verifiedCompany') {
      payload = {
        ...payload,
        [key]: value[0].value ? true : false
      }
    } else if (['jobFunctions', 'functionTitles'].includes(key)) {
      payload = {
        ...payload,
        [key]: payload[key] ? (payload[key] += value[0].id) : value[0].id
      }
    } else {
      payload = {
        ...payload,
        [key]: payload[key] ? (payload[key] += value[0].value) : value[0].value
      }
    }
  }
  for (const [key, value] of Object.entries(matchedLocation)) {
    payload = {
      ...payload,
      [key]:
        payload[key] && payload[key] !== value[0].value
          ? (payload[key] += value[0].value)
          : value[0].value
    }
  }

  return { defaultValues, payload, config }
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, req, resolvedUrl }) => {
      const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null

      const { keyword, page } = query
      store.dispatch({type:'JOB_HIRED_SERVER_SIDE',payload:query})
      store.dispatch(END)
      await (store as any).sagaTask.toPromise()
      const storeState = store.getState()
      const config = storeState.config.config.response
      // console.log({storeState})
      const { defaultValues } = await initPagePayLoad(query, config)

      // store actions
      // store.dispatch(fetchJobsListRequest(initPayload, accessToken))
      // store.dispatch(fetchConfigRequest())
      // if (accessToken) {
      //   store.dispatch(fetchUserOwnDetailRequest({ accessToken }))
      // }
      // store.dispatch(fetchFeaturedCompaniesListRequest({ size: 21, page: 1 }))
      // store.dispatch(END)
      // await (store as any).sagaTask.toPromise()
      
      // const config = storeState.config.config.response
      const featuredCompanies =
        storeState.companies.fetchFeaturedCompaniesList.response?.featured_companies?.map(
          (featuredCompany) => featuredCompany.company
        )
      const topCompanies = featuredCompanies?.map((featuredCompany) => {
        const logoUrl = featuredCompany.logo_url
        const companyUrl = featuredCompany.company_url
        delete featuredCompany.logo_url
        delete featuredCompany.companyUrl
        return { ...featuredCompany, logoUrl, companyUrl }
      })

      /* Handle job search logic */
      const { searchQuery, predefinedQuery, predefinedLocation } = checkFilterMatch(query, config)

      /* Handle SEO Meta Tags*/
      const { month, year } = getCurrentMonthYear()
      let seoMetaTitle = `Professional Jobs in Philippines - Search & Apply Job Opportunities - ${month} ${year} | Bossjob`
      let seoMetaDescription =
        'New Jobs in Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers'
      const seoCanonical = resolvedUrl

      if (searchQuery && !predefinedQuery && !predefinedLocation) {
        seoMetaTitle = `${unslugify(
          searchQuery,
          true
        )} Jobs in Philippines, Job Opportunities - ${month} ${year} | Bossjob`
        seoMetaDescription = `New ${unslugify(
          searchQuery,
          true
        )} Jobs in Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
      } else if (!searchQuery && predefinedQuery && !predefinedLocation) {
        seoMetaTitle = `${unslugify(
          predefinedQuery,
          true
        )} Jobs in Philippines, Job Opportunities - ${month} ${year} | Bossjob`
        seoMetaDescription = `New ${unslugify(
          predefinedQuery,
          true
        )} Jobs in Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
      } else if (searchQuery && !predefinedQuery && predefinedLocation) {
        seoMetaTitle = `${unslugify(
          searchQuery,
          true
        )} Jobs in Philippines, Apply Job Opportunities - ${month} ${year} | Bossjob`
        seoMetaDescription = `New ${unslugify(searchQuery, true)} Jobs in ${unslugify(
          predefinedLocation,
          true
        )}, Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
      } else if (!searchQuery && predefinedQuery && predefinedLocation) {
        seoMetaTitle = `${unslugify(predefinedQuery, true)} Jobs in ${unslugify(
          predefinedLocation,
          true
        )}, Philippines, Job Opportunities - ${month} ${year} | Bossjob`
        seoMetaDescription = `New ${unslugify(predefinedQuery, true)} Jobs in ${unslugify(
          predefinedLocation,
          true
        )}, Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
      } else {
        seoMetaTitle = `Professional Jobs in Philippines - Search & Apply Job Opportunities - ${month} ${year} | Bossjob`
        seoMetaDescription = `New Jobs in Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
      }

      return {
        props: {
          topCompanies,
          key: keyword,
          defaultPage: page ? Number(page) : 1,
          defaultValues,
          accessToken,
          seoMetaTitle,
          seoMetaDescription: encodeURI(seoMetaDescription),
          seoCanonical
        }
      }
    }
)
export default JobSearchPage
