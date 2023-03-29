/* eslint-disable react/no-unknown-property */
'use client'
import React, { useState, useCallback, useEffect, useMemo, useRef, useContext } from 'react'
import { flushSync } from 'react-dom'
import { flatMap } from 'lodash-es'
import LocationField from 'app/components/commons/location'
import JobSearchBar from '../../../components/commons/location/search'
import styles from './index.pc.module.scss'
import MaterialButton from 'components/MaterialButton'
import Multiple from 'app/components/commons/select/multiple'
import { encode } from 'app/jobs-hiring/interpreters/encoder'
import { useSuggest } from './hooks'
import theme from 'app/components/commons/theme'
import { ThemeProvider } from '@mui/material/styles'
// import { useRouter } from 'next/navigation'
import { toPairs } from 'ramda'
import { Button } from 'app/components/MUIs'
import { useDispatch } from 'react-redux'
import { fetchConfigSuccess } from 'store/actions/config/fetchConfig'
import { useFirstRender } from 'helpers/useFirstRender'
import { filter } from 'ramda'
import { LoadingContext } from 'app/components/providers/loadingProvider'
import { useSearchParams } from 'next/navigation'
import PreferenceSelector from '../preferenceSelector'
const SearchArea = (props: any) => {
  const { config, preferences } = props
  const dispatch = useDispatch()
  const searchParams: any = useSearchParams() ?? {}
  useEffect(() => {
    dispatch(fetchConfigSuccess(config))
  }),
    []
  const [page, setPage] = useState(searchParams?.page ?? '1')
  const { push } = useContext(LoadingContext)
  const locations = flatMap(config.inputs.location_lists, (item) => item.locations)
  const [location, setLocation] = useState(
    locations.find((location) => location.seo_value === searchParams.location?.[0])
  )
  const [qualification, setQualification] = useState(searchParams.qualification ?? [])
  const qualificationList = config.filters.educations.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? []
  const [workExperience, setWorkExperience] = useState(searchParams.workExperience ?? [])
  const workExperienceList = config.inputs.xp_lvls.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? []
  const [industry, setIndustry] = useState(searchParams.industry ?? [])
  const industryList = config.inputs.industry_lists.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? []
  const [verifiedCompany, setVerifiedCompany] = useState(searchParams.verifiedCompany ? [searchParams.verifiedCompany] : [])
  const [salaries, setSelaries] = useState(searchParams?.salary ?? [])
  const salaryOptions =
    config.filters?.salary_range_filters?.map?.((item) => ({
      value: item?.['seo-value'],
      label: item.value
    })) ?? []


  const [sort, setSort] = useState(searchParams?.sort?.[0] ?? '2')

  const [moreData, setMoreData] = useState(
    filter((a) => a)({
      workExperience: searchParams?.workExperience ?? null,
      qualification: searchParams?.qualification ?? null,
      verifiedCompany: searchParams?.verifiedCompany ?? null,
      companySizes: searchParams?.companySizes ?? null,
      financingStages: searchParams?.financingStages ?? null,
      industry: searchParams?.industry ?? null
    })
  )
  const [jobTypes, setJobtypes] = useState(searchParams?.jobType ?? [])
  const jobTypeList =
    config?.inputs?.job_types?.map?.((item) => ({
      value: item?.['seo-value'],
      label: item.value
    })) ?? []
  const [searchValue, setSearchValue] = useState(searchParams.query)
  const [suggestionList, handleSuggestionSearch, addSearchHistory, searchLoading] = useSuggest() as any[]

  const filterParams = useMemo(() => {
    return filter((a) => a)({
      query: searchValue?.trim?.(),
      salary: salaries,
      location: [location?.['seo_value']].filter((a) => a),
      jobType: jobTypes,
      sort: sort,
      page: page,
    })
  }, [searchValue, salaries, jobTypes, moreData, location, sort])
  console.log({ filterParams })
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
  useEffect(reload, [location, salaries, jobTypes, moreData, sort])

  return (
    <div>
      <ThemeProvider theme={theme}>
        <div className={styles.container}>
          <div className={styles.searchArea}>
            <LocationField
              className={styles.location}
              locationList={config.inputs.location_lists}
              value={location}
              isClear={true}
              defaultValue={location}
              onChange={(e, value) => {
                setLocation(value)
              }}
            />
            <JobSearchBar
              id='search'
              label='Search for job title or company name'
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
                  reloadRef.current()
                }
              }}
              options={suggestionList}
              onSelect={(value: any) => {
                flushSync(() => {
                  setSearchValue(value)
                })
                addSearchHistory(value)
                reloadRef.current()
              }}
            />
            <MaterialButton
              className={styles.searchButton}
              capitalize
              onClick={() => {
                flushSync(() => {
                  setSearchValue(searchValue)
                })
                addSearchHistory(searchValue)
                reloadRef.current()
              }}
            >
              {' '}
              Search{' '}
            </MaterialButton>
          </div>
          <PreferenceSelector preferences={preferences} />
          <div className={styles.filters}>
            <Multiple
              label='Qualification'
              value={qualification}
              options={qualificationList}
              className={styles.filterItems}
              onSelect={setQualification}
            />
            <Multiple
              label='Salary'
              value={salaries}
              options={salaryOptions}
              className={styles.filterItems}
              onSelect={setSelaries}
            />
            <Multiple
              label='Experience'
              value={workExperience}
              options={workExperienceList}
              className={styles.filterItems}
              onSelect={setWorkExperience}
            />
            <Multiple
              label='Industry'
              value={industry}
              options={industryList}
              className={styles.filterItems}
              onSelect={setIndustry}
            />
            <Multiple
              label='Job Type'
              value={jobTypes}
              options={jobTypeList}
              className={styles.filterItems}
              onSelect={setJobtypes}
              defaultValue={jobTypes}
            />
            <Multiple
              label='Company'
              value={verifiedCompany}
              options={[
                {
                  value: 'verified-companies',
                  label: 'View verified companies'
                }
              ]}
              className={styles.filterItems}
              onSelect={setVerifiedCompany}
              defaultValue={verifiedCompany}
            />
            <Button
              className={styles.clearButton}
              variant='text'
              onClick={() => {
                setLocation(null)
                setSearchValue('')
                setSort('1')
                setJobtypes([])
                setSelaries([])
                setMoreData({} as any)
                setPage('1')
              }}
            >
              Reset Filters{' '}
            </Button>
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}
export default SearchArea
