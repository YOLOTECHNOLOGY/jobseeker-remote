/* eslint-disable no-unused-vars */
'use client'
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import styles from '../../index.module.scss'
import MobileCard from '../jobCard/index.mobile'
import { lensProp, set } from 'ramda'
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
import tableIp from '../../../interpreters/talbeMoble'
import { CircularProgress } from 'app/components/MUIs'

const MobileTable = (props: any) => {
  const { jobs = [], page, totalPages, searchValues, config } = props
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
    fetchList
      .run({ searchValues: newSearchValues, config })
      .then((response) => {
        const { jobs, page } = response
        setJobList(jobList.concat(jobs ?? []))
        setLatestPage(page)
      })
      .finally(() => setLoading(false))
  }, [noMore, loading, searchValues, latestPage])

  const NoMore = () => {
    return noMore ? (
      <div style={{ color: '#86909c' }}>{props?.lang?.noMore}</div>
    ) : (
      <button className={styles.viewMore} onClick={shouldLoadMore}>
        {props?.lang?.viewMore}
      </button>
    )
  }

  return (
    <div className={styles.mobileContainer}>
      {jobList.map((job) => {
        return (
          <div className={styles.jobContainer} key={job?.id}>
            <MobileCard {...job} />
          </div>
        )
      })}
      {/* <LoadMore loading={loading} shouldLoad={shouldLoadMore} noMore={noMore} /> */}
      <div className={styles.loadMore}>
        {!loading ? <NoMore /> : <CircularProgress color={'primary'} size={20} />}
      </div>
    </div>
  )
}

export default MobileTable
