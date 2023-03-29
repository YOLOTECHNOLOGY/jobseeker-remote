/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
'use client'
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { flushSync } from 'react-dom'
import { flatMap } from 'lodash-es'
import LocationField from 'app/components/commons/location'
import JobSearchBar from '../../../components/commons/location/search'
import styles from './index.mobile.module.scss'
import Single from 'app/components/mobile/select/single'
import Multiple from 'app/components/mobile/select/multiple'
import MultyGroup from 'app/components/mobile/select/groupedMulty'
import { encode } from 'app/jobs-hiring/interpreters/encoder'
import { useSuggest } from './hooks'
import theme from 'app/components/mobile/theme'
import { ThemeProvider } from '@mui/material/styles'
import JobFunction from 'app/components/commons/jobFunction'
// import { useRouter } from 'next/navigation'
import { toPairs } from 'ramda'
import { useDispatch } from 'react-redux'
import { fetchConfigSuccess } from 'store/actions/config/fetchConfig'
import { useRouter } from 'next/navigation'
import { useFirstRender } from 'helpers/useFirstRender'
import { filter } from 'ramda'
import { useSearchParams } from 'next/navigation'
const SearchArea = (props: any) => {
    const { config } = props
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchConfigSuccess(config))
    }), []
    const searchParams:any = useSearchParams() ?? {}
    const [page, setPage] = useState(searchParams.page ?? '1')

    const locations = flatMap(config.inputs.location_lists, item => item.locations)
    const [location, setLocation] = useState(locations.find(location => location.seo_value === searchParams.location?.[0]))
    const [industry, setIndustry] = useState(searchParams.industry ?? [])
    const [qualification,setQualification] = useState(searchParams.qualification) 

    const [jobFunctionValue, jobFunctionChange] = useState({
        functionTitles: searchParams?.functionTitles ?? [],
        jobFunctions: searchParams?.jobFunctions ?? [],
        mainFunctions: searchParams?.mainFunctions ?? []
    })
   
    const [sort, setSort] = useState(searchParams?.sort?.[0] ?? '2')

    const [moreData, setMoreData] = useState(filter(a => a)({
        workExperience: searchParams?.workExperience ?? null,
        qualification: searchParams?.qualification ?? null,
        salaries: searchParams?.salary ?? null,
        jobTypes: searchParams?.jobType ?? null,
        verifiedCompany: searchParams?.verifiedCompany ?? null,
        companySizes: searchParams?.companySizes ?? null,
        financingStages: searchParams?.financingStages ?? null
    }))
    const [searchValue, setSearchValue] = useState(searchParams.query)

    const filterParams = useMemo(() => {
        return filter(a => a)({
            query: searchValue,
            industry: industry.length ? industry : null,
            location: [location?.['seo_value']].filter(a => a),
            sort: sort,
            page: page,
            ...jobFunctionValue,
            ...moreData
        })
    }, [searchValue, industry, moreData, location, sort, jobFunctionValue])
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
        router.push('/jobs-hiring/' + result.searchQuery + '?' + url, { forceOptimisticNavigation: false })
    }, [result])
    const reloadRef = useRef(reload)
    useEffect(() => {
        reloadRef.current = reload
    }, [reload])
    useEffect(reload, [location, industry, moreData, sort, jobFunctionValue])
    return <div>
        <ThemeProvider theme={theme}>
            <div className={styles.container}>
                
            </div>
        </ThemeProvider>
    </div>
}
export default SearchArea