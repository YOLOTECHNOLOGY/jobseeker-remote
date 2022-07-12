import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tabs, Tab } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import slugify from 'slugify'

// Redux Actions
import { fetchSimilarCompanyRequest } from 'store/actions/companies/fetchSimilarCompany'

// Components
import Layout from 'components/Layout'
import SEO from 'components/SEO'
import Text from 'components/Text'
import Link from 'components/Link'

// Styles
import styles from './CompanyProfileLayout.module.scss'
import JobDetailSidebarCard from 'components/Loader/JobDetailSidebarCard'

const theme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '50px',
        },
        centered: {
          justifyContent: 'flex-start',
          ['@media (max-width: 780px)']: {
            // eslint-disable-line no-useless-computed-key
            justifyContent: 'center',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          textTransform: 'capitalize',
        },
      },
    },
  },
})

interface ICompanyProfileLayout {
  children: React.ReactNode
  company: any
  currentTab: string
  totalJobs: number
  seoMetaTitle: string
  seoMetaDescription: string
}

const CompanyProfileLayout = ({
  children,
  company,
  currentTab,
  totalJobs,
  seoMetaTitle,
  seoMetaDescription,
}: ICompanyProfileLayout) => {
  const dispatch = useDispatch()
  const imgPlaceholder =
    'https://assets.bossjob.com/companies/1668/cover-pictures/0817984dff0d7d63fcb8193fef08bbf2.jpeg'

  const [tabValue, setTabValue] = useState(currentTab)
  const [similarCompanies, setSimilarCompanies] = useState(null)

  const similarCompaniesResponse = useSelector(
    (store: any) => store.companies.fetchSimilarCompany.response
  )
  const isSimilarCompanyFetching = useSelector((store: any) => store.companies.fetchSimilarCompany.fetching)

  useEffect(() => {
    dispatch(fetchSimilarCompanyRequest({ companyId: company.id }))
  }, [])

  useEffect(() => {
    if (similarCompaniesResponse) setSimilarCompanies(similarCompaniesResponse)
  }, [similarCompaniesResponse])

  // TODO: temp fix for cananonical link
  const currentUrl = (typeof window !== 'undefined') ? window.location.pathname : '/'

  return (
    <Layout>
      <SEO title={seoMetaTitle} description={seoMetaDescription} canonical={currentUrl} imageUrl={company.logo_url}/>
      <div className={styles.company}>
        <div className={styles.companyContent}>
          <div className={styles.companyHeader}>
            <img
              src={company.cover_pic_url || imgPlaceholder}
              alt={`${company.name} banner`}
              className={styles.companyBanner}
            />
            <div className={styles.companyProfile}>
              <img src={company.logo_url} alt={`${company.name} logo`} />
              <Text tagName='h1' textStyle='xxl' bold>
                {company.name}
              </Text>
            </div>

            <div className={styles.companyTabs}>
              <ThemeProvider theme={theme}>
                <Tabs
                  value={tabValue}
                  centered
                  onChange={(e: any) => {
                    const tab = e.target.childNodes[0].textContent.toLowerCase()
                    setTabValue(tab === 'overview' || tab === 'life' ? tab : 'jobs')
                  }}
                >
                  <Tab
                    className={styles.companyTabsItem}
                    value='overview'
                    href={`/company/${slugify(company.name)}-${company.id}`}
                    label={
                      <Text
                        bold
                        textStyle='xl'
                        textColor={tabValue === 'overview' ? 'primaryBlue' : 'black'}
                      >
                        Overview
                      </Text>
                    }
                  />
                  <Tab
                    className={styles.companyTabsItem}
                    value='life'
                    href={`/company/${slugify(company.name)}-${company.id}/life`}
                    label={
                      <Text
                        bold
                        textStyle='xl'
                        textColor={tabValue === 'life' ? 'primaryBlue' : 'black'}
                      >
                        Life
                      </Text>
                    }
                  />
                  <Tab
                    className={styles.companyTabsItem}
                    value='jobs'
                    href={`/company/${slugify(company.name)}-${company.id}/jobs`}
                    label={
                      <Text
                        bold
                        textStyle='xl'
                        textColor={tabValue === 'jobs' ? 'primaryBlue' : 'black'}
                      >
                        Jobs
                        <span className={styles.companyJobsBadge}>{totalJobs}</span>
                      </Text>
                    }
                  />
                </Tabs>
              </ThemeProvider>
            </div>
          </div>

          {children}
        </div>

        <div className={styles.relatedCompany}>
          <div className={styles.relatedCompanyContent}>
            <Text textStyle='xl' bold>
              People also viewed...
            </Text>

            {isSimilarCompanyFetching && [...Array(10)].map((_, i) => <JobDetailSidebarCard key={i} />)}

            {similarCompanies?.length > 0 && (
              <div className={styles.relatedCompanyList}>
                {similarCompanies.map((company) => (
                  <Link
                    to={`/company/${slugify(company.name)}-${company.id}`}
                    key={company.id}
                    className={styles.relatedCompanyItem}
                    aTag
                  >
                    <img
                      src={company.logo_url}
                      alt={`${company.name} logo`}
                      className={styles.relatedCompanyImage}
                    />
                    <Text textStyle='lg' bold className={styles.relatedCompanyName}>
                      {company.name}
                    </Text>
                    <Text textStyle='lg'>{company.industry}</Text>
                  </Link>
                ))}
              </div>
            )}
            <Link to='/companies' className={styles.relatedCompanyLink}>
              <Text textColor='primaryBlue' textStyle='base'>
                View all
              </Text>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CompanyProfileLayout
