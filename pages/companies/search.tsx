import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import slugify from 'slugify'

// Redux Actions
import { fetchCompanySuggestionsRequest } from 'store/actions/companies/fetchCompanySuggestions'
import { fetchCompanyFilterRequest } from 'store/actions/companies/fetchCompanyFilter'

// Components
import Layout from 'components/Layout'
import Text from 'components/Text'
import SEO from 'components/SEO'
import CompanyCardList from 'components/Company/CompanyCardList'
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'
import SearchCompanyField from 'components/SearchCompanyField/SearchCompanyField'

// Helpers
import { unslugify } from 'helpers/formatter'
import useDebounce from 'helpers/useDebounce'
import useWindowDimensions from 'helpers/useWindowDimensions'

// Styles
import styles from './Companies.module.scss' 

const Search = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { query, page, size } = router.query
  const { width } = useWindowDimensions()

  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [companySuggestions, setCompanySuggestions] = useState(null)
  const [companies, setCompanies] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchCompanySuggestionsResponse = useSelector((store: any) => store.companies.fetchCompanySuggestions.response)
  const fetchCompanyFilterResponse = useSelector((store: any) => store.companies.fetchCompanyFilter.response)
  const isCompanyFilterFetching = useSelector((store: any) => store.companies.fetchCompanyFilter.fetching)

  useEffect(() => {
    setSearchText(unslugify(query))

    const searchFilterPayload = {
      query: unslugify(query),
      size: size,
      page: page,
      source: width < 768 ? 'mobile_web' : 'web'
    }

    setCurrentPage(Number(page))
    dispatch(fetchCompanyFilterRequest(searchFilterPayload))
  }, [router.query])

  useEffect(() => {
    if (fetchCompanySuggestionsResponse) setCompanySuggestions(fetchCompanySuggestionsResponse.items)
  }, [fetchCompanySuggestionsResponse])

  useEffect(() => {
    if (fetchCompanyFilterResponse) {
      setCompanies(fetchCompanyFilterResponse.companies)
      setTotalPages(fetchCompanyFilterResponse.total_pages)
    }
    setCompanySuggestions(null)
  }, [fetchCompanyFilterResponse])

  useDebounce(() => {
    if (!searchText) setCompanySuggestions(null)
    if (searchText && !isInitialLoad) {
      const payload = {
        query: searchText,
        size: 5,
        page: 1
      }

      dispatch(fetchCompanySuggestionsRequest(payload))
    }
  }, 300, [searchText])

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
  }

  const handleKeywordSearch = (keyword) => {
    router.push(`/companies/search?query=${slugify(keyword)}&size=30&page=1`)
    setCompanySuggestions(null)
  }

  const handleOnSearch = (value) => {
    setIsInitialLoad(false)
    setSearchText(value)
  }

  const handlePaginationClick = (_, newPage) => {
    scrollToTop()
    router.query.page = newPage
    router.push(router, undefined, { shallow: true })
  }
  
  return (
    <Layout>
      <SEO title='Company Directories' />

      <div className={styles.companies}>
        <div className={styles.searchCompany}>
          <Text textStyle='xxl' tagName='p' bold className={styles.searchCompanyTitle}>Search Companies</Text>
          <SearchCompanyField
            searchValue={searchText}
            suggestions={companySuggestions}
            onSearch={handleOnSearch}
            onKeywordSearch={handleKeywordSearch}
          />
          <Text textStyle='xl' tagName='p' bold className={styles.searchCompanyTitle}>
            Companies for “{query ? unslugify(query) : 'all'}” 
            {companies?.length === 0 && (
              <span> - No Results Found.</span>
            )}
          </Text>
        </div>

        <div className={styles.companiesList}>
          <CompanyCardList 
            companiesList={companies} 
            isLoading={isCompanyFilterFetching}
            isSearchPage
          />
        </div>
        
        {companies?.length > 0 && (
          <div className={styles.companiesPagination}>
            <MaterialRoundedPagination 
              onChange={handlePaginationClick} 
              defaultPage={1} 
              totalPages={totalPages} 
              page={currentPage}
            />
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Search