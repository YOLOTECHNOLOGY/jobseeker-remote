import { useEffect, useState, useCallback } from 'react'
import slugify from 'slugify'
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

// Components
import Text from 'components/Text'
import Link from 'components/Link'
import CompanyJobsCard from 'components/Company/CompanyJobsCard'
import CompanyProfileLayout from 'components/Company/CompanyProfileLayout'
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'
import MaterialTextField from 'components/MaterialTextField'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialButton from 'components/MaterialButton'

// Images
import {
  FacebookOutline,
  LinkedinOutline,
  InstagramOutline,
  YoutubeOutline
} from 'images'

// Helpers
import { formatSalaryRange } from 'helpers/formatter'

// Styles
import styles from '../Company.module.scss'

const CompanyDetail = (props: any) => {
  const size = 10
  const router = useRouter()
  const dispatch = useDispatch()
  const { page } = router.query
  const [jobQuery, setJobQuery] = useState('')

  const { companyDetail } = props
  const company = companyDetail?.response.data
  const [companyJobs, setCompanyJobs] = useState(null)
  const [totalJobs, setTotalJobs] = useState(null)
  const [totalPages, setTotalPages] = useState(null)
  const [jobLocation, setJobLocation] = useState(null)
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    loop: true,
    skipSnaps: false,
    slidesToScroll: 1,
    inViewThreshold: 0.7
  })

  const fetchJobsListResponse = useSelector((store: any) => store.job.jobList.response)

  useEffect(() => {
    const payload = {
      companyIds: company.id,
      size: 30,
      page: page ? Number(page) : 1
    }

    dispatch(fetchJobsListRequest({...payload}))
  }, [])

  useEffect(() => {
    if (fetchJobsListResponse) {
      setCompanyJobs(fetchJobsListResponse.data?.jobs)
      setTotalJobs(fetchJobsListResponse.data?.total_num)
      setTotalPages(fetchJobsListResponse.data?.total_pages)
    }
  }, [fetchJobsListResponse])

  useEffect(() => {
    const payload = {
      companyIds: company.id,
      size: 30,
      page: page ? Number(page) : 1
    }

    dispatch(fetchJobsListRequest({...payload}))
  }, [router.query])

  const handlePaginationClick = (event, val) => {
    router.query.page = val
    router.push(router, undefined, { shallow: true })
  }

  const handleSearchCompanyJobSearch = () => {
    const payload = {
      companyIds: company.id,
      size,
      page,
      query: jobQuery,
      jobLocation: jobLocation?.value || ''
    }

    dispatch(fetchJobsListRequest({...payload}))
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

  return (
    <CompanyProfileLayout
      company={company}
      currentTab='overview'
      totalJobs={totalJobs}
    >
      <div className={styles.companyTabsContent}>
        <div className={styles.companySection}>
          <Text textStyle='lg' bold className={styles.companySectionTitle}>About the company</Text>
          <div className={styles.companyDescription} dangerouslySetInnerHTML={{ __html: company.description_html }} />
          <div className={styles.companyOverview}>
            <div className={styles.companyOverviewContents}>
              <div className={styles.companyOverviewLeft}>
                <div className={styles.companyOverviewItem}>
                  <Text textStyle='lg' bold>Company Size: </Text>
                  <Text textStyle='lg'>{company.company_size} Employees</Text>
                </div>
                <div className={styles.companyOverviewItem}>
                  <Text textStyle='lg' bold>Industry: </Text>
                  <Text textStyle='lg'>{company.industry}</Text>
                </div>
                <div className={styles.companyOverviewItem}>
                  <Text textStyle='lg' bold>Website: </Text>
                  <Text textStyle='lg'>{company.website}</Text>
                </div>
              </div>
              <div className={styles.companyOverviewRight}>
                <div className={styles.companyOverviewItem}>
                  <Text textStyle='lg' bold>Location: </Text>
                  <Text textStyle='lg' className={styles.companyOverviewLocation}>{company.full_address}</Text>
                </div>
                <div className={classNames(styles.companyOverviewItem, styles.companyOverviewItemSocial)}>
                  <Text textStyle='lg' bold>Social Media: </Text>
                  <div className={styles.companyOverviewSocial}>
                    <Link external className={styles.companyOverviewSocialLink} to={company.facebook_url ? company.facebook_url : router.asPath}>
                      <img src={FacebookOutline} />
                    </Link>
                    <Link external className={styles.companyOverviewSocialLink} to={company.linkedin_url ? company.linkedin_url : router.asPath}>
                      <img src={LinkedinOutline} />
                    </Link>
                    <Link external className={styles.companyOverviewSocialLink} to={company.instagram_url ? company.instagram_url : router.asPath}>
                      <img src={InstagramOutline} />
                    </Link>
                    <Link external className={styles.companyOverviewSocialLink} to={company.youtube_url ? company.youtube_url : router.asPath}>
                      <img src={YoutubeOutline} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.companySection}>
          <div className={styles.companyCulture}>
            <div className={styles.companyCultureContent}>
              <div className={styles.companyCultureWrapper}>
                {company.cultures?.length > 0 && (
                  <div className={styles.companyCultureSection}>
                    <div className={styles.companyCultureHeading}>
                      <Text textStyle='lg' bold>Company Culture</Text>
                      <Link to={`/company/${slugify(company.name)}-${company.id}/life`} className={classNames(styles.companyCultureHeadingLink, styles.companyCultureHeadingLinkTop)}>
                        <Text textColor='primaryBlue' textStyle='base'>View all</Text>
                      </Link>
                    </div>
                    <div className={styles.companyCultureList}>
                      {company.cultures.map((item) => (
                        <Text className={styles.companyCultureItem} textStyle='base' key={item.id}>{item.value}</Text>
                      ))}
                    </div>
                    <Link to={`/company/${slugify(company.name)}-${company.id}/life`} className={classNames(styles.companyCultureHeadingLink, styles.companyCultureHeadingLinkBottom)}>
                      <Text textColor='primaryBlue' textStyle='base'>View all</Text>
                    </Link>
                  </div>
                )}
                {company.benefits?.length > 0 && (
                  <div className={styles.companyCultureSection}>
                    <div className={styles.companyCultureHeading}>
                      <Text textStyle='lg' bold>Employee Benefits</Text>
                      <Link to={`/company/${slugify(company.name)}-${company.id}/life`} className={classNames(styles.companyCultureHeadingLink, styles.companyCultureHeadingLinkTop)}>
                        <Text textColor='primaryBlue' textStyle='base'>View all</Text>
                      </Link>
                    </div>
                    <div className={styles.companyCultureList}>
                      {company.benefits.map((item) => (
                        <Text className={styles.companyCultureItem} textStyle='base' key={item.id}>{item.value}</Text>
                      ))}
                    </div>
                    <Link to={`/company/${slugify(company.name)}-${company.id}/life`} className={classNames(styles.companyCultureHeadingLink, styles.companyCultureHeadingLinkBottom)}>
                      <Text textColor='primaryBlue' textStyle='base'>View all</Text>
                    </Link>
                  </div>
                )}
                {company.pictures?.length > 0 && (
                  <div className={styles.companyCultureSection}>
                    <div className={styles.companyCultureHeading}>
                      <Text textStyle='lg' bold>Photos</Text>
                    </div>
                    <div className={styles.companyCultureTopImage}>
                      <div className={styles.embla}>
                        <div className={styles.emblaViewport} ref={emblaRef}>
                          <div className={styles.emblaContainer}>
                            {company.pictures.map((picture) => (
                              <div className={styles.emblaSlide} key={picture.id}>
                                <div className={styles.emblaSlideInner}>
                                  <img src={picture.url} className={`${styles.emblaSlideImage}`} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className={styles.slidesControl}>
                          <div className={classNames([styles.slidesControlItem, styles.slidesControlLeft])} onClick={scrollPrev}/>
                          <div className={classNames([styles.slidesControlItem, styles.slidesControlRight])} onClick={scrollNext}/>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>  
        </div>

        <div className={styles.companySection}>
          <div className={styles.companyCultureJobs}>
            <div className={styles.companyCultureHeading}>
              <Text textStyle='lg' bold>Jobs</Text>
              <Link to={`/company/${slugify(company.name)}-${company.id}/jobs`} className={styles.companyCultureHeadingLink}>
                <Text textColor='primaryBlue' textStyle='base'>See all Jobs</Text>
              </Link>
            </div>
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
            <div className={styles.companyCultureJobsList}>
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
            <div className={styles.companyJobsPagination}>
                <MaterialRoundedPagination onChange={handlePaginationClick} defaultPage={Number(page) || 1} totalPages={totalPages || 1} />
              </div>
          </div>
        </div>
      </div>
    </CompanyProfileLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const companyPageUrl = req.url.split('/')
  const companyPath = companyPageUrl[companyPageUrl.length - 1].split('-')
  let companyId
  if (companyPath[companyPath.length - 1].includes('?page=')) {
    companyId = Number(companyPath[companyPath.length - 1].split('?page=')[0])
  } else {
    companyId = Number(companyPath[companyPath.length - 1])
  }
  
  store.dispatch(fetchCompanyDetailRequest(companyId))
  store.dispatch(END)

  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const companyDetail = storeState.companies.companyDetail

  return {
    props: {
      companyDetail
    }
  }
})

export default CompanyDetail