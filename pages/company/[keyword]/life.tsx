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
  const { companyDetail, seoMetaTitle, seoMetaDescription, totalActiveJobs } = props
  const company = companyDetail?.response.data

  return (
    <CompanyProfileLayout
      company={company}
      currentTab='life'
      totalJobs={totalActiveJobs}
      seoMetaTitle={seoMetaTitle}
      seoMetaDescription={seoMetaDescription}
    >
      <div className={styles.companySection}>
        <div className={styles.companyTabsContent}>
          {company.cultures?.length > 0 && (
            <div className={styles.companyLifeCultures}>
              <Text tagName='h1' textStyle='xl' bold className={styles.companySectionTitle}>
                Company Culture
              </Text>
              <div className={styles.companyLifeCategoryList}>
                {company.cultures.map((culture) => (
                  <Text
                    textStyle='base'
                    className={styles.companyLifeCategoryValue}
                    key={culture.id}
                  >
                    {culture.value}
                  </Text>
                ))}
              </div>
            </div>
          )}

          {company.benefits?.length > 0 && (
            <div className={styles.companyLifeCultures}>
              <Text tagName='h1' textStyle='xl' bold className={styles.companySectionTitle}>
                Employee Benefits
              </Text>
              <div className={styles.companyLifeCategoryList}>
                {company.benefits.map((benefit) => (
                  <Text
                    textStyle='base'
                    className={styles.companyLifeCategoryValue}
                    key={benefit.id}
                  >
                    {benefit.value}
                  </Text>
                ))}
              </div>
            </div>
          )}

          <div className={styles.companyLifeCultures}>
            <Text tagName='h1' textStyle='xl' bold className={styles.companySectionTitle}>
              Photos
            </Text>
            {company.pictures?.length > 0 ? (
              <div className={styles.companyLifePictures}>
                {company.pictures.map((picture, index) => (
                  <img
                    src={picture.url}
                    alt={`${company.name} photo ${index}`}
                    className={styles.companyLifePicture}
                    key={picture.id}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyResult}>
                <Text>
                  The company has not provided any photos.
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </CompanyProfileLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null
  const companyPageUrl = req.url.split('/')
  const companyPath = companyPageUrl.length === 4 ? companyPageUrl[2].split('-') : companyPageUrl[companyPageUrl.length - 1].split('-')
  const companyId = Number(companyPath[companyPath.length - 1])
  const jobFilterpayload = {
    companyIds: companyId,
    size: 10,
    page: 1
  }

  store.dispatch(fetchJobsListRequest({...jobFilterpayload}, accessToken))
  store.dispatch(fetchCompanyDetailRequest(companyId))
  store.dispatch(END)

  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()

  const companyDetail = storeState.companies.companyDetail
  const companyName = companyDetail.response.data.name
  const jobList = storeState.job.jobList.response.data
  const totalActiveJobs = jobList?.total_num || 0
  const seoMetaTitle = `Culture & Life at ${companyName} | Bossjob`
  const seoMetaDescription = `Discover company culture & life at ${companyName} in Philippines on Bossjob - Connecting pre-screened experienced professionals to employers`
  return {
    props: {
      companyDetail,
      accessToken,
      seoMetaTitle,
      seoMetaDescription,
      totalActiveJobs
    },
  }
})

export default CompanyLifeProfile