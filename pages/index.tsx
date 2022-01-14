import React, { useState, useEffect, useRef } from 'react'
// @ts-ignore
import { END } from 'redux-saga'

/* Vendors */
import { useRouter } from 'next/router'
import slugify from 'slugify'

/* Action Creators */
import { wrapper } from 'store'

/* Redux Actions */
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchFeaturedCompaniesRequest } from 'store/actions/companies/fetchFeaturedCompanies'

/* Components */
import Image from 'next/image'
import Layout from 'components/Layout'
import Text from 'components/Text'
import Link from 'components/Link'

/* Material Components */
import MaterialButton from 'components/MaterialButton'
import MaterialTextField from 'components/MaterialTextField'
import MaterialLocationField from 'components/MaterialLocationField'

/* Helpers*/
import {
  categoryParser,
  conditionChecker,
} from 'helpers/jobPayloadFormatter'
import useWindowDimensions from 'helpers/useWindowDimensions'

/* Images */
import {
  BuildProfessionalResume,
  ChatDirectlyWithBoss,
  GetHeadhunted,
  LevelUpCareer,
  BusinessInsider,
  KrAsia,
  GrabVentures,
  MoneyMax,
  TechInAsia,
} from 'images'

/* styles */
import styles from './Home.module.scss'
import breakpointStyles from 'styles/breakpoint.module.scss'
// import classNamesCombined from 'classnames'

type configObject = {
  inputs: any
  filters: any
}

type companyObject = {
  id: number
  logo: string
  name: string
}

interface HomeProps {
  config: configObject
  topCompanies: companyObject[]
}

