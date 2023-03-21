'use client'
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { flushSync } from 'react-dom'
import { flatMap } from 'lodash-es'
import LocationField from 'app/components/commons/location'
import JobSearchBar from '../../../../components/commons/location/search'
import styles from './index.module.scss'
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
const sortOptions = [
    { label: 'Newest', value: '1' },
    { label: 'Relevance', value: '2' },
    { label: 'Highest Salary', value: '3' }
]
const SearchArea = (props: any) => {
    const { config, searchValues } = props
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchConfigSuccess(config))
    }), []
    const accessToken = getCookie('accessToken')
    const userCookie = getCookie('user')
    const [page, setPage] = useState(searchValues.page ?? '1')

    const locations = flatMap(config.inputs.location_lists, item => item.locations)
    const [location, setLocation] = useState(locations.find(location => location.seo_value === searchValues.location?.[0]))

    const [salaries, setSelaries] = useState(searchValues?.salary ?? [])
    const salaryOptions = config.filters?.salary_range_filters?.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? []

    const [jobFunctionValue, jobFunctionChange] = useState({
        functionTitles: searchValues?.functionTitles ?? [],
        jobFunctions: searchValues?.jobFunctions ?? [],
        mainFunctions: searchValues?.mainFunctions ?? []
    })
    const [showMore, setShowMore] = useState(false)
    const [sort, setSort] = useState(searchValues?.sort?.[0] ?? '2')

    const [moreData, setMoreData] = useState({
        workExperience: searchValues?.workExperience ?? [],
        qualification: searchValues?.qualification ?? [],
        verifiedCompany: searchValues?.verifiedCompany ?? [],
        companySizes: searchValues?.companySizes ?? [],
        financingStages: searchValues?.financingStages ?? []
    })
    const [jobTypes, setJobtypes] = useState(searchValues?.jobType ?? [])
    const jobTypeList = config?.inputs?.job_types?.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? []
    const [searchValue, setSearchValue] = useState(searchValues.query)
    const [suggestionList, handleSuggestionSearch, addSearchHistory] = useSuggest() as any[]

    const filterParams = useMemo(() => {
        return filter(a => a)({
            query: searchValue,
            salary: salaries,
            location: [location?.['seo_value']].filter(a => a),
            jobType: jobTypes,
            sort: sort,
            page: page,
            ...jobFunctionValue,
            ...moreData
        })
    }, [searchValue, salaries, jobTypes, moreData, location, sort, jobFunctionValue])
    const router = useRouter()
    const result = useMemo(() => {
        return encode(filterParams)
    }, [filterParams])
    const firstRender = useFirstRender()
    const reload = useCallback(() => {
        if (firstRender) {
            return
        }
        const url = new URLSearchParams(toPairs(result.params)).toString();
        router.push('/job-search/' + result.searchQuery + '?' + url, { forceOptimisticNavigation: true })
    }, [result])
    const reloadRef = useRef(reload)
    useEffect(() => {
        reloadRef.current = reload
    }, [reload])
    useEffect(reload, [location, salaries, jobTypes, moreData, sort, jobFunctionValue])
    const moreCount = useMemo(() => {
        return Object.values(moreData).reduce((a1, a2) => a1 + (a2?.length ?? 0), 0)
    }, [moreData])
    return <div>
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
                        onClick={() => {
                            flushSync(() => {
                                setSearchValue(searchValue)
                            })
                            addSearchHistory(searchValue)
                            reloadRef.current()

                        }}
                    > Search </MaterialButton>
                </div>
                <div className={styles.filters}>
                    <Single options={sortOptions}
                        value={sort}
                        onSelect={setSort}
                        className={styles.filterItems}
                        label='Sort by'
                    />
                    <JobFunction
                        // label='Job Function'
                        id='jobFunction'
                        label='Job Function'
                        value={jobFunctionValue}
                        className={[styles.filterItems, styles.jobFunctions]}
                        onChange={jobFunctionChange}
                    />
                    <Multiple
                        label='Salary'
                        value={salaries}
                        options={salaryOptions}
                        className={styles.filterItems}

                        onSelect={setSelaries}
                    />
                    <Multiple
                        label='Job Type'
                        value={jobTypes}
                        options={jobTypeList}
                        className={styles.filterItems}
                        onSelect={setJobtypes}
                        defaultValue={jobTypes}
                    />
                    <Button
                        className={styles.searchButton}
                        variant='outlined'
                        onClick={() => {
                            setShowMore(true)
                        }}
                    > More Filters {moreCount ? `(${moreCount})` : ''} </Button>
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
                    > Reset Filters </Button>
                </div>
            </div>
        </ThemeProvider>

        {showMore && (
            <JobSearchFilters
                urlDefaultValues={moreData}
                isShowFilter={showMore}
                onResetFilter={() => {
                    console.log('onReset')
                    setMoreData({} as any)
                }}
                keyword={searchValues.query}
                config={config}
                handleShowFilter={() => {
                    console.log('onClose')
                    setShowMore(false)
                }}
                moreFilterReset={false}
                isShowingEmailAlert={accessToken && !userCookie?.is_email_verify}

                setClientDefaultValues={data => {
                    console.log('dataChanged', data)
                    setMoreData(data)
                }} />
        )}
    </div>
}
export default SearchArea