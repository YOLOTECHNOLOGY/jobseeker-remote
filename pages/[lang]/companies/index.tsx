import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

/* Action Creators */
import { wrapper } from 'store'

// @ts-ignore
import { END } from 'redux-saga'

// Components
import Layout from 'components/Layout'
import Text from 'components/Text'
import CompanyCardList from './components/CompanyCardList'
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'
import { getDictionary } from 'get-dictionary'
// Redux Actions
import { fetchCompanyFilterRequest } from 'store/actions/companies/fetchCompanyFilter'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'

// Styles
import styles from './Companies.module.scss'

// Assets
import { getCountryKey } from 'helpers/country'
import { formatTemplateString } from 'helpers/formatter'
import { changeCompanyValueWithConfigure } from 'helpers/config/changeCompanyValue'
import SortFilter from './components/SortFilter'
import SearchCompany from './components/SearchCompany'
import FeaturedCompanied from './components/FeaturedCompanied'
import { useFirstRender } from 'helpers/useFirstRender'

const initSearchQueries = {
  query: '',
  size: 15,
  page: 1,
  company_size_ids: '',
  financing_stage_ids: '',
  industry_ids: '',
  location_ids: ''
}

interface IProps {
  lang: any
  langKey: string
}

const Companies = (props: IProps) => {
  const {
    lang: { companies },
    langKey
  } = props

  const dispatch = useDispatch()
  const [featuredCompanies, setFeaturedCompanies] = useState(null)
  const [featuredCompany, setFeaturedCompany] = useState(null)
  const [totalPage, setTotalPage] = useState(null)
  const [reset, setReset] = useState(true)
  const firstRender = useFirstRender()
  const [searchQuery, setSearchQuery] = useState({ ...initSearchQueries })
  const clearSearchRef = useRef(null)

  const config = useSelector((store: any) => store.config.config.response)

  const fetchCompanyFilterResponse = useSelector(
    (store: any) => store.companies.fetchCompanyFilter.response
  )
  const featureBanners = useSelector((store: any) => store.config.config.response.feature_banners)

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
    const pageSize = ((newQueries.page == 1) && isEmpty) ? 16 : 15
    newQueries = { ...newQueries, page: 1, size: pageSize }
    setReset(isEmpty)
    setSearchQuery(newQueries)
    dispatch(fetchCompanyFilterRequest(newQueries))
  }

  const handlePaginationClick = (event, val) => {
    const num = Number(val) || 1
    const isEmpty = Object.values(searchQuery).filter(Boolean).length === 2
    const pageSize = ((num == 1) && isEmpty) ? 16 : 15
    const newQueries = { ...searchQuery, page: num, size: pageSize }
    setSearchQuery(newQueries)
    dispatch(fetchCompanyFilterRequest(newQueries))
    setReset(isEmpty && num === 1)
  }

  const handleSortFilter = (query) => {
    if (firstRender) return
    let newQueries = { ...searchQuery, ...query}
    const isEmpty = Object.values(newQueries).filter(Boolean).length === 2
    const pageSize = ((newQueries.page == 1) && isEmpty) ? 16 : 15
    newQueries = { ...newQueries, page: 1, size: pageSize }
    setReset(isEmpty)
    setSearchQuery(newQueries)
    dispatch(fetchCompanyFilterRequest(newQueries))
  }

  const handleResetFilter = () => {
    setSearchQuery(initSearchQueries)
    clearSearchRef && clearSearchRef.current()
  }

  return (
    <Layout {...props}>
      <div className={styles.container}>
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
        <div className={styles.companies}>
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

          {/* Pagination */}
          {totalPage > 1 && (
            <div className={styles.companiesPagination}>
              <MaterialRoundedPagination
                onChange={handlePaginationClick}
                defaultPage={Number(searchQuery.page) || 1}
                totalPages={totalPage || 1}
                page={searchQuery.page}
                boundaryCount={1}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async (props) => {
  const { lang }: any = props.query
  const dictionary = await getDictionary(lang)
  const {
    seo: { company }
  } = dictionary
  store.dispatch(fetchConfigRequest(lang))

  const searchFilterPayload = {
    size: 16,
    page: 1
  }

  store.dispatch(fetchCompanyFilterRequest(searchFilterPayload))

  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const country = dictionary.seo[getCountryKey()]
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
