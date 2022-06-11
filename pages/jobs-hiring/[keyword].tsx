import React, { useState, useEffect } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import slugify from 'slugify'

// @ts-ignore
import { END } from 'redux-saga'

// import classNames from 'classnames/bind'
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
import MaterialCategoryField from 'components/MaterialCategoryField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialSelectCheckmarksCustomSEO from 'components/MaterialSelectCheckmarksCustomSEO'
import Tooltip from '@mui/material/Tooltip'

/* Components */
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
import { checkFilterMatch, userFilterSelectionDataParser } from 'helpers/jobPayloadFormatter'
import { flat, unslugify } from 'helpers/formatter'
import { useFirstRender } from 'helpers/useFirstRender'
import useWindowDimensions from 'helpers/useWindowDimensions'
import { getCookie } from 'helpers/cookies'

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
  const jobsPageLink = '/jobs-hiring'

  return (
    <div className={styles.popularSearch}>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?category=audit-taxation,banking-financial,corporate-finance-investment,sales-insurance-financial-services,general-cost-accounting`}
        title='Finance jobs'
        aTag
      >
        <Text textStyle='lg' textColor='darkgrey'>
          Finance
        </Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?category=sales-corporate,sales-engineering-technical-it,sales-insurance-financial-services,marketing-business-development`}
        title='Sales jobs'
        aTag
      >
        <Text textStyle='lg' textColor='darkgrey'>
          Sales
        </Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?category=digital-marketing,marketing-business-development,telesales-telemarketing`}
        title='Marketing jobs'
        aTag
      >
        <Text textStyle='lg' textColor='darkgrey'>
          Marketing
        </Text>
      </Link>
      <Link className={styles.link} to={`${jobsPageLink}/makati-jobs`} title='Makati jobs' aTag>
        <Text textStyle='lg' textColor='darkgrey'>
          Makati
        </Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?category=it-hardware,it-network-system-database-admin,it-software-engineering,sales-engineering-technical-it,technical-helpdesk-support,it-product-management`}
        title='IT jobs'
        aTag
      >
        <Text textStyle='lg' textColor='darkgrey'>
          IT
        </Text>
      </Link>
      <Link className={styles.link} to={`${jobsPageLink}/overseas-jobs`} title='Overseas jobs' aTag>
        <Text textStyle='lg' textColor='darkgrey'>
          Overseas jobs
        </Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?category=customer-service-relations,technical-helpdesk-support`}
        title='Customer Service jobs'
        aTag
      >
        <Text textStyle='lg' textColor='darkgrey'>
          Customer Service
        </Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?salary=30K_to_60K,60K_to_80K,80K_to_100K,Above_200K`}
        title='₱30K + jobs'
        aTag
      >
        <Text textStyle='lg' textColor='darkgrey'>
          ₱30K + jobs
        </Text>
      </Link>
      <Link
        className={styles.link}
        to={`${jobsPageLink}/job-search/?jobType=full_time`}
        title='Full Time jobs'
        aTag
      >
        <Text textStyle='lg' textColor='darkgrey'>
          Full Time jobs
        </Text>
      </Link>
    </div>
  )
}

