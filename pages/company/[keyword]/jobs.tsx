import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

// @ts-ignore
import { END } from 'redux-saga'

// Redux Actions
import { wrapper } from 'store'
import { fetchJobsListRequest } from 'store/actions/jobs/fetchJobsList'
import { fetchCompanyDetailRequest } from 'store/actions/companies/fetchCompanyDetail'

// Components
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'
import MaterialTextField from 'components/MaterialTextField'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'
import CompanyJobsCard from 'components/Company/CompanyJobsCard'
import CompanyProfileLayout from 'components/Company/CompanyProfileLayout'

// Helpers
import { formatSalaryRange } from 'helpers/formatter'

// Styles
import styles from '../Company.module.scss'

const CompanyJobsProfile = (props: any) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { companyDetail } = props
  const company = companyDetail?.response.data
  const [companyJobs, setCompanyJobs] = useState(null)
  const [totalPages, setTotalPages] = useState(null)
  const [totalJobs, setTotalJobs] = useState(null)

  const fetchJobsListResponse = useSelector((store: any) => store.job.jobList.response)

  useEffect(() => {
    const payload = {
      companyIds: company.id,
      size: 30
    }

    dispatch(fetchJobsListRequest({...payload}))
  }, [])

  useEffect(() => {
    if (fetchJobsListResponse) {
      setCompanyJobs(fetchJobsListResponse.data?.jobs)
      setTotalPages(fetchJobsListResponse.data?.total_pages)
      setTotalJobs(fetchJobsListResponse.data?.total_num)
    }
  }, [fetchJobsListResponse])

  const handlePaginationClick = (event, val) => {
    router.query.page = val
    router.push(router, undefined, { shallow: true })
  }

  return (
    <CompanyProfileLayout
      company={company}
      currentTab='jobs'
      totalJobs={totalJobs}
    >
      <div className={styles.companyTabsContent}>
        <div className={styles.companyJobs}>
          <div className={styles.companyJobsSearch}>
            <div className={styles.companyJobsSearchLeft}>
              <MaterialTextField 
                className={styles.companyJobsSearchTitle}
                size='small'
                label='Search for job title'
              />
            </div>
            <div className={styles.companyJobsSearchRight}>
              <MaterialLocationField
                className={styles.companyJobsSearchLocation}
                label='Location'
              />
              <MaterialButton variant='contained' capitalize className={styles.companyJobsSearchButton}>
                <Text textColor='white' bold>Search</Text>
              </MaterialButton>
            </div>
          </div>
          <Text textStyle='sm' className={styles.companyJobsFound}>{totalJobs} jobs at {company.name}</Text>
          <div className={styles.companyJobsList}>
            {companyJobs?.length > 0 && companyJobs.map((companyJob) => {
              const company = {
                id: companyJob.id,
                title: companyJob.job_title,
                location: companyJob.job_location,
                salary: `${formatSalaryRange(`${companyJob.salary_range_from}-${companyJob.salary_range_to}`)}`,
                availability: companyJob.job_type
              }

              return <CompanyJobsCard {...company} key={companyJob.id}/>
            })}
          </div>
          <Text textStyle='sm' className={styles.companyJobsResults}>Showing 1 - 30 of {totalJobs} jobs</Text>
          <div className={styles.companyJobsPagination}>
            <MaterialRoundedPagination onChange={handlePaginationClick} defaultPage={1} totalPages={totalPages || 1} />
          </div>
        </div>
      </div>
    </CompanyProfileLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const companyPageUrl = req.url.split('/')
  const companyPath = companyPageUrl.length === 4 ? companyPageUrl[2].split('-') : companyPageUrl[companyPageUrl.length - 1].split('-')
  const companyId = Number(companyPath[companyPath.length - 1])

  store.dispatch(fetchCompanyDetailRequest(companyId))
  store.dispatch(END)

  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const companyDetail = storeState.companies.companyDetail || null

  return {
    props: {
      companyDetail
    }
  }
})

export default CompanyJobsProfile