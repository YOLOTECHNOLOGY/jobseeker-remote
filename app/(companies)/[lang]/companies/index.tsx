'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isMobile } from 'react-device-detect'

import Text from 'components/Text'
import CompanyCardList from './components/CompanyCardList'
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'
import { fetchCompanyFilterRequest } from 'store/actions/companies/fetchCompanyFilter'
import styles from './Companies.module.scss'
import { changeCompanyValueWithConfigure } from 'helpers/config/changeCompanyValue'
import SortFilter from './components/SortFilter'
import SearchCompany from './components/SearchCompany'
import FeaturedCompanied from './components/FeaturedCompanied'
import { useFirstRender } from 'helpers/useFirstRender'
import CompanyCardLoader from 'components/Loader/CompanyCard'

const initSearchQueries = {
  query: '',
  size: 15,
  page: 1,
  company_size_ids: '',
  financing_stage_ids: '',
  industry_ids: ''
}

interface IProps {
  lang: any
  langKey: string
  configs: any
  companyData: any
}

const Companies = (props: IProps) => {
  const {
    lang: { companies },
    langKey,
    configs
  } = props

  const dispatch = useDispatch()
  const [featuredCompanies, setFeaturedCompanies] = useState(null)
  const [featuredCompany, setFeaturedCompany] = useState(null)
  const [totalPage, setTotalPage] = useState(null)
  const [reset, setReset] = useState(true)
  const firstRender = useFirstRender()
  const [searchQuery, setSearchQuery] = useState({ ...initSearchQueries })
  const clearSearchRef = useRef(null)

  const { config } = configs
  useEffect(() => {
    dispatch(
      fetchCompanyFilterRequest({
        size: 16,
        page: 1
      })
    )
  }, [])
  const fetchCompanyFilterResponse = useSelector(
    (store: any) => store.companies.fetchCompanyFilter.response
  )
  const featureBanners = config.feature_banners
  const isFeaturedCompaniesFetching = useSelector(
    (store: any) => store.companies.fetchCompanyFilter.fetching
  )

  useEffect(() => {
    if (fetchCompanyFilterResponse?.companies) {
      setTotalPage(fetchCompanyFilterResponse.total_pages)
      const companies = fetchCompanyFilterResponse.companies.map((item) => {
        changeCompanyValueWithConfigure(item, config)
        return item
      })
      if (!companies || (companies && !companies.length)) {
        setFeaturedCompanies([])
        return
      }
      if (reset) {
        setFeaturedCompany(companies[0])
        setFeaturedCompanies(companies.slice(1))
      } else {
        setFeaturedCompany([])
        setFeaturedCompanies(companies)
      }
    }
  }, [fetchCompanyFilterResponse, reset])

  const handleKeywordSearch = (keyword) => {
    const words = keyword.trim()
    let newQueries = { ...searchQuery, query: words, page: 1 }
    const isEmpty = Object.values(newQueries).filter(Boolean).length === 2
    const pageSize = newQueries.page == 1 && isEmpty ? 16 : 15
    newQueries = { ...newQueries, page: 1, size: pageSize }
    setReset(isEmpty)
    setSearchQuery(newQueries)
    dispatch(fetchCompanyFilterRequest(newQueries))
  }

  const handlePaginationClick = (event, val) => {
    const num = Number(val) || 1
    const isEmpty = Object.values(searchQuery).filter(Boolean).length === 2
    const pageSize = num == 1 && isEmpty ? 16 : 15
    const newQueries = { ...searchQuery, page: num, size: pageSize }
    setSearchQuery(newQueries)
    dispatch(fetchCompanyFilterRequest(newQueries))
    setReset(isEmpty && num === 1)
    window.scrollTo(0, 0)
  }

  const handleSortFilter = (query) => {
    if (firstRender) return
    let newQueries = { ...searchQuery, ...query }
    const isEmpty = Object.values(newQueries).filter(Boolean).length === 2
    const pageSize = newQueries.page == 1 && isEmpty ? 16 : 15
    newQueries = { ...newQueries, page: 1, size: pageSize }
    setReset(isEmpty)
    setSearchQuery(newQueries)
    dispatch(fetchCompanyFilterRequest(newQueries))
  }

  const handleResetFilter = () => {
    setSearchQuery(initSearchQueries)
    clearSearchRef && clearSearchRef.current()
  }

  const CompaniesLoader = () => {
    return (
      <div className={styles.companyList}>
        {[...Array(12)].map((_, i) => (
          <div className={styles.companyItem} key={i}>
            <CompanyCardLoader />
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className={styles.container}>
        {/* search */}
        <div className={styles.searchContainer}>
          <div className={styles.searchCompany}>
            <SearchCompany
              transitions={companies.search}
              clearSearchRef={clearSearchRef}
              onKeywordSearch={handleKeywordSearch}
            />
            <SortFilter
              lang={props.lang}
              config={config}
              sortFilterFn={handleSortFilter}
              resetFilterFn={handleResetFilter}
            />
          </div>
        </div>

        {/* companies list */}
        <div className={styles.companies}>

          {/* fetching loading: true */}
          {isFeaturedCompaniesFetching && <CompaniesLoader />}

          {/* fetching loading: false */}
          {!isFeaturedCompaniesFetching && (
            <>
              {/* featured company */}
              {reset ? (
                <FeaturedCompanied
                  featuredCompany={featuredCompany}
                  langKey={langKey}
                  featureBanners={featureBanners}
                  lang={props.lang}
                />
              ) : null}

              {/* company card title */}
              {reset ? (
                <Text textStyle='xxl' tagName='h2' bold className={styles.popularCompanyTitle}>
                  {companies.popularCompany.title}
                </Text>
              ) : null}

              {/* company card list */}
              <CompanyCardList
                companiesList={featuredCompanies}
                isLoading={isFeaturedCompaniesFetching}
                transitions={companies.popularCompany}
                langKey={langKey}
                lang={props.lang}
              />
            </>
          )}

          {/* Pagination */}
          {totalPage > 1 && (
            <div className={styles.companiesPagination}>
              <MaterialRoundedPagination
                onChange={handlePaginationClick}
                defaultPage={Number(searchQuery.page) || 1}
                totalPages={totalPage || 1}
                page={searchQuery.page}
                boundaryCount={isMobile ? 0 : 1}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Companies
