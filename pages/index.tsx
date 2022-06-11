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
import { fetchFeaturedCompaniesListRequest } from 'store/actions/companies/fetchFeaturedCompaniesList'

/* Components */
import SEO from 'components/SEO'
import Layout from 'components/Layout'
import Text from 'components/Text'
import Link from 'components/Link'
import LazyLoad from 'components/LazyLoad'
import AdSlot from 'components/AdSlot'
import TopCompaniesLogoLoader from 'components/Loader/TopCompaniesLogo'

/* Material Components */
import MaterialButton from 'components/MaterialButton'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialTextFieldWithSuggestionList from 'components/MaterialTextFieldWithSuggestionList'

/* Helpers*/
import { categoryParser, conditionChecker } from 'helpers/jobPayloadFormatter'
import useWindowDimensions from 'helpers/useWindowDimensions'
import { getCookie } from 'helpers/cookies'
import { authPathToOldProject } from 'helpers/authenticationTransition'

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
  RHBannerDesktop,
  RHBannerMobile,
  RHBannerTablet,
} from 'images'

/* styles */
import styles from './Home.module.scss'
import breakpointStyles from 'styles/breakpoint.module.scss'
import MetaText from '../components/MetaText'
// import classNamesCombined from 'classnames'

type configObject = {
  inputs: any
  filters: any
}

