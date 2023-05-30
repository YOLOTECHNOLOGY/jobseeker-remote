/* eslint-disable react/no-unknown-property */
'use client'
import React, { useState, useCallback, useEffect, useMemo, useRef, useContext } from 'react'
import { flushSync } from 'react-dom'
import LocationField from 'app/[lang]/components/commons/location'
import LocationField1 from 'app/[lang]/components/mobile/location1'
import JobSearchBar from '../../../components/commons/location/search'
import styles from './index.pc.module.scss'
import MaterialButton from 'components/MaterialButton'
import Multiple from 'app/[lang]/components/commons/select/multiple'
import { useSuggest } from './hooks'
import theme from 'app/[lang]/components/commons/theme'
import { ThemeProvider } from '@mui/material/styles'
// import { useRouter } from 'next/navigation'
import { toPairs } from 'ramda'
import { Button } from 'app/[lang]/components/MUIs'
import { useDispatch } from 'react-redux'
import { fetchConfigSuccess } from 'store/actions/config/fetchConfig'
import { useFirstRender } from 'helpers/useFirstRender'
import { filter } from 'ramda'
import { LoadingContext } from 'app/[lang]/components/providers/loadingProvider'
import { useSearchParams } from 'next/navigation'
import PreferenceSelector from '../preferenceSelector'
import classNames from 'classnames'
import { encode } from 'app/[lang]/jobs-hiring/interpreters/encoder'
import { useRouter } from 'next/navigation'
import { SortContext } from './SortProvider'

