import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Tabs, Tab } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { isMobile } from 'react-device-detect'

// Redux Actions
import { fetchSimilarCompanyRequest } from 'store/actions/companies/fetchSimilarCompany'

// Components
import Layout from 'components/Layout'
// import SEO from 'components/SEO'
import Text from 'components/Text'
import Link from 'components/Link'
import MaterialDesktopTooltip from 'components/MaterialDesktopTooltip'
import MaterialMobileTooltip from 'components/MaterialMobileTooltip'
import UploadResumeButton from 'components/LncreaseUserConversion/UploadResumeButton/UploadResumeButton'

// Styles
import styles from './CompanyProfileLayout.module.scss'
import JobDetailSidebarCard from 'components/Loader/JobDetailSidebarCard'

// Assets
import { BlueTickIcon } from 'images'
import { changeCompanyValueWithConfigure } from 'helpers/config/changeCompanyValue'

const theme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '50px'
        },
        centered: {
          justifyContent: 'flex-start',
          ['@media (max-width: 780px)']: {
            // eslint-disable-line no-useless-computed-key
            justifyContent: 'center'
          }
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          textTransform: 'capitalize'
        }
      }
    }
  }
})

interface ICompanyProfileLayout {
  children: React.ReactNode
  company: any
  currentTab: string
  totalJobs: number
  seoMetaTitle: string
  seoMetaDescription: string
  accessToken?: boolean
  lang?: any
}
const CompanyProfileLayout = ({
  children,
  company,
  currentTab,
  totalJobs,
  accessToken,
  lang
}: ICompanyProfileLayout) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const imgPlaceholder =
    'https://assets.bossjob.com/companies/1668/cover-pictures/0817984dff0d7d63fcb8193fef08bbf2.jpeg'
  const {
    companyDetail: { tab, rightSection }
  } = lang

  const tabs = useMemo<{ value: string; label: string; path?: string; badge?: number }[]>(() => {
    return [
      { value: 'overview', path: '' },
      { value: 'life' },
      { value: 'jobs', badge: totalJobs }
    ].map((item) => {
      ;(item as any).label = tab[item.value]
      return item
    }) as any
  }, [])

  const [tabValue, setTabValue] = useState(currentTab)
  const [similarCompanies, setSimilarCompanies] = useState(null)

  const similarCompaniesResponse = useSelector(
    (store: any) => store.companies.fetchSimilarCompany.response
  )
  const isSimilarCompanyFetching = useSelector(
    (store: any) => store.companies.fetchSimilarCompany.fetching
  )
  const config = useSelector((store: any) => store.config.config.response)

  useEffect(() => {
    dispatch(fetchSimilarCompanyRequest({ companyId: company.id }))
  }, [])

  useEffect(() => {
    if (similarCompaniesResponse && Array.isArray(similarCompaniesResponse)) {
      setSimilarCompanies(
        similarCompaniesResponse?.map((item) => {
          changeCompanyValueWithConfigure(item, config)
          return item
        })
      )
    }
  }, [similarCompaniesResponse])

  const handleQuickUploadResumeClick = () => {
    router.push('/quick-upload-resume')
  }

  // const additionalCanonicalText =
  //   currentTab == 'jobs' ? '/jobs' : currentTab == 'life' ? '/life' : ''
  const companyUrl = company.company_url
  // const canonicalUrl = companyUrl + additionalCanonicalText

  return (
    <Layout lang={lang}>
      {/* <SEO
        title={seoMetaTitle}
        description={seoMetaDescription}
        canonical={canonicalUrl}
        imageUrl={company.logo_url}
      /> */}
      <div className={styles.company}>
        <div className={styles.companyContent}>
          <div className={styles.companyHeader}>
            <img
              src={company.cover_pic_url || imgPlaceholder}
              alt={`${company.name} banner`}
              className={styles.companyBanner}
            />
            <div className={styles.companyProfile}>
              <img
                src={company.logo_url}
                alt={`${company.name} logo`}
                width='78px'
                height='78px'
                className={styles.companyProfileImage}
              />
              <Text tagName='h1' textStyle='xxl' bold>
                {company.name}
                {company?.is_verify &&
                  (isMobile ? (
                    <MaterialMobileTooltip
                      icon={BlueTickIcon}
                      className={styles.companyTooltip}
                      title='Verified'
                    />
                  ) : (
                    <MaterialDesktopTooltip
                      icon={BlueTickIcon}
                      className={styles.companyTooltip}
                      title='Verified'
                    />
                  ))}
              </Text>
            </div>

            <div className={styles.companyTabs}>
              <ThemeProvider theme={theme}>
                <Tabs
                  value={tabValue}
                  centered
                  onChange={(e: any, value) => {
                    setTabValue(value)
                  }}
                >
                  {tabs.map((item) => {
                    let { path, label, value, badge } = item
                    path = path ?? `/${value}`
                    return (
                      <Tab
                        key={value}
                        className={styles.companyTabsItem}
                        value={value}
                        href={companyUrl + path}
                        label={
                          <Text
                            bold
                            textStyle='xl'
                            textColor={tabValue === value ? 'primaryBlue' : 'black'}
                          >
                            {label}
                            {badge && <span className={styles.companyJobsBadge}>{badge}</span>}
                          </Text>
                        }
                      />
                    )
                  })}
                </Tabs>
              </ThemeProvider>
            </div>
          </div>

          {children}
        </div>

        <div className={styles.relatedCompany}>
          {!accessToken && (
            <div className={styles.relatedCompanyQuickUploadResume}>
              <UploadResumeButton
                isShowBtn={!accessToken}
                handleClick={handleQuickUploadResumeClick}
                isShowArrowIcon
                className={styles.arrowIconPostion}
                text={rightSection.uploadResume}
              />
            </div>
          )}

          <div className={styles.relatedCompanyContent}>
            <Text textStyle='xl' bold>
              {rightSection.othersViewed}
            </Text>

            {isSimilarCompanyFetching &&
              [...Array(10)].map((_, i) => <JobDetailSidebarCard key={i} />)}

            {similarCompanies?.length > 0 && (
              <div className={styles.relatedCompanyList}>
                {similarCompanies.map((company) => (
                  <div key={company.id}>
                    <Link
                      to={company?.company_url || '/'}
                      key={company.id}
                      className={styles.relatedCompanyImageItem}
                    >
                      <img
                        src={company.logo_url}
                        alt={`${company.name} logo`}
                        className={styles.relatedCompanyImage}
                      />
                    </Link>
                    <Text textStyle='lg' bold className={styles.relatedCompanyName}>
                      <Link
                        to={company?.company_url || '/'}
                        key={company.id}
                        className={styles.relatedCompanyNameItem}
                      >
                        {company.name}
                      </Link>
                      {company?.is_verify &&
                        (isMobile ? (
                          <MaterialMobileTooltip
                            icon={BlueTickIcon}
                            className={styles.companyTooltip}
                            title='Verified'
                          />
                        ) : (
                          <MaterialDesktopTooltip
                            icon={BlueTickIcon}
                            className={styles.companyTooltip}
                            title='Verified'
                          />
                        ))}
                    </Text>
                    <div className={styles.relatedCompanyIndustry}>
                      <Text textStyle='lg'>{company.industry}</Text>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link to='/companies' className={styles.relatedCompanyLink}>
              <Text textColor='primaryBlue' textStyle='base'>
                {rightSection.viewAll}
              </Text>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CompanyProfileLayout