type companyObject = {
  id: number
  logoUrl: string
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
  const isAuthenticated = getCookie('accessToken') ? true : false
  const [searchValue, setSearchValue] = useState('')
  const [locationValue, setLocationValue] = useState(null)
  const [suggestionList, setSuggestionList] = useState([])
  const [showLogo, setShowLogo] = useState(false)

  const [activeFeature, updateActiveFeature] = useState(1)
  const [activeFeatureImg, updateActiveFeatureImg] = useState(1)
  const firstFeatureImgNode = useRef(null)
  const secondFeatureImgNode = useRef(null)
  const thirdFeatureImgNode = useRef(null)
  const fourthFeatureImgNode = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowLogo(true), 1500)
    return () => clearTimeout(timer)
  }, [])

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

  const onSearch = (value = searchValue) => {
    let queryParam = null
    if (locationValue) {
      const sanitisedLocValue = categoryParser(locationValue.value)
      queryParam = conditionChecker(value, sanitisedLocValue)
    } else if (value) {
      queryParam = conditionChecker(value)
    }

    updateUrl(queryParam, { sort: 2 })
  }

  const handleSuggestionSearch = (val) => {
    if (val !== '') {
      fetch(`${process.env.JOB_BOSSJOB_URL}/suggested-search?size=5&query=${val}`)
        .then((resp) => resp.json())
        .then((data) => setSuggestionList(data.data.items))
    }
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
          to={`${jobsPageLink}/job-search?industry=accounting-finance&category=accounting-finance,sales-insurance-financial-services`}
          title='Finance jobs'
          aTag
        >
          <Text textStyle='sm' textColor='primaryBlue'>
            Finance jobs
          </Text>
        </Link>
        <Link
          className={styles.link}
          to={`${jobsPageLink}/job-search?category=marketing-business-development,sales-corporate,sales-insurance-financial-services,sales-engineering-technical-it`}
          title='Sales jobs'
          aTag
        >
          <Text textStyle='sm' textColor='primaryBlue'>
            Sales jobs
          </Text>
        </Link>
        <Link
          className={styles.link}
          to={`${jobsPageLink}/job-search?category=marketing-business-development,telesales-telemarketing,digital-marketing`}
          title='Marketing jobs'
          aTag
        >
          <Text textStyle='sm' textColor='primaryBlue'>
            Marketing jobs
          </Text>
        </Link>
        <Link className={styles.link} to={`${jobsPageLink}/makati-jobs`} title='Makati jobs' aTag>
          <Text textStyle='sm' textColor='primaryBlue'>
            Makati jobs
          </Text>
        </Link>
        <Link
          className={styles.link}
          to={`${jobsPageLink}/job-search?category=computer-information-technology,technical-helpdesk-support,sales-engineering-technical-it`}
          title='IT jobs'
          aTag
        >
          <Text textStyle='sm' textColor='primaryBlue'>
            IT jobs
          </Text>
        </Link>
        <Link
          className={styles.link}
          to={`${jobsPageLink}/overseas-jobs`}
          title='Overseas jobs'
          aTag
        >
          <Text textStyle='sm' textColor='primaryBlue'>
            Overseas jobs
          </Text>
        </Link>
        <Link
          className={styles.link}
          to={`${jobsPageLink}/customer-service-jobs`}
          title='Customer Service jobs'
          aTag
        >
          <Text textStyle='sm' textColor='primaryBlue'>
            Customer Service jobs
          </Text>
        </Link>
        <Link
          className={styles.link}
          to={`${jobsPageLink}/job-search?salary=30k-60k,60k-80k,80k-100k,100k-200k,above-200k`}
          title='₱30K + jobs'
          aTag
        >
          <Text textStyle='sm' textColor='primaryBlue'>
            ₱30K + jobs
          </Text>
        </Link>
        <Link className={styles.link} to={`${jobsPageLink}/manila-jobs`} title='Manila jobs' aTag>
          <Text textStyle='sm' textColor='primaryBlue'>
            Manila jobs
          </Text>
        </Link>
        <Link
          className={styles.link}
          to={`${jobsPageLink}/full-time-jobs`}
          title='Full Time jobs'
          aTag
        >
          <Text textStyle='sm' textColor='primaryBlue'>
            Full Time jobs
          </Text>
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Layout>
        <SEO
          title='Career Platform for Professionals in Philippines | Bossjob'
          description='Discover job opportunities in Philippines on Bossjob! Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers'
          canonical='/'
        />
        <section className={styles.searchAndQuickLinkSection}>
          <div className={styles.commonContainer}>
            <Text
              textStyle='xxxl'
              textColor='primaryBlue'
              bold
            >
              Find Jobs for Professionals in Phillipines
            </Text>
            <MetaText tagName='h1'>Career Platform for Professionals in Philippines</MetaText>
            <div className={styles.searchSection}>
              <div className={styles.searchAndLocationContainer}>
                <MaterialTextFieldWithSuggestionList
                  id='search'
                  label='Search for job title, keyword or company'
                  variant='outlined'
                  size='small'
                  className={styles.searchField}
                  searchFn={handleSuggestionSearch}
                  updateSearchValue={setSearchValue}
                  onSelect={(val: any) => {
                    setSearchValue(val)
                    onSearch(val)
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      setSuggestionList([])
                      onSearch()
                    }
                  }}
                  options={suggestionList}
                />
                <MaterialLocationField
                  className={styles.locationField}
                  // defValue={defaultLocation}
                  // defValue={urlLocation}
                  onChange={onLocationSearch}
                />
                <MaterialButton variant='contained' capitalize onClick={() => onSearch()}>
                  <Text textStyle='lg' bold textColor='white'>
                    Search
                  </Text>
                </MaterialButton>
              </div>
              <div className={styles.quickLinksContainer}>{renderQuickLinks()}</div>
            </div>
          </div>
        </section>
        <div className={styles.main}>
          <div className={styles.companiesSection}>
            <div className={styles.topCompanies}>
              <Text tagName='h1' textStyle='xxxl' bold>
                Top Companies
              </Text>
              <div className={styles.topCompaniesList}>
                {topCompanies?.map((company, index) => {
                  if (index < 24) {
                    if (!showLogo) {
                      return (
                        <div className={styles.topCompaniesLogoLoader}>
                          <TopCompaniesLogoLoader />
                        </div>
                      )
                    }
                    return (
                      <Link
                        key={company.id}
                        className={styles.topCompaniesLogo}
                        to={`/company/${slugify(company.name.toLowerCase())}-${company.id}/jobs`}
                        external
                      >
                        <img
                          src={company.logoUrl}
                          title={company.name}
                          alt={company.name}
                          width='60'
                          height='60'
                        />
                      </Link>
                    )
                  }
                })}
              </div>
              <div className={styles.topCompaniesListMobile}>
                {topCompanies?.map((company, index) => {
                  if (index < 10) {
                    if (!showLogo) {
                      return (
                        <div className={styles.topCompaniesLogoLoader}>
                          <TopCompaniesLogoLoader />
                        </div>
                      )
                    }
                    return (
                      <Link
                        key={company.id}
                        className={styles.topCompaniesLogo}
                        to={`/company/${slugify(company.name.toLowerCase())}-${company.id}/jobs`}
                        external
                      >
                        <img src={company.logoUrl} alt={company.name} width='60' height='60' />
                      </Link>
                    )
                  }
                })}
              </div>
              <div className={styles.viewAllCompanies}>
                <Link to='/companies' className={styles.viewAllCompaniesLink}>
                  <Text textStyle='lg' textColor='primaryBlue'>
                    View all companies
                  </Text>
                </Link>
              </div>
            </div>
            <div className={styles.companyBanners}>
              <div className={styles.companyBanner}>
                <AdSlot adSlot={'homepage/rectangle-banner-1'} />
              </div>
              <div className={styles.companyBanner}>
                <AdSlot adSlot={'homepage/rectangle-banner-2'} />
              </div>
            </div>
          </div>
          <div className={styles.statsSection}>
            <Text textStyle='xxxl' bold>
              Find your next job here
            </Text>
            <div className={styles.statsSectionContentWrapper}>
              <div className={styles.statsSectionContent}>
                <Text className={styles.stats}>30K+</Text>
                <Text className={styles.statsDescription} textStyle='xxl' bold>
                  Companies are hiring on Bossjob
                </Text>
                <MetaText tagName='h2'>30K+ Companies are hiring on Bossjob</MetaText>
              </div>
              <div className={styles.statsSectionContent}>
                <Text className={styles.stats}>₱33K+</Text>
                <Text className={styles.statsDescription} textStyle='xxl' bold>
                  Average monthly salary offered by our employers
                </Text>
                <MetaText tagName='h2'>
                  ₱33K+ Average monthly salary offered by our employers
                </MetaText>
              </div>
              <div className={styles.statsSectionContent}>
                <Text className={styles.stats}>2.5M+</Text>
                <Text className={styles.statsDescription} textStyle='xxl' bold>
                  Job Seekers using Bossjob to find jobs
                </Text>
                <MetaText tagName='h2'>2.5M+ Job Seekers using Bossjob to find jobs</MetaText>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.whatCanYouDoSection}>
          <div className={styles.commonContainer}>
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
                    <Text tagName='h2' className={styles.featureTitle}>
                      Build Professional Resume
                    </Text>
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
                    <Text tagName='h2' className={styles.featureTitle}>
                      Chat directly with Boss
                    </Text>
                    <p>Get instant feedback and all your queries answered by the hiring manager</p>
                  </span>
                  <span
                    ref={thirdFeatureImgNode}
                    onClick={() => updateActiveFeature(3)}
                    className={activeFeature === 3 ? styles.active : ''}
                  >
                    <Text tagName='h2' className={styles.featureTitle}>
                      Get Headhunted
                    </Text>
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
                    <Text tagName='h2' className={styles.featureTitle}>
                      Level Up Your Career
                    </Text>
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
                    width='535'
                    height='432'
                  />
                  <img
                    className={activeFeatureImg === 2 ? styles.active : ''}
                    src={ChatDirectlyWithBoss}
                    alt='Chat Directly'
                    width='554'
                    height='382'
                  />
                  <img
                    className={activeFeatureImg === 3 ? styles.active : ''}
                    src={GetHeadhunted}
                    alt='Get Headhunted'
                    width='555'
                    height='427'
                  />
                  <img
                    className={activeFeatureImg === 4 ? styles.active : ''}
                    src={LevelUpCareer}
                    alt='Level Up Your Career'
                    width='520'
                    height='382'
                  />
                </div>
                <div className={styles.flatDisplay}>
                  <Text tagName='h2' textStyle='xxxl' bold>
                    What can you do with Bossjob?
                  </Text>
                  <LazyLoad>
                    <div className={styles.flatDisplayContent}>
                      <div className={styles.featureContainer}>
                        <img
                          className={styles.flatDisplayImage}
                          src={BuildProfessionalResume}
                          alt='Build Professional Resume'
                          width='335'
                          height='265'
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
                          alt='Chat Directly'
                          width='335'
                          height='265'
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
                          alt='Get Headhunted'
                          width='335'
                          height='274'
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
                          alt='Level Up Your Career'
                          width='335'
                          height='265'
                        />
                        <div className={styles.featureText}>
                          <p className={styles.title}>
                            <Text textColor='primaryBlue' textStyle='xxxl' bold>
                              {' '}
                              Level Up Your Career{' '}
                            </Text>
                          </p>
                          <p className={styles.description}>
                            100,00+ cheap courses & certifications readily available to equip you
                            with skills for your next career jump
                          </p>
                        </div>
                      </div>
                    </div>
                  </LazyLoad>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className={styles.newsFeatureSection}>
          <Text tagName='h1' textStyle='xxxl' bold>
            Bossjob in the news
          </Text>
          <LazyLoad className={styles.video}>
            <iframe
              width='560'
              height='315'
              src='https://www.youtube.com/embed/_taCBqITsGM'
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          </LazyLoad>
          <div className={styles.featureList}>
            <div className={styles.featureContent}>
              <div className={styles.featureContentImage}>
                <img src={BusinessInsider} alt='Business Insider' width='206' height='70' />
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
                <img src={TechInAsia} alt='Tech In Asia' width='206' height='55' />
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
                <img src={GrabVentures} alt='Grab Ventures' width='206' height='20' />
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
                <img src={MoneyMax} alt='Moneymax' width='206' height='40' />
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
                <img src={KrAsia} alt='KR Asia' width='206' height='40' />
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
          <div className={styles.commonContainer}>
            <Link to={isAuthenticated ? authPathToOldProject(null, '/dashboard/headhunt-me') : `${process.env.OLD_PROJECT_URL}/headhunt-me`} external>
              <div className={breakpointStyles.hideOnMobileAndTablet}>
                  <img src={RHBannerDesktop} alt='rh-banner-desktop' width='100%' height='254' />
              </div>
              <div className={breakpointStyles.hideOnMobileAndDesktop}>
                <img src={RHBannerTablet} alt='rh-banner-tablet' width='100%' height='359' />
              </div>
              <div className={breakpointStyles.hideOnTabletAndDesktop}>
                <img src={RHBannerMobile} alt='rh-banner-mobile' width='100%' height='150' />
              </div>
            </Link>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async () => {
  // store actions
  store.dispatch(fetchConfigRequest())
  store.dispatch(fetchFeaturedCompaniesListRequest({ size: 21, page: 1 }))
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response
  const featuredCompanies =
    storeState.companies.fetchFeaturedCompaniesList.response?.featured_companies?.map(
      (featuredCompany) => featuredCompany.company
    )
  const topCompanies = featuredCompanies?.map((featuredCompany) => {
    const logoUrl = featuredCompany.logo_url
    delete featuredCompany.logo_url
    return { ...featuredCompany, logoUrl }
  })
  return {
    props: {
      config,
      topCompanies,
    },
  }
})
export default Home
