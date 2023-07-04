/* eslint-disable react/no-unknown-property */
'use client'
import React, { useState, useCallback, useEffect, useMemo, useRef, useContext } from 'react'
import { flushSync } from 'react-dom'
import { flatMap } from 'lodash-es'
import JobSearchBar from '../../../../../../components/commons/location/search'
import styles from '../../index.module.scss'
import MaterialButton from 'components/MaterialButton'
import Single from 'app/components/commons/select/single'
import Multiple from 'app/components/commons/select/multiple'
import { encode } from '../../../interpreters/encoder'
import { useSuggest } from './hooks'
import theme from 'app/components/commons/theme'
import { ThemeProvider } from '@mui/material/styles'
import JobFunction from 'app/components/commons/jobFunction'
// import { useRouter } from 'next/navigation'
import { toPairs } from 'ramda'
import { Button } from 'app/components/MUIs'
import JobSearchFilters from 'app/components/commons/JobSearchFilters'
import { getCookie } from 'helpers/cookies'
import { useDispatch } from 'react-redux'
import { fetchConfigSuccess } from 'store/actions/config/fetchConfig'
import { useRouter } from 'next/navigation'
import { useFirstRender } from 'helpers/useFirstRender'
import { filter } from 'ramda'
import useUserAgent from 'helpers/useUserAgent'
import { LoadingContext } from 'app/components/providers/loadingProvider'
import { AppDownQRCode, HistoryIcons } from 'images'
import Image from 'next/image'
import classNames from 'classnames'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SearchIcon from '@mui/icons-material/Search'
import { languageContext } from 'app/components/providers/languageProvider'
import LocationMultiSelector from 'app/components/commons/locationMulty'
import { LoginModalContext } from 'app/components/providers/loginModalProvider'
import {MoreFilterIcon} from 'images'

const SearchArea = (props: any) => {
  const { config, searchValues } = props
  const { search } = useContext(languageContext) as any
  const sortOptions = [
    { label: search?.newest, value: '1' },
    { label: search?.relevance, value: '2' },
    { label: search?.highestSalary, value: '3' }
  ]
  const { setShowLogin } = useContext(LoginModalContext)
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
    locations.filter((location) => searchValues?.location?.includes(location.seo_value))
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
      location: location?.map((a) => a['seo_value']),
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
          <div className={styles.searchAreaContent}>
          {/* search */}
          <div className={styles.searchArea}>
            <div className={styles.searchAreaLeft}>
              <LocationMultiSelector
                className={styles.location}
                locationList={config.location_lists}
                value={location}
                // isClear={true}
                label={search.location}
                // defaultValue={location}
                lang={search}
                onChange={setLocation}
                sx={{
                  '> .MuiFormControl-root': {
                    borderRadius: '8px',
                    height: '60px',
                    marginTop: '4px',
                    overflow: 'hidden',
                    '> .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      height: '60px',
                      overflow: 'hidden',
                      marginTop: '4px'
                    }
                  }
                }}
              />
              <div className={styles.searchAreaBox}>
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
                        <Image src={HistoryIcons} alt='history icons' width='17' height='17' />
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
                  Find Now
                </MaterialButton>
              </div>
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
                className={[styles.filterItems, styles.jobFunction]}
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
                endIcon={<Image src={MoreFilterIcon} width={16} height={16} alt='filter' />}
              >
                {search.more} {moreCount ? `(${moreCount})` : ''}{' '}
              </Button>
            </div>
            <div className={styles.filtersRight}>
              <Button
                className={styles.clearButton}
                variant='text'
                onClick={() => {
                  setLocation([])
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
