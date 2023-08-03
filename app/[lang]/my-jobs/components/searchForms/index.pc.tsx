/* eslint-disable react/no-unknown-property */
'use client'
import React, { useState, useCallback, useEffect, useMemo, useRef, useContext } from 'react'
import { flushSync } from 'react-dom'
import LocationField1 from 'app/components/mobile/location1'
import JobSearchBar from '../../../../components/commons/location/search'
import styles from './index.pc.module.scss'
import MaterialButton from 'components/MaterialButton'
import Multiple from 'app/components/commons/select/multiple'
import { useSuggest } from './hooks'
import theme from 'app/components/commons/theme'
import { ThemeProvider } from '@mui/material/styles'
// import { useRouter } from 'next/navigation'
import { toPairs } from 'ramda'
import { useDispatch } from 'react-redux'
import { fetchConfigSuccess } from 'store/actions/config/fetchConfig'
import { useFirstRender } from 'helpers/useFirstRender'
import { filter } from 'ramda'
import { LoadingContext } from 'app/components/providers/loadingProvider'
import { useSearchParams } from 'next/navigation'
import PreferenceSelector from '../preferenceSelector'
import classNames from 'classnames'
import { encode } from 'app/(jobs-hiring)/[lang]/jobs-hiring/interpreters/encoder'
import { useRouter } from 'next/navigation'
import { flatMap } from 'lodash-es'
import { SortContext } from './SortProvider'
import LocationMultiSelector from 'app/components/commons/locationMulty'
import Image from 'next/image'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { HistoryIcons } from 'images'

const SearchArea = (props: any) => {
  const { sort, setSort } = useContext(SortContext)
  let { config, preferences, preferenceId, lang } = props
  const allLang = lang
  const locationRef = useRef();
  lang = lang?.myJobs
  const { searchForJobTitleOrCompanyName, salary, experience, Industry, JobType, resetFilters } =
    lang || {}
  const dispatch = useDispatch()
  const searchParams: any = useSearchParams() ?? {}
  useEffect(() => {
    dispatch(fetchConfigSuccess(config))
  }, [])
  const flatLoaction = useMemo(() => {
    return flatMap(config?.location_lists, (item) => item.locations) ?? []
  }, [config?.location_lists])
  const { push } = useContext(LoadingContext)
  const [location, setLocation] = useState<any>([])
  const [filterLocation, setFilterLocation] = useState<any>(
    flatLoaction?.find((location) => location.id == searchParams.get('location'))
  )
  const [searchValue, setSearchValue] = useState<any>()
  const router = useRouter()
  const pushJobSearch = useCallback((type='') => {
    if (firstRender) {
      return
    }
    const params = {
      query: searchValue?.trim?.(),
      location: location.map((a) => a['seo_value']),
      queryFields: type
    }
    const result = encode(params)
    const url = new URLSearchParams(toPairs(result.params)).toString()
    router.push('/jobs-hiring/' + result.searchQuery + '?' + url, {
      scroll: true
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
    config.degrees.map?.((item) => ({ value: item?.['seo-value'], label: item.value })) ?? []
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
      location: filterLocation?.id?.toString()
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
    const url = new URLSearchParams(toPairs(filterParams)).toString()
    push(window.location.pathname + '?' + url)
  }, [filterParams, push])
  const reloadRef = useRef(reload)
  useEffect(() => {
    reloadRef.current = reload
  }, [reload])
  useEffect(() => {
    if(firstRender) return
    reloadRef.current()
  }, [
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

  const styleleSelect = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  }

  const spanStyle = {
    paddingLeft: '10px',
    fontSize: '15px'
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <div
          className={classNames({
            [styles.container]: true
            // [styles.isFixed]: isFixed
          })}
        >
          <div className={styles.searchArea}>
            {/* location */}
            <LocationMultiSelector
              className={styles.location}
              value={location}
              label={lang.location}
              onChange={setLocation}
              sx={{
                '> .MuiFormControl-root': {
                  borderRadius: '10px',
                  height: '40px',
                  marginTop: '4px',
                  overflow: 'hidden',
                  '> .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    height: '40px',
                    overflow: 'hidden',
                    marginTop: '4px'
                  }
                }
              }}
            />
            <div className={styles.searchSpread} />
            {/* search input */}
            <JobSearchBar
              id='search'
              placeholder={searchForJobTitleOrCompanyName}
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
                  const value = (e.target as HTMLInputElement).value
                  flushSync(() => {
                    setSearchValue(value)
                    addSearchHistory(value)
                  })
                  value && pushJobSearchRef.current()
                }
              }}
              options={suggestionList}
              onSelect={(value: any) => {
                const newValue = value?.value || value || ''
                const type = value?.type || ''
                flushSync(() => {
                  setSearchValue(newValue)
                })
                addSearchHistory(searchValue)
                if (newValue) {
                  pushJobSearchRef.current(type)
                }
              }}
              renderOption={(props, option) => {
                const { type, is_history: isHistory, value, logo_url: logoUrl } = option || {}
                return type === 'company' ? (
                  <li {...props} style={styleleSelect} key={props.id}>
                    <Image src={logoUrl} alt={value} width='22' height='22' />
                    <span style={spanStyle}>{value}</span>
                  </li>
                ) : isHistory ? (
                  <li {...props} style={{ ...styleleSelect, color: '#136fd3' }} key={props.id}>
                    <AccessTimeIcon />
                    <span style={spanStyle}>{value}</span>
                  </li>
                ) : (
                  <li {...props} style={styleleSelect} key={props.id}>
                    <Image src={HistoryIcons} alt='history icons' width='17' height='17' />
                    <span style={spanStyle}>{value || option}</span>
                  </li>
                )
              }}
            />

            {/* search button */}
            <button
              className={styles.searchButton}
              onClick={() => {
                if (!searchValue) return
                addSearchHistory(searchValue)
                pushJobSearchRef.current()
              }}
            >
              {lang.search}
            </button>
          </div>

          {/* preference */}
          <PreferenceSelector
            lang={allLang}
            preferences={preferences}
            preferenceId={preferenceId}
            config={config}
          />

          {/* filters items */}
          <div className={styles.filters}>
            <LocationField1
              className={styles.filterItems}
              height={'30px'}
              locationList={config.location_lists}
              value={filterLocation}
              inputValue={filterLocation?.value ? filterLocation.value : ''}
              width='100%'
              // isClear={true}
              label={lang.location}
              ref={locationRef}
              // defaultValue={filterLocation}
              onChange={(e, value) => {
                setFilterLocation(value)
              }}
              // ref
              sx={{
                '.MuiPaper-root': {
                  width: '300px',
                  '.MuiAutocomplete-paper': {
                    width: '300px'
                  }
                }
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
            <div className={styles.clearButtonWrap}>
              <button
                className={styles.clearButton}
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
                  setFilterLocation(undefined)
                }}
              >
                {resetFilters}{' '}
              </button>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  )
}
export default SearchArea
