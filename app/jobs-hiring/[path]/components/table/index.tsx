import React from 'react'
import styles from './index.module.scss'
import tableIp from '../../../interpreters/table'
import { serverDataScript } from 'app/abstractModels/FetchServierComponents'
import { buildComponentScript } from 'app/abstractModels/util'
import Pagination from '../Pagination'
import JobCard from '../jobCard'
import MobileTable from './mobile'
import Loader from './loader'
import Empty from 'app/components/empty/empty'
const Table = (props: any) => {
    const { jobs = [], page, totalPages } = props
    // jobs = [], page, totalPages, searchValues, config
    console.log({ jobs })
    return <Loader>
        <div className={styles.container}>
            {jobs?.length ? jobs.map(job => {
                return (<div className={styles.jobContainer} key={job?.id}>
                    <JobCard {...job} />
                </div>)
            }) : <Empty />}
            {
                totalPages > 1 ? <Pagination
                    count={+totalPages}
                    page={+page}
                /> : null
            }

        </div>
        <MobileTable {...props} />
    </Loader>
}

export default tableIp(serverDataScript()
    .chain(props => buildComponentScript(props, Table))).run