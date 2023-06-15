// Components
import CompanyCard from './CompanyCard'
import CompanyCardLoader from 'components/Loader/CompanyCard'
// import Empty from './Empty'
import Empty from 'app/[lang]/components/empty/empty'


// Styles
import styles from '../Companies.module.scss'

interface ICompanyCardList {
  companiesList: any
  isLoading?: boolean
  lang?: any
  transitions: any
  langKey: string
}

const CompanyCardList = ({
  companiesList,
  isLoading,
  transitions = {},
  lang,
  langKey
}: ICompanyCardList) => {
  return (
    <div className={styles.companyList}>
      {isLoading &&
        [...Array(9)].map((_, i) => (
          <div className={styles.companyItem} key={i}>
            <CompanyCardLoader />
          </div>
        ))}

      {!isLoading &&
        companiesList?.length > 0 &&
        companiesList.map((item) => (
          <div className={styles.companyItem} key={item.id}>
            <CompanyCard transitions={transitions} company={item} langKey={langKey} />
          </div>
        ))}

      {!isLoading && !companiesList?.length && <Empty lang={lang} description="Companies Not Found" />}
    </div>
  )
}

export default CompanyCardList
