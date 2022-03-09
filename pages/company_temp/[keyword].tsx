import React, { useState } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import { Tabs, Tab } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// @ts-ignore
import { END } from 'redux-saga'

// Redux Actions
import { wrapper } from 'store'
import { fetchCompanyDetailRequest } from 'store/actions/companies/fetchCompanyDetail'

// Components
import Layout from 'components/Layout'
import SEO from 'components/SEO'
import Text from 'components/Text'
import Link from 'components/Link'
import Image from 'next/image'

// Images
import {
  FacebookOutline,
  LinkedinOutline,
  InstagramOutline,
  YoutubeOutline,
  CareerGrowth,
  DailyRoutine,
  PersonalHealth,
  TeamCollaboration,
  Strategy,
  Insurance,
  PerksAndBenefits,
  Leaves
} from 'images'

// Styles
import styles from './Company.module.scss'
import breakpointStyles from 'styles/breakpoint.module.scss'

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
  },
})

const CompanyDetail = (props: any) => {
  const router = useRouter()
  const { companyDetail } = props
  const company = companyDetail?.response.data
  const imgPlaceholder = 'https://assets.bossjob.com/companies/1668/cover-pictures/0817984dff0d7d63fcb8193fef08bbf2.jpeg'

  const [tabValue, setTabValue] = useState('overview')
  
  // console.log(company)
  // console.log(router)

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Team Collaboration':
        return <Image src={TeamCollaboration} width="25" height="25"/>
      case 'Daily Routines':
        return <Image src={DailyRoutine} width="25" height="25"/>
      case 'Career Growth':
        return <Image src={CareerGrowth} width="25" height="25"/>
      case 'Personal Health':
        return <Image src={PersonalHealth} width="25" height="25"/>
      case 'Strategy':
        return <Image src={Strategy} width="25" height="25"/>
      case 'Insurance, Health & Wellness':
        return <Image src={Insurance} width="25" height="25"/>
      case 'Perks & Benefits':
        return <Image src={PerksAndBenefits} width="25" height="25"/>
      default:
        return <Image src={Leaves} width="25" height="25"/>
    }
    
  }

  return (
    <Layout>
      <SEO title={`${company.name} Company`} />
      <div className={styles.company}>
        <div className={styles.companyContent}>
          <div className={styles.companyHeader}>
            <img 
              src={company.cover_pic_url || imgPlaceholder} 
              alt={company.name} 
              className={styles.companyBanner}
            />
            <div className={styles.companyProfile}>
              <img src={company.logo} alt={company.name} />
              <Text textStyle='xxl' bold>{company.name}</Text>
            </div>
            <div className={styles.companyTabs}>
              <ThemeProvider theme={theme}>
                <Tabs 
                  value={tabValue} 
                  centered
                  onChange={(e: any) => setTabValue(e.target.childNodes[0].textContent.toLowerCase() || 'jobs')}
                >
                  <Tab 
                    className={styles.companyTabsItem}
                    value="overview" 
                    label={
                      <Text bold textColor={tabValue === 'overview' ? 'primaryBlue' : 'black'}>Overview</Text>
                    }
                  />
                  <Tab 
                    className={styles.companyTabsItem}
                    value="life" 
                    label={
                      <Text bold textColor={tabValue === 'life' ? 'primaryBlue' : 'black'}>Life</Text>
                    }
                  />
                  <Tab 
                    className={styles.companyTabsItem}
                    value="jobs" 
                    label={
                      <Text bold textColor={tabValue === 'jobs' ? 'primaryBlue' : 'black'}>
                        Jobs
                        <span className={styles.companyJobsBadge}>999+</span>
                      </Text>
                    }
                  />
                </Tabs>
              </ThemeProvider>
            </div>
                
            {tabValue === 'overview' && (
              <div className={styles.companyTabsContent}>
                <div className={styles.companyOverview}>
                  <div className={styles.companyOverviewContents}>
                    <div className={styles.companyOverviewLeft}>
                      <div className={styles.companyOverviewItem}>
                        <Text textStyle='lg' bold>Company Size: </Text>
                        <Text textStyle='lg'>{company.company_size} Employees</Text>
                      </div>
                      <div className={styles.companyOverviewItem}>
                        <Text textStyle='lg' bold>Industry: </Text>
                        <Text textStyle='lg'>{company.industry}</Text>
                      </div>
                      <div className={styles.companyOverviewItem}>
                        <Text textStyle='lg' bold>Website: </Text>
                        <Text textStyle='lg'>{company.website}</Text>
                      </div>
                    </div>
                    <div className={styles.companyOverviewRight}>
                      <div className={styles.companyOverviewItem}>
                        <Text textStyle='lg' bold>Location: </Text>
                        <Text textStyle='lg'>{company.address}, {company.location}, {company.country}</Text>
                      </div>
                      <div className={styles.companyOverviewItem}>
                        <Text textStyle='lg' bold>Social Media: </Text>
                        <div className={styles.companyOverviewSocial}>
                          <Link external className={styles.companyOverviewSocialLink} to={company.facebook_url ? company.facebook_url : router.asPath}>
                            <img src={FacebookOutline} />
                          </Link>
                          <Link external className={styles.companyOverviewSocialLink} to={company.linkedin_url ? company.linkedin_url : router.asPath}>
                            <img src={LinkedinOutline} />
                          </Link>
                          <Link external className={styles.companyOverviewSocialLink} to={company.instagram_url ? company.instagram_url : router.asPath}>
                            <img src={InstagramOutline} />
                          </Link>
                          <Link external className={styles.companyOverviewSocialLink} to={company.youtube_url ? company.youtube_url : router.asPath}>
                            <img src={YoutubeOutline} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Text textStyle='lg' bold className={styles.companySectionTitle}>About the company</Text>
                <div className={styles.companyDescription} dangerouslySetInnerHTML={{ __html: company.description_html }} />

                <div className={styles.companyCulture}>
                  <div className={styles.companyCultureHeading}>
                    <Text textStyle='lg' bold>Culture & Benefits</Text>
                    <div onClick={() => setTabValue('life')} className={classNames(styles.companyCultureHeadingLink, breakpointStyles.hideOnMobile)}>
                      <Text textColor='primaryBlue' textStyle='base'>View all culture & benefits</Text>
                    </div>
                  </div>
                  <div className={styles.companyCultureContent}>
                    <div className={styles.companyCultureTopImage}>
                      {company.pictures?.length > 0 && (
                        <img src={company.pictures[0].url} alt={company.name}/>
                      )}
                    </div>
                    <div className={styles.companyCultureWrapper}>
                      <div className={styles.companyCultureSection}>
                        <Text className={styles.companyCultureSectionTitle} textStyle='lg' bold>Company Culture</Text>
                        <div className={styles.companyCultureList}>
                          {company.cultures?.length > 0 && company.cultures.map((item) => (
                            <Text className={styles.companyCultureItem} textStyle='base' key={item.id}>{item.value}</Text>
                          ))}
                        </div>
                      </div>
                      <div className={styles.companyCultureSection}>
                        <Text className={styles.companyCultureSectionTitle} textStyle='lg' bold>Employee Benefits</Text>
                        <div className={styles.companyCultureList}>
                          {company.benefits?.length > 0 && company.benefits.map((item) => (
                            <Text className={styles.companyCultureItem} textStyle='base' key={item.id}>{item.value}</Text>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div onClick={() => setTabValue('life')}  className={classNames(styles.companyCultureHeadingLink, breakpointStyles.hideOnDesktop)}>
                    <Text textColor='primaryBlue' textStyle='base'>View all culture & benefits</Text>
                  </div>
                </div>
              </div>
            )}

            {tabValue === 'life' && (
              <div className={styles.companyTabsContent}>
                {company.pictures?.length > 0 && (
                  <div className={styles.companyLifePictures}>
                    {company.pictures.map((picture) => (
                      <img key={picture.id} src={picture.url} alt={company.name} className={styles.companyLifePicture}/>
                    ))}
                  </div>
                )}
                
                {company.cultures?.length > 0 && (
                  <div className={styles.companyLifeCultures}>
                    <Text textStyle='xxl' bold className={styles.companySectionTitle}>Company Culture</Text>
                    <div className={styles.companyLifeCategoryList}>
                      {company.cultures.map((culture) => (
                        <div className={styles.companyLifeCategoryGroup} key={culture.id}>
                          <div className={styles.companyLifeCategory}>
                            {getCategoryIcon(culture.category)}
                            <Text textStyle='base' bold>{culture.category}</Text>
                          </div>
                          <Text textStyle='base' className={styles.companyLifeCategoryValue}>{culture.value}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {company.benefits?.length > 0 && (
                  <div className={styles.companyLifeCultures}>
                    <Text textStyle='xxl' bold className={styles.companySectionTitle}>Employee Benefits</Text>
                    <div className={styles.companyLifeCategoryList}>
                      {company.benefits.map((benefit) => (
                        <div className={styles.companyLifeCategoryGroup} key={benefit.id}>
                          <div className={styles.companyLifeCategory}>
                            {getCategoryIcon(benefit.category)}
                            <Text textStyle='base' bold>{benefit.category}</Text>
                          </div>
                          <Text textStyle='base' className={styles.companyLifeCategoryValue}>{benefit.value}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
        <div className={styles.relatedCompany}></div>
      </div>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const companyPageUrl = req.url.split('/')
  const companyPath = companyPageUrl[companyPageUrl.length - 1].split('-')
  const companyId = Number(companyPath[companyPath.length - 1])

  store.dispatch(fetchCompanyDetailRequest(companyId))
  store.dispatch(END)

  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const companyDetail = storeState.companies.companyDetail

  return {
    props: {
      companyDetail
    }
  }
})

export default CompanyDetail