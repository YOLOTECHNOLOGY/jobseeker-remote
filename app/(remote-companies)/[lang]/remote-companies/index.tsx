'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isMobile } from 'react-device-detect'

import CompanyCardList from 'app/(companies)/[lang]/companies/components/CompanyCardList'
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'
// import { fetchCompanyFilterRequest } from 'store/actions/companies/fetchCompanyFilter'
import styles from 'app/(companies)/[lang]/companies/Companies.module.scss'
import { changeCompanyValueWithConfigure } from 'helpers/config/changeCompanyValue'
import SortFilter from 'app/(companies)/[lang]/companies/components/SortFilter'
import SearchCompany from 'app/(companies)/[lang]/companies/components/SearchCompany'
import { useFirstRender } from 'helpers/useFirstRender'
import CompanyCardLoader from 'components/Loader/CompanyCard'
import Image from 'next/image'
import { fetchSearchRemoteService } from 'store/services/companies2/fetchCompanyRemote'

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

  const [featuredCompanies, setFeaturedCompanies] = useState(null)
  //  const [featuredCompany, setFeaturedCompany] = useState(null)
  const [totalPage, setTotalPage] = useState(null)
  const [reset, setReset] = useState(true)
  const firstRender = useFirstRender()
  const [searchQuery, setSearchQuery] = useState({ ...initSearchQueries })
  const clearSearchRef = useRef(null)
  const [isFeaturedCompaniesFetching, setIsFeaturedCompaniesFetching] = useState(true)
  const { config } = configs
  useEffect(() => {
    getData()
  }, [searchQuery])

  const getData = () => {
    setIsFeaturedCompaniesFetching(true)

    const newObj = Object.entries(searchQuery).reduce((acc, [key, value]) => {
      if (value) acc[key] = value
      return acc
    }, {})
    fetchSearchRemoteService(newObj)
      .then((res) => {
        const data = res?.data?.data
        console.log(data, 8888)
        setTotalPage(data.total_pages)
        const companies = data.companies.map((item) => {
          changeCompanyValueWithConfigure(item, config)
          return item
        })
        console.log(companies, 8888999)
        setFeaturedCompanies(companies)
      })
      .finally(() => setIsFeaturedCompaniesFetching(false))
  }

  const handleKeywordSearch = (keyword) => {
    const words = keyword.trim()
    let newQueries = { ...searchQuery, query: words, page: 1 }
    const isEmpty = Object.values(newQueries).filter(Boolean).length === 2
    newQueries = { ...newQueries, page: 1 }
    setReset(isEmpty)
    setSearchQuery(newQueries)
  }

  const handlePaginationClick = (event, val) => {
    const num = Number(val) || 1
    const isEmpty = Object.values(searchQuery).filter(Boolean).length === 2
    const newQueries = { ...searchQuery, page: num }
    setSearchQuery(newQueries)
    setReset(isEmpty && num === 1)
    window.scrollTo(0, 0)
  }

  const handleSortFilter = (query) => {
    if (firstRender) return
    let newQueries = { ...searchQuery, ...query }
    const isEmpty = Object.values(newQueries).filter(Boolean).length === 2
    newQueries = { ...newQueries, page: 1 }
    setReset(isEmpty)
    setSearchQuery(newQueries)
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
          <Image
            fill
            alt='bg'
            style={{ objectFit: 'cover' }}
            src={`${process.env.S3_BUCKET_URL}/companies/companies-search-bg.svg`}
          />

          <div className={styles.searchCompany} style={{ paddingBottom: '20px' }}>
            <SearchCompany
              transitions={companies.search}
              clearSearchRef={clearSearchRef}
              isRemote={true}
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
        <div
          className={styles.placeholderSpace}
          style={{
            height: searchQuery.page === 1 || isMobile ? 75 : 125,
            backgroundColor: searchQuery.page === 1 || isMobile ? '#ffffff' : '#F7F8FA'
          }}
        />

        {/* companies list */}
        <div className={styles.companiesWrapper}>
          <div className={styles.companies}>
            {/* fetching loading: true */}
            {isFeaturedCompaniesFetching && <CompaniesLoader />}

            {/* fetching loading: false */}
            {!isFeaturedCompaniesFetching && (
              <div>
                {/* company card title */}
                {reset ? (
                  <h2 className={styles.popularCompanyTitle}>{companies.popularCompany.title}</h2>
                ) : null}

                {/* company card list */}
                <CompanyCardList
                  companiesList={featuredCompanies}
                  isLoading={isFeaturedCompaniesFetching}
                  transitions={companies.popularCompany}
                  langKey={langKey}
                  config={config}
                  lang={props.lang}
                  page={searchQuery.page}
                />
              </div>
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
      </div>
    </>
  )
}

export default Companies
