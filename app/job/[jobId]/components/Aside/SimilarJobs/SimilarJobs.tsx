import Link from 'next/link'

import { fetchSimilarJobsService } from 'store/services/jobs/fetchSimilarJobs'
import { fetchRecruiterLastActiveService } from 'store/services/recruiters/last-active'

import SeeMore from './SeeMore/SeeMore'
import { Avatar } from 'app/components/MUIs/'

import { transState } from 'helpers/utilities'

import styles from '../../../page.module.scss'
import classNames from 'classnames/bind'

type propsType = {
  id?: number
  jobDetail: any
}

export default async function SimilarJobs({ id, jobDetail }: propsType) {
  const params = {
    jobId: id,
    size: 5
  }

  let recruiterLineStatus = []
  const data = await fetchSimilarJobsService(params)
    .then(({ data: { data } }) => data?.jobs )
    .catch(() => ({ error: true }))
  if (!data.error) {
    const ids = data.map((item) => item.recruiter?.id)
    if (ids.length) {
      const lines = await fetchRecruiterLastActiveService(ids.join(','))
        .then(({ data: { data } }) => data)
        .catch(() => ({ error: true }))
      recruiterLineStatus = lines
    }
  }

  return (
    <>
      {data.length ? (
        <section className={styles.similarJobs}>
          <h3>SimilarJobs</h3>

          <div className={styles.similarJobs_container}>
            <div className={styles.similarJobs_webCard}>
              {data?.map((item) => {
                return (
                  <div key={item.id} className={styles.similarJobs_card}>
                    <Link href={item.job_url}>
                      <h6 className={styles.similarJobs_title}>{item.truncated_job_title}</h6>
                      <div className={styles.similarJobs_salary}>{item.salary_range_value}</div>
                      <div className={styles.similarJobs_info}>
                        <div>
                          <Avatar
                            alt={item.company_name}
                            src={item.company_logo}
                            sx={{
                              borderRadius: '5px',
                              width: '24px',
                              height: '24px',
                              marginRight: '6px'
                            }}
                          />
                        </div>
                        <div className={styles.similarJobs_info_jobType}>
                          <div>{item.company_name}</div>
                          <div>{item.location_value}</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>

            <div className={styles.similarJobs_mobileCard}>
              {data?.map((item) => {
                const lastActiveAt: any =
                  recruiterLineStatus?.length &&
                  recruiterLineStatus?.find((line: any) => line.id == item.recruiter?.id)

                return (
                  <div key={item.id} className={styles.similarJobs_card}>
                    <Link href={item.job_url}>
                      <div className={styles.similarJobs_mobileCardWrapper}>
                        <h6 className={classNames([styles.similarJobs_title])}>
                          {item.truncated_job_title}
                        </h6>
                        <div className={classNames([styles.similarJobs_salary])}>
                          {item.local_salary_range_value}
                        </div>
                      </div>

                      <div className={styles.similarJobs_mobileCard_name}>{item.company_name}</div>

                      <div className={styles.similarJobs_mobileCard_tags}>
                        <span>{item.job_type}</span>
                        <span>{item?.xp_lvl?.value}</span>
                        <span>{item?.degree?.value}</span>
                      </div>

                      <div className={styles.similarJobs_info}>
                        <div className={styles.similarJobs_infoWrpper}>
                          <Avatar
                            alt={item.company_name}
                            src={item.company_logo}
                            sx={{
                              borderRadius: '50%',
                              width: '17px',
                              height: '17px',
                              marginRight: '6px'
                            }}
                          />

                          <span
                            className={classNames([
                              styles.similarJobs_infoWrpper_status,
                              transState(lastActiveAt?.last_active_at)?.state
                                ? styles.similarJobs_infoWrpper_lineStatus
                                : null
                            ])}
                          ></span>
                        </div>
                        <div className={classNames([styles.similarJobs_mobileCard_loca])}>
                          <div>{item.recruiter?.full_name}</div>
                          <div className={styles.similarJobs_mobileCard_loca_value}>
                            {item.location_value}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>

            <SeeMore jobDetail={jobDetail} />
          </div>
        </section>
      ) : null}
    </>
  )
}
