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
import { getCountry } from 'helpers/country'
import { getDictionary } from 'get-dictionary'
import { formatTemplateString } from 'helpers/formatter'

const CompanyLifeProfile = (props: any) => {
  const { companyDetail, seoMetaTitle, lang, seoMetaDescription, totalActiveJobs } = props
  const company = companyDetail
  const {
    companyDetail: { life }
  } = lang
  return (
    <CompanyProfileLayout
      lang={lang}
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
                {life.culture}
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
                {life.benefit}
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

          {company.pictures?.length > 0 && (
            <div className={styles.companyLifeCultures}>
              <Text tagName='h1' textStyle='xl' bold className={styles.companySectionTitle}>
                {life.photo}
              </Text>
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
            </div>
          )}
          {company.cultures?.length == 0 &&
            company.benefits?.length == 0 &&
            company.pictures?.length == 0 && (
              <div>
                <Text>
                  {formatTemplateString(life.noPhotoTips, company.name)}
                  {/* {company.name} has not uploaded any information about their company life. Please
                  come back again. */}
                </Text>
              </div>
            )}
        </div>
      </div>
    </CompanyProfileLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>

    async ({ req, query: { lang } }: any) => {
      const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null
      const companyPageUrl = req.url.split('/')
      const companyPath =
        companyPageUrl.length === 4
          ? companyPageUrl[2].split('-')
          : companyPageUrl[companyPageUrl.length - 2].split('-')
      const companyId = Number(companyPath[companyPath.length - 1])
      const jobFilterpayload = {
        companyIds: companyId,
        size: 10,
        page: 1
      }
      const dictionary = await getDictionary(lang || 'zh')

      store.dispatch(fetchJobsListRequest({ ...jobFilterpayload }, accessToken))
      store.dispatch(fetchCompanyDetailRequest(companyId))
      store.dispatch(END)

      await (store as any).sagaTask.toPromise()
      const storeState = store.getState()
      const companyDetail = storeState.companies.companyDetail.response.data
      console.log('companyDetail', !companyDetail)
      if (!companyDetail) {
        return {
          notFound: true
        }
      }

      const companyName = companyDetail?.name
      const jobList = storeState.job.jobList.response.data
      const totalActiveJobs = jobList?.total_num || 0
      const seoMetaTitle = `Culture & Life at ${companyName} | Bossjob`
      const seoMetaDescription = encodeURI(
        `Discover company culture & life at ${companyName} in ${getCountry()} on Bossjob - Connecting pre-screened experienced professionals to employers`
      )
      const additionalCanonicalText = '/life'
      const companyUrl = companyDetail.company_url
      const canonicalUrl = companyUrl + additionalCanonicalText
      return {
        props: {
          companyDetail,
          accessToken,
          seoMetaTitle,
          canonicalUrl,
          imageUrl: companyDetail?.logo_url,
          seoMetaDescription,
          totalActiveJobs,
          lang: dictionary
        }
      }
    }
)

export default CompanyLifeProfile
