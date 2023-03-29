import React from 'react'
import styles from './index.module.scss'
import tableIp from '../../interpreters/table'
import { serverDataScript } from 'app/abstractModels/FetchServierComponents'
import { buildComponentScript } from 'app/abstractModels/util'
import Pagination from '../Pagination'
import JobCard from '../jobCard'
import MobileTable from './mobile'
import Loader from './loader'
import NoPreference from '../noPreference'
const Table = (props: any) => {
    const { jobs = [], page, totalPages, preferences, preferenceId } = props
    // jobs = [], page, totalPages, searchValues, config
    const preference = preferences?.find?.(item => item.id === preferenceId)
    return <Loader>
        <div className={styles.container}>
            {jobs.map(job => {
                return (<div className={styles.jobContainer} key={job?.id}>
                    <JobCard {...job} preference={preference} />
                </div>)
            })}
            {
                totalPages > 1 ? <Pagination
                    count={+totalPages}
                    page={+page}
                /> : null
            }

        </div>
        <MobileTable {...props} preference={preference} />
    </Loader>
}

export default tableIp(serverDataScript()
    .chain(props => {
        const { preferences } = props
        if (preferences.length) {
            return buildComponentScript(props, Table)
        } else {
            return buildComponentScript({}, NoPreference)
        }
    })).run
    // .chain(props => buildComponentScript(props, Table))).run