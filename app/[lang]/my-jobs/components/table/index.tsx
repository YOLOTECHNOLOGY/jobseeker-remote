/* eslint-disable import/no-anonymous-default-export */
import React from 'react'
import styles from './index.module.scss'
import tableIp from '../../interpreters/table'
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
import { buildComponentScript } from 'app/models/abstractModels/util'
import Pagination from '../Pagination'
import JobCard from '../jobCard/index'
import MobileTable from './mobile'
import Loader from './loader'
import NoPreference from '../noPreference'
import ChatInfoProvider from 'app/components/chatInfoProvider'
import NoData from '../noData'
const Table = (props: any) => {
  const { jobs = [], page, totalPages, preferences, preferenceId } = props
  // jobs = [], page, totalPages, searchValues, config
  const preference = preferences?.find?.((item: { id: number }) => item.id === +preferenceId)
  const recruiterIds = jobs.map((job: { recruiter_id: any }) => job.recruiter_id)

  return (
    <ChatInfoProvider recruiterIds={recruiterIds}>
      {jobs?.length ? (
        <Loader>
          <div className={styles.container}>
            {jobs.map((job: { id: React.Key }) => {
              return (
                <div className={styles.jobContainer} key={job?.id}>
                  <JobCard
                    job={job}
                    preference={preference}
                    jobTitleId={preference?.job_title_id}
                    {...props}
                  />
                </div>
              )
            })}
            {totalPages > 1 ? <Pagination count={+totalPages} page={+page} /> : null}
          </div>
          <MobileTable {...props} preference={preference} />
        </Loader>
      ) : (
        <NoData />
      )}
    </ChatInfoProvider>
  )
}

export default (props: any) => {
  const { preferences } = props
  if (preferences?.length) {
    return tableIp(serverDataScript().chain((props: any) => buildComponentScript(props, Table))).run(
      props
    )
  } else {
    return tableIp(buildComponentScript({}, NoPreference)).run(props)
  }
}
