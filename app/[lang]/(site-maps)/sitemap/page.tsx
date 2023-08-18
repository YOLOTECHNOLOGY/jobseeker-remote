'use client'
import { useState, useEffect } from 'react'
/* Components */
import Text from 'components/Text'
import Link from 'components/Link'

/* Actions */
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'

/* Styles */
import styles from './PublicSitemap.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getCountry } from 'helpers/country'

const PublicSitemap = () => {
  const [locationList, setLocationList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [industryList, setIndustryList] = useState([])
  const [qualificationList, setQualificationList] = useState([])
  const [experienceList, setExperienceList] = useState([])
  const [jobTypeList, setJobTypeList] = useState([])
  const [salaryList, setSalaryList] = useState([])
  const config = useSelector((store: any) => store?.config?.config?.response)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchConfigRequest())
  }, [])
  useEffect(() => {
    if (config) {
      const locationList =
        config &&
        config.location_lists
          .map((region) =>
            region.locations.map((loc) => ({
              ...loc,
              value: loc?.value,
              // loc value all lower case
              seoValue: loc.seo_value
            }))
          )
          .reduce((a, c) => a.concat(c), [])
          .sort((a, b) => a.value.localeCompare(b.value))

      const categoryList =
        config && config.job_category_lists && config.job_category_lists

      const industryList =
        config &&
        config.industry_lists.map((industry) => ({
          key: industry['seo-value'],
          label: industry.value,
          value: industry.value.replace(/&/gi, '%26')
        }))

      const qualificationList =
        config &&
        config.educations &&
        config.educations.map((degree) => {
          return {
            key: degree['seo-value'],
            label: degree.value,
            value: degree.value
          }
        })

      const experienceList =
        config &&
        config.work_xps &&
        config.work_xps.map((level) => {
          return {
            key: level['seo-value'],
            label: level.value,
            value: level.value
          }
        })

      const jobTypeList =
        config.job_types?.map?.((type) => {
          return {
            key: type['seo-value'],
            label: type.value,
            value: type.value
          }
        }) ?? []

      const salaryList =
        config &&
        config.salary_range_filters &&
        config.salary_range_filters.map((salary) => {
          return {
            key: salary['seo-value'],
            label: salary.value,
            value: salary.key[0]
          }
        })

      setLocationList(locationList)
      setCategoryList(categoryList)
      setIndustryList(industryList)
      setQualificationList(qualificationList)
      setExperienceList(experienceList)
      setJobTypeList(jobTypeList)
      setSalaryList(salaryList)
    }
  }, [])

  const generatePath = (param, label) => {
    const pathUrl = `/jobs-hiring/${param}-jobs`

    return (
      <Link to={pathUrl} external className={styles.item} key={param}>
        <Text textStyle='base'>{label}</Text>
      </Link>
    )
  }

  return (
    <>
      <div className={styles.contentWrapper}>
        <Text
          className={styles.sectionHeader}
          textColor='primaryBlue'
          bold
          tagName='h1'
          textStyle='xxl'
        >
          Sitemap
        </Text>
        <div className={styles.sectionWrapper}>
          <Text
            className={styles.sectionHeader}
            textColor='primaryBlue'
            bold
            tagName='h2'
            textStyle='lg'
          >
            For Jobseekers
          </Text>
          <div className={styles.section}>
            <Link
              to={`/get-started`}
              aTag
              className={styles.item}
              external
            >
              <Text textStyle='base'>Register as a jobseeker</Text>
            </Link>
            <Link
              to={`/get-started`}
              aTag
              className={styles.item}
              external
            >
              <Text textStyle='base'>Login as a jobseeker</Text>
            </Link>
          </div>
          <div className={styles.section}>
            <Text
              className={styles.sectionHeader}
              textColor='primaryBlue'
              bold
              tagName='h3'
              textStyle='base'
            >
              Jobs by Location
            </Text>
            <div className={styles.itemWrapperLocation}>
              {locationList.map((loc) => generatePath(loc.seoValue, `Jobs in ${loc?.value}`))}
            </div>
          </div>
          <div className={styles.section}>
            <Text
              className={styles.sectionHeader}
              textColor='primaryBlue'
              bold
              tagName='h3'
              textStyle='base'
            >
              Jobs by Specialization
            </Text>
            <div className={styles.itemWrapperCategory}>
              {categoryList.map((cat) => (
                <div key={cat.id}>
                  {generatePath(cat.key, `${cat.value} jobs`)}
                  {cat.sub_list.map((sub) => generatePath(sub.key, `${sub.value} jobs`))}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.section}>
            <Text
              className={styles.sectionHeader}
              textColor='primaryBlue'
              bold
              tagName='h3'
              textStyle='base'
            >
              Jobs by Industry
            </Text>
            <div className={styles.itemWrapperIndustry}>
              {industryList.map((industry) => generatePath(industry.key, `${industry.label} jobs`))}
            </div>
          </div>
          <div className={styles.section}>
            <Text
              className={styles.sectionHeader}
              textColor='primaryBlue'
              bold
              tagName='h3'
              textStyle='base'
            >
              Jobs by Work Experience
            </Text>
            <div className={styles.itemWrapperExperience}>
              {experienceList.map((exp) => generatePath(exp.key, `${exp.value} jobs`))}
            </div>
          </div>
          <div className={styles.section}>
            <Text
              className={styles.sectionHeader}
              textColor='primaryBlue'
              bold
              tagName='h3'
              textStyle='base'
            >
              Jobs by Qualification
            </Text>
            <div className={styles.itemWrapperQualification}>
              {qualificationList.map((qualification) => {
                if (qualification.value === 'Not required') {
                  return generatePath(qualification.key, `${qualification.value}`)
                }
                return generatePath(qualification.key, `${qualification.value} jobs`)
              })}
            </div>
          </div>
          <div className={styles.section}>
            <Text
              className={styles.sectionHeader}
              textColor='primaryBlue'
              bold
              tagName='h3'
              textStyle='base'
            >
              Jobs by Job Type
            </Text>
            <div className={styles.itemWrapperJobType}>
              {jobTypeList.map((jobType) => generatePath(jobType.key, `${jobType.value} jobs`))}
            </div>
          </div>
          <div className={styles.section}>
            <Text
              className={styles.sectionHeader}
              textColor='primaryBlue'
              bold
              tagName='h3'
              textStyle='base'
            >
              Jobs by Salary
            </Text>
            <div className={styles.itemWrapperSalary}>
              {salaryList.map((salary) => generatePath(salary.key, `${salary.label} jobs`))}
            </div>
          </div>
          <div className={styles.section}>
            <Text
              className={styles.sectionHeader}
              textColor='primaryBlue'
              bold
              tagName='h3'
              textStyle='base'
            >
              Other Resources
            </Text>
            {/* <Link
              className={styles.item}
              to={`${process.env.OLD_PROJECT_URL}/headhunt-me`}
              title='Headhunt Me'
              external
            >
              <Text textStyle='base'>Headhunt Me</Text>
            </Link> */}
            <Link
              className={styles.item}
              aTag
              to={`/resumetemplate`}
              title='Create Free Resume'
              external
            >
              <Text textStyle='base'>Create Free Resume</Text>
            </Link>
            <Link
              className={styles.item}
              to={`/jobs-hiring/job-search`}
              title={`Jobs in ${getCountry()}`}
              external
            >
              <Text textStyle='base'>All jobs</Text>
            </Link>
            <Link
              className={styles.item}
              to={`/company/bossjob-1668`}
              title='About Bossjob'
              external
            >
              <Text textStyle='base'>About Bossjob</Text>
            </Link>
            <Link
              className={styles.item}
              to='https://blog.bossjob.ph/category/career-advice/'
              title='Career Guide'
              aTag
              external
            >
              <Text textStyle='base'>Career Guide</Text>
            </Link>
            {/* <Link
              className={styles.item}
              to={`${process.env.OLD_PROJECT_URL}/bosspoints`}
              title='BossPoints'
              external
            >
              <Text textStyle='base'>BossPoints</Text>
            </Link> */}
            <Link
              className={styles.item}
              to={`${process.env.BLOG_BOSSJOB}/terms-and-conditions/  `}
              title='Legal'
              external
            >
              <Text textStyle='base'>Legal</Text>
            </Link>
            <Link
              className={styles.item}
              to={`${process.env.BOSS_BLOG_URL}/category/faq/`}
              title='FAQ'
              external
            >
              <Text textStyle='base'>FAQ</Text>
            </Link>
          </div>
        </div>
        <div className={styles.sectionWrapper}>
          <Text
            className={styles.sectionHeader}
            textColor='primaryBlue'
            bold
            tagName='h2'
            textStyle='lg'
          >
            For Employers
          </Text>
          <div className={styles.section}>
            <Link
              to={`${process.env.OLD_PROJECT_URL}/register/employer`}
              aTag
              className={styles.item}
              external
            >
              <Text textStyle='base'>Register as a recruiter</Text>
            </Link>
            <Link
              to={`${process.env.BOSSHUNT_URL}/get-started-company`}
              aTag
              className={styles.item}
              external
            >
              <Text textStyle='base'>Login as a recruiter</Text>
            </Link>
          </div>
          <div className={styles.section}>
            <Text
              className={styles.sectionHeader}
              textColor='primaryBlue'
              bold
              tagName='h3'
              textStyle='base'
            >
              Jobs
            </Text>
            <Link
              className={styles.item}
              to={`${process.env.OLD_PROJECT_URL}/employer/post-a-job`}
              title='Post a job'
              external
            >
              <Text textStyle='base'>Post A Job</Text>
            </Link>
            <Link
              className={styles.item}
              to={`${process.env.OLD_PROJECT_URL}/employer#pricing`}
              title='Job Posting Prices'
              external
            >
              <Text textStyle='base'>Job Posting Price</Text>
            </Link>
            <Link
              className={styles.item}
              to={`${process.env.OLD_PROJECT_URL}/employer#partners`}
              title='Jobsite Partners'
              external
            >
              <Text textStyle='base'>Jobsite Partners</Text>
            </Link>
          </div>
          <div className={styles.section}>
            <Text
              className={styles.sectionHeader}
              textColor='primaryBlue'
              bold
              tagName='h3'
              textStyle='base'
            >
              Headhunt
            </Text>
            <Link
              className={styles.item}
              to={`${process.env.OLD_PROJECT_URL}/employer/bosshunt/agency`}
              title='Search Headhunters'
              external
            >
              <Text textStyle='base'>Search Headhunters</Text>
            </Link>
          </div>
        </div>
        <div className={styles.section}>
          <Text
            className={styles.sectionHeader}
            textColor='primaryBlue'
            bold
            tagName='h2'
            textStyle='lg'
          >
            For Headhunters
          </Text>
          <div className={styles.section}>
            <Link className={styles.item} to='https://employer.bossjob.com' external title='Bosshunt'>
              <Text textStyle='base'>Bosshunt</Text>
            </Link>
            <Link
              className={styles.item}
              to='https://employer.bossjob.com/get-started'
              external
              title='Request Demo'
            >
              <Text textStyle='base'>Request Demo</Text>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}


export default PublicSitemap
