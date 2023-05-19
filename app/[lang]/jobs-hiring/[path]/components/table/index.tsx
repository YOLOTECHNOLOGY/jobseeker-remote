import React from 'react'
import styles from '../../index.module.scss'
import tableIp from '../../../interpreters/table'
import { serverDataScript } from 'app/[lang]/abstractModels/FetchServierComponents'
import { buildComponentScript } from 'app/[lang]/abstractModels/util'
import Pagination from '../Pagination'
import JobCard from '../jobCard'
import MobileTable from './mobile'
import Loader from './loader'
import Empty from 'app/[lang]/components/empty/empty'
const Table = (props: any) => {
    const { jobs = [], page, totalPages } = props
    console.log(props,'jobs')
    return (
        <Loader>
            {jobs?.length ? (
                <div className={styles.tableContainer}>
                    {jobs.map((job) => {
                        return (
                            <div className={styles.jobContainer} key={job?.id}>
                                <JobCard {...job} />
                            </div>
                        )
                    })}
                    {totalPages > 1 ? <Pagination count={+totalPages} page={+page} /> : null}
                </div>
            ) : (
                <Empty {...props}/>
            )}
            <div>{jobs?.length ? <MobileTable {...props} /> : null}</div>
        </Loader>
    )
}

export default tableIp(serverDataScript().chain((props) => buildComponentScript(props, Table))).run
