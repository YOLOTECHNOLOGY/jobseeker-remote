import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// @ts-ignore
import { END } from 'redux-saga'

// Redux Actions
import { wrapper } from 'store'
import { fetchCompanyDetailRequest } from 'store/actions/companies/fetchCompanyDetail'
import { fetchJobsListRequest } from 'store/actions/jobs/fetchJobsList'

// Components
import Text from 'components/Text'
import CompanyProfileLayout from 'components/Company/CompanyProfileLayout'

// Styles
import styles from '../Company.module.scss'

const CompanyLifeProfile = (props: any) => {
  const dispatch = useDispatch()
  const { companyDetail } = props
  const company = companyDetail?.response.data
  const [totalJobs, setTotalJobs] = useState(null)

  const fetchJobsListResponse = useSelector((store: any) => store.job.jobList.response)

  useEffect(() => {
    const payload = {
      companyIds: company.id,
      size: 30
    }

    dispatch(fetchJobsListRequest({...payload}))
  }, [])

  useEffect(() => {
    if (fetchJobsListResponse) setTotalJobs(fetchJobsListResponse.data?.total_num)
  }, [fetchJobsListResponse])

  return (
    <CompanyProfileLayout
      company={company}
      currentTab='life'
      totalJobs={totalJobs}
    >
      <div className={styles.companySection}>
        <div className={styles.companyTabsContent}>
          
          {company.cultures?.length > 0 && (
            <div className={styles.companyLifeCultures}>
              <Text textStyle='xxl' bold className={styles.companySectionTitle}>Company Culture</Text>
              <div className={styles.companyLifeCategoryList}>
                {company.cultures.map((culture) => (
                  <Text textStyle='base' className={styles.companyLifeCategoryValue} key={culture.id}>{culture.value}</Text>
                ))}
              </div>
            </div>
          )}
          
          {company.benefits?.length > 0 && (
            <div className={styles.companyLifeCultures}>
              <Text textStyle='xxl' bold className={styles.companySectionTitle}>Employee Benefits</Text>
              <div className={styles.companyLifeCategoryList}>
                {company.benefits.map((benefit) => (
                  <Text textStyle='base' className={styles.companyLifeCategoryValue} key={benefit.id}>{benefit.value}</Text>
                ))}
              </div>
            </div>
          )}

          <div className={styles.companyLifeCultures}>
            <Text textStyle='xxl' bold className={styles.companySectionTitle}>Photos</Text>
            {company.pictures?.length > 0 && (
              <div className={styles.companyLifePictures}>
                {company.pictures.map((picture) => (
                  <img src={picture.url} className={styles.companyLifePicture} key={picture.id} />
                ))}  
              </div>
            )}
          </div>
        </div>
      </div>
    </CompanyProfileLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const companyPageUrl = req.url.split('/')
  const companyPath = companyPageUrl.length === 4 ? companyPageUrl[2].split('-') : companyPageUrl[companyPageUrl.length - 1].split('-')
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

export default CompanyLifeProfile