'use client'
import React, { useState, useContext, useEffect, useMemo } from 'react'
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
import { LocationContext } from '../../../../components/providers/locationProvier'
import JobSearchFilters from 'app/components/commons/JobSearchFilters'
import { getCookie } from 'helpers/cookies'
import { useDispatch } from 'react-redux'
import { fetchConfigSuccess } from 'store/actions/config/fetchConfig'
import { useRouter } from 'next/navigation'
const sortOptions = [
    { label: 'Newest', value: '1' },
    { label: 'Relevance', value: '2' },
    { label: 'Highest Salary', value: '3' }
]
const SearchArea = (props: any) => {
    const { config, searchValues } = props
    console.log({ props })
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchConfigSuccess(config))
    }), []
    const accessToken = getCookie('accessToken')
    const userCookie = getCookie('user')

    const locations = flatMap(config.inputs.location_lists, item => item.locations)
    const [location, setLocation] = useState(locations.find(location => location.seo_value === searchValues.location?.[0]))

    const [salaries, setSelaries] = useState(searchValues?.salary ?? [])
    const salaryOptions = config.filters?.salary_range_filters?.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? []

    const [jobFunctionValue, jobFunctionChange] = useState({
        functionTitles: searchValues?.functionTitles ?? [],
        jobFunctions: searchValues?.jobFunctions ?? [],
        mainFunctions: searchValues?.mainFunctions ?? []
    })
    console.log({ jobFunctionValue })
    const [showMore, setShowMore] = useState(false)
    const [sort, setSort] = useState(searchValues?.sort?.[0] ?? '1')
    // {
    //     "workExperience": [
    //         "1-yr-exp",
    //         "3-5-yrs-exp"
    //     ],
    //     "qualification": [
    //         "edu-not-required"
    //     ],
    //     "verifiedCompany": [
    //         "verified-companies"
    //     ]
    // }
    const [moreData, setMoreData] = useState({
        workExperience: searchValues?.workExperience ?? [],
        qualification: searchValues?.qualification ?? [],
        verifiedCompany: searchValues?.verifiedCompany ?? []
    })
    const [jobTypes, setJobtypes] = useState(searchValues?.jobType ?? [])
    const jobTypeList = config?.inputs?.job_types?.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? []
    // const router = useRouter()
    const [searchValue, setSearchValue] = useState(searchValues.query)
    const [suggestionList, handleSuggestionSearch, addSearchHistory] = useSuggest() as any[]

    const filterParams = useMemo(() => {
        return {
            query: searchValue,
            salary: salaries,
            location: [location?.['seo_value']].filter(a => a),
            jobType: jobTypes,
            sort: sort,
            ...moreData
        }
    }, [searchValue, salaries, moreData, location, sort, jobFunctionValue])
    const router = useRouter()
    useEffect(() => {
        const url = URL.createObjectURL(filterParams);
        console.log({ url })
        // router.push(filterParams)
    }, [filterParams])
    console.log({ filterParams })
    const result = encode(filterParams)
    console.log({ jobFunctionValue, moreData, result, location })
    return <div style={{ height: 2080 }}>
        <ThemeProvider theme={theme}>
            <div className={styles.container}>
                <div className={styles.searchArea}>
                    <LocationField
                        className={styles.location}
                        locationList={config.inputs.location_lists}
                        value={location}
                        isClear={true}
                        defaultValue={location}
                        onChange={(e, value) => setLocation(value)}
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
                                setSearchValue((e.target as HTMLInputElement).value)
                                addSearchHistory((e.target as HTMLInputElement).value)
                            }
                        }}
                        options={suggestionList}
                        onSelect={(value: any) => {
                            setSearchValue(value)
                            addSearchHistory(value)
                        }}
                    />
                    <MaterialButton
                        className={styles.searchButton}
                        onClick={() => {
                            addSearchHistory(searchValue)
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
                    <MaterialButton
                        className={styles.searchButton}
                        onClick={() => {
                            setShowMore(true)
                        }}
                    > More Filters </MaterialButton>
                </div>
            </div>
        </ThemeProvider>

        {showMore && (
            <JobSearchFilters
                urlDefaultValues={moreData}
                isShowFilter={showMore}
                onResetFilter={() => {
                    console.log('onReset')
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