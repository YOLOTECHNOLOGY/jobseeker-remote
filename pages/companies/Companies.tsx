import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import slugify from 'slugify'
import classNames from 'classnames/bind'

// Components
import Layout from 'components/Layout'
import Text from 'components/Text'
import Link from 'components/Link'
import SEO from 'components/SEO'
import CompanyCardList from 'components/Company/CompanyCardList'
import SearchCompanyField from 'components/SearchCompanyField'
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'

import { ImageList, ImageListItem } from '@mui/material'

// Redux Actions
import { fetchFeaturedCompaniesListRequest } from 'store/actions/companies/fetchFeaturedCompaniesList'

// Styles
import styles from './Companies.module.scss'
import breakpointStyles from 'styles/breakpoint.module.scss'

const Companies = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [featuredCompanies, setFeaturedCompanies] = useState(null)
  const [featuredCompany, setFeaturedCompany] = useState(null)
  const [totalPage, setTotalPage] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const featuredCompaniesResponse = useSelector((store: any) => store.companies.fetchFeaturedCompaniesList.response)
  const isFeaturedCompaniesFetching = useSelector((store: any) => store.companies.fetchFeaturedCompaniesList.fetching)

  useEffect(() => {
    dispatch(fetchFeaturedCompaniesListRequest({}))
  }, [])

  useEffect(() => {
    setCurrentPage(Number(router.query.page))
    dispatch(fetchFeaturedCompaniesListRequest({page: Number(router.query.page)}))
  }, [router.query])

  useEffect(() => {
    if (featuredCompaniesResponse?.featured_companies) {
      setTotalPage(featuredCompaniesResponse.total_pages)
      const companies = featuredCompaniesResponse.featured_companies
      if (!featuredCompany) {
        setFeaturedCompany(companies[0].company)
        companies.shift()
      }
      setFeaturedCompanies(companies)
    }
  }, [featuredCompaniesResponse])

  const handleKeywordSearch = (keyword) => {
    router.push(`/companies/search?query=${keyword}&size=9&page=1`)
  }

  const handlePaginationClick = (event, val) => {
    router.query.page = val
    router.push(router, undefined, { shallow: true })
  }

  return (
    <Layout>
      <SEO
        title='Find Companies Hiring in Philippines | Bossjob'
        description='Discover great companies to work for in Philippines! Learn more about the company and apply to job openings on Bossjob!'
        canonical='/companies'
      />
      <div className={styles.companies}>
        <div className={styles.searchCompany}>
          <Text
            textStyle='xxxl'
            tagName='h1'
            bold
            className={styles.searchCompanyTitle}
            textColor='primaryBlue'
          >
            Find great companies in Phillipines
          </Text>
          <SearchCompanyField onKeywordSearch={handleKeywordSearch} />
        </div>

        <div className={styles.banner}>
          <img
            src='https://dummyimage.com/1920x450/000/fff'
            alt=''
            className={classNames([breakpointStyles.hideOnMobileAndTablet, styles.bannerImage])}
          />
          <img
            src='https://dummyimage.com/788x401/000/fff'
            alt=''
            className={classNames([breakpointStyles.hideOnMobileAndDesktop, styles.bannerImage])}
          />
          <img
            src='https://dummyimage.com/788x638/000/fff'
            alt=''
            className={classNames([breakpointStyles.hideOnTabletAndDesktop, styles.bannerImage])}
          />
        </div>

        <Text textStyle='xxl' tagName='h2' bold className={styles.featuredEmployerSectionTitle}>
          Featured Employer
        </Text>
        <div className={styles.featuredEmployer}>
          <div className={styles.featuredEmployerLeft}>
            <div className={styles.featuredEmployerInfo}>
              <img
                src={featuredCompany?.logo_url}
                alt={`${featuredCompany?.name} logo`}
                className={styles.featuredEmployerImage}
              />
              <div className={styles.featuredEmployerDetails}>
                <Link
                  to={`/company/${slugify(featuredCompany?.name.toLowerCase() || '')}-${
                    featuredCompany?.id
                  }`}
                  className={styles.featuredEmployerName}
                >
                  <Text textStyle='xl' bold tagName='h3'>
                    {featuredCompany?.name}
                  </Text>
                </Link>
                <div className={styles.featuredEmployerAbout}>
                  <div className={styles.featuredEmployerAboutItem}>
                    <Text textStyle='base' bold>
                      Company Size
                    </Text>
                    <Text textStyle='base'>{featuredCompany?.company_size_value} Employees</Text>
                  </div>
                  <div className={styles.featuredEmployerAboutItem}>
                    <Text textStyle='base' bold>
                      Industry
                    </Text>
                    <Text textStyle='base'>{featuredCompany?.industry_value}</Text>
                  </div>
                </div>
                <Text textStyle='base' tagName='p' className={styles.featuredEmployerDescription}>
                  {featuredCompany?.short_description}
                </Text>
                <Link
                  to={`/company/${slugify(featuredCompany?.name.toLowerCase() || '')}-${
                    featuredCompany?.id
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
          />
        </div>
      </div>
    </Layout>
  )
}

export default Companies