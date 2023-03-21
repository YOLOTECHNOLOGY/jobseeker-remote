import Link from 'next/link'

import { fetchSimilarJobsService } from 'store/services/jobs/fetchSimilarJobs'

import { Avatar, Button } from 'app/components/MUIs/'

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

        <Button
          variant='outlined'
          sx={{
            height: '44px',
            width: '100%',
            marginTop: '20px',
            borderRadius: '10px',
            border: '2px solid #136FD3',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '18px',
            letterSpacing: '0.0075em',
            color: '#136FD3',
            textTransform: 'capitalize'
          }}
        >
          See more
        </Button>
      </div>
    </section>
  )
}
