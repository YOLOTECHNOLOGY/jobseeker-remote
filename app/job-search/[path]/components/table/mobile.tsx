/* eslint-disable no-unused-vars */
'use client'
import React from 'react'
import styles from './index.module.scss'
import MobileCard from '../jobCard/index.mobile'
import LoadMore from '../loadMore'
const MobileTable = (props: any) => {
    const { jobs = [], page, totalPages } = props
    return <div className={styles.mobileContainer}>
        {jobs.map(job => {
            return (<div className={styles.jobContainer} key={job?.id}>
                <MobileCard {...job} />
            </div>)
        })}
        <LoadMore />
    </div>
}

export default MobileTable