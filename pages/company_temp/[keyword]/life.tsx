// @ts-ignore
import { END } from 'redux-saga'

// Redux Actions
import { wrapper } from 'store'
import { fetchCompanyDetailRequest } from 'store/actions/companies/fetchCompanyDetail'

// Components
import Text from 'components/Text'
import Image from 'next/image'
import CompanyProfileLayout from 'components/Company/CompanyProfileLayout'

// Images
import {
  CareerGrowth,
  DailyRoutine,
  PersonalHealth,
  TeamCollaboration,
  Strategy,
  Insurance,
  PerksAndBenefits,
  Leaves
} from 'images'

// Styles
import styles from '../Company.module.scss'

const CompanyLifeProfile = (props: any) => {
  const { companyDetail } = props
  const company = companyDetail?.response.data
  
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Team Collaboration':
        return <Image src={TeamCollaboration} width="25" height="25"/>
      case 'Daily Routines':
        return <Image src={DailyRoutine} width="25" height="25"/>
      case 'Career Growth':
        return <Image src={CareerGrowth} width="25" height="25"/>
      case 'Personal Health':
        return <Image src={PersonalHealth} width="25" height="25"/>
      case 'Strategy':
        return <Image src={Strategy} width="25" height="25"/>
      case 'Insurance, Health & Wellness':
        return <Image src={Insurance} width="25" height="25"/>
      case 'Perks & Benefits':
        return <Image src={PerksAndBenefits} width="25" height="25"/>
      default:
        return <Image src={Leaves} width="25" height="25"/>
    }
  }

  return (
    <CompanyProfileLayout
      company={company}
      currentTab='life'
    >
      <div className={styles.companyTabsContent}>
        {company.pictures?.length > 0 && (
          <div className={styles.companyLifePictures}>
            {company.pictures.map((picture) => (
              <img key={picture.id} src={picture.url} alt={company.name} className={styles.companyLifePicture}/>
            ))}
          </div>
        )}
        
        {company.cultures?.length > 0 && (
          <div className={styles.companyLifeCultures}>
            <Text textStyle='xxl' bold className={styles.companySectionTitle}>Company Culture</Text>
            <div className={styles.companyLifeCategoryList}>
              {company.cultures.map((culture) => (
                <div className={styles.companyLifeCategoryGroup} key={culture.id}>
                  <div className={styles.companyLifeCategory}>
                    {getCategoryIcon(culture.category)}
                    <Text textStyle='base' bold>{culture.category}</Text>
                  </div>
                  <Text textStyle='base' className={styles.companyLifeCategoryValue}>{culture.value}</Text>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {company.benefits?.length > 0 && (
          <div className={styles.companyLifeCultures}>
            <Text textStyle='xxl' bold className={styles.companySectionTitle}>Employee Benefits</Text>
            <div className={styles.companyLifeCategoryList}>
              {company.benefits.map((benefit) => (
                <div className={styles.companyLifeCategoryGroup} key={benefit.id}>
                  <div className={styles.companyLifeCategory}>
                    {getCategoryIcon(benefit.category)}
                    <Text textStyle='base' bold>{benefit.category}</Text>
                  </div>
                  <Text textStyle='base' className={styles.companyLifeCategoryValue}>{benefit.value}</Text>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CompanyProfileLayout>
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

export default CompanyLifeProfile