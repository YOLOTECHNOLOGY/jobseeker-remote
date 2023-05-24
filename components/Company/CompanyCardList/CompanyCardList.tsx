// Components
import CompanyCard from '../CompanyCard'
import CompanyCardLoader from 'components/Loader/CompanyCard'

// Styles
import styles from './CompanyCardList.module.scss'

interface ICompanyCardList {
  companiesList: any
  isSearchPage?: boolean
  isLoading?: boolean
  transitions: any,
  langKey: string
}

const CompanyCardList = ({
  companiesList,
  isSearchPage,
  isLoading,
  transitions = {},
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
        isSearchPage &&
        companiesList?.length > 0 &&
        companiesList.map((company) => (
          <div className={styles.companyItem} key={company.id}>
            <CompanyCard transitions={transitions} company={company} langKey={langKey}/>
          </div>
        ))}
      {!isLoading &&
        !isSearchPage &&
        companiesList?.length > 0 &&
        companiesList.map((item) => (
          <div className={styles.companyItem} key={item.id}>
            <CompanyCard transitions={transitions} company={item.company} langKey={langKey}/>
          </div>
        ))}
    </div>
  )
}

export default CompanyCardList
