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
import { getDictionary } from 'get-dictionary'
// Redux Actions
import { fetchFeaturedCompaniesListRequest } from 'store/actions/companies/fetchFeaturedCompaniesList'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'

// Styles
import styles from './Companies.module.scss'
import BannerCarousel from 'components/BannerCarousel'

// Assets
import { BlueTickIcon } from 'images'
import { getCountry, getCountryKey } from 'helpers/country'
import { formatTemplateString } from 'helpers/formatter'
import { changeCompanyValueWithConfigure } from 'helpers/config/changeCompanyValue'
import { flatMap } from 'lodash-es'

const Companies = (props: any) => {
  const {
    lang: { companies },
    langKey
  } = props
  const dispatch = useDispatch()
  const router = useRouter()
  const { page } = router.query
  const [featuredCompanies, setFeaturedCompanies] = useState(null)
  const [featuredCompany, setFeaturedCompany] = useState(null)
  const [totalPage, setTotalPage] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const config = useSelector((store: any) => store.config.config.response)

  // useEffect(() => {
  //   dispatch(fetchConfigRequest())
  // }, [])

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
      const companies = featuredCompaniesResponse.featured_companies.map((item) => {
        changeCompanyValueWithConfigure(item.company, config)
        return item
      })
      if (!companies || (companies && !companies.length)) return
      setFeaturedCompany(companies[0]?.company)
      companies.shift()

      setFeaturedCompanies(companies)
    }
  }, [featuredCompaniesResponse])
  console.log(langKey, 9999)
  const handleKeywordSearch = (keyword) => {
    const words = keyword.trim()
    router.push(`/${langKey}/companies/search?query=${words}&size=15&page=1`)
  }

  const handlePaginationClick = (event, val) => {
    router.query.page = val
    router.push(router, undefined, { shallow: true })
  }

  return (
    <Layout {...props}>
      <div className={styles.companies}>
        <div className={styles.searchCompany}>
          <Text
            textStyle='xxxl'
            tagName='h1'
            bold
            className={styles.searchCompanyTitle}
            textColor='primaryBlue'
          >
            {formatTemplateString(companies.title, getCountry())}
          </Text>
          <SearchCompanyField
            transitions={companies.search}
            onKeywordSearch={handleKeywordSearch}
          />
        </div>

        <BannerCarousel slides={featureBanners} />

        <Text textStyle='xxl' tagName='h2' bold className={styles.featuredEmployerSectionTitle}>
          {companies.employer.title}
        </Text>
        <div className={styles.featuredEmployer}>
          {featuredCompany && (
            <div className={styles.featuredEmployerLeft}>
              <div className={styles.featuredEmployerInfo}>
                <Link to={'/' + langKey + featuredCompany?.company_url || '/'}>
                  <img
                    src={featuredCompany?.logo_url}
                    alt={`${featuredCompany?.name} logo`}
                    className={styles.featuredEmployerImage}
                  />
                </Link>
                <div className={styles.featuredEmployerDetails}>
                  <Text textStyle='xl' bold>
                    <Link
                      to={'/' + langKey + featuredCompany?.company_url || '/'}
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
                        {companies.employer.size}
                      </Text>
                      <Text textStyle='lg'>
                        {featuredCompany?.company_size} {companies.employer.employees}
                      </Text>
                    </div>
                    <div className={styles.featuredEmployerAboutItem}>
                      <Text textStyle='lg' bold>
                        {companies.employer.industry}
                      </Text>
                      <Text textStyle='lg'>{featuredCompany?.industry}</Text>
                    </div>
                  </div>
                  <Text textStyle='lg' tagName='p' className={styles.featuredEmployerDescription}>
                    {featuredCompany?.short_description}
                  </Text>
                  <Link
                    to={`${featuredCompany?.company_url ? '/' + langKey + featuredCompany.company_url + '/jobs' : '/jobs'
                      }`}
                    className={styles.featuredEmployerOpenings}
                  >
                    <Text textStyle='lg' bold>
                      {formatTemplateString(
                        companies.employer.allJobs,
                        featuredCompany?.num_of_active_jobs
                      )}
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
          {companies.popularCompany.title}
        </Text>
        <CompanyCardList
          companiesList={featuredCompanies}
          isLoading={isFeaturedCompaniesFetching}
          transitions={companies.popularCompany}
          langKey={langKey}
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

export const getServerSideProps = wrapper.getServerSideProps((store) => async (props) => {
  const { page, lang }: any = props.query
  const dictionary = await getDictionary(lang)
  const { seo: { company } } = dictionary
  store.dispatch(fetchConfigRequest(lang))
  store.dispatch(fetchFeaturedCompaniesListRequest({ page: Number(page) || 1 }))
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const country = dictionary.seo[getCountryKey()]
  // const storeState = store.getState()
  // console.log({ store })
  // const location_lists = storeState?.config?.config?.response?.location_lists ?? []
  // const flatLocations =  flatMap(location_lists,item => item.locations)
  // const location = 
  return {
    props: {
      seoMetaTitle: formatTemplateString(company.listTitle, country),
      seoMetaDescription: formatTemplateString(company.listDescription, country),
      canonicalUrl: '/companies',
      lang: dictionary,
      langKey: lang
    }
  }
})

export default Companies