const JobSearchPage = (props: JobSearchPageProps) => {
  const {
    accessToken,
    seoMetaTitle,
    seoMetaDescription,
    config,
    topCompanies,
    defaultPage,
    defaultValues,
  } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const firstRender = useFirstRender()
  const { width } = useWindowDimensions()

  const userCookie = getCookie('user') || null
  const isMobile = width < 768 ? true : false

  const [clientDefaultValues, setClientDefaultValues] = useState(defaultValues || {})
  const [filterCount, setFilterCount] = useState(0)
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [urlLocation, setUrlLocation] = useState(defaultValues?.location)
  const [sort, setSort] = useState(defaultValues?.sort)
  const [moreFilterReset, setMoreFilterReset] = useState(false)
  const catList = config && config.inputs && config.inputs.job_category_lists
  const [jobAlertList, setJobAlertList] = useState(null)
  const [createdJobAlert, setCreatedJobAlert] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [searchValue, setSearchValue] = useState(defaultValues?.urlQuery || '')
  const [categoryList, setCategoriesList] = useState(defaultValues?.categoryList || [])
  const [categories, setCategories] = useState(defaultValues?.category || [])
  const [isCategoryReset, setIsCategoryReset] = useState(false)
  const [jobTypes, setJobTypes] = useState(defaultValues?.jobType || [])
  const [salaries, setSalaries] = useState(defaultValues?.salary || [])
  const { keyword, ...rest } = router.query
  const [displayQuickLinks, setDisplayQuickLinks] = useState(
    keyword === 'job-search' && Object.entries(rest).length === 0
  )
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

  const postReportResponse = useSelector((store: any) => store.reports.postReport.response)
  const isPostingReport = useSelector((store: any) => store.reports.postReport.fetching)

  const { searchQuery, predefinedQuery, predefinedLocation } = checkFilterMatch(
    router.query,
    config
  )
  const [selectedPage, setSelectedPage] = useState(defaultPage)

  useEffect(() => {
    // eslint-disable-next-line no-console
    const {
      // keyword,
      industry,
      education,
      workExperience,
      category,
      jobType,
      salary,
      qualification,
    } = router.query

    if (!firstRender) setDisplayQuickLinks(false)

    // const routerCategories: any = predefinedCategory ? predefinedCategory[0] : category
    // let jobCategories: any = []

    // if (routerCategories) {
    //   catList.forEach(cat => {
    //     if (routerCategories.split(',').includes(cat.key)) {
    //       jobCategories.push(cat.value)
    //     }
    //   });
    // }

    // jobCategories = jobCategories.join(',')
    const hasActiveFilters = !!(
      industry ||
      education ||
      workExperience ||
      category ||
      qualification ||
      jobType ||
      salary ||
      predefinedLocation ||
      predefinedQuery
    )

    setHasMoreFilters(hasActiveFilters)

    const payload = {
      query: searchValue,
      jobLocation: urlLocation?.value,
      jobCategories: router.query?.category,
      // jobCategories: jobCategories,
      salary: router.query?.salary,
      jobType: router.query?.jobType,
      industry: router.query?.industry,
      education: router.query?.qualification,
      workExperience: router.query?.workExperience,
      sort: router.query?.sort,
      page: router.query?.page ? Number(router.query.page) : 1,
    }

    dispatch(fetchJobsListRequest(payload, accessToken))

    setIsCategoryReset(false)
    setMoreFilterReset(false)

    setFilterCount(getFilterCount())
  }, [router.query])

  useEffect(() => {
    if (jobAlertListResponse) setJobAlertList(jobAlertListResponse)
    if (createdJobAlertResponse) setCreatedJobAlert(createdJobAlertResponse)
  }, [jobAlertListResponse, createdJobAlertResponse])

  useEffect(() => {
    if (jobListResponse?.data?.jobs.length > 0) {
      handleFetchJobDetail(jobListResponse.data?.jobs?.[0].id)
      setSelectedJobId(jobListResponse.data?.jobs?.[0].id)
    } else {
      setSelectedJobId(null)
      setSelectedJob(null)
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
    if (isShowFilter) {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      // retrieve previous scroll position
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
    setIsShowFilter(!isShowFilter)
  }

  const jobTypeOption = config.inputs.job_types

  const salaryRangeOption = flat(
    config.filters.salary_range_filters.map((range) => {
      const rangeObj = {
        ...range,
        value: range.value === '10K - 30K' ? 'Below 30K' : range.value,
      }
      return rangeObj
    })
  )

  const getFilterCount = () => {
    const nonFilterKeys = [
      'keyword',
      'search',
      'page',
      'id',
      'sort',
      'utm_source',
      'utm_campaign',
      'utm_medium',
    ]

    let count = 0

    if (predefinedLocation && predefinedLocation.length > 0) {
      count += predefinedLocation.length
    }

    Object.entries<any>(router.query).forEach(([key, value]) => {
      const val = value.split(',')
      if (!nonFilterKeys.includes(key)) {
        // ensure value exist and is not an empty array
        if (val && val.length !== 0) {
          val.forEach(() => {
            count++
          })
        }
      }
    })

    return count
  }

  const updateUrl = (queryParam, queryObject) => {
    queryObject['page'] = '1'
    setSelectedPage(Number(queryObject['page']))

    router.push(
      {
        pathname: `/jobs-hiring/${queryParam ? slugify(queryParam) : 'job-search'}`,
        query: queryObject,
      },
      undefined,
      { shallow: true }
    )
  }

  const onKeywordSearch = (val) => {
    // eslint-disable-next-line
    const { keyword, ...rest } = router.query
    const sortOption = val.length > 0 ? 2 : 1
    const isClear = val.length === 0

    setSort(sortOption)
    const {
      searchQuery,
      filterParamsObject,
      matchedConfig,
      matchedConfigFromUrl,
      matchedConfigFromUserSelection,
    } = userFilterSelectionDataParser('query', val, router.query, config, isClear)

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
        case 'category':
          let categorySelected = []
          // append current search that matches catergory
          categorySelected.push(value[0]['seo-value'])
          // append the other options that was selected previously
          Object.values(matchedConfigFromUrl).forEach((value) => {
            value.forEach((val) => categorySelected.push(val['seo-value']))
          })
          Object.values(matchedConfigFromUserSelection).forEach((value) => {
            value.forEach((val) => categorySelected.push(val['seo-value']))
          })

          // sanitise categorySelected to only include unique value
          categorySelected = [...new Set(categorySelected)]

          const updatedCategoryList = catList.map((data) => {
            let newData = { ...data }
            let newSubList = data.sub_list.map((subListData) => {
              // if checked === true, set subOption isChecked = true
              if (categorySelected.includes(subListData['seo-value'])) {
                // if (subListData['seo-value'] === value[0]['seo-value']) {
                return {
                  ...subListData,
                  isChecked: true,
                }
              } else {
                return {
                  ...subListData,
                  isChecked: false,
                }
              }
            })
            if (categorySelected.includes(data['seo-value'])) {
              // if (data['seo-value'] === value[0]['seo-value']){
              newSubList = data.sub_list.map((data) => {
                return {
                  ...data,
                  isChecked: true,
                }
              })
              newData = {
                ...newData,
                isChecked: true,
                sub_list: newSubList,
              }
            } else {
              newData = {
                ...newData,
                isChecked: false,
                sub_list: newSubList,
              }
            }
            return newData
          })
          setCategories(categorySelected)
          setCategoriesList(updatedCategoryList)
          setSearchValue('')
          break
        case 'location':
          setUrlLocation(value[0])
          setSearchValue('')
        default:
          break
      }
    }
    updateUrl(searchQuery, filterParamsObject)
  }

  const handleSuggestionSearch = (val) => {
    if (val !== '') {
      fetch(`${process.env.JOB_BOSSJOB_URL}/suggested-search?size=5&query=${val}`)
        .then((resp) => resp.json())
        .then((data) => setSuggestionList(data.data.items))
    }
  }

  const onLocationSearch = (event, value) => {
    // eslint-disable-next-line
    const { keyword, ...rest } = router.query

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
    // NOTE: there is a different sort selection logic when selecting sort in Mobile, refer to JobSearchFilters
    // eslint-disable-next-line
    // const { keyword, ...rest } = router.query
    // const queryParam = conditionChecker(predefinedQuery, predefinedLocation, predefinedCategory)
    // const queryObject = Object.assign({}, { ...rest, sort: selectedOption })

    const { searchQuery, filterParamsObject } = userFilterSelectionDataParser(
      'sort',
      selectedOption,
      router.query,
      config
    )
    setSort(selectedOption)

    updateUrl(searchQuery, filterParamsObject)
    // updateUrl(queryParam, queryObject)
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

  const onSpecializationSelection = (selectedOptions) => {
    const isClear = selectedOptions && selectedOptions.length === 0
    const { searchQuery, filterParamsObject } = userFilterSelectionDataParser(
      'category',
      selectedOptions,
      router.query,
      config,
      isClear
    )

    // setCategoriesList(selectedOptions)
    // setCategories(filterParamsObject['category'].split(','))
    setCategories(selectedOptions)
    updateUrl(searchQuery, filterParamsObject)
  }

  const handleResetFilter = () => {
    const { searchMatch, locationMatch, searchQuery, predefinedLocation } = checkFilterMatch(
      router.query,
      config
    )

    const queryObject = []

    setUrlLocation([])
    setJobTypes([])
    setSalaries([])
    setCategories([])
    setIsCategoryReset(true)
    if (searchMatch) setSearchValue('')
    setMoreFilterReset(true)

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

  const handleSelectedJobId = (jobId, jobTitle) => {
    // Open new tab in mobile
    if (isMobile && typeof window !== 'undefined') {
      window.open(`/job/${slugify(jobTitle.toLowerCase())}-${jobId}`)

      return
    }

    setSelectedJobId(jobId)
    handleFetchJobDetail(jobId)
  }

  const handleUpdateJobAlert = (updateJobAlertData) => {
    const updateJobAlertPayload = {
      updateJobAlertData,
      accessToken,
    }

    dispatch(updateJobAlertRequest(updateJobAlertPayload))
  }

  const handleDeleteJobAlert = (jobAlertId) => {
    const deleteJobAlertPayload = {
      jobAlertId,
      accessToken,
    }

    dispatch(deleteJobAlertRequest(deleteJobAlertPayload))
  }

  const handlePostReportJob = (reportJobData) => {
    const postReportJobPayload = {
      reportJobData,
      accessToken,
    }

    dispatch(postReportRequest(postReportJobPayload))
  }

  const handleFetchJobAlertsList = () => dispatch(fetchJobAlertsListRequest({ accessToken }))

  const handleCreateJobAlert = (jobAlertData) => {
    const createJobAlertPayload = {
      jobAlertData,
      accessToken,
      user_id: userCookie.id,
    }

    dispatch(createJobAlertRequest(createJobAlertPayload))
  }

  const handlePostSaveJob = ({ jobId }) => {
    const postSaveJobPayload = {
      jobId,
      user_id: userCookie.id,
    }

    dispatch(postSaveJobRequest(postSaveJobPayload))
  }

  const handleDeleteSavedJob = ({ jobId }) => {
    const deleteJobPayload = {
      jobId,
    }

    dispatch(deleteSaveJobRequest(deleteJobPayload))
  }

  return (
    <Layout>
      <SEO title={seoMetaTitle} description={seoMetaDescription} />
      <div className={isShowFilter ? styles.jobSearchFilterBackdrop : ''}></div>
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
            defaultValue={defaultValues?.urlQuery}
            value={searchValue}
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
          <div className={breakpointStyles.hideOnDesktop}>
            <MaterialButton
              variant='outlined'
              capitalize
              className={styles.filtersButton}
              onClick={() => handleShowFilter()}
            >
              <Text textStyle='base' textColor='primaryBlue' bold>
                Filters
              </Text>
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
          <MaterialSelectCheckmarksCustomSEO
            id='jobType'
            label='Job Type'
            options={jobTypeOption}
            className={styles.sortField}
            onSelect={onJobTypeSelection}
            value={jobTypes}
          />
          <MaterialSelectCheckmarksCustomSEO
            id='salary'
            label='Salary'
            options={salaryRangeOption}
            className={styles.sortField}
            onSelect={onSalarySelection}
            value={salaries}
          />
          <MaterialCategoryField
            id='specialization'
            label='Specialization'
            options={config.inputs.job_category_lists}
            className={styles.specializationField}
            onSelect={onSpecializationSelection}
            list={categoryList}
            value={categories}
            isReset={isCategoryReset}
          />
          <MaterialButton
            variant='outlined'
            className={styles.moreFiltersBtn}
            onClick={handleShowFilter}
            capitalize
          >
            <Text className={styles.moreFilters} textColor='primaryBlue' textStyle='base' bold>
              More Filters
            </Text>
            {filterCount > 0 && (
              <Text
                tagName='p'
                textStyle='base'
                textColor='white'
                className={styles.searchFilterCount}
              >
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
            <Text textStyle='base' bold className={styles.quickLinkTitle}>
              Popular Search:
            </Text>
            {renderPopularSearch()}
          </div>
          <div className={styles.topCompaniesContainer}>
            <Text textStyle='base' bold className={styles.quickLinkTitle}>
              Top Companies:
            </Text>
            <div className={styles.topCompanies}>
              {topCompanies &&
                topCompanies.map((company, i) => {
                  if (i < 8) {
                    return (
                      <Link
                        key={company.id}
                        className={styles.topCompaniesLogo}
                        to={`/company/${slugify(company.name.toLowerCase())}-${company.id}/jobs`}
                        external
                      >
                        <Tooltip
                          title={company.name}
                          placement='top'
                          className={styles.toolTip}
                          arrow
                        >
                          <span>
                            <img src={company.logoUrl} alt={company.name} width='30' height='30' />
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
      <JobSearchFilters
        urlDefaultValues={clientDefaultValues}
        categories={categories}
        displayQuickLinks={displayQuickLinks}
        isShowFilter={isShowFilter}
        onResetFilter={handleResetFilter}
        onShowFilter={handleShowFilter}
        moreFilterReset={moreFilterReset}
        isShowingEmailAlert={accessToken && !userCookie?.is_email_verify}
      />
      {/* <div className={breakpointStyles.hideOnTabletAndDesktop}>
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
          <img src={FilterIcon} alt='filter' width='15' height='15' />
          <Text className={styles.moreFiltersText}>More Filters</Text>
        </div>
      </div> */}
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

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query, req }) => {
  const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null

  const { keyword, page } = query
  // store actions
  store.dispatch(fetchConfigRequest())
  store.dispatch(fetchFeaturedCompaniesListRequest({ size: 21, page: 1 }))
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response
  const featuredCompanies =
    storeState.companies.fetchFeaturedCompaniesList.response?.featured_companies?.map(
      (featuredCompany) => featuredCompany.company
    )
  const topCompanies = featuredCompanies?.map((featuredCompany) => {
    const logoUrl = featuredCompany.logo_url
    delete featuredCompany.logo_url
    return { ...featuredCompany, logoUrl }
  })
  const catList = config && config.inputs && config.inputs.job_category_lists

  const { searchQuery, matchedLocation, matchedConfigFromUrl } = checkFilterMatch(query, config)

  // query parameters
  const queryJobType: any = query?.jobType
  const querySalary: any = query?.salary
  const queryQualification: any = query?.qualification
  const queryLocation: any = query?.location
  const queryIndustry: any = query?.industry
  const queryWorkExp: any = query?.workExperience
  const queryCategory: any = query?.category

  const defaultValues: any = {
    urlQuery: searchQuery || '',
    sort: query?.sort ? query?.sort : 1,
    jobType: queryJobType?.split(',') || null,
    salary: querySalary?.split(',') || null,
    qualification: queryQualification?.split(',') || null,
    location: queryLocation?.split(',') || null,
    industry: queryIndustry?.split(',') || null,
    workExperience: queryWorkExp?.split(',') || null,
    category: queryCategory?.split(',') || null,
  }

  for (const [key, value] of Object.entries(matchedConfigFromUrl)) {
    defaultValues[key] = [value[0]['seo-value']]
  }
  for (const [key, value] of Object.entries(matchedLocation)) {
    defaultValues[key] = value[0]
  }

  if (defaultValues.category) {
    const defaultCategories = defaultValues.category
    const initialListOptions = catList.map((data) => {
      const newSubList = data.sub_list.map((subData) => ({
        ...subData,
        isChecked:
          defaultCategories.includes(subData['seo-value']) ||
          defaultCategories.includes(data['seo-value']),
      }))
      const newList = {
        ...data,
        isChecked: defaultCategories.includes(data['seo-value']),
        sub_list: newSubList,
      }
      return newList
    })
    defaultValues.categoryList = initialListOptions
  }

  return {
    props: {
      config,
      topCompanies,
      key: keyword,
      defaultPage: page ? Number(page) : 1,
      defaultValues,
      accessToken,
    },
  }
})
export default JobSearchPage
