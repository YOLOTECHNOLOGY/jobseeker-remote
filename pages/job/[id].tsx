import React, { useState, useEffect } from 'react'
import { Radio, RadioGroup, FormControlLabel} from '@mui/material'

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
  NotificationIcon,
  CreateIcon,
  DeleteIcon
} from 'images'

const Job = () => {
  const dummyCompanyDetail = 'Loop Contact Solutions is a contact center uniquely designed to help subscription businesses acquire and keep more customers who purchase more products over longer periods of time. The result is the achievement of Loop\'s core value proposition to significantly improve recurring revenues, profits and market share for our subscription business clients. Loop Contact Solutions is a contact center uniquely designed to help subscription businesses acquire and keep more customers who purchase more products over longer periods of time. The result is the achievement of Loop\'s core value proposition to significantly improve recurring revenues, profits and market share for our subscription business clients.'
  const [companyDetail, setCompanyDetail] = useState(dummyCompanyDetail)
  const [isFullDetail, setIsFullDetail] = useState(false)
  const [jobSelectedId, setJobSelectedId] = useState(null)
  const [modalJobAlert, setModalJobAlert] = useState(false)
  const [modalManageJobAlert, setModalManageJobAlert] = useState(false)
  const [modalDeleteJobAlert, setModalDeleteJobAlert] = useState(false)
  const [frequency, setFrequency] = useState('daily')
  const [notifiedAt, setNotifiedAt] = useState('email')

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

  const ModalJobAlerts = () => {
    return (
      <Modal
        headerTitle='Job Alerts'
        showModal={modalJobAlert}
        handleModal={() => setModalJobAlert(false)}
        firstButtonText='Done'
        handleFirstButton={() => setModalJobAlert(false)}
      >
        <ul className={styles.jobAlertsList}>
          <li className={styles.jobAlertsItem}>
            <div className={styles.jobAlertsItemHeader}>
              <Text textStyle='lg' bold>Marketing</Text>
              <div className={styles.jobAlertsItemAction}>
                <Image
                  src={CreateIcon} 
                  width='18' 
                  height='18'
                  onClick={() => {
                    setModalJobAlert(false)
                    setModalManageJobAlert(true)
                  }}
                  className={styles.jobAlertsItemButton}
                />
                <Image
                  src={DeleteIcon} 
                  width='18' 
                  height='18'
                  onClick={() => {
                    setModalJobAlert(false)
                    setModalDeleteJobAlert(true)
                  }}
                  className={styles.jobAlertsItemButton}
                />
              </div>
            </div>
            <div className={styles.jobAlertsItemBody}>
              <Text textStyle='base'>Manila</Text>
              <Text textStyle='base'>Filters: Full-time, Marketing/Business Dev </Text>
              <Text textStyle='base'>Frequency: Daily via email</Text>
            </div>
          </li>
          <li className={styles.jobAlertsItem}>
            <div className={styles.jobAlertsItemHeader}>
              <Text textStyle='lg' bold>Marketing</Text>
              <div className={styles.jobAlertsItemAction}>
                <Image
                  src={CreateIcon} 
                  width='20' 
                  height='20'
                  onClick={() => {
                    setModalJobAlert(false)
                    setModalManageJobAlert(true)
                  }}
                  className={styles.jobAlertsItemButton}
                />
                <Image
                  src={DeleteIcon} 
                  width='20' 
                  height='20'
                  onClick={() => {
                    setModalJobAlert(false)
                    setModalDeleteJobAlert(true)
                  }}
                  className={styles.jobAlertsItemButton}
                />
              </div>
            </div>
            <div className={styles.jobAlertsItemBody}>
              <Text textStyle='base'>Manila</Text>
              <Text textStyle='base'>Filters: Full-time, Marketing/Business Dev </Text>
              <Text textStyle='base'>Frequency: Daily via email</Text>
            </div>
          </li>
        </ul>
      </Modal>
    )
  }

  const ModalManageJobAlert = () => {
    const handleChange = (event, isFrequency) => {
      if (isFrequency) {
        setFrequency(event.target.value)
        return
      }
      setNotifiedAt(event.target.value)
    }

    return (
      <Modal
        headerTitle='Manage Job Alert'
        showModal={modalManageJobAlert}
        handleModal={() => setModalManageJobAlert(false)}
        firstButtonText='Back'
        handleFirstButton={() => {
          setModalManageJobAlert(false)
          setModalJobAlert(true)
        }}
        secondButtonText='Done'
        handleSecondButton={() => {
          setModalManageJobAlert(false)
          setModalJobAlert(true)
        }}
      >
        <div className={styles.jobManageJobAlert}>
          <div className={styles.jobManageJobAlertHeader}>
            <Text textStyle='lg' bold>Marketing</Text>
            <Image
              src={DeleteIcon} 
              width='18' 
              height='18'
              onClick={() => {
                setModalJobAlert(false)
                setModalManageJobAlert(false)
                setModalDeleteJobAlert(true)
              }}
            />
          </div> 
          <div className={styles.jobManageJobAlertBody}>
            <div className={styles.jobManageJobAlertGroup}>
              <Text textStyle='base' className={styles.jobManageJobAlertGroupHeader}>Alert Frequency</Text>
              <RadioGroup
                aria-label="frequency"
                name="controlled-radio-buttons-group"
                value={frequency}
                onChange={(e) => handleChange(e, true)}
              >
                <FormControlLabel value="daily" control={<Radio />} label={<Text textStyle='base'>Daily</Text>} />
                <FormControlLabel value="weekly" control={<Radio />} label={<Text textStyle='base'>Weekly</Text>} />
              </RadioGroup>
            </div>

            <div className={styles.jobManageJobAlertGroup}>
              <Text textStyle='base' className={styles.jobManageJobAlertGroupHeader}>Get notified via:</Text>
              <RadioGroup
                aria-label="frequency"
                name="controlled-radio-buttons-group"
                value={notifiedAt}
                onChange={handleChange}
              >
                <FormControlLabel value="email" control={<Radio />} label={<Text textStyle='base'>Email</Text>} />
              </RadioGroup>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  const ModalDeleteJobAlert = () => {
    return (
      <Modal
        headerTitle='Delete Job Alert'
        showModal={modalDeleteJobAlert}
        handleModal={() => setModalDeleteJobAlert(false)}
        firstButtonText='Keep'
        handleFirstButton={() => {
          setModalDeleteJobAlert(false)
          setModalJobAlert(true)
        }}
        secondButtonText='Delete'
        handleSecondButton={() => {
          setModalDeleteJobAlert(false)
          setModalJobAlert(true)
        }}
      >
        <Text textStyle='base'>You are about to delete the job alert for “Marketing, Manila”.
        <br/> This cannot be undone</Text>    
      </Modal>
    )
  }

  return (
    <Layout>
      <div className={styles.job}>
        <div className={styles.jobList}>
          <div className={styles.jobListOption}>
            <Text textStyle='xl' bold>5,777 jobs found</Text>
            <div className={styles.jobListOptionAlerts}>
              <div 
                className={styles.jobListOptionAlertsItem} 
                onClick={() => console.log('Enable Alerts')}
              >
                <Text textStyle='base'>Enable job alerts</Text>
                </div>
              <div 
                className={styles.jobListOptionAlertsItem}
                onClick={() => setModalJobAlert(true)}
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

      <ModalJobAlerts />
      <ModalManageJobAlert />
      <ModalDeleteJobAlert />
    </Layout>
  )
}

export default Job