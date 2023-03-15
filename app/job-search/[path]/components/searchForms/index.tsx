'use client'
import React, { useState, useContext, useEffect, useMemo } from 'react'
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
const sortOptions = [
    { label: 'Newest', value: '1' },
    { label: 'Relevance', value: '2' },
    { label: 'Highest Salary', value: '3' }
]
const SearchArea = (props: any) => {
    const { config, searchValues: { params, searchParams } } = props
    console.log({ props })
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchConfigSuccess(config))
    }), []
    const accessToken = getCookie('accessToken')
    const userCookie = getCookie('user')
    const { location, setLocation } = useContext(LocationContext)
    const [salaries, setSelaries] = useState([])
    const salaryOptions = config.filters?.salary_range_filters ?? []
    const [jobFunctionValue, jobFunctionChange] = useState()
    const [showMore, setShowMore] = useState(false)
    const [sort, setSort] = useState()
    const [moreData, setMoreData] = useState({})
    const [jobTypes,setJobtypes] = useState([])
    const jobTypeList = config?.inputs?.job_types ?? []
    // const router = useRouter()
    const [searchValue, setSearchValue] = useState('')
    const [suggestionList, handleSuggestionSearch, addSearchHistory] = useSuggest() as any[]

    const filterParams = useMemo(() => {
        return {
            query: searchValue,
            salary: salaries,
            location: [location['seo_value']],
            sort: sort,
            ...moreData
        }
    }, [searchValue, salaries, moreData, location, sort, jobFunctionValue])
    console.log({ filterParams })
    const result = encode(filterParams)
    console.log({  jobFunctionValue, moreData, result, location })
    return <div>
        <ThemeProvider theme={theme}>
            <div className={styles.searchArea}>
                <LocationField
                    className={styles.location}
                    locationList={config.inputs.location_lists}
                    value={location}
                    isClear={true}
                    defaultValue={location}
                    // disableClearable
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
                    className={styles.searchButton} disabled={!searchValue}
                    onClick={() => {
                        addSearchHistory(searchValue)
                    }}
                > Search </MaterialButton>
            </div>
            <div style={{ width: '300px' }}>
                <Single options={sortOptions}
                    value={sort}
                    onSelect={setSort}
                    style={{ height: 30, width: 200 }}
                    label='Sort by'
                />
                <JobFunction
                    // label='Job Function'
                    id='jobFunction'
                    label='Job Function'
                    value={jobFunctionValue}
                    onChange={jobFunctionChange}
                />
                <Multiple
                    label='Salary'
                    value={salaries}
                    options={salaryOptions}
                    onSelect={setSelaries}
                />
                 <Multiple
                    label='Job Type'
                    value={jobTypes}
                    options={jobTypeList}
                    onSelect={setSelaries}
                />
                <MaterialButton
                    className={styles.searchButton}
                    onClick={() => {
                        setShowMore(true)
                    }}
                > More Filters </MaterialButton>
            </div>
        </ThemeProvider>
        {showMore && (
            <JobSearchFilters
                urlDefaultValues={moreData}
                isShowFilter={showMore}
                onResetFilter={() => {
                    console.log('onReset')
                }}
                keyword={params.path}
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