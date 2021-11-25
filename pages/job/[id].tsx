import React, { useState, useEffect } from 'react'

/* Components */
import Image from 'next/image'
import Link from 'components/Link'
import Layout from 'components/Layout'
import Button from 'components/Button'
import Text from 'components/Text'
import JobTag from 'components/JobTag'
import JobCard from 'components/JobCard'
import Modal from 'components/Modal'

/* Styles */
import styles from './job.module.scss'

/* Images */
import { 
  BriefcaseIcon, 
  LocationIcon, 
  EducationIcon, 
  SalaryIcon, 
  EquityIcon, 
  MealAllowanceIcon,
  EmployeeStockIcon,
  HousingAllowanceIcon,
  MoreIcon,
  NotificationIcon
} from 'images'

const Job = () => {
  const dummyCompanyDetail = 'Loop Contact Solutions is a contact center uniquely designed to help subscription businesses acquire and keep more customers who purchase more products over longer periods of time. The result is the achievement of Loop\'s core value proposition to significantly improve recurring revenues, profits and market share for our subscription business clients. Loop Contact Solutions is a contact center uniquely designed to help subscription businesses acquire and keep more customers who purchase more products over longer periods of time. The result is the achievement of Loop\'s core value proposition to significantly improve recurring revenues, profits and market share for our subscription business clients.'
  const [companyDetail, setCompanyDetail] = useState(dummyCompanyDetail)
  const [isFullDetail, setIsFullDetail] = useState(false)
  const [jobSelectedId, setJobSelectedId] = useState(null)
  const [jobAlert, setJobAlert] = useState(false)

  useEffect(() => {
    handleCompanyDisplay()
  }, [isFullDetail])

  const handleCompanyDisplay = () => {
    if (!isFullDetail && dummyCompanyDetail.length > 352) {
      setCompanyDetail(`${dummyCompanyDetail.slice(0, 352)}...`)
      return
    }
    setCompanyDetail(dummyCompanyDetail)
  }
  const handleJobSelection = (id) => setJobSelectedId(id)

  return (
    <Layout>
      <div className={styles.job}>
        <div className={styles.jobList}>
          <div className={styles.jobListOption}>
            <Text textStyle='xl' bold>5,777 jobs found</Text>
            <div className={styles.jobListOptionAlerts}>
              <div 
                className={styles.jobListOptionAlertsItem} 
                onClick={() => setJobAlert(!jobAlert)}
              >
                <Text textStyle='base'>Enable job alerts</Text>
                </div>
              <div 
                className={styles.jobListOptionAlertsItem}
                onClick={() => console.log('Manage Alerts')}
              >
                <Image src={NotificationIcon} width='20' height='20'/>
              </div>
            </div>
          </div>
          <div className={styles.jobListContent}>
            <JobCard
              id={0}
              image='https://wallpaperaccess.com/full/6133725.jpg'
              title='Operation Manager Lorem Ipsum'
              tag='urgent'
              company='Loop Contact Solutions Inc.'
              location='Makati'
              salary='₱75k - ₱80k'
              postedAt='23 August 2021'
              selectedId={jobSelectedId}
              handleSelection={handleJobSelection}
            />
            <JobCard
              id={2}
              image='https://wallpaperaccess.com/full/6133725.jpg'
              title='Operation Manager Lorem Ipsum'
              tag='fullTime'
              company='Loop Contact Solutions Inc.'
              location='Makati'
              salary='₱75k - ₱80k'
              postedAt='23 August 2021'
              selectedId={jobSelectedId}
              handleSelection={handleJobSelection}
            />
            <JobCard
              id={3}
              image='https://wallpaperaccess.com/full/6133725.jpg'
              title='Operation Manager Lorem Ipsum'
              tag='featured'
              company='Loop Contact Solutions Inc.'
              location='Makati'
              salary='₱75k - ₱80k'
              postedAt='23 August 2021'
              selectedId={jobSelectedId}
              handleSelection={handleJobSelection}
            />
          </div>
        </div>
        <div className={styles.jobDetail}>
          <div className={styles.jobDetailOption}>
            <div className={styles.jobDetailOptionImage}>
              <Image src={MoreIcon} width='20' height='20'></Image>
            </div>
          </div>
          <div className={styles.jobDetailHeader}>
            <div className={styles.jobDetailImage} style={{ backgroundImage: `url(${'https://wallpaperaccess.com/full/6133725.jpg'})`}}/>
            <div className={styles.jobDetailInfo}>
              <Text textStyle='xxl' bold className={styles.jobDetailTitle}>Operation Manager lorem ipsum dolor sit amet lorem ipsum dolor sit amet</Text>
              <Text textStyle='lg' className={styles.jobDetailCompany}>Loop Contact Solutions Inc.</Text>
              <JobTag tag='featured'/>
              <div className={styles.jobDetailButtons}>
                <Button primary>Apply Now</Button>
                <Button secondary>Save Job</Button>
              </div>
              <Text textStyle='xsm' className={styles.jobDetailPostedAt}>Posted on 23 August 2021</Text>
            </div>
          </div>
          <div className={styles.jobDetailPref}>
            <ul className={styles.jobDetailPrefList}>
              <li className={styles.jobDetailPrefItem}>
                <Image src={LocationIcon} alt='logo' width='18' height='18' />
                <span className={styles.jobDetailPrefText}>
                  <Text
                    textStyle='base'
                    textColor='lightgrey'
                    className={styles.jobDetailPrefField}
                  >
                    Location
                  </Text>
                  <Text textStyle='base' bold className={styles.jobDetailPrefValue}>
                    Makati
                  </Text>
                </span>
              </li>
              <li className={styles.jobDetailPrefItem}>
                <Image src={BriefcaseIcon} alt='logo' width='20' height='20' />
                <span className={styles.jobDetailPrefText}>
                  <Text
                    textStyle='base'
                    textColor='lightgrey'
                    className={styles.jobDetailPrefField}
                  >
                    Experience
                  </Text>
                  <Text textStyle='base' bold className={styles.jobDetailPrefValue}>
                    1 - 3 years
                  </Text>
                </span>
              </li>
              <li className={styles.jobDetailPrefItem}>
                <Image src={EducationIcon} alt='logo' width='20' height='20' />
                <span className={styles.jobDetailPrefText}>
                  <Text
                    textStyle='base'
                    textColor='lightgrey'
                    className={styles.jobDetailPrefField}
                  >
                    Education
                  </Text>
                  <Text textStyle='base' bold className={styles.jobDetailPrefValue}>
                    Bachelor
                  </Text>
                </span>
              </li>
              <li className={styles.jobDetailPrefItem}>
                <Image src={SalaryIcon} alt='logo' width='20' height='20' />
                <span className={styles.jobDetailPrefText}>
                  <Text
                    textStyle='base'
                    textColor='lightgrey'
                    className={styles.jobDetailPrefField}
                  >
                    Salary
                  </Text>
                  <Text textStyle='base' bold className={styles.jobDetailPrefValue}>
                    ₱75k - ₱80k
                  </Text>
                </span>
              </li>
            </ul>
          </div>
          <div className={styles.jobDetailSection}>
            <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>Job Description</Text>
            <Text textStyle='base' className={styles.jobDetailSectionBody}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at diam ante. Cras varius mauris lectus, vitae cursus turpis malesuada ut. Proin imperdiet faucibus dolor, gravida vestibulum nibh ultricies sodales. Duis ultricies metus ultrices laoreet pretium. Praesent augue orci, mollis ut libero at, malesuada cursus neque. Mauris accumsan libero eu felis hendrerit, at congue augue pulvinar. Vivamus ligula tortor, auctor et finibus id, lobortis et turpis. Sed rhoncus dapibus neque vel tempor. 
            </Text>
          </div>
          <div className={styles.jobDetailSection}>
            <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>Requirements</Text>
            <Text textStyle='base' className={styles.jobDetailSectionBody}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at diam ante. Cras varius mauris lectus, vitae cursus turpis malesuada ut. Proin imperdiet faucibus dolor, gravida vestibulum nibh ultricies sodales. Duis ultricies metus ultrices laoreet pretium. Praesent augue orci, mollis ut libero at, malesuada cursus neque. Mauris accumsan libero eu felis hendrerit, at congue augue pulvinar. Vivamus ligula tortor, auctor et finibus id, lobortis et turpis. Sed rhoncus dapibus neque vel tempor. 
            </Text>
          </div>
          <div className={styles.jobDetailSection}>
            <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>Benefits</Text>
            <ul className={styles.jobDetailBenefitsList}>
              <li className={styles.jobDetailBenefitsItem}>
                <Image src={EquityIcon} alt='logo' width='22' height='22' />
                <Text
                  textStyle='base'
                  className={styles.jobDetailBenefitsText}
                >
                  Equity Incentive
                </Text>
              </li>
              <li className={styles.jobDetailBenefitsItem}>
                <Image src={MealAllowanceIcon} alt='logo' width='22' height='22' />
                <Text
                  textStyle='base'
                  className={styles.jobDetailBenefitsText}
                >
                  Meal Allowance
                </Text>
              </li>
              <li className={styles.jobDetailBenefitsItem}>
                <Image src={EmployeeStockIcon} alt='logo' width='22' height='22' />
                <Text
                  textStyle='base'
                  className={styles.jobDetailBenefitsText}
                >
                  Employee Stock Purchase
                </Text>
              </li>
              <li className={styles.jobDetailBenefitsItem}>
                <Image src={HousingAllowanceIcon} alt='logo' width='22' height='22' />
                <Text
                  textStyle='base'
                  className={styles.jobDetailBenefitsText}
                >
                  Housing Allowance
                </Text>
              </li>
            </ul>
          </div>
          <div className={styles.jobDetailSection}>
            <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>Skills/Software</Text>
            <ul className={styles.jobDetailSkillsList}>
              <li className={styles.jobDetailSkillsItem}>
                <Text
                  bold
                  textStyle='base'
                  className={styles.jobDetailSkillsText}
                >
                  Javascript
                </Text>
              </li>
              <li className={styles.jobDetailSkillsItem}>
                <Text
                  bold
                  textStyle='base'
                  className={styles.jobDetailSkillsText}
                >
                  CSS
                </Text>
              </li>
              <li className={styles.jobDetailSkillsItem}>
                <Text
                  bold
                  textStyle='base'
                  className={styles.jobDetailSkillsText}
                >
                  Javascript
                </Text>
              </li>
              <li className={styles.jobDetailSkillsItem}>
                <Text
                  bold
                  textStyle='base'
                  className={styles.jobDetailSkillsText}
                >
                  CSS
                </Text>
              </li>
              <li className={styles.jobDetailSkillsItem}>
                <Text
                  bold
                  textStyle='base'
                  className={styles.jobDetailSkillsText}
                >
                  Javascript
                </Text>
              </li>
              <li className={styles.jobDetailSkillsItem}>
                <Text
                  bold
                  textStyle='base'
                  className={styles.jobDetailSkillsText}
                >
                  CSS
                </Text>
              </li>
              <li className={styles.jobDetailSkillsItem}>
                <Text
                  bold
                  textStyle='base'
                  className={styles.jobDetailSkillsText}
                >
                  Javascript
                </Text>
              </li>
              <li className={styles.jobDetailSkillsItem}>
                <Text
                  bold
                  textStyle='base'
                  className={styles.jobDetailSkillsText}
                >
                  CSS
                </Text>
              </li>
            </ul>
          </div>
          <div className={styles.jobDetailSection}>
            <Text textStyle='lg' bold className={styles.jobDetailSectionTitle}>Additional Information</Text>
            <Text textStyle='base' bold className={styles.jobDetailSectionSubTitle}>Working Location</Text>
            <Text textStyle='base' className={styles.jobDetailSectionSubBody}>
              111 Paseo de Roxas Building Legazpi Village, Makati City, Philippines
            </Text>
            <Text textStyle='base' bold className={styles.jobDetailSectionSubTitle}>Specialization</Text>
            <Link to='/' className={styles.jobDetailSectionSubBody}>
              <Text textStyle='base' className={styles.jobDetailSectionSubBodyLink}>
                Telesales/Telemarketing, Sales - Financial Services, Marketing/Business Dev
              </Text>
            </Link>
          </div>
          <div className={styles.aboutCompany}>
            <Text bold textStyle='xl' className={styles.aboutCompanyHeader}>About the company</Text>
            <Link to='/' className={styles.aboutCompanyTitle}>
              <Text bold textStyle='xl' textColor='primaryBlue'>Loop Contact Solutions Inc.</Text>
            </Link>
            <div className={styles.aboutCompanyDetail}>
              <Text textStyle='base'>BPO</Text>
              <Text textStyle='base'>0 - 50 employees</Text>
            </div>
            <div className={styles.aboutCompanyInfo}>
              <Text textStyle='base'>
                {companyDetail}
              </Text>
            </div>
            <div className={styles.aboutCompanyMore}>
              <span onClick={() => {
                handleCompanyDisplay()
                setIsFullDetail(!isFullDetail)
              }}>
                <Text textStyle='base' textColor='primaryBlue'>
                  {!isFullDetail ? '...read more' : '...read less'}</Text>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.jobAds}></div>
      </div>

      <Modal
        showModal={jobAlert}
        handleModal={() => setJobAlert(!jobAlert)}
        headerTitle='Enable Job Alert'
        handleFirstButton={() => console.log('first Button')}
        handleSecondButton={() => console.log('Second Button')}
        firstButtonText='Keep'
        secondButtonText='Delete'
      >
        <Text textStyle='base'>Job alert for ‘Lorem Ipsum’ enabled. 
          <Text 
            className={styles.jobModalEnableAlert}
            textColor='primaryBlue' 
            onClick={() => {
              setJobAlert(!jobAlert)
            }}>
              {' '} Manage alert.
          </Text>
        </Text>
      </Modal>
    </Layout>
  )
}

export default Job