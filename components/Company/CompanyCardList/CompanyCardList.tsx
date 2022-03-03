// Components
import CompanyCard from '../CompanyCard'

// Styles
import styles from './CompanyCardList.module.scss'
const CompanyCardList = () => {
  return (
    <div className={styles.companyList}>
      {[...Array(10)].map((_,i) => (
        <div className={styles.companyItem} key={i}>
          <CompanyCard />
        </div>
      ))}
    </div>
  )
}

export default CompanyCardList