const SearchArea = (props: any) => {
  const { sort, setSort } = useContext(SortContext)
  let { config, preferences, preferenceId, lang } = props
  const allLang = lang
  lang = lang?.myJobs
  const { searchForJobTitleOrCompanyName, salary, experience, Industry, JobType, resetFilters } =
    lang || {}
  const dispatch = useDispatch()
  const searchParams: any = useSearchParams() ?? {}
  useEffect(() => {
    dispatch(fetchConfigSuccess(config))
  }),
    []
  const { push } = useContext(LoadingContext)
  const [location, setLocation] = useState<any>()
  const [filterLocation, setFilterLocation] = useState<any>()
  const [searchValue, setSearchValue] = useState<any>()
  const router = useRouter()
  const pushJobSearch = useCallback(() => {
    if (firstRender) {
      return
    }
    const params = {
      query: searchValue?.trim?.(),
      location: [location?.['seo_value']].filter((a) => a)
    }
    const result = encode(params)
    const url = new URLSearchParams(toPairs(result.params)).toString()
    router.push('/jobs-hiring/' + result.searchQuery + '?' + url, {
      forceOptimisticNavigation: true
    })
  }, [searchValue, location])
  const pushJobSearchRef = useRef(pushJobSearch)
  useEffect(() => {
    pushJobSearchRef.current = pushJobSearch
  }, [pushJobSearch])

  const [page, setPage] = useState(searchParams?.page ?? '1')

  const [qualification, setQualification] = useState(
    searchParams.get('qualification')?.split?.(',') ?? []
  )
  const qualificationList =
    config.educations.map?.((item) => ({ value: item?.['seo-value'], label: item.value })) ?? []
  const [workExperience, setWorkExperience] = useState(
    searchParams.get('workExperience')?.split?.(',') ?? []
  )
  const workExperienceList =
    config.xp_lvls.map?.((item) => ({ value: item?.['seo-value'], label: item.value })) ?? []
  const [industry, setIndustry] = useState(searchParams.get('industry')?.split?.(',') ?? [])
  const industryList =
    config.industry_lists.map?.((item) => ({ value: item?.['seo-value'], label: item.value })) ?? []
  const [companySizes, setCompanySizes] = useState(
    searchParams.get('companySizes')?.split?.(',') ?? []
  )
  const companySizeList =
    config.company_sizes.map?.((item) => ({ value: item?.['seo-value'], label: item.value })) ?? []

  const [salaries, setSelaries] = useState(searchParams.get('salary')?.split(',') ?? [])
  const salaryOptions =
    config?.salary_range_filters?.map?.((item) => ({
      value: item?.['seo-value'],
      label: item.value
    })) ?? []

  const [jobTypes, setJobtypes] = useState(searchParams?.jobTypes ?? [])
  const jobTypeList =
    config?.job_types?.map?.((item) => ({
      value: item?.['seo-value'],
      label: item.value
    })) ?? []
  const [suggestionList, handleSuggestionSearch, addSearchHistory, searchLoading] =
    useSuggest() as any[]
  console.log({ filterLocation })
  const filterParams = useMemo(() => {
    return filter((a) => a?.length)({
      qualification,
      salary: salaries,
      workExperience,
      jobTypes,
      industry,
      companySizes,
      sort,
      page,
      preferenceId,
      location: filterLocation?.key
    })
  }, [
    qualification,
    workExperience,
    companySizes,
    industry,
    salaries,
    jobTypes,
    sort,
    preferenceId,
    filterLocation
  ])

  const firstRender = useFirstRender()
  const reload = useCallback(() => {
    if (firstRender) {
      return
    }
    const url = new URLSearchParams(toPairs(filterParams)).toString()
    push(window.location.pathname + '?' + url)
  }, [filterParams, push])
  const reloadRef = useRef(reload)
  useEffect(() => {
    reloadRef.current = reload
  }, [reload])
  useEffect(reload, [
    qualification,
    workExperience,
    companySizes,
    industry,
    salaries,
    jobTypes,
    sort,
    push,
    filterLocation
  ])

  return (
    <div>
      <ThemeProvider theme={theme}>
        <div
          className={classNames({
            [styles.container]: true
            // [styles.isFixed]: isFixed
          })}
        >
          <div className={styles.searchArea}>
            <LocationField
              className={styles.location}
              locationList={config.location_lists}
              value={location}
              // isClear={true}
              label={lang.location}
              defaultValue={location}
              onChange={(e, value) => {
                setLocation(value)
              }}
            />
            <JobSearchBar
              id='search'
              label={searchForJobTitleOrCompanyName}
              variant='outlined'
              size='small'
              className={styles.search}
              value={searchValue}
              maxLength={255}
              isLoading={searchLoading}
              searchFn={handleSuggestionSearch as any}
              updateSearchValue={setSearchValue}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  flushSync(() => {
                    setSearchValue((e.target as any).value)
                  })
                  addSearchHistory((e.target as any).value)
                  pushJobSearchRef.current()
                }
              }}
              options={suggestionList}
              onSelect={(value: any) => {
                flushSync(() => {
                  setSearchValue(value)
                })
              }}
            />
            <MaterialButton
              className={styles.searchButton}
              variant='contained'
              capitalize
              onClick={() => {
                addSearchHistory(searchValue)
                pushJobSearchRef.current()
              }}
            >
              {' '}
              {lang.search}{' '}
            </MaterialButton>
          </div>
          <PreferenceSelector
            lang={allLang}
            preferences={preferences}
            preferenceId={preferenceId}
            config={config}
          />
          <div className={styles.filters}>
            <LocationField1
              className={styles.filterItems}
              height={'30px'}
              locationList={config.location_lists}
              value={filterLocation}
              // isClear={true}
              label={lang.location}
              defaultValue={filterLocation}
              onChange={(e, value) => {
                setFilterLocation(value)
              }}
            />
            <Multiple
              label={lang.qualification}
              value={qualification}
              options={qualificationList}
              className={styles.filterItems}
              onSelect={setQualification}
            />
            <Multiple
              label={salary}
              value={salaries}
              options={salaryOptions}
              className={styles.filterItems}
              onSelect={setSelaries}
            />
            <Multiple
              label={experience}
              value={workExperience}
              options={workExperienceList}
              className={styles.filterItems}
              onSelect={setWorkExperience}
            />
            <Multiple
              label={Industry}
              value={industry}
              options={industryList}
              className={styles.filterItems}
              onSelect={setIndustry}
            />
            <Multiple
              label={JobType}
              value={jobTypes}
              options={jobTypeList}
              className={styles.filterItems}
              onSelect={setJobtypes}
              defaultValue={jobTypes}
            />
            <Multiple
              label={lang.companySizes}
              value={companySizes}
              options={companySizeList}
              className={styles.filterItems}
              onSelect={setCompanySizes}
              defaultValue={companySizes}
            />
            <Button
              className={styles.clearButton}
              variant='text'
              onClick={() => {
                setLocation(null)
                setSearchValue('')
                setSort('2')
                setJobtypes([])
                setSelaries([])
                setPage('1')
                setQualification([])
                setWorkExperience([])
                setCompanySizes([])
                setJobtypes([])
                setIndustry([])
              }}
            >
              {resetFilters}{' '}
            </Button>
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}
export default SearchArea
