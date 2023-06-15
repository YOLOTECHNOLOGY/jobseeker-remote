import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

/* Action Creators */
import { wrapper } from 'store'

// Redux Actions
import { fetchCompanyFilterRequest } from 'store/actions/companies/fetchCompanyFilter'

// Components
import Layout from 'components/Layout'
import Text from 'components/Text'
// import SEO from 'components/SEO'
import CompanyCardList from 'components/Company/CompanyCardList'
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'
import SearchCompanyField from 'components/SearchCompanyField/SearchCompanyField'

// Helpers
import { formatTemplateString, unslugify } from 'helpers/formatter'
import useWindowDimensions from 'helpers/useWindowDimensions'

// Styles
import styles from './Companies.module.scss'
import MetaText from '../../../components/MetaText'
import { getCountry,getLang } from 'helpers/country'
import { END } from 'redux-saga'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { getDictionary } from 'get-dictionary'
import { changeCompanyValueWithConfigure } from 'helpers/config/changeCompanyValue'
import { configKey } from 'helpers/cookies'

interface SearchProps {
  defaultQuery: string
  lang: Record<string, any>
}

const Search = ({ defaultQuery, lang }: SearchProps) => {
  const { companies: transitions } = lang
  const router = useRouter()
  const dispatch = useDispatch()
  const { query, page, size } = router.query
  const { width } = useWindowDimensions()

  const [companies, setCompanies] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchCompanyFilterResponse = useSelector(
    (store: any) => store.companies.fetchCompanyFilter.response
  )
  const isCompanyFilterFetching = useSelector(
    (store: any) => store.companies.fetchCompanyFilter.fetching
  )
  const config = useSelector((store: any) => store.config.config.response)
  useEffect(() => {
    const searchFilterPayload = {
      query,
      size: size,
      page: page,
      source: width < 768 ? 'mobile_web' : 'web'
    }

    setCurrentPage(Number(page))
    dispatch(fetchCompanyFilterRequest(searchFilterPayload))
  }, [router.query])

  useEffect(() => {
    if (fetchCompanyFilterResponse) {
      setCompanies(
        fetchCompanyFilterResponse.companies?.map((item) => {
          changeCompanyValueWithConfigure(item, config)
          return item
        })
      )
      setTotalPages(fetchCompanyFilterResponse.total_pages)
    }
  }, [fetchCompanyFilterResponse])

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  }

  const handleKeywordSearch = (keyword) => {
    const words = keyword.trim()
    router.push(`/companies/search?query=${words}&size=15&page=1`)
  }

  const handlePaginationClick = (_, newPage) => {
    scrollToTop()
    router.query.page = newPage
    router.push(router, undefined, { shallow: true })
  }

  return (
    <Layout lang={lang}>
      <div className={styles.companies}>
        <div className={styles.searchCompany}>
          <Text textStyle='xxxl' tagName='h1' bold className={styles.searchCompanyTitle}>
            {transitions.searchPage.title}
          </Text>
          <MetaText tagName='h1'>
            {formatTemplateString(transitions.searchPage.seoText, getCountry())}
          </MetaText>
          <SearchCompanyField
            defaultQuery={defaultQuery}
            onKeywordSearch={handleKeywordSearch}
            transitions={transitions.search}
          />
        </div>
        <div className={styles.searchCompanyQuery}>
          <Text textStyle='xl' tagName='p' bold>
            {formatTemplateString(
              transitions.searchPage.subTitle,
              `"${query ? unslugify(query) : 'all'}"`
            )}
            {companies?.length === 0 && <span> - {transitions.searchPage.noResult}</span>}
          </Text>
        </div>
        <div className={styles.companiesList}>
          <CompanyCardList
            companiesList={companies}
            isLoading={isCompanyFilterFetching}
            isSearchPage
            transitions={transitions.popularCompany}
            langKey={getLang()}
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

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, query }) => {
  const { lang }: any = query
  const dictionary = await getDictionary(lang)

  store.dispatch(fetchConfigRequest(lang))
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()

  return {
    props: {
      defaultQuery: query.query || null,
      lang: dictionary,
      seoMetaTitle: `Find Companies Hiring in ${getCountry()} | Bossjob`,
      seoMetaDescription: `Discover great companies to work for in ${getCountry()}! Learn more about the company and apply to job openings on Bossjob!`,
      canonicalUrl: '/companies/search'
    }
  }
})

export default Search
