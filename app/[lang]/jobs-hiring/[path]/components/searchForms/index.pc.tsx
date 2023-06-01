/* eslint-disable react/no-unknown-property */
'use client'
import React, { useState, useCallback, useEffect, useMemo, useRef, useContext } from 'react'
import { flushSync } from 'react-dom'
import { flatMap } from 'lodash-es'
import MaterialLocationField from 'components/MaterialLocationField'
import JobSearchBar from '../../../../components/commons/location/search'
import styles from '../../index.module.scss'
import MaterialButton from 'components/MaterialButton'
import Single from 'app/[lang]/components/commons/select/single'
import Multiple from 'app/[lang]/components/commons/select/multiple'
import { encode } from '../../../interpreters/encoder'
import { useSuggest } from './hooks'
import theme from 'app/[lang]/components/commons/theme'
import { ThemeProvider } from '@mui/material/styles'
import JobFunction from 'app/[lang]/components/commons/jobFunction'
// import { useRouter } from 'next/navigation'
import { toPairs } from 'ramda'
import { Button } from 'app/[lang]/components/MUIs'
import JobSearchFilters from 'app/[lang]/components/commons/JobSearchFilters'
import { getCookie } from 'helpers/cookies'
import { useDispatch } from 'react-redux'
import { fetchConfigSuccess } from 'store/actions/config/fetchConfig'
import { useRouter } from 'next/navigation'
import { useFirstRender } from 'helpers/useFirstRender'
import { filter } from 'ramda'
import useUserAgent from 'helpers/useUserAgent'
import { LoadingContext } from 'app/[lang]/components/providers/loadingProvider'
import { AppDownQRCode } from 'images'
import Image from 'next/image'
import classNames from 'classnames'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SearchIcon from '@mui/icons-material/Search'
import { languageContext } from 'app/[lang]/components/providers/languageProvider'
import LocationMultiSelector from 'app/[lang]/components/commons/locationMulty'

