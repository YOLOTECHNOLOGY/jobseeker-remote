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
import MetaText from '../../../../components/MetaText'
import { getCountry } from 'helpers/country'
import { getDictionary } from 'get-dictionary'
import { formatTemplateString } from 'helpers/formatter'

const CompanyJobsProfile = (props: any) => {
  const size = 30
  const router = useRouter()
  const { page } = router.query
  const dispatch = useDispatch()
  const { companyDetail, accessToken, seoMetaTitle, seoMetaDescription, totalActiveJobs, lang } =
    props
  const {
    companyDetail: {
      job,
      overview: {
        jobs: { card }
      }
    }
  } = lang
  const company = companyDetail

  useEffect(() => {
    dispatch(fetchConfigRequest())
  }, [])
  const [jobQuery, setJobQuery] = useState('')
  const [jobLocation, setJobLocation] = useState(null)
  const [selectedPage, setSelectedpage] = useState(Number(page) || 1)

  const [companyJobs, setCompanyJobs] = useState(null)
  const [totalPages, setTotalPages] = useState(null)
  const [totalJobs, setTotalJobs] = useState(null)

  const fetchJobsListResponse = useSelector((store: any) => store.job.jobList.response)
  const isJobsListFetching = useSelector((store: any) => store.job.jobList.fetching)

  const filterJobs = () => {
    const payload = {
      companyIds: company.id,
      size,
      page,
      query: jobQuery,
      location: jobLocation?.value || ''
    }

    dispatch(fetchJobsListRequest({ ...payload }, accessToken))
  }

  useEffect(() => {
    if (fetchJobsListResponse) {
      setCompanyJobs(fetchJobsListResponse.data?.jobs)
      setTotalPages(fetchJobsListResponse.data?.total_pages)
      setTotalJobs(fetchJobsListResponse.data?.total_num)
    }
  }, [fetchJobsListResponse])

  const handleSearchCompanyJobSearch = () => {
    setSelectedpage(1)
    setJobLocation(jobLocation)
    filterJobs()
  }

  const handlePaginationClick = (event, val) => {
    setSelectedpage(Number(val))
    filterJobs()
    scrollToTop()
  }

  const handleJobsDisplayCount = () => {
    return `${size * ((page as any) || 1) - size + 1} - ${
      totalJobs < size ? totalJobs : size * ((page as any) || 1)
    }`
  }

  const onLocationSearch = (_, value) => {
    setJobLocation(value)
  }

  const scrollToTop = () => {
    const companyJobsElement = document.getElementById('companyJobs')
    companyJobsElement.scrollIntoView()
  }

  return (
    <CompanyProfileLayout
      lang={lang}
      company={company}
      currentTab='jobs'
      totalJobs={totalActiveJobs}
      seoMetaTitle={seoMetaTitle}
      seoMetaDescription={seoMetaDescription}
    >
      <div className={styles.companySection} id='companyJobs'>
        <div className={styles.companyTabsContent}>
          {totalActiveJobs > 0 && (
            <div className={styles.companyJobs}>
              <Text textStyle='xl' bold className={styles.companySectionTitle}>
                {job.title}
              </Text>
              <MetaText tagName='h1'>{`Jobs at ${company.name} ${company.id}`}</MetaText>

              {totalActiveJobs > 0 && (
                <div className={styles.companyJobsSearch}>
                  <div className={styles.companyJobsSearchLeft}>
                    <MaterialTextField
                      value={jobQuery}
                      defaultValue={jobQuery}
                      onChange={(e) => setJobQuery(e.target.value)}
                      className={styles.companyJobsSearchTitle}
                      size='small'
                      label={job.search.jobTitle}
                      isSubmitOnEnter={true}
                      onSubmit={handleSearchCompanyJobSearch}
                    />
                  </div>
                  <div className={styles.companyJobsSearchRight}>
                    <MaterialLocationField
                      className={styles.companyJobsSearchLocation}
                      label={job.search.location}
                      value={jobLocation}
                      defaultValue={jobLocation}
                      onChange={onLocationSearch}
                    />
                    <MaterialButton
                      variant='contained'
                      capitalize
                      className={styles.companyJobsSearchButton}
                      onClick={handleSearchCompanyJobSearch}
                    >
                      <Text textColor='white' bold>
                        {job.search.btn}
                      </Text>
                    </MaterialButton>
                  </div>
                </div>
              )}

              {isJobsListFetching &&
                [...Array(size)].map((_, i) => <CompanyJobsCardLoader key={i} />)}

              {companyJobs?.length > 0 ? (
                <React.Fragment>
                  {!isJobsListFetching && (
                    <>
                      <div className={styles.companyJobsList}>
                        {companyJobs.map((companyJob) => {
                          const company = {
                            title: companyJob.job_title,
                            location: companyJob.job_location,
                            salary: companyJob.salary_range_value,
                            availability: companyJob.job_type,
                            jobUrl: companyJob.job_url
                          }

                          return (
                            <CompanyJobsCard
                              chatText={card.chatNow}
                              {...company}
                              key={companyJob.id}
                            />
                          )
                        })}
                      </div>
                      <Text textStyle='sm' className={styles.companyJobsResults}>
                        {formatTemplateString(
                          job.pagination.tips,
                          handleJobsDisplayCount(),
                          totalJobs
                        )}
                        {/* Showing {handleJobsDisplayCount()} of {totalJobs} jobs */}
                      </Text>
                      <div className={styles.companyJobsPagination}>
                        <MaterialRoundedPagination
                          onChange={handlePaginationClick}
                          defaultPage={Number(page) || 1}
                          page={selectedPage}
                          totalPages={totalPages || 1}
                        />
                      </div>
                    </>
                  )}
                </React.Fragment>
              ) : (
                <div className={styles.emptyResult}>
                  {totalActiveJobs > 0 && (
                    <Text>
                      {job.noMatchedJobs}
                      {/* We couldn't find any jobs matching your search. */}
                    </Text>
                  )}
                </div>
              )}
            </div>
          )}
          {totalActiveJobs == 0 && (
            <div>
              <Text>
                {formatTemplateString(job.noJobs, company.name)}
                {/* {company.name} does not have any job openings now. Please come back again. */}
              </Text>
            </div>
          )}
        </div>
      </div>
    </CompanyProfileLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query: { lang } }) => {
      const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null
      const companyPageUrl = req.url.split('/')
      const companyPath =
        companyPageUrl.length === 4
          ? companyPageUrl[2].split('-')
          : companyPageUrl[companyPageUrl.length - 1].split('-')
      const companyId = Number(companyPath[companyPath.length - 1])
      const jobFilterpayload = {
        companyIds: companyId,
        size: 10,
        page: 1
      }
      const dictionary = await getDictionary(lang as any)

      store.dispatch(fetchJobsListRequest({ ...jobFilterpayload }, accessToken))
      // store.dispatch(fetchConfigRequest())
      store.dispatch(fetchCompanyDetailRequest(companyId))
      store.dispatch(END)

      await (store as any).sagaTask.toPromise()
      const storeState = store.getState()
      const companyDetail = storeState.companies.companyDetail.response.data

      if (!companyDetail) {
        return {
          notFound: true
        }
      }

      const config = storeState.config.config.response
      const companyName = companyDetail?.name
      const jobList = storeState.job.jobList.response.data
      const totalActiveJobs = jobList?.total_num || 0
      const seoMetaTitle = `${companyName} Careers in ${getCountry()}, Job Opportunities | Bossjob`
      const seoMetaDescription = encodeURI(
        `View all current job opportunities at ${companyName} in ${getCountry()} on Bossjob - Connecting pre-screened experienced professionals to employers`
      )
      const additionalCanonicalText = '/jobs'
      const companyUrl = companyDetail.company_url
      const canonicalUrl = companyUrl + additionalCanonicalText
      return {
        props: {
          config,
          companyDetail,
          accessToken,
          seoMetaTitle,
          canonicalUrl,
          imageUrl: companyDetail?.logo_url,
          seoMetaDescription,
          totalActiveJobs,
          lang: dictionary
        }
      }
    }
)

export default CompanyJobsProfile
