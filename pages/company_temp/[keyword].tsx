// @ts-ignore
import { END } from 'redux-saga'

// Redux Actions
import { wrapper } from 'store'
import { fetchCompanyDetailRequest } from 'store/actions/companies/fetchCompanyDetail'

// Components
import Layout from 'components/Layout'
import SEO from 'components/SEO'
import Text from 'components/Text'

// Styles
import styles from './Company.module.scss'

const CompanyDetail = (props: any) => {
  const { companyDetail } = props
  const company = companyDetail?.response.data
  
  // console.log(company)

  return (
    <Layout>
      <SEO title={`${company.name} Company`} />
      <div className={styles.companyDetail}>
        <div className={styles.companyDetailContent}>
          <div className={styles.companyDetailHeader}>
            <img 
              src={'https://assets.bossjob.com/companies/1668/cover-pictures/0817984dff0d7d63fcb8193fef08bbf2.jpeg'} 
              alt={company.name} 
              className={styles.companyDetailBanner}
            />
            <div className={styles.companyDetailProfile}>
              <img src={company.logo} alt={company.name} />
              <Text textStyle='xxl' bold>{company.name}</Text>
            </div>
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