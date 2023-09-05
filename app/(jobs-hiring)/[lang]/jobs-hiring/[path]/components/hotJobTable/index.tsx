import React from 'react'
import styles from '../../index.module.scss'
import tableIp from '../../../interpreters/table'
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
import { buildComponentScript } from 'app/models/abstractModels/util'
import Pagination from '../Pagination'
import JobCard from '../jobCard'
import MobileTable from './mobile'
import Loader from './loader'
import Empty from 'app/components/empty/empty'
import ChatDataProvider from '../ChatProvider'
import { fetchHotJobsListService } from 'store/services/jobs/fetchJobsList'
import { getCountryId } from 'helpers/country'
import { getCookie } from 'helpers/cookies'

const hotJobListData = async () => {
    const accessToken = getCookie('accessToken')
    const result = await fetchHotJobsListService(
        // getCountryId(),
        167,
        accessToken)
    if (!result) {
        throw new Error('data failed')

    }
    return result?.data?.data?.jobs
}
const Table = async () => {

    const jobs = await hotJobListData()

    return (
        <Loader>
            <ChatDataProvider recruiterIds={jobs.map(job => job.recruiter_id).join(',')}>
                <div className={styles.tableContainer}>
                    {jobs.map((job) => {
                        return (
                            <div className={styles.jobContainer} key={job?.id}>
                                <JobCard {...job} />
                            </div>
                        )
                    })}
                    {/* {totalPages > 1 ? <Pagination count={+totalPages} page={+page} /> : null} */}
                </div>
                <Empty />
            </ChatDataProvider>
        </Loader>
    )
}

export default tableIp(serverDataScript().chain((props) => buildComponentScript(props, Table))).run
