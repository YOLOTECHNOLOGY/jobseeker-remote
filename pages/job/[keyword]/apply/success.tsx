import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

/* Action Creators */
import { wrapper } from 'store'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'

// @ts-ignore
import { END } from 'redux-saga'

// Components
import Layout from 'components/Layout'
import Text from 'components/Text'
import Link from 'components/Link'
import JobDetailSidebarCard from 'components/Loader/JobDetailSidebarCard'
import JobCard from 'components/JobCard'
import MaterialButton from 'components/MaterialButton'

// Redux Actions
import { fetchSimilarJobsRequest } from 'store/actions/jobs/fetchSimilarJobs'
import { fetchJobDetailRequest } from 'store/actions/jobs/fetchJobDetail'

// Styles
import styles from './ApplySuccess.module.scss'

/* Images */
import {
  ApplySuccess as ApplySuccessImg,
} from 'images'
interface IApplyJobDetails {
  jobDetails: any
}

const ApplySuccess = ({
  jobDetails
}: IApplyJobDetails) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [similarJobs, setSimilarJobs] = useState(null)
  
  const similarJobsResponse = useSelector((store: any) => store.job.similarJobs.response)
  const isSimilarJobsFetching = useSelector((store: any) => store.job.similarJobs.fetching)
  
  useEffect(() => {
    dispatch(fetchSimilarJobsRequest({ jobId: jobDetails.id }))
  }, [])

  useEffect(() => {
    if (similarJobsResponse) setSimilarJobs(similarJobsResponse)
  }, [similarJobsResponse])

  return (
    <Layout>
      <div className={styles.applySuccessContainer}>
        <div className={styles.applySuccess}>
          <div className={styles.applySuccessMessage}>
            <img src={ApplySuccessImg} height='108' width='152' /> 
            <Text textStyle='xxl' tagName='h2' bold>
              You have successfully applied for {jobDetails.job_title}!
            </Text>
            <Text>
              Your application has been sent to {jobDetails.company.name}. 
              They will be reviewing it soon.
            </Text>
          </div>
          <div className={styles.applySuccessSimilarJob}>
            <Text textStyle='xxl' tagName='h2' bold>
              Here are some relevant jobs you might want to apply too!
            </Text> 

            {!isSimilarJobsFetching && similarJobs?.length > 0 ? (
              <div className={styles.jobList}>
                {similarJobs.map((job) => (
                  <div key={job.id} className={styles.jobCard}>
                    <JobCard
                      key={job.id}
                      id={job.id}
                      image={job.company_logo}
                      title={job.truncated_job_title}
                      jobType={job.job_type}
                      isFeatured={Boolean(job.is_featured)}
                      isUrgent={Boolean(job.is_urgent)}
                      company={job.company_name}
                      location={job.location_value}
                      salary={job.salary_range_value}
                      postedAt={job.refreshed_at}
                      status={job.status_key}
                      handleSelectedId={() => {
                        router.push(job.job_url)
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : isSimilarJobsFetching ? (
              <div>
                <JobDetailSidebarCard />
                <JobDetailSidebarCard />
                <JobDetailSidebarCard />
                <JobDetailSidebarCard />
                <JobDetailSidebarCard />
              </div>
            ) : null}

            <div className={styles.buttonAction}>
              <Link title='Log In' to='/jobs-hiring/job-search'>
                <MaterialButton variant='contained' size='medium' capitalize>
                  <Text textStyle='base' textColor='white' bold>Back to jobs</Text>
                </MaterialButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query, req }) => {
  const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null
  const { keyword } = query
  const keywordQuery: any = keyword
  const jobId = keywordQuery?.split('-').pop()
  
  store.dispatch(fetchJobDetailRequest({
      jobId,
      status: 'protected',
      serverAccessToken: accessToken,
    })
  )
  store.dispatch(END)
  
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const jobDetails = storeState.job?.jobDetail.response
  
  // Redirect to job page if the job hasn't been applied by the user
  if (!jobDetails.is_applied) {
    return {
      redirect: {
        permanent: false,
        destination: jobDetails.job_url
      }
    }
  }

  return {
    props: {
      jobDetails,
    }
  }
})

export default ApplySuccess