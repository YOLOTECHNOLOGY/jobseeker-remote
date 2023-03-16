import { fetchSimilarJobsService } from 'store/services/jobs/fetchSimilarJobs'

import { Avatar } from 'app/components/MUIs/'

import styles from '../../../page.module.scss'

type propsType = {
  id?: number
}

export default async function SimilarJobs({ id }: propsType) {
  const params = {
    jobId: id,
    size: 5
  }

  const data = await fetchSimilarJobsService(params)
    .then(({ data: { data } }) => data)
    .catch(() => ({ error: true }))

  console.log(data, '===============SimilarJobs')

  return (
    <section className={styles.SimilarJobs}>
      <h5>SimilarJobs</h5>
      {data?.map((item) => {
        return (
          <div key={item.id} className={styles.SimilarJobs_card}>
            <h6>{item.function_job_title}</h6>
            <div>{item.salary_range_value}</div>
            <div>
              <div>
                <Avatar alt={item.company?.name} src={item.logo} />
              </div>
              <div>
                <span>{item.job_type}</span>
                <span>{item.location_value}</span>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
