import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { isMobile } from 'react-device-detect'

/* Action Creators */
import { wrapper } from 'store'

// @ts-ignore
import { END } from 'redux-saga'

// Components
import Layout from 'components/Layout'
import Text from 'components/Text'
import Link from 'components/Link'
// import SEO from 'components/SEO'
import CompanyCardList from 'components/Company/CompanyCardList'
import SearchCompanyField from 'components/SearchCompanyField'
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'
import MaterialDesktopTooltip from 'components/MaterialDesktopTooltip'
import MaterialMobileTooltip from 'components/MaterialMobileTooltip'
import { ImageList, ImageListItem } from '@mui/material'

// Redux Actions
import { fetchFeaturedCompaniesListRequest } from 'store/actions/companies/fetchFeaturedCompaniesList'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'

// Styles
import styles from './Companies.module.scss'
import BannerCarousel from 'components/BannerCarousel'

// Assets
import { BlueTickIcon } from 'images'
import { getCountryKey } from 'helpers/country'

const COUNTRY_FULL_MAP = {
  'sg': 'Singapore',
  'ph': 'Philippines'
}


const Companies = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { page } = router.query
  const [featuredCompanies, setFeaturedCompanies] = useState(null)
  const [featuredCompany, setFeaturedCompany] = useState(null)
  const [totalPage, setTotalPage] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(fetchConfigRequest())
  }, [])
  const featuredCompaniesResponse = useSelector(
    (store: any) => store.companies.fetchFeaturedCompaniesList.response
  )
  const featureBanners = useSelector((store: any) => store.config.config.response.feature_banners)

  const isFeaturedCompaniesFetching = useSelector(
    (store: any) => store.companies.fetchFeaturedCompaniesList.fetching
  )

  useEffect(() => {
    setCurrentPage(Number(page) || 1)
    dispatch(fetchFeaturedCompaniesListRequest({ page: Number(router.query.page) }))
  }, [router.query])

  useEffect(() => {
    if (featuredCompaniesResponse?.featured_companies) {
      setTotalPage(featuredCompaniesResponse.total_pages)
      const companies = featuredCompaniesResponse.featured_companies
      if(!companies || (companies && !companies.length)) return
      setFeaturedCompany(companies[0]?.company)
      companies.shift()

      setFeaturedCompanies(companies)
    }
  }, [featuredCompaniesResponse])

  const handleKeywordSearch = (keyword) => {
    const words = keyword.trim()
    router.push(`/companies/search?query=${words}&size=9&page=1`)
  }

  const handlePaginationClick = (event, val) => {
    router.query.page = val
    router.push(router, undefined, { shallow: true })
  }

  const countryNames = () => {
    const currentCountryKey = getCountryKey()
    return COUNTRY_FULL_MAP[currentCountryKey]
  }

  return (
    <Layout>
      {/* <SEO
        title='Find Companies Hiring in Philippines | Bossjob'
        description='Discover great companies to work for in Philippines! Learn more about the company and apply to job openings on Bossjob!'
        canonical='/companies'
      /> */}
      <div className={styles.companies}>
        <div className={styles.searchCompany}>
          <Text
            textStyle='xxxl'
            tagName='h1'
            bold
            className={styles.searchCompanyTitle}
            textColor='primaryBlue'
          >
            Find great companies in {countryNames()}
          </Text>
          <SearchCompanyField onKeywordSearch={handleKeywordSearch} />
        </div>

        <BannerCarousel slides={featureBanners} />

        <Text textStyle='xxl' tagName='h2' bold className={styles.featuredEmployerSectionTitle}>
          Featured Employer
        </Text>
        <div className={styles.featuredEmployer}>
          {featuredCompany && (
            <div className={styles.featuredEmployerLeft}>
              <div className={styles.featuredEmployerInfo}>
                <Link to={featuredCompany?.company_url || '/'}>
                  <img
                    src={featuredCompany?.logo_url}
                    alt={`${featuredCompany?.name} logo`}
                    className={styles.featuredEmployerImage}
                  />
                </Link>
                <div className={styles.featuredEmployerDetails}>
                  <Text textStyle='xl' bold>
                    <Link
                      to={featuredCompany?.company_url || '/'}
                      className={styles.featuredEmployerName}
                    >
                      {featuredCompany?.name}
                    </Link>
                    {featuredCompany?.is_verify &&
                      (isMobile ? (
                        <MaterialMobileTooltip
                          icon={BlueTickIcon}
                          className={styles.featuredEmployerTooltip}
                          title='Verified'
                        />
                      ) : (
                        <MaterialDesktopTooltip
                          icon={BlueTickIcon}
                          className={styles.featuredEmployerTooltip}
                          title='Verified'
                        />
                      ))}
                  </Text>
                  <div className={styles.featuredEmployerAbout}>
                    <div className={styles.featuredEmployerAboutItem}>
                      <Text textStyle='lg' bold>
                        Company Size
                      </Text>
                      <Text textStyle='lg'>{featuredCompany?.company_size} Employees</Text>
                    </div>
                    <div className={styles.featuredEmployerAboutItem}>
                      <Text textStyle='lg' bold>
                        Industry
                      </Text>
                      <Text textStyle='lg'>{featuredCompany?.industry}</Text>
                    </div>
                  </div>
                  <Text textStyle='lg' tagName='p' className={styles.featuredEmployerDescription}>
                    {featuredCompany?.short_description}
                  </Text>
                  <Link
                    to={`${
                      featuredCompany?.company_url ? featuredCompany.company_url + '/jobs' : '/jobs'
                    }`}
                    className={styles.featuredEmployerOpenings}
                  >
                    <Text textStyle='lg' bold>
                      View {featuredCompany?.num_of_active_jobs} job openings
                    </Text>
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className={styles.featuredEmployerRight}>
            <div className={styles.featuredEmployerImages}>
              <ImageList sx={{ width: 500, height: 335 }} gap={10} cols={3}>
                {featuredCompany?.pictures?.length > 0 &&
                  featuredCompany.pictures.map((item) => (
                    <ImageListItem key={item.id}>
                      <img
                        src={item.url}
                        srcSet={item.url}
                        alt={`${featuredCompany?.name} photo`}
                        loading='lazy'
                        className={styles.featuredEmployerPhoto}
                      />
                    </ImageListItem>
                  ))}
              </ImageList>
            </div>
            <div className={styles.featuredEmployerImagesMobile}>
              {featuredCompany?.pictures?.length > 0 && (
                <img
                  src={featuredCompany.pictures[0].url}
                  alt={featuredCompany?.name}
                  className={styles.featuredEmployerSinglePhoto}
                />
              )}
            </div>
          </div>
        </div>

        <Text textStyle='xxl' tagName='h2' bold className={styles.featuredEmployerSectionTitle}>
          Popular Companies
        </Text>
        <CompanyCardList
          companiesList={featuredCompanies}
          isLoading={isFeaturedCompaniesFetching}
        />
        <div className={styles.companiesPagination}>
          <MaterialRoundedPagination
            onChange={handlePaginationClick}
            defaultPage={Number(currentPage) || 1}
            totalPages={totalPage || 1}
            page={currentPage}
          />
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query }) => {
  const { page } = query

  // store.dispatch(fetchConfigRequest())
  store.dispatch(fetchFeaturedCompaniesListRequest({ page: Number(page) || 1 }))
  store.dispatch(END)

  await (store as any).sagaTask.toPromise()
  return {
    props: {
      seoMetaTitle: 'Find Companies Hiring in Philippines | Bossjob',
      seoMetaDescription:
        'Discover great companies to work for in Philippines! Learn more about the company and apply to job openings on Bossjob!',
      canonicalUrl: '/companies'
    }
  }
})

export default Companies
