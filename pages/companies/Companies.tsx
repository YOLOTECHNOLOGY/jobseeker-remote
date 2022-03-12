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

import { ImageList, ImageListItem } from '@mui/material'

// Redux Actions
import { fetchFeaturedCompaniesListRequest } from 'store/actions/companies/fetchFeaturedCompaniesList'
import { fetchCompanySuggestionsRequest } from 'store/actions/companies/fetchCompanySuggestions'

// Helpers
import useDebounce from 'helpers/useDebounce' 

// Styles
import styles from './Companies.module.scss'
import breakpointStyles from 'styles/breakpoint.module.scss'

const Companies = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [featuredCompanies, setFeaturedCompanies] = useState(null)
  const [featuredCompany, setFeaturedCompany] = useState(null)
  const [companySuggestions, setCompanySuggestions] = useState(null)
  const [searchText, setSearchText] = useState('')

  const featuredCompaniesResponse = useSelector((store: any) => store.companies.fetchFeaturedCompaniesList.response)
  const isFeaturedCompaniesFetching = useSelector((store: any) => store.companies.fetchFeaturedCompaniesList.fetching)
  const fetchCompanySuggestionsResponse = useSelector((store: any) => store.companies.fetchCompanySuggestions.response)

  useEffect(() => {
    dispatch(fetchFeaturedCompaniesListRequest())
  }, [])

  useEffect(() => {
    if (featuredCompaniesResponse?.featured_companies) {
      const companies = featuredCompaniesResponse.featured_companies
      setFeaturedCompany(companies[0].company)
      companies.shift()
      setFeaturedCompanies(companies)
    }
  }, [featuredCompaniesResponse])

  useEffect(() => {
    if (fetchCompanySuggestionsResponse) {
      setCompanySuggestions(fetchCompanySuggestionsResponse.items)
    }
  }, [fetchCompanySuggestionsResponse])

  useDebounce(() => {
      if (!searchText) setCompanySuggestions(null)
      if (searchText) {
        const payload = {
          query: searchText,
          size: 5,
          page: 1
        }

        dispatch(fetchCompanySuggestionsRequest(payload))
      }
    }, 300, [searchText])

  const handleKeywordSearch = (keyword) => {
    setCompanySuggestions(null)
    router.push(`/companies/search?query=${keyword}&size=9&page=1`)
  }

  return (
    <Layout>
      <SEO title='Company Directories' />

      <div className={styles.companies}>
        <div className={styles.searchCompany}>
          <Text textStyle='xxxl' tagName='p' bold className={styles.searchCompanyTitle} textColor='primaryBlue'>Find great companies in Phillipines</Text>
          <SearchCompanyField
            suggestions={companySuggestions}
            onSearch={setSearchText}
            onKeywordSearch={handleKeywordSearch}
          />
        </div>

        <div className={styles.banner}>
          <img src="https://dummyimage.com/1920x450/000/fff" alt="" className={classNames([breakpointStyles.hideOnMobileAndTablet, styles.bannerImage])} />
          <img src="https://dummyimage.com/788x401/000/fff" alt="" className={classNames([breakpointStyles.hideOnMobileAndDesktop, styles.bannerImage])} />
          <img src="https://dummyimage.com/788x638/000/fff" alt="" className={classNames([breakpointStyles.hideOnTabletAndDesktop, styles.bannerImage])} />
        </div>

        <Text textStyle='xxxl' tagName='p' bold className={styles.featuredEmployerSectionTitle}>Featured Employer</Text>
        <div className={styles.featuredEmployer}>
          <div className={styles.featuredEmployerLeft}>
            <div className={styles.featuredEmployerInfo}>
              <img 
                src={featuredCompany?.logo_url} 
                alt={featuredCompany?.name} 
                className={styles.featuredEmployerImage}
              />
              <div className={styles.featuredEmployerDetails}>
                <Link to={`/companies/${slugify(featuredCompany?.name.toLowerCase() || '')}-${featuredCompany?.id}`} className={styles.featuredEmployerName}>
                  <Text textStyle='xl' bold tagName='p'>{featuredCompany?.name}</Text>
                </Link>
                <div className={styles.featuredEmployerAbout}>
                  <div className={styles.featuredEmployerAboutItem}>
                    <Text textStyle='base' bold>Company Size</Text>
                    <Text textStyle='base'>{featuredCompany?.company_size_value} Employees</Text>
                  </div>
                  <div className={styles.featuredEmployerAboutItem}>
                    <Text textStyle='base' bold>Industry</Text>
                    <Text textStyle='base'>{featuredCompany?.industry_value}</Text>
                  </div>
                </div>
                <Text textStyle='base' tagName='p' className={styles.featuredEmployerDescription}>
                  {featuredCompany?.short_description}
                </Text>
                <Link to={`/companies/${slugify(featuredCompany?.name.toLowerCase() || '')}-${featuredCompany?.id}`} className={styles.featuredEmployerOpenings}>
                  <Text textStyle='lg' bold>View {featuredCompany?.num_of_active_jobs} job openings</Text>
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.featuredEmployerRight}>
            <div className={breakpointStyles.hideOnMobileAndTablet}>
              <ImageList sx={{ width: 500, height: 335 }} gap={10} cols={3}>
                {featuredCompany?.pictures?.length > 0 && featuredCompany.pictures.map((item) => (
                  <ImageListItem key={item.id}>
                    <img
                      src={item.url}
                      srcSet={item.url}
                      alt={featuredCompany.name}
                      loading="lazy"
                      className={styles.featuredEmployerPhoto}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </div>
            <div className={breakpointStyles.hideOnDesktop}>
              {featuredCompany?.pictures?.length > 0 && (
                <img 
                  src={featuredCompany.pictures[0].url} 
                  alt={featuredCompany.name}
                  className={styles.featuredEmployerSinglePhoto}
                />
              )}
            </div>
          </div>
        </div>

        <Text textStyle='xxxl' tagName='p' bold className={styles.featuredEmployerSectionTitle}>Popular Companies</Text>
        <CompanyCardList 
          companiesList={featuredCompanies} 
          isLoading={isFeaturedCompaniesFetching}
        />
      </div>
    </Layout>
  )
}

export default Companies