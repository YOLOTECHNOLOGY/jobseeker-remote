import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

// @ts-ignore
import { END } from 'redux-saga'

// Redux Actions
import { wrapper } from 'store'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
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
import CompanyJobsCardLoader from 'components/Loader/CompanyJobsCard'

// Styles
import styles from '../Company.module.scss'

const CompanyJobsProfile = (props: any) => {
  const size = 30
  const router = useRouter()
  const { page } = router.query
  const dispatch = useDispatch()
  const { companyDetail, accessToken } = props
  const company = companyDetail?.response.data
  
  const [jobQuery, setJobQuery] = useState('')
  const [jobLocation, setJobLocation] = useState(null)

  const [companyJobs, setCompanyJobs] = useState(null)
  const [totalPages, setTotalPages] = useState(null)
  const [totalJobs, setTotalJobs] = useState(null)

  const fetchJobsListResponse = useSelector((store: any) => store.job.jobList.response)
  const isJobsListFetching = useSelector((store: any) => store.job.jobList.fetching)

  useEffect(() => {
    const payload = {
      companyIds: company.id,
      size,
      page,
      query: jobQuery,
      jobLocation: jobLocation?.value || ''
    }

    dispatch(fetchJobsListRequest({...payload}, accessToken))
    scrollToTop()
  }, [router.query])

  useEffect(() => {
    const payload = {
      companyIds: company.id,
      size: 30,
    }

    dispatch(fetchJobsListRequest({...payload}, accessToken))
  }, [])

  useEffect(() => {
    if (fetchJobsListResponse) {
      setCompanyJobs(fetchJobsListResponse.data?.jobs)
      setTotalPages(fetchJobsListResponse.data?.total_pages)
      setTotalJobs(fetchJobsListResponse.data?.total_num)
    }
  }, [fetchJobsListResponse])

  const handleSearchCompanyJobSearch = () => {
    const payload = {
      companyIds: company.id,
      size,
      page,
      query: jobQuery,
      jobLocation: jobLocation?.value || ''
    }

    dispatch(fetchJobsListRequest({...payload}, accessToken))
  }

  const handlePaginationClick = (event, val) => {
    router.query.page = val
    router.push(router, undefined, { shallow: true })
  }

  const handleJobsDisplayCount = () => {
    return `${(size * (page as any || 1) - size) + 1} - ${totalJobs < size ? totalJobs : size * (page as any || 1)}`
  }

  const onLocationSearch = (_, value) => {
    setJobLocation(value)
  }

  const scrollToTop = () => {
    const companyJobsElement = document.getElementById('companyJobs')
    companyJobsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <CompanyProfileLayout
      company={company}
      currentTab='jobs'
      totalJobs={totalJobs}
    >
      <div className={styles.companySection} id="companyJobs">
        <div className={styles.companyTabsContent}>
          <div className={styles.companyJobs}>
            <Text textStyle='xxl' bold className={styles.companySectionTitle}>Jobs</Text>
            <div className={styles.companyJobsSearch}>
              <div className={styles.companyJobsSearchLeft}>
                <MaterialTextField 
                  value={jobQuery}
                  defaultValue={jobQuery}
                  onChange={(e) => setJobQuery(e.target.value)}
                  className={styles.companyJobsSearchTitle}
                  size='small'
                  label='Search for job title'
                />
              </div>
              <div className={styles.companyJobsSearchRight}>
                <MaterialLocationField
                  className={styles.companyJobsSearchLocation}
                  label='Location'
                  value={jobLocation}
                  defaultValue={jobLocation}
                  onChange={onLocationSearch}
                />
                <MaterialButton variant='contained' capitalize className={styles.companyJobsSearchButton} onClick={handleSearchCompanyJobSearch}>
                  <Text textColor='white' bold>Search</Text>
                </MaterialButton>
              </div>
            </div>
            {isJobsListFetching && [...Array(10)].map((_, i) => (
              <CompanyJobsCardLoader key={i}/>
            ))}
            {!isJobsListFetching && companyJobs?.length > 0 && (
              <>
                <div className={styles.companyJobsList}>
                  {companyJobs.map((companyJob) => {
                    const company = {
                      id: companyJob.id,
                      title: companyJob.job_title,
                      location: companyJob.job_location,
                      salary: companyJob.salary_range_value,
                      availability: companyJob.job_type
                    }

                    return <CompanyJobsCard {...company} key={companyJob.id}/>
                  })}
                </div>
                <Text textStyle='sm' className={styles.companyJobsResults}>Showing {handleJobsDisplayCount()} of {totalJobs} jobs</Text>
                <div className={styles.companyJobsPagination}>
                  <MaterialRoundedPagination onChange={handlePaginationClick} defaultPage={Number(page) || 1} totalPages={totalPages || 1} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </CompanyProfileLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null

  const companyPageUrl = req.url.split('/')
  const companyPath = companyPageUrl.length === 4 ? companyPageUrl[2].split('-') : companyPageUrl[companyPageUrl.length - 1].split('-')
  const companyId = Number(companyPath[companyPath.length - 1])

  store.dispatch(fetchConfigRequest())
  store.dispatch(fetchCompanyDetailRequest(companyId))
  store.dispatch(END)

  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response
  const companyDetail = storeState.companies.companyDetail || null

  return {
    props: {
      config,
      companyDetail,
      accessToken
    }
  }
})

export default CompanyJobsProfile