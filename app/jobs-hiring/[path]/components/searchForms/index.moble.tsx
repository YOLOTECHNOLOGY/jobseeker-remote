/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
'use client'
import React, { useState, useCallback, useEffect, useMemo, useRef, useContext } from 'react'
import { flushSync } from 'react-dom'
import { flatMap } from 'lodash-es'
import LocationField from 'app/components/mobile/location'
import JobSearchBar from '../../../../components/commons/location/search'
import styles from './index.mobile.module.scss'
import Single from 'app/components/mobile/select/single'
import Multiple from 'app/components/mobile/select/multiple'
import MultyGroup from 'app/components/mobile/select/groupedMulty'
import { encode } from '../../../interpreters/encoder'
import { useSuggest } from './hooks'
import theme from 'app/components/mobile/theme'
import { ThemeProvider } from '@mui/material/styles'
import JobFunction from 'app/components/commons/jobFunction'
// import { useRouter } from 'next/navigation'
import { toPairs } from 'ramda'
import { useDispatch } from 'react-redux'
import { fetchConfigSuccess } from 'store/actions/config/fetchConfig'
import { useFirstRender } from 'helpers/useFirstRender'
import { filter } from 'ramda'
import { LoadingContext } from 'app/components/providers/loadingProvider'
import Image from 'next/image'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
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
    const [page, setPage] = useState(searchValues.page ?? '1')

    const locations = flatMap(config.location_lists, item => item.locations)
    const [location, setLocation] = useState(locations.find(location => location.seo_value === searchValues.location?.[0]))
    const [industry, setIndustry] = useState(searchValues.industry ?? [])
    const industryList = config.industry_lists.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? []
    const [queryFields, setQueryFields] = useState(searchValues.queryFields)
    const [jobFunctionValue, jobFunctionChange] = useState({
        functionTitles: searchValues?.functionTitles ?? [],
        jobFunctions: searchValues?.jobFunctions ?? [],
        mainFunctions: searchValues?.mainFunctions ?? []
    })
    const moreDataOptions = useMemo(() => {
        const workExperience = config.xp_lvls.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? []
        const qualification = config.educations.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? []
        const salary = config?.salary_range_filters?.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? []
        const jobType = config.job_types.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? []
        const companySizes = config.company_sizes.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? []
        const financingStages = config.company_financing_stage_lists?.map?.(item => ({ value: item?.key, label: item.value })) ?? []
        return {
            workExperience, qualification, salary, jobType, companySizes, financingStages
        }
    }, [config])
    const labels = ['Work Experience', 'Qualification', 'Salary', 'Job Type', 'Company Sizes', 'Financing Stages']
    const [sort, setSort] = useState(searchValues?.sort?.[0] ?? '2')

    const [moreData, setMoreData] = useState(filter(a => a)({
        workExperience: searchValues?.workExperience ?? null,
        qualification: searchValues?.qualification ?? null,
        salaries: searchValues?.salary ?? null,
        jobTypes: searchValues?.jobType ?? null,
        verifiedCompany: searchValues?.verifiedCompany ?? null,
        companySizes: searchValues?.companySizes ?? null,
        financingStages: searchValues?.financingStages ?? null
    }))
    const [searchValue, setSearchValue] = useState(searchValues.query)
    const [suggestionList, handleSuggestionSearch, addSearchHistory] = useSuggest() as any[]

    const filterParams = useMemo(() => {
        return filter(a => a)({
            query: searchValue,
            queryFields,
            industry: industry.length ? industry : null,
            location: [location?.['seo_value']].filter(a => a),
            sort: sort,
            page: page,
            ...jobFunctionValue,
            ...moreData
        })
    }, [searchValue, industry, moreData, location, sort, jobFunctionValue,queryFields])
    const result = useMemo(() => {
        return encode(filterParams)
    }, [filterParams])
    const firstRender = useFirstRender()
    const { push } = useContext(LoadingContext)
    const reload = useCallback(() => {
        if (firstRender) {
            return
        }
        const url = new URLSearchParams(toPairs(result.params)).toString();
        push('/jobs-hiring/' + result.searchQuery + '?' + url)
    }, [result])
    const reloadRef = useRef(reload)
    useEffect(() => {
        reloadRef.current = reload
    }, [reload])
    useEffect(reload, [location, industry, moreData, sort, jobFunctionValue,queryFields])
    const styleleSelect = {
        display:'flex',
        alignItems:'center',
        cursor: 'pointer'
      }
    return <div>
        <ThemeProvider theme={theme}>
            <div className={styles.container}>
                <div className={styles.searchArea}>
                    <LocationField
                        className={styles.location}
                        locationList={config.location_lists}
                        value={location}
                        disableClearable={true}
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
                        renderOption={(props, option) => {
                            const {type, is_history:isHistory,value ,logo_url:logoUrl} = option || {}
                            return (
                                type === 'company' ?
                                 <li {...props} style={styleleSelect}>
                                     <Image src={logoUrl} alt={value} width='22' height='22'/>
                                     <span style={{paddingLeft:'10px'}}>{value}</span>
                                 </li> 
                                 : isHistory ? (
                                <li {...props} style={{...styleleSelect,color:'#136fd3'}}>
                                    <AccessTimeIcon/>
                                    <span style={{paddingLeft:'10px'}}>{value}</span>
                                </li>
                                ) : 
                                 <li {...props} style={styleleSelect}> 
                                   <SearchIcon/> 
                                   <span style={{paddingLeft:'10px'}}>{value || option}</span>
                                </li>
                               
                            )
                        }}
                        searchFn={handleSuggestionSearch as any}
                        updateSearchValue={setSearchValue}
                        enterKeyHint='search'

                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                setQueryFields('')
                                flushSync(() => {
                                    setSearchValue((e.target as HTMLInputElement).value)
                                })
                                addSearchHistory?.((e.target as HTMLInputElement).value);

                                ((e.target ?? {}) as any)?.blur?.()
                                reloadRef?.current?.()
                            }
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
                </div>
                <div className={styles.filters}>
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
                        label='Job Function'
                        value={jobFunctionValue}
                        className={[styles.filterItems, styles.jobFunctions]}
                        onChange={jobFunctionChange}
                    />
                    <Multiple
                        label='Industry'
                        value={industry}
                        options={industryList}
                        className={styles.filterItems}

                        onSelect={setIndustry}
                    />
                    <MultyGroup
                        label='More Filters'
                        value={moreData}
                        labels={labels}
                        options={moreDataOptions}
                        className={styles.filterItems}
                        onSelect={setMoreData}
                        defaultValue={moreData}
                    />
                </div>
            </div>
        </ThemeProvider>
    </div>
}
export default SearchArea