const SearchArea = (props: any) => {
  const { config, searchValues } = props
  const { search } = useContext(languageContext) as any
  const sortOptions = [
    { label: search?.newest, value: '1' },
    { label: search?.relevance, value: '2' },
    { label: search?.highestSalary, value: '3' }
  ]
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchConfigSuccess(config))
  }, [])
  const accessToken = getCookie('accessToken')
  const userCookie = getCookie('user')
  const [page, setPage] = useState(searchValues.page ?? '1')
  const { push } = useContext(LoadingContext)
  const locations = flatMap(config.location_lists, (item) => item.locations)
  const [location, setLocation] = useState(
    locations.find((location) => location.seo_value === searchValues.location?.[0])
  )
  const [isFixed, setIsfixed] = useState(false)
  useEffect(() => {
    const listener = () => {
      const scrollTop = document.documentElement.scrollTop
      setIsfixed(scrollTop > 58)
    }
    window.addEventListener('scroll', listener, true)
    return window.removeEventListener('scroll', listener)
  }, [])

  const [salaries, setSelaries] = useState(searchValues?.salary ?? [])
  const salaryOptions =
    config?.salary_range_filters?.map?.((item) => ({
      value: item?.['seo-value'],
      label: item.value
    })) ?? []

  const [jobFunctionValue, jobFunctionChange] = useState({
    functionTitles: searchValues?.functionTitles ?? [],
    jobFunctions: searchValues?.jobFunctions ?? [],
    mainFunctions: searchValues?.mainFunctions ?? []
  })
  const [showMore, setShowMore] = useState(false)
  const [sort, setSort] = useState(searchValues?.sort?.[0] ?? '2')

  const [moreData, setMoreData] = useState(
    filter((a) => a)({
      workExperience: searchValues?.workExperience ?? null,
      qualification: searchValues?.qualification ?? null,
      verifiedCompany: searchValues?.verifiedCompany ?? null,
      companySizes: searchValues?.companySizes ?? null,
      financingStages: searchValues?.financingStages ?? null,
      industry: searchValues?.industry ?? null
    })
  )
  const [jobTypes, setJobtypes] = useState(searchValues?.jobType ?? [])
  const jobTypeList =
    config?.job_types?.map?.((item) => ({
      value: item?.['seo-value'],
      label: item.value
    })) ?? []
  const [searchValue, setSearchValue] = useState(searchValues.query)
  const [queryFields, setQueryFields] = useState(searchValues.queryFields)
  const [suggestionList, handleSuggestionSearch, addSearchHistory, searchLoading] =
    useSuggest() as any[]

  const filterParams = useMemo(() => {
    return filter((a) => a)({
      query: searchValue?.trim?.(),
      queryFields,
      salary: salaries,
      location: [location?.['seo_value']].filter((a) => a),
      jobType: jobTypes,
      sort: sort,
      page: page,
      ...jobFunctionValue,
      ...moreData
    })
  }, [searchValue, salaries, jobTypes, moreData, location, sort, jobFunctionValue, queryFields])
  const router = useRouter()
  const result = useMemo(() => {
    return encode(filterParams)
  }, [filterParams])
  const firstRender = useFirstRender()
  const reload = useCallback(() => {
    if (firstRender) {
      return
    }
    const url = new URLSearchParams(toPairs(result.params)).toString()
    push('/jobs-hiring/' + result.searchQuery + '?' + url)
  }, [result, push])
  const reloadRef = useRef(reload)
  useEffect(() => {
    reloadRef.current = reload
  }, [reload])
  useEffect(reload, [location, salaries, jobTypes, moreData, sort, jobFunctionValue, queryFields])

  const moreCount = useMemo(() => {
    return Object.values(moreData).reduce((a1, a2: any) => a1 + (a2?.length ?? 0), 0)
  }, [moreData])
  const userAgent = useUserAgent()
  const styleleSelect = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  }
  return (
    <div className={styles.searchWrap}>
      <ThemeProvider theme={theme}>
        <div
          className={classNames({
            [styles.searchForm]: true,
            [styles.isFixed]: isFixed
          })}
        >
          {/* search */}
          <div className={styles.searchArea}>
            <div className={styles.searchAreaLeft}>
              <LocationMultiSelector
                className={styles.location}
                locationList={config.location_lists}
                value={[location]}
                // isClear={true}
                label={search.location}
                // defaultValue={location}
                onChange={(e, value) => {
                  console.log({onLocationChange:value,e})
                  // setLocation(value)
                }}
                sx={{
                  '> .MuiFormControl-root': {
                    '> .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      height: '40px',
                      marginTop: '4px'
                    }
                  }
                }}
              />
              <JobSearchBar
                id='search'
                label={search.title}
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
                      setSearchValue((e.target as HTMLInputElement).value)
                    })
                    addSearchHistory((e.target as HTMLInputElement).value)
                    setQueryFields('')
                    reloadRef.current()
                  }
                }}
                renderOption={(props, option) => {
                  const { type, is_history: isHistory, value, logo_url: logoUrl } = option || {}
                  return type === 'company' ? (
                    <li {...props} style={styleleSelect}>
                      <Image src={logoUrl} alt={value} width='22' height='22' />
                      <span style={{ paddingLeft: '10px' }}>{value}</span>
                    </li>
                  ) : isHistory ? (
                    <li {...props} style={{ ...styleleSelect, color: '#136fd3' }}>
                      <AccessTimeIcon />
                      <span style={{ paddingLeft: '10px' }}>{value}</span>
                    </li>
                  ) : (
                    <li {...props} style={styleleSelect}>
                      <SearchIcon />
                      <span style={{ paddingLeft: '10px' }}>{value || option}</span>
                    </li>
                  )
                }}
                options={suggestionList}
                onSelect={(value: any) => {
                  const newValue = value?.value || value || ''
                  setQueryFields(value?.type || '')
                  flushSync(() => {
                    setSearchValue(newValue)
                  })
                  addSearchHistory(newValue)
                  reloadRef.current()
                }}
              />
              <MaterialButton
                className={styles.searchButton}
                variant='contained'
                capitalize
                onClick={() => {
                  flushSync(() => {
                    setSearchValue(searchValue)
                  })
                  addSearchHistory(searchValue)
                  reloadRef.current()
                  setQueryFields('')
                }}
              >
                {' '}
                {search.searchBtn}{' '}
              </MaterialButton>
            </div>
            <div className={styles.searchAreaRight}>
              {accessToken ? (
                <div
                  className={styles.downloadApp}
                  onClick={() => {
                    // app store
                    window.location.href = userAgent.ua.isMac
                      ? process.env.APP_STORE_LINK
                      : process.env.GOOGLE_PLAY_STORE_LINK
                  }}
                >
                  <svg
                    width='32'
                    height='32'
                    viewBox='0 0 32 32'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M22.6667 2.66675H9.33341C7.86066 2.66675 6.66675 3.86066 6.66675 5.33341V26.6667C6.66675 28.1395 7.86066 29.3334 9.33341 29.3334H22.6667C24.1395 29.3334 25.3334 28.1395 25.3334 26.6667V5.33341C25.3334 3.86066 24.1395 2.66675 22.6667 2.66675Z'
                      stroke='#136FD3'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      className={styles.downloadApp_phoneIconBorderPath}
                    />
                    <path
                      d='M16 24H16.0133'
                      stroke='#136FD3'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      className={styles.downloadApp_phoneIconHomePath}
                    />
                  </svg>
                  <div className={styles.text}> {search.downloadAPP} </div>
                  <div className={styles.popver}>
                    <Image src={AppDownQRCode} alt='app down' width='104' height='104' />
                    <p>
                    {search.chatDirectly} 
                      <br />
                    {search.withBoss}
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  className={styles.loginButton}
                  variant='outlined'
                  onClick={() => {
                    router.push('/get-started', { forceOptimisticNavigation: true })
                  }}
                >
                  <svg
                    width='21'
                    height='20'
                    viewBox='0 0 21 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M7.84375 13.2812L11.125 10L7.84375 6.71875'
                      stroke='#136FD3'
                      stroke-width='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M2.375 10H11.125'
                      stroke='#136FD3'
                      stroke-width='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M11.125 3.125H15.5C15.6658 3.125 15.8247 3.19085 15.9419 3.30806C16.0592 3.42527 16.125 3.58424 16.125 3.75V16.25C16.125 16.4158 16.0592 16.5747 15.9419 16.6919C15.8247 16.8092 15.6658 16.875 15.5 16.875H11.125'
                      stroke='#136FD3'
                      stroke-width='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <span>{search.login}</span>
                </Button>
              )}
            </div>
          </div>
          {/* filter */}
          <div className={styles.filters}>
            <div className={styles.filtersLeft}>
              <Single
                options={sortOptions}
                value={sort}
                onSelect={setSort}
                className={styles.filterItems}
                label='Sort by'
              />
              <JobFunction
                // label='Job Function'
                id='jobFunction'
                label={search.function}
                value={jobFunctionValue}
                className={[styles.filterItems]}
                onChange={jobFunctionChange}
              />
              <Multiple
                label={search.salary}
                value={salaries}
                options={salaryOptions}
                className={classNames([styles.filterItems, styles.jobSalary])}
                onSelect={setSelaries}
              />
              <Multiple
                label={search.type}
                value={jobTypes}
                options={jobTypeList}
                className={styles.filterItems}
                onSelect={setJobtypes}
                defaultValue={jobTypes}
              />
              <Button
                className={styles.moreButton}
                variant='outlined'
                onClick={() => {
                  setShowMore(true)
                }}
              >
                {' '}
                {search.more} {moreCount ? `(${moreCount})` : ''}{' '}
              </Button>
            </div>
            <div className={styles.filtersRight}>
              <Button
                className={styles.clearButton}
                variant='text'
                onClick={() => {
                  setLocation(null)
                  setSearchValue('')
                  setSort('1')
                  jobFunctionChange({
                    jobFunctions: [],
                    mainFunctions: [],
                    functionTitles: []
                  })
                  setJobtypes([])
                  setSelaries([])
                  setMoreData({} as any)
                  setPage('1')
                }}
              >
                {search.reset}{' '}
              </Button>
            </div>
          </div>
        </div>
      </ThemeProvider>

      {showMore && (
        <JobSearchFilters
          urlDefaultValues={moreData}
          isShowFilter={showMore}
          onResetFilter={() => {
            setMoreData({} as any)
          }}
          keyword={searchValues.query}
          config={config}
          handleShowFilter={() => {
            setShowMore(false)
          }}
          moreFilterReset={false}
          isShowingEmailAlert={accessToken && !userCookie?.is_email_verify}
          setClientDefaultValues={(data) => {
            setMoreData(data)
          }}
        />
      )}
    </div>
  )
}
export default SearchArea
