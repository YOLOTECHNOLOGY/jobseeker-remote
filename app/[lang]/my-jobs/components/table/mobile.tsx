/* eslint-disable no-unused-vars */
'use client'
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import styles from './index.module.scss'
import MobileCard from '../jobCard/index.mobile'
import LoadMore from '../loadMore'
import { lensProp, set } from 'ramda'
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
import tableIp from '../../interpreters/talbeMoble'

const MobileTable = (props: any) => {
    const { jobs = [], page, totalPages, searchValues, config, preference } = props
    const [loading, setLoading] = useState(false)
    const [jobList, setJobList] = useState(jobs)
    const [latestPage, setLatestPage] = useState(page)
    useEffect(() => {
        setJobList([])
        setTimeout(() => {
            setJobList(jobs)
        }, 10)
        // Promise.resolve().then(() => setJobList(jobs))
        setLatestPage(1)
    }, [jobs])
    const fetchList = useMemo(() => {
        return tableIp(serverDataScript())
    }, [])
    const noMore = useMemo(() => {
        return latestPage === +totalPages
    }, [latestPage, totalPages])
    const shouldLoadMore = useCallback(() => {
        if (noMore || loading) {
            return
        }
        setLoading(true)
        const newSearchValues = set(lensProp('page'))(['' + (latestPage + 1)])(searchValues)
        fetchList.run({ searchValues: newSearchValues, config }).then(response => {
            const { jobs, page } = response
            setJobList(jobList.concat(jobs ?? []))
            setLatestPage(page)
        })
            .finally(() => setLoading(false))
    }, [noMore, loading, searchValues, latestPage])
    return <div className={styles.mobileContainer}>
        {jobList.map(job => {
            return (<div className={styles.jobContainer} key={job?.id}>
                <MobileCard {...props} {...job} preference={preference} />
            </div>)
        })}
        <LoadMore loading={loading} shouldLoad={shouldLoadMore} noMore={noMore} />
    </div>
}

export default MobileTable