import Link from 'next/link'

import { fetchSimilarJobsService } from 'store/services/jobs/fetchSimilarJobs'

import SeeMore from './SeeMore/SeeMore'
import { Avatar } from 'app/components/MUIs/'

import styles from '../../../page.module.scss'

type propsType = {
  id?: number
  jobDetail: any
}

export default async function SimilarJobs({ id, jobDetail }: propsType) {
  const params = {
    jobId: id,
    size: 5
  }

  const data = await fetchSimilarJobsService(params)
    .then(({ data: { data } }) => data)
    .catch(() => ({ error: true }))

  return (
    <section className={styles.similarJobs}>
      <h3>SimilarJobs</h3>

      <div className={styles.similarJobs_container}>
        {data?.map((item) => {
          return (
            <div key={item.id} className={styles.similarJobs_card}>
              <Link href={'/job-detail/' + item.id}>
                <h6 className={styles.similarJobs_title}>{item.function_job_title}</h6>
                <div className={styles.similarJobs_salary}>{item.salary_range_value}</div>
                <div className={styles.similarJobs_info}>
                  <div>
                    <Avatar
                      alt={item.company?.name}
                      src={item.company?.logo}
                      sx={{
                        borderRadius: '5px',
                        width: '24px',
                        height: '24px',
                        marginRight: '6px'
                      }}
                    />
                  </div>
                  <div className={styles.similarJobs_info_jobType}>
                    <div>{item.job_type}</div>
                    <div>{item.location_value}</div>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}

        <SeeMore jobDetail={jobDetail} />
      </div>
    </section>
  )
}
