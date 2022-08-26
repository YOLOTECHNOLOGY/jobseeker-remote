import { useState, useEffect } from 'react'

/* Vendors */
import { END } from 'redux-saga'
import { wrapper } from 'store'

/* Components */
import Layout from 'components/Layout'
import Text from 'components/Text'
import Link from 'components/Link'

/* Actions */
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'

/* Styles */
import styles from './PublicSitemap.module.scss'

const PublicSitemap = ({ config }: any) => {
  const [locationList, setLocationList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [industryList, setIndustryList] = useState([])
  const [qualificationList, setQualificationList] = useState([])
  const [experienceList, setExperienceList] = useState([])
  const [jobTypeList, setJobTypeList] = useState([])
  const [salaryList, setSalaryList] = useState([])

  useEffect(() => {
    if (config) {
      const locationList =
        config &&
        config.inputs.location_lists
          .map(region =>
            region.locations.map(loc => ({
              ...loc,
              value: loc.value,
              // loc value all lower case
              seoValue: loc.seo_value
            }))
          )
          .reduce((a, c) => a.concat(c), [])
          .sort((a, b) => a.value.localeCompare(b.value))

      const categoryList =
        config &&
        config.inputs.job_category_lists &&
        config.inputs.job_category_lists

      const industryList =
        config &&
        config.inputs.industry_lists.map(industry => ({
          key: industry['seo-value'],
          label: industry.value,
          value: industry.value.replace(/&/gi, '%26')
        }))

      const qualificationList =
        config &&
        config.filters.educations &&
        config.filters.educations.map(degree => {
          return {
            key: degree['seo-value'],
            label: degree.value,
            value: degree.value
          }
        })

      const experienceList =
        config &&
        config.filters.work_xps &&
        config.filters.work_xps.map(level => {
          return {
            key: level['seo-value'],
            label: level.value,
            value: level.value
          }
        })

      const jobTypeList =
        config &&
        config.inputs.job_types &&
        config.inputs.job_types.map(type => {
          return {
            key: type['seo-value'],
            label: type.value,
            value: type.value
          }
        })

      const salaryList =
        config &&
        config.filters.salary_range_filters &&
        config.filters.salary_range_filters.map(salary => {
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
    const pathUrl = `${process.env.NEW_PROJECT_URL}/jobs-hiring/${param}-jobs`

    return (
      <Link
        to={pathUrl}
        external
        className={styles.item}
        key={param}
      >
        <Text textStyle='base'>
          {label}
        </Text>
      </Link>
    )
  }

  return (
    <Layout>
      <div className={styles.contentWrapper}>
        <Text className={styles.sectionHeader} textColor="primaryBlue" bold tagName="h1" textStyle="xxl">
          Sitemap
        </Text>
        <div className={styles.sectionWrapper}>
          <Text className={styles.sectionHeader} textColor="primaryBlue" bold tagName="h2" textStyle="lg">
            For Jobseekers
          </Text>
          <div className={styles.section}>
            <Link
              to={`${process.env.NEW_PROJECT_URL}/register/jobseeker`}
              aTag
              className={styles.item}
              external
            >
              <Text textStyle='base'>
                Register as a jobseeker
              </Text>
            </Link>
            <Link
              to={`${process.env.NEW_PROJECT_URL}/login/jobseeker`}
              aTag
              className={styles.item}
              external
            >
              <Text textStyle='base'>
                Login as a jobseeker
              </Text>
            </Link>
          </div>
          <div className={styles.section}>
            <Text className={styles.sectionHeader} textColor="primaryBlue" bold tagName="h3" textStyle="base">
              Jobs by Location
            </Text>
            <div className={styles.itemWrapperLocation}>
              {locationList.map(loc => (
                  generatePath(
                    loc.seoValue,
                    `Jobs in ${loc.value}`
                  )
                )
              )}
            </div>
          </div>
          <div className={styles.section}>
            <Text className={styles.sectionHeader} textColor="primaryBlue" bold tagName="h3" textStyle="base">
              Jobs by Specialization
            </Text>
            <div className={styles.itemWrapperCategory}>
              {categoryList.map(cat =>
                <div key={cat.id}>
                  {generatePath(cat.key, `${cat.value} jobs`)}
                  {cat.sub_list.map(sub => generatePath(sub.key, `${sub.value} jobs`))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.section}>
            <Text className={styles.sectionHeader} textColor="primaryBlue" bold tagName="h3" textStyle="base">
              Jobs by Industry
            </Text>
            <div className={styles.itemWrapperIndustry}>
              {industryList.map(industry =>
                generatePath(industry.key, `${industry.label} jobs`)
              )}
            </div>
          </div>
          <div className={styles.section}>
            <Text className={styles.sectionHeader} textColor="primaryBlue" bold tagName="h3" textStyle="base">
              Jobs by Work Experience
            </Text>
            <div className={styles.itemWrapperExperience}>
              {experienceList.map(exp =>
                generatePath(exp.key, `${exp.value} jobs`)
              )}
            </div>
          </div>
          <div className={styles.section}>
            <Text className={styles.sectionHeader} textColor="primaryBlue" bold tagName="h3" textStyle="base">
              Jobs by Qualification
            </Text>
            <div className={styles.itemWrapperQualification}>
              {qualificationList.map(qualification => {
                if (qualification.value === 'Not required') {
                  return generatePath(
                    qualification.key,
                    `${qualification.value}`
                  )
                }
                return generatePath(
                  qualification.key,
                  `${qualification.value} jobs`
                )
              })}
            </div>
          </div>
          <div className={styles.section}>
            <Text className={styles.sectionHeader} textColor="primaryBlue" bold tagName="h3" textStyle="base">
              Jobs by Job Type
            </Text>
            <div className={styles.itemWrapperJobType}>
              {jobTypeList.map(jobType =>
                generatePath(jobType.key, `${jobType.value} jobs`)
              )}
            </div>
          </div>
          <div className={styles.section}>
            <Text className={styles.sectionHeader} textColor="primaryBlue" bold tagName="h3" textStyle="base">
              Jobs by Salary
            </Text>
            <div className={styles.itemWrapperSalary}>
              {salaryList.map(salary =>
                generatePath(salary.key, `${salary.label} jobs`)
              )}
            </div>
          </div>
          <div className={styles.section}>
            <Text className={styles.sectionHeader} textColor="primaryBlue" bold tagName="h3" textStyle="base">
              Other Resources
            </Text>
            <Link
              className={styles.item}
              to={`${process.env.OLD_PROJECT_URL}/headhunt-me`}
              title="Headhunt Me"
              external
            >
              <Text textStyle="base">Headhunt Me</Text>
            </Link>
            <Link
              className={styles.item}
              aTag
              to={`${process.env.NEW_PROJECT_URL}/resumetemplate`}
              title="Create Free Resume"
              external
            >
              <Text textStyle="base">Create Free Resume</Text>
            </Link>
            <Link
              className={styles.item}
              to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/job-search`}
              title="Jobs in Philippines"
              external
            >
              <Text textStyle="base">All jobs</Text>
            </Link>
            <Link
              className={styles.item}
              to={`${process.env.NEW_PROJECT_URL}/company/bossjob-1668`}
              title="About Bossjob"
              external
            >
              <Text textStyle="base">About Bossjob</Text>
            </Link>
            <Link
              className={styles.item}
              to="https://blog.bossjob.ph/category/career-advice/"
              title="Career Guide"
              aTag
              external
            >
              <Text textStyle="base">Career Guide</Text>
            </Link>
            <Link
              className={styles.item}
              to={`${process.env.OLD_PROJECT_URL}/bosspoints`}
              title="BossPoints"
              external
            >
              <Text textStyle="base">BossPoints</Text>
            </Link>
            <Link className={styles.item} to={`${process.env.OLD_PROJECT_URL}/legal`} title="Legal" external>
              <Text textStyle="base">Legal</Text>
            </Link>
            <Link className={styles.item} to={`${process.env.OLD_PROJECT_URL}/faq`} title="FAQ" external>
              <Text textStyle="base">FAQ</Text>
            </Link>
          </div>
        </div>
        <div className={styles.sectionWrapper}>
          <Text className={styles.sectionHeader} textColor="primaryBlue" bold tagName="h2" textStyle="lg">
            For Employers
          </Text>
          <div className={styles.section}>
            <Link to={`${process.env.OLD_PROJECT_URL}/register/employer`} aTag className={styles.item} external>
              <Text textStyle='base'>
                Register as a recruiter
              </Text>
            </Link>
            <Link to={`${process.env.OLD_PROJECT_URL}/login/employer`} aTag className={styles.item} external>
              <Text textStyle='base'>
                Login as a recruiter
              </Text>
            </Link>
          </div>
          <div className={styles.section}>
            <Text className={styles.sectionHeader} textColor="primaryBlue" bold tagName="h3" textStyle="base">
              Jobs
            </Text>
            <Link
              className={styles.item}
              to={`${process.env.OLD_PROJECT_URL}/employer/post-a-job`}
              title="Post a job"
              external
            >
              <Text textStyle="base">Post A Job</Text>
            </Link>
            <Link
              className={styles.item}
              to={`${process.env.OLD_PROJECT_URL}/employer#pricing`}
              title="Job Posting Prices"
              external
            >
              <Text textStyle="base">Job Posting Price</Text>
            </Link>
            <Link
              className={styles.item}
              to={`${process.env.OLD_PROJECT_URL}/employer#partners`}
              title="Jobsite Partners"
              external
            >
              <Text textStyle="base">Jobsite Partners</Text>
            </Link>
          </div>
          <div className={styles.section}>
            <Text className={styles.sectionHeader} textColor="primaryBlue" bold tagName="h3" textStyle="base">
              Headhunt
            </Text>
            <Link
              className={styles.item}
              to={`${process.env.OLD_PROJECT_URL}/employer/bosshunt/agency`}
              title="Search Headhunters"
              external
            >
              <Text textStyle="base">Search Headhunters</Text>
            </Link>
          </div>
        </div>
        <div className={styles.section}>
          <Text className={styles.sectionHeader} textColor="primaryBlue" bold tagName="h2" textStyle="lg">
            For Headhunters
          </Text>
          <div className={styles.section}>
            <Link
              className={styles.item}
              to="https://hunt.bossjob.ph"
              external
              title="Bosshunt"
            >
              <Text textStyle="base">Bosshunt</Text>
            </Link>
            <Link
              className={styles.item}
              to="https://hunt.bossjob.ph/get-started"
              external
              title="Request Demo"
            >
              <Text textStyle="base">Request Demo</Text>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async () => {
  store.dispatch(fetchConfigRequest())
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response

  return {
    props: {
      config,
    }
  }
})

export default PublicSitemap