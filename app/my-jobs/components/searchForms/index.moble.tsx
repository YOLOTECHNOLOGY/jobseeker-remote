/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
'use client'
import React, { useState, useCallback, useEffect, useMemo, useRef, useContext } from 'react'
import styles from './index.mobile.module.scss'
import Single from 'app/components/mobile/select/single'
import Grouped from 'app/components/mobile/select/groupedMulty'
import theme from 'app/components/mobile/theme'
import { ThemeProvider } from '@mui/material/styles'
import Image from 'next/image'
import { Plus, Search } from 'images'
import { useDispatch } from 'react-redux'
import { fetchConfigSuccess } from 'store/actions/config/fetchConfig'
import { useRouter } from 'next/navigation'
import { useFirstRender } from 'helpers/useFirstRender'
import { filter, toPairs, pipe, is, split, map } from 'ramda'
import { LoadingContext } from 'app/components/providers/loadingProvider'
const sortOptions = [
    { label: 'Newest', value: '1' },
    { label: 'Relevance', value: '2' },
    { label: 'Highest Salary', value: '3' }
]
const SearchArea = (props: any) => {
    // console.log({ props })
    const { config, preferences, preferenceId, searchParams } = props
    const preferenceOptions = useMemo(() => {
        return preferences.map(preference => ({ value: preference.id, label: preference.job_title }))
    }, [preferences])
    const [selectedPreferenceId, setSelectedPreferenceId] = useState(+preferenceId)
    // useEffect(() => {
    //     if(preferenceId){
    //         setSelectedPreferenceId(+preferenceId)
    //     }
    // }, [preferenceId])
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchConfigSuccess(config))
    }), []
    const moreOptions = useMemo(() => {
        return {
            qualification: config.educations.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? [],
            workExperience: config.xp_lvls.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? [],
            industry: config.industry_lists.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? [],
            salary: config?.salary_range_filters?.map?.((item) => ({
                value: item?.['seo-value'],
                label: item.value
            })) ?? [],
            jobTypes: config?.job_types?.map?.((item) => ({
                value: item?.['seo-value'],
                label: item.value
            })) ?? [],
            companySizes: config.company_sizes.map?.(item => ({ value: item?.['seo-value'], label: item.value })) ?? []
        }
    }, [config])
    const page = searchParams.page ?? '1'
    const { push } = useContext(LoadingContext)
    // const locations = flatMap(config.location_lists, item => item.locations)
    // const [location, setLocation] = useState(locations.find(location => location.seo_value === searchParams.location?.[0]))
    const [sort, setSort] = useState(searchParams?.sort?.[0] ?? '2')
    const [moreData, setMoreData] = useState(
        pipe(map(item => {
            if (is(String)(item)) {
                return item.split(',')
            } else if (is(Array)(item)) {
                return item
            } else {
                return null
            }
        }), filter(a => a))({
            workExperience: searchParams?.workExperience ?? null,
            qualification: searchParams?.qualification ?? null,
            salary: searchParams?.salary ?? null,
            jobTypes: searchParams?.jobTypes ?? null,
            companySizes: searchParams?.companySizes ?? null,
            industry: searchParams?.industry ?? null
        }))

    const filterParams = useMemo(() => {
        return filter(a => a?.length)({
            // location: [location?.['seo_value']].filter(a => a),
            sort: sort,
            page: page,
            preferenceId: selectedPreferenceId,
            ...moreData
        })
    }, [moreData, location, sort, selectedPreferenceId])
    const router = useRouter()
    const firstRender = useFirstRender()
    const reload = useCallback(() => {
        if (firstRender) {
            return
        }
        const url = new URLSearchParams(toPairs(filterParams)).toString();
        push(window.location.pathname + '?' + url)
    }, [filterParams, push])
    const reloadRef = useRef(reload)
    useEffect(() => {
        reloadRef.current = reload
    }, [reload])
    useEffect(reload, [location, moreData, sort, selectedPreferenceId])

    const newTheme = {...theme}
    newTheme.components.MuiPaper.styleOverrides.root['height'] = 'calc(100% - 64px)'

    return <div>
        <ThemeProvider theme={newTheme}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <Single
                        options={preferenceOptions}
                        value={selectedPreferenceId}
                        className={styles.preference}
                        onSelect={value => {
                            setSelectedPreferenceId(value)
                        }}
                        label='Job Preference'
                    />
                    <div className={styles.iconContainer}>
                        <div
                            className={styles.icon}
                            onClick={() => {
                                router.push('/manage-profile?tab=job-preferences', { forceOptimisticNavigation: true })
                            }}
                        >
                            <Image src={Plus} width={18} height={18} alt='' />
                        </div>
                        <div
                            className={styles.icon}
                            onClick={() => {
                                router.push('/jobs-hiring/job-search', { forceOptimisticNavigation: true })
                            }}
                        >
                            <Image src={Search} width={18} height={18} alt='' />
                        </div>

                    </div>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.selector}>
                        <Single
                            style={{ width: '100%', height: '30px', marginRight: 4 }}
                            options={sortOptions}
                            value={sort}
                            onSelect={setSort}
                            className={styles.filterItems}
                            label='Sort by'
                        />
                    </div>
                    {/* <div className={styles.selector}>
                        <LocationField
                            height='30px'
                            labelTop='0px'
                            style={{ width: '100%', height: '30px', marginLeft: 2 }}
                            options={locations}
                        />
                    </div> */}
                    <div className={styles.selector}>
                        <Grouped
                            value={moreData}
                            options={moreOptions}
                            style={{ width: '100%', height: '30px', marginLeft: 4 }}
                            labels={['Qualification', 'Work Exprerience', 'Industry', 'Salary', 'Job Type', 'Company Sizes']}
                            label='Filters'
                            onSelect={setMoreData}
                        />
                    </div>



                </div>
            </div>
        </ThemeProvider>
    </div>
}
export default SearchArea