const Home = (props: HomeProps) => {
  const { width } = useWindowDimensions()
  const { topCompanies } = props
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const [locationValue, setLocationValue] = useState(null)

  const [activeFeature, updateActiveFeature] = useState(1)
  const [activeFeatureImg, updateActiveFeatureImg] = useState(1)
  const firstFeatureImgNode = useRef(null)
  const secondFeatureImgNode = useRef(null)
  const thirdFeatureImgNode = useRef(null)
  const fourthFeatureImgNode = useRef(null)
  useEffect(() => {
    if (activeFeature !== activeFeatureImg) {
      updateActiveFeatureImg(activeFeature)

      const activeNode =
        activeFeature === 1
          ? firstFeatureImgNode
          : activeFeature === 2
          ? secondFeatureImgNode
          : activeFeature === 3
          ? thirdFeatureImgNode
          : activeFeature === 4
          ? fourthFeatureImgNode
          : null

      let paragraphHeight = 0
      paragraphHeight = activeNode.current.querySelector('p').offsetHeight

      firstFeatureImgNode.current.style.height = 50 + 'px'
      secondFeatureImgNode.current.style.height = 50 + 'px'
      thirdFeatureImgNode.current.style.height = 50 + 'px'
      fourthFeatureImgNode.current.style.height = 50 + 'px'

      activeNode.current.style.height = 50 + paragraphHeight + 25 + 'px'
    } else {
      const activeNode =
        activeFeature === 1
          ? firstFeatureImgNode
          : activeFeature === 2
          ? secondFeatureImgNode
          : activeFeature === 3
          ? thirdFeatureImgNode
          : activeFeature === 4
          ? fourthFeatureImgNode
          : null

      if (activeNode.current.style.height <= 50) {
        const paragraphHeight = activeNode.current.querySelector('p').offsetHeight
        activeNode.current.style.height = 50 + paragraphHeight + 25 + 'px'
      }
    }
  }, [activeFeature])

  const updateUrl = (queryParam, queryObject) => {
    router.push({
      pathname: `${process.env.HOST_PATH}/jobs-hiring/${queryParam ? queryParam : 'job-search'}`,
      query: queryObject,
    })
  }

  const onLocationSearch = (event, value) => {
    setLocationValue(value)
  }

  const onSearch = () => {
    let queryParam = null
    if (locationValue) {
      const sanitisedLocValue = categoryParser(locationValue.value)
      queryParam = conditionChecker(searchValue, sanitisedLocValue)
    } else if (searchValue){
      queryParam = conditionChecker(searchValue)
    }
    updateUrl(queryParam, null)
  }

  const renderQuickLinks = () => {
    // To refactor when authentication is handled
    // const jobsPageLink = cookies.get('user')
    //   ? '/dashboard/jobs-hiring'
    //   : '/jobs-hiring'
    const jobsPageLink = '/jobs-hiring'
    return (
      <div className={styles.quickLinks}>
        <Link
          className={styles.link}
          to={`${jobsPageLink}/job-search/?jobCategory=audit-taxation,banking-financial,corporate-finance-investment,sales-financial-services,general-cost-accounting`}
          title='Finance jobs'
          aTag
        >
          <Text textStyle='sm' textColor='white'>Finance jobs</Text>
        </Link>
        <Link
          className={styles.link}
          to={`${jobsPageLink}/job-search/?jobCategory=sales-corporate,sales-eng-tech-it,sales-financial-services,marketing-business-dev`}
          title='Sales jobs'
          aTag
        >
          <Text textStyle='sm' textColor='white'>Sales jobs</Text>
        </Link>
        <Link
          className={styles.link}
          to={`${jobsPageLink}/job-search/?jobCategory=digital-marketing,marketing-business-dev,telesales-telemarketing`}
          title='Marketing jobs'
          aTag
        >
          <Text textStyle='sm' textColor='white'>Marketing jobs</Text>
        </Link>
        <Link className={styles.link} to={`${jobsPageLink}/makati-jobs`} title='Makati jobs' aTag>
          <Text textStyle='sm' textColor='white'>Makati jobs</Text>
        </Link>
        <Link
          className={styles.link}
          to={`${jobsPageLink}/job-search/?jobCategory=it-hardware,it-network-sys-db-admin,it-software-engineering,sales-eng-tech-it,tech-helpdesk-support`}
          title='IT jobs'
          aTag
        >
          <Text textStyle='sm' textColor='white'>IT jobs</Text>
        </Link>
        <Link
          className={styles.link}
          to={`${jobsPageLink}/overseas-jobs`}
          title='Overseas jobs'
          aTag
        >
          <Text textStyle='sm' textColor='white'>Overseas jobs</Text>
        </Link>
        <Link
          className={styles.link}
          to={`${jobsPageLink}/job-search/?jobCategory=customer-service,tech-helpdesk-support`}
          title='Customer Service jobs'
          aTag
        >
          <Text textStyle='sm' textColor='white'>Customer Service jobs</Text>
        </Link>
        <Link
          className={styles.link}
          to={`${jobsPageLink}/job-search/?salary=30K_to_60K,60K_to_80K,80K_to_100K,Above_200K`}
          title='₱30K + jobs'
          aTag
        >
          <Text textStyle='sm' textColor='white'>₱30K + jobs</Text>
        </Link>
        <Link className={styles.link} to={`${jobsPageLink}/manila-jobs`} title='Manila jobs' aTag>
          <Text textStyle='sm' textColor='white'>Manila jobs</Text>
        </Link>
        <Link
          className={styles.link}
          to={`${jobsPageLink}/job-search/?jobtype=full_time`}
          title='Full Time jobs'
          aTag
        >
          <Text textStyle='sm' textColor='white'>Full Time jobs</Text>
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Layout>
        <section className={styles.searchAndQuickLinkSection}>
          <Text
            tagName='h1'
            textStyle='xxxl'
            textColor='white'
            bold
            className={breakpointStyles.hideOnMobileAndTablet}
          >
            Find Jobs for Professionals in Phillipines
          </Text>
          <div className={styles.searchSection}>
            <div className={styles.searchAndLocationContainer}>
              <MaterialTextField
                id='search'
                label='Search for job title, keyword or company'
                variant='outlined'
                size='small'
                className={styles.searchField}
                onChange={(e)=>{
                  e.preventDefault()
                  setSearchValue(e.target.value)
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    onSearch()
                  }
                }}
              />
              <MaterialLocationField
                className={styles.locationField}
                // defValue={defaultLocation}
                // defValue={urlLocation}
                onChange={onLocationSearch}
              />
              <MaterialButton variant='contained' onClick={onSearch}>
                Search
              </MaterialButton>
            </div>
            <div className={styles.quickLinksContainer}>
              {renderQuickLinks()}
            </div>
          </div>
        </section>
        <div className={styles.main}>
          <div className={styles.companiesSection}>
            <div className={styles.topCompanies}>
              <Text tagName='h1' textStyle='xxxl' bold>
                Top Companies
              </Text>
              {width >= 799 ? (
                <div className={styles.topCompaniesList}>
                  {topCompanies?.map((company, index) => {
                    if (index < 25) {
                      return (
                        <Link
                          key={company.id}
                          className={styles.topCompaniesLogo}
                          to={`/company/${slugify(company.name.toLowerCase())}-${company.id}/jobs`}
                          external
                        >
                          <Image src={company.logo} alt={company.name} width='60' height='60' />
                        </Link>
                      )
                    }
                  })}
                  {topCompanies?.map((company, index) => {
                    if (index < 12) {
                      return (
                        <Link
                          key={company.id}
                          className={styles.topCompaniesLogo}
                          to={`/company/${slugify(company.name.toLowerCase())}-${company.id}/jobs`}
                          external
                        >
                          <Image src={company.logo} alt={company.name} width='60' height='60' />
                        </Link>
                      )
                    }
                  })}
                </div>
              ) : (
                <div className={styles.topCompaniesListMobile}>
                  {topCompanies?.map((company, index) => {
                    if (index < 10) {
                      return (
                        <Link
                          key={company.id}
                          className={styles.topCompaniesLogo}
                          to={`/company/${slugify(company.name.toLowerCase())}-${company.id}/jobs`}
                          external
                        >
                          <Image src={company.logo} alt={company.name} width='60' height='60' />
                        </Link>
                      )
                    }
                  })}
                </div>
              )}

              <div className={styles.viewAllCompanies}>
                <Link to='/' className={styles.viewAllCompaniesLink}>
                  <Text textStyle='lg' textColor='primaryBlue'>
                    View all companies
                  </Text>
                </Link>
              </div>
            </div>
            <div className={styles.companyBanners}>
              <div className={styles.companyBanner} />
              <div className={styles.companyBanner} />
            </div>
          </div>
          <div className={styles.statsSection}>
            <Text tagName='h1' textStyle='xxxl' bold>
              Find your next job here
            </Text>
            <div className={styles.statsSectionContentWrapper}>
              <div className={styles.statsSectionContent}>
                <Text className={styles.stats}>30K+</Text>
                <Text className={styles.statsDescription} textStyle='xxl' bold>
                  Companies are hiring on Bossjob
                </Text>
              </div>
              <div className={styles.statsSectionContent}>
                <Text className={styles.stats}>₱33K+</Text>
                <Text className={styles.statsDescription} textStyle='xxl' bold>
                  Average monthly salary offered by our employers
                </Text>
              </div>
              <div className={styles.statsSectionContent}>
                <Text className={styles.stats}>2.5M+</Text>
                <Text className={styles.statsDescription} textStyle='xxl' bold>
                  Job Seekers using Bossjob to find jobs
                </Text>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.whatCanYouDoSection}>
          <section className={styles.whatYouCanDo}>
            <div className={styles.content}>
              <div className={styles.left}>
                <Text tagName='h1' textStyle='xxxl' bold>
                  What can you do with Bossjob?
                </Text>
                <span
                  ref={firstFeatureImgNode}
                  onClick={() => updateActiveFeature(1)}
                  className={activeFeature === 1 ? styles.active : ''}
                >
                  Build Professional Resume
                  <p>
                    Choose from Bossjob's ready-to-use resume templates to win interviews
                    effortlessly
                  </p>
                </span>
                <span
                  ref={secondFeatureImgNode}
                  onClick={() => updateActiveFeature(2)}
                  className={activeFeature === 2 ? styles.active : ''}
                >
                  Chat directly with Boss
                  <p>Get instant feedback and all your queries answered by the hiring manager</p>
                </span>
                <span
                  ref={thirdFeatureImgNode}
                  onClick={() => updateActiveFeature(3)}
                  className={activeFeature === 3 ? styles.active : ''}
                >
                  Get Headhunted
                  <p>
                    Opt in to be headhunted by Bossjob's Robo-headhunter, an A.I.-powered
                    headhunterbot matching you with suitable jobs round the clock
                  </p>
                </span>
                <span
                  ref={fourthFeatureImgNode}
                  onClick={() => updateActiveFeature(4)}
                  className={activeFeature === 4 ? styles.active : ''}
                >
                  Level Up Your Career
                  <p>
                    100,00+ cheap courses & certifications readily available to equip you with
                    skills for your next career jump
                  </p>
                </span>
              </div>
              <div className={styles.right}>
                <img
                  className={activeFeatureImg === 1 ? styles.active : ''}
                  src={BuildProfessionalResume}
                  alt='Build Professional Resume'
                />
                <img
                  className={activeFeatureImg === 2 ? styles.active : ''}
                  src={ChatDirectlyWithBoss}
                  alt='Build Professional Resume'
                />
                <img
                  className={activeFeatureImg === 3 ? styles.active : ''}
                  src={GetHeadhunted}
                  alt='Build Professional Resume'
                />
                <img
                  className={activeFeatureImg === 4 ? styles.active : ''}
                  src={LevelUpCareer}
                  alt='Build Professional Resume'
                />
              </div>
              <div className={styles.flatDisplay}>
                <h2 className={styles.h2}>What can you do with Bosshunt?</h2>
                <div className={styles.flatDisplayContent}>
                  <div className={styles.featureContainer}>
                    <img
                      className={styles.flatDisplayImage}
                      src={BuildProfessionalResume}
                      alt='Build Professional Resume'
                    />
                    <div className={styles.featureText}>
                      <p className={styles.title}>
                        {' '}
                        <Text textColor='primaryBlue' textStyle='xxxl' bold>
                          {' '}
                          Build Professional Resume{' '}
                        </Text>
                      </p>
                      <p className={styles.description}>
                        {' '}
                        Choose from Bossjob's ready-to-use resume templates to win interviews
                        effortlessly
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.flatDisplayContent}>
                  <div className={styles.featureContainer}>
                    <img
                      className={styles.flatDisplayImage}
                      src={ChatDirectlyWithBoss}
                      alt='Build Professional Resume'
                    />
                    <div className={styles.featureText}>
                      <p className={styles.title}>
                        {' '}
                        <Text textColor='primaryBlue' textStyle='xxxl' bold>
                          Chat directly with Boss
                        </Text>
                      </p>
                      <p className={styles.description}>
                        {' '}
                        Get instant feedback and all your queries answered by the hiring manager
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.flatDisplayContent}>
                  <div className={styles.featureContainer}>
                    <img
                      className={styles.flatDisplayImage}
                      src={GetHeadhunted}
                      alt='Build Professional Resume'
                    />
                    <div className={styles.featureText}>
                      <p className={styles.title}>
                        {' '}
                        <Text textColor='primaryBlue' textStyle='xxxl' bold>
                          Get Headhunted{' '}
                        </Text>
                      </p>
                      <p className={styles.description}>
                        Opt in to be headhunted by Bossjob's Robo-headhunter, an A.I.-powered
                        headhunterbot matching you with suitable jobs round the clock
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.flatDisplayContent}>
                  <div className={styles.featureContainer}>
                    <img
                      className={styles.flatDisplayImage}
                      src={LevelUpCareer}
                      alt='Build Professional Resume'
                    />
                    <div className={styles.featureText}>
                      <p className={styles.title}>
                        <Text textColor='primaryBlue' textStyle='xxxl' bold>
                          {' '}
                          Level Up Your Career{' '}
                        </Text>
                      </p>
                      <p className={styles.description}>
                        100,00+ cheap courses & certifications readily available to equip you with
                        skills for your next career jump
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className={styles.newsFeatureSection}>
          <Text tagName='h1' textStyle='xxxl' bold>
            Bossjob in the news
          </Text>
          <div className={styles.video} />
          <div className={styles.featureList}>
            <div className={styles.featureContent}>
              <div className={styles.featureContentImage}>
                <Image src={BusinessInsider} alt='Business Insider' width='206' height='70' />
              </div>
              {width > 576 ? (
                <Link
                  to='https://markets.businessinsider.com/news/stocks/recruitment-platform-bossjob-launches-a-tool-for-headhunters-to-easily-spot-their-ideal-candidates-1028874126'
                  external
                >
                  <Text textStyle='xl' className={styles.featureContentDesc}>
                    Recruitment Platform Bossjob Launches a Tool for Headhunters to Easily Spot
                    Their
                    <br /> Ideal Candidates
                  </Text>
                </Link>
              ) : (
                <div className={styles.featureContentMobile}>
                  <Text textStyle='xl' className={styles.featureContentMobile}>
                    Recruitment Platform Bossjob Launches a Tool for Headhunters to Easily Spot
                    Their
                    <br /> Ideal Candidates
                  </Text>
                  <Link
                    to='https://markets.businessinsider.com/news/stocks/recruitment-platform-bossjob-launches-a-tool-for-headhunters-to-easily-spot-their-ideal-candidates-1028874126'
                    external
                  >
                    <Text
                      textStyle='xl'
                      textColor='primaryBlue'
                      className={styles.featureContentReadMore}
                    >
                      Read More
                    </Text>
                  </Link>
                </div>
              )}
            </div>
            <div className={styles.featureContent}>
              <div className={styles.featureContentImage}>
                <Image src={TechInAsia} alt='Tech In Asia' width='206' height='55' />
              </div>
              {width > 576 ? (
                <Link
                  to='https://www.techinasia.com/5-ways-recruiters-tackle-tech-talent-crunch'
                  external
                >
                  <Text textStyle='xl' className={styles.featureContentDesc}>
                    5 ways recruiters can tackle the tech talent crunch
                  </Text>
                </Link>
              ) : (
                <div className={styles.featureContentMobile}>
                  <Text textStyle='xl' className={styles.featureContentDesc}>
                    5 ways recruiters can tackle the tech talent crunch
                  </Text>
                  <Link
                    to='https://www.techinasia.com/5-ways-recruiters-tackle-tech-talent-crunch'
                    external
                  >
                    <Text
                      textStyle='xl'
                      textColor='primaryBlue'
                      className={styles.featureContentReadMore}
                    >
                      Read More
                    </Text>
                  </Link>
                </div>
              )}
            </div>
            <div className={styles.featureContent}>
              <div className={styles.featureContentImage}>
                <Image src={GrabVentures} alt='Grab Ventures' width='206' height='20' />
              </div>
              {width > 576 ? (
                <Link
                  to='https://www.grab.com/vn/en/press/business/vigrab-chinh-thuc-khoi-dong-chuong-trinh-grab-ventures-ignite-nham-gop-phan-thuc-day-he-sinh-thai-khoi-nghiep-viet-namengrab-officially-kicks-off-grab-ventures-ignite-programme-to-propel-vie/'
                  external
                >
                  <Text textStyle='xl' className={styles.featureContentDesc}>
                    Grab officially kicks off Grab Ventures Ignite programme to propel Vietnam’s
                    <br /> startup ecosystem forward
                  </Text>
                </Link>
              ) : (
                <div className={styles.featureContentMobile}>
                  <Text textStyle='xl' className={styles.featureContentDesc}>
                    Grab officially kicks off Grab Ventures Ignite programme to propel Vietnam’s
                    <br /> startup ecosystem forward
                  </Text>
                  <Link
                    to='https://www.grab.com/vn/en/press/business/vigrab-chinh-thuc-khoi-dong-chuong-trinh-grab-ventures-ignite-nham-gop-phan-thuc-day-he-sinh-thai-khoi-nghiep-viet-namengrab-officially-kicks-off-grab-ventures-ignite-programme-to-propel-vie/'
                    external
                  >
                    <Text
                      textStyle='xl'
                      textColor='primaryBlue'
                      className={styles.featureContentReadMore}
                    >
                      Read More
                    </Text>
                  </Link>
                </div>
              )}
            </div>
            <div className={styles.featureContent}>
              <div className={styles.featureContentImage}>
                <Image src={MoneyMax} alt='Moneymax' width='206' height='40' />
              </div>
              {width > 576 ? (
                <Link to='https://www.moneymax.ph/lifestyle/articles/online-job-sites/' external>
                  <Text textStyle='xl' className={styles.featureContentDesc}>
                    Legit Online Job Sites to Help You Look for Work During the Pandemic
                  </Text>
                </Link>
              ) : (
                <div className={styles.featureContentMobile}>
                  <Text textStyle='xl' className={styles.featureContentDesc}>
                    Legit Online Job Sites to Help You Look for Work During the Pandemic
                  </Text>
                  <Link to='https://www.moneymax.ph/lifestyle/articles/online-job-sites/' external>
                    <Text
                      textStyle='xl'
                      textColor='primaryBlue'
                      className={styles.featureContentReadMore}
                    >
                      Read More
                    </Text>
                  </Link>
                </div>
              )}
            </div>
            <div className={styles.featureContent}>
              <div className={styles.featureContentImage}>
                <Image src={KrAsia} alt='KR Asia' width='206' height='40' />
              </div>
              {width > 576 ? (
                <Link
                  to='https://kr-asia.com/grab-ventures-ignite-helps-singaporean-startups-kickstart-in-vietnam'
                  external
                >
                  <Text textStyle='xl' className={styles.featureContentDesc}>
                    Grab Ventures Ignite helps Singaporean startups kickstart in Vietnam
                  </Text>
                </Link>
              ) : (
                <div className={styles.featureContentMobile}>
                  <Text textStyle='xl' className={styles.featureContentDesc}>
                    Grab Ventures Ignite helps Singaporean startups kickstart in Vietnam
                  </Text>
                  <Link
                    to='https://kr-asia.com/grab-ventures-ignite-helps-singaporean-startups-kickstart-in-vietnam'
                    external
                  >
                    <Text
                      textStyle='xl'
                      textColor='primaryBlue'
                      className={styles.featureContentReadMore}
                    >
                      Read More
                    </Text>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.bannerSection}>
          <Text className={styles.bannerSectionText}>Client Banner Here</Text>
        </div>
      </Layout>
    </div>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query }) => {
  // store actions
  store.dispatch(fetchConfigRequest())
  store.dispatch(fetchFeaturedCompaniesRequest())
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response
  const topCompanies = storeState.companies.featuredCompanies.response
  return {
    props: {
      config,
      topCompanies,
    },
  }
})
export default Home
