import React, { useEffect, useState, useCallback } from 'react'
import classNames from 'classnames/bind'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import useEmblaCarousel from 'embla-carousel-react'

// @ts-ignore
import { END } from 'redux-saga'

// Redux Actions
import { wrapper } from 'store'
import { fetchCompanyDetailRequest } from 'store/actions/companies/fetchCompanyDetail'
import { fetchJobsListRequest } from 'store/actions/jobs/fetchJobsList'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'

// Components
import Text from 'components/Text'
import Link from 'components/Link'
import CompanyJobsCard from 'components/Company/CompanyJobsCard'
import CompanyProfileLayout from 'components/Company/CompanyProfileLayout'
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'
import MaterialTextField from 'components/MaterialTextField'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialButton from 'components/MaterialButton'
import CompanyJobsCardLoader from 'components/Loader/CompanyJobsCard'

// Images
import { FacebookOutline, LinkedinOutline, InstagramOutline, YoutubeOutline } from 'images'

// Styles
import styles from '../Company.module.scss'

const CompanyDetail = (props: any) => {
  const size = 10
  const router = useRouter()
  const dispatch = useDispatch()
  const { page } = router.query
  const [jobQuery, setJobQuery] = useState('')

  const { companyDetail, accessToken, seoMetaTitle, seoMetaDescription, totalActiveJobs } = props
  const company = companyDetail
  const [companyJobs, setCompanyJobs] = useState(null)
  const [selectedPage, setSelectedpage] = useState(Number(page) || 1)
  const [totalPages, setTotalPages] = useState(null)
  const [jobLocation, setJobLocation] = useState(null)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    skipSnaps: false,
    slidesToScroll: 1,
    inViewThreshold: 1
  })

  const fetchJobsListResponse = useSelector((store: any) => store.job.jobList.response)
  const isJobsListFetching = useSelector((store: any) => store.job.jobList.fetching)

  useEffect(() => {
    if (fetchJobsListResponse) {
      setCompanyJobs(fetchJobsListResponse.data?.jobs)
      setTotalPages(fetchJobsListResponse.data?.total_pages)
    }
  }, [fetchJobsListResponse])

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

  const handlePaginationClick = (event, val) => {
    setSelectedpage(Number(val))
    filterJobs()
    scrollToTop()
  }

  const handleSearchCompanyJobSearch = () => {
    setSelectedpage(1)
    setJobLocation(jobLocation)
    filterJobs()
  }

  const onLocationSearch = (_, value) => {
    setJobLocation(value)
  }

  // Embla Carousel
  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }, [emblaApi])
  // Embla Carousel

  const scrollToTop = () => {
    const companyJobsElement = document.getElementById('companyJobs')
    companyJobsElement.scrollIntoView()
  }

  return (
    <CompanyProfileLayout
      company={company}
      currentTab='overview'
      totalJobs={totalActiveJobs}
      seoMetaTitle={seoMetaTitle}
      seoMetaDescription={seoMetaDescription}
      accessToken={accessToken}
    >
      <div className={styles.companyTabsContent}>
        <div className={styles.companySection}>
          <Text textStyle='xl' bold className={styles.companySectionTitle}>
            About the company
          </Text>
          <div
            className={styles.companyDescription}
            dangerouslySetInnerHTML={{ __html: company.description_html }}
          />
          <div className={styles.companyOverview}>
            <div className={styles.companyOverviewContents}>
              <div className={styles.companyOverviewLeft}>
                {company.company_size && (
                  <div className={styles.companyOverviewItem}>
                    <Text textStyle='lg' bold>
                      Company Size:{' '}
                    </Text>
                    <Text textStyle='lg'>{company.company_size} Employees</Text>
                  </div>
                )}
                {company.industry && (
                  <div className={styles.companyOverviewItem}>
                    <Text textStyle='lg' bold>
                      Industry:{' '}
                    </Text>
                    <Text textStyle='lg'>{company.industry}</Text>
                  </div>
                )}
                {company.website && (
                  <div className={styles.companyOverviewItem}>
                    <Text textStyle='lg' bold>
                      Website:{' '}
                    </Text>
                    <Link to={company.website} external>
                      <Text textStyle='lg' className={styles.companyOverviewLink}>
                        {company.website}
                      </Text>
                    </Link>
                  </div>
                )}
              </div>
              <div className={styles.companyOverviewRight}>
                {company.full_address && (
                  <div className={styles.companyOverviewItem}>
                    <Text textStyle='lg' bold>
                      Location:{' '}
                    </Text>
                    <Text textStyle='lg' className={styles.companyOverviewLocation}>
                      {company.full_address}
                    </Text>
                  </div>
                )}
                <div
                  className={classNames(
                    styles.companyOverviewItem,
                    styles.companyOverviewItemSocial
                  )}
                >
                  <Text textStyle='lg' bold>
                    Social Media:{' '}
                  </Text>
                  <div className={styles.companyOverviewSocial}>
                    <Link
                      external
                      className={styles.companyOverviewSocialLink}
                      to={company.facebook_url ? company.facebook_url : router.asPath}
                    >
                      <img src={FacebookOutline} />
                    </Link>
                    <Link
                      external
                      className={styles.companyOverviewSocialLink}
                      to={company.linkedin_url ? company.linkedin_url : router.asPath}
                    >
                      <img src={LinkedinOutline} />
                    </Link>
                    <Link
                      external
                      className={styles.companyOverviewSocialLink}
                      to={company.instagram_url ? company.instagram_url : router.asPath}
                    >
                      <img src={InstagramOutline} />
                    </Link>
                    <Link
                      external
                      className={styles.companyOverviewSocialLink}
                      to={company.youtube_url ? company.youtube_url : router.asPath}
                    >
                      <img src={YoutubeOutline} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {company.cultures?.length > 0 || company.benefits?.length > 0 ? (
          <div className={styles.companySection}>
            <div className={styles.companyCulture}>
              <div className={styles.companyCultureContent}>
                <div className={styles.companyCultureWrapper}>
                  {company.cultures?.length > 0 && (
                    <div className={styles.companyCultureSection}>
                      <div className={styles.companyCultureHeading}>
                        <Text textStyle='xl' bold>
                          Company Culture
                        </Text>
                        <Link
                          to={`${company?.company_url}/life`}
                          className={classNames(
                            styles.companyCultureHeadingLink,
                            styles.companyCultureHeadingLinkTop
                          )}
                        >
                          <Text textColor='primaryBlue' textStyle='base'>
                            View all
                          </Text>
                        </Link>
                      </div>
                      <div className={styles.companyCultureList}>
                        {company.cultures.map((item) => (
                          <Text
                            className={styles.companyCultureItem}
                            textStyle='base'
                            key={item.id}
                          >
                            {item.value}
                          </Text>
                        ))}
                      </div>
                      <Link
                        to={`${company?.company_url}/life`}
                        className={classNames(
                          styles.companyCultureHeadingLink,
                          styles.companyCultureHeadingLinkBottom
                        )}
                      >
                        <Text textColor='primaryBlue' textStyle='base'>
                          View all
                        </Text>
                      </Link>
                    </div>
                  )}
                  {company.benefits?.length > 0 && (
                    <div className={styles.companyCultureSection}>
                      <div className={styles.companyCultureHeading}>
                        <Text textStyle='xl' bold>
                          Employee Benefits
                        </Text>
                        <Link
                          to={`${company?.company_url}/life`}
                          className={classNames(
                            styles.companyCultureHeadingLink,
                            styles.companyCultureHeadingLinkTop
                          )}
                        >
                          <Text textColor='primaryBlue' textStyle='base'>
                            View all
                          </Text>
                        </Link>
                      </div>
                      <div className={styles.companyCultureList}>
                        {company.benefits.map((item) => (
                          <Text
                            className={styles.companyCultureItem}
                            textStyle='base'
                            key={item.id}
                          >
                            {item.value}
                          </Text>
                        ))}
                      </div>
                      <Link
                        to={`${company?.company_url}/life`}
                        className={classNames(
                          styles.companyCultureHeadingLink,
                          styles.companyCultureHeadingLinkBottom
                        )}
                      >
                        <Text textColor='primaryBlue' textStyle='base'>
                          View all
                        </Text>
                      </Link>
                    </div>
                  )}
                  {company.pictures?.length > 0 && (
                    <div className={styles.companyCultureSection}>
                      <div className={styles.companyCultureHeading}>
                        <Text textStyle='xl' bold>
                          Photos
                        </Text>
                      </div>
                      <div className={styles.companyCultureTopImage}>
                        <div className={styles.embla}>
                          <div className={styles.emblaViewport} ref={emblaRef}>
                            <div className={styles.emblaContainer}>
                              {company.pictures.map((picture, index) => (
                                <div className={styles.emblaSlide} key={picture.id}>
                                  <div className={styles.emblaSlideInner}>
                                    <img
                                      src={picture.url}
                                      alt={`${company.name} photo ${index}`}
                                      className={`${styles.emblaSlideImage}`}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className={styles.slidesControl}>
                            <div
                              className={classNames([
                                styles.slidesControlItem,
                                styles.slidesControlLeft
                              ])}
                              onClick={scrollPrev}
                            />
                            <div
                              className={classNames([
                                styles.slidesControlItem,
                                styles.slidesControlRight
                              ])}
                              onClick={scrollNext}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.companySection}>
            <div className={styles.companyCulture}>
              <div className={styles.companyCultureContent}>
                <div className={styles.companyCultureWrapper}>
                  <div className={styles.companyCultureHeading}>
                    <Text textStyle='xl' bold>
                      Company Culture
                    </Text>
                  </div>
                  <Text>
                    {company.name} has not uploaded any information about their company life. Please
                    come back again.
                  </Text>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.companySection} id='companyJobs'>
          <div className={styles.companyCultureJobs}>
            <div className={styles.companyCultureHeading}>
              <Text textStyle='xl' bold>
                Jobs
              </Text>
              {companyJobs?.length > 0 && (
                <Link
                  to={`${company?.company_url}/jobs`}
                  className={styles.companyCultureHeadingLink}
                >
                  <Text textColor='primaryBlue' textStyle='base'>
                    See all Jobs
                  </Text>
                </Link>
              )}
            </div>

            {totalActiveJobs > 0 && (
              <div className={styles.companyJobsSearch}>
                <div className={styles.companyJobsSearchLeft}>
                  <MaterialTextField
                    value={jobQuery}
                    defaultValue={jobQuery}
                    onChange={(e) => setJobQuery(e.target.value)}
                    className={styles.companyJobsSearchTitle}
                    size='small'
                    label='Search for job title'
                    isSubmitOnEnter={true}
                    onSubmit={handleSearchCompanyJobSearch}
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
                  <MaterialButton
                    variant='contained'
                    capitalize
                    className={styles.companyJobsSearchButton}
                    onClick={handleSearchCompanyJobSearch}
                  >
                    <Text textColor='white' bold>
                      Search
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
                    <div className={styles.companyCultureJobsList}>
                      {companyJobs.map((companyJob) => {
                        const company = {
                          title: companyJob.job_title,
                          location: companyJob.job_location,
                          salary: companyJob.salary_range_value,
                          availability: companyJob.job_type,
                          jobUrl: companyJob.job_url
                        }

                        return <CompanyJobsCard {...company} key={companyJob.id} />
                      })}
                    </div>
                    <div className={styles.companyJobsPagination}>
                      <MaterialRoundedPagination
                        onChange={handlePaginationClick}
                        defaultPage={Number(page) || 1}
                        totalPages={totalPages || 1}
                        page={selectedPage}
                      />
                    </div>
                  </>
                )}
              </React.Fragment>
            ) : (
              totalActiveJobs != 0 && (
                <div className={styles.emptyResult}>
                  <Text>We couldn't find any jobs matching your search.</Text>
                </div>
              )
            )}
          </div>
          {totalActiveJobs === 0 && (
            <Text>{company.name} does not have any job openings now. Please come back again.</Text>
          )}
        </div>
      </div>
    </CompanyProfileLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null
  const companyPageUrl = req.url.split('/')
  const companyPath = companyPageUrl[companyPageUrl.length - 1].split('-')

  let companyId
  if (companyPath[companyPath.length - 1].includes('?page=')) {
    companyId = Number(companyPath[companyPath.length - 1].split('?page=')[0])
  } else {
    companyId = Number(companyPath[companyPath.length - 1])
  }

  const jobFilterpayload = {
    companyIds: companyId,
    size: 10,
    page: 1
  }

  store.dispatch(fetchJobsListRequest({ ...jobFilterpayload }, accessToken))
  store.dispatch(fetchCompanyDetailRequest(companyId))
  store.dispatch(fetchConfigRequest())
  store.dispatch(END)

  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const companyDetail = storeState.companies.companyDetail.response.data

  if (!companyDetail) {
    return {
      notFound: true
    }
  }

  const companyName = companyDetail.name
  const jobList = storeState.job.jobList.response.data
  const totalActiveJobs = jobList?.total_num || 0
  const seoMetaTitle = `Working at ${companyName} | Bossjob`
  const seoMetaDescription = encodeURI(
    `Discover career opportunities at ${companyName}, learn more about ${companyName} by reading employee reviews, benefits and culture on Bossjob!`
  )

  return {
    props: {
      companyDetail,
      accessToken,
      seoMetaTitle,
      seoMetaDescription,
      totalActiveJobs
    }
  }
})

export default CompanyDetail
