// Components
import CompanyCard from './CompanyCard'
import CompanyCardLoader from 'components/Loader/CompanyCard'
// import Empty from './Empty'
import Empty from 'app/components/empty/empty'

// Styles
import styles from '../Companies.module.scss'

interface ICompanyCardList {
  companiesList: any
  isLoading?: boolean
  lang?: any
  transitions: any
  langKey: string
  config: any
}

const CompanyCardList = (props: ICompanyCardList) => {
  const { companiesList, isLoading, transitions = {}, lang, langKey, config } = props

  return (
    <div className={styles.companyList}>
      {!isLoading &&
        companiesList?.length > 0 &&
        companiesList.map((item) => (
          <div className={styles.companyItem} key={item.id}>
            <CompanyCard
              transitions={transitions}
              config={config}
              company={item}
              langKey={langKey}
            />
          </div>
        ))}

      {!isLoading && !companiesList?.length && (
        <Empty lang={lang} description={lang?.companies?.companiesEmpty} />
      )}
    </div>
  )
}

export default CompanyCardList
