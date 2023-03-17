import React from 'react'
import styles from './index.module.scss'
import tableIp from '../../../interpreters/table'
import { serverDataScript } from 'app/abstractModels/FetchServierComponents'
import { buildComponentScript } from 'app/abstractModels/util'
import Pagination from 'app/components/commons/Pagination'

import JobCard from '../jobCard'
const Table = (props: any) => {
    const { jobs = [], page, totalPages } = props
    return <div className={styles.container}>
        {jobs.map(job => {
            return (<div className={styles.jobContainer} key={job?.id}>
                <JobCard {...job} />
            </div>)
        })}
        <Pagination
            count={+totalPages}
            page={+page}
        />
    </div>
}

export default tableIp(serverDataScript()
    .chain(props => buildComponentScript(props, Table))).run