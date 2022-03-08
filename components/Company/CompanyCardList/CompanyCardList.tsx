// Components
import CompanyCard from '../CompanyCard'

// Styles
import styles from './CompanyCardList.module.scss'

interface ICompanyCardList {
  companiesList: any
}

const CompanyCardList = ({
  companiesList
}: ICompanyCardList) => {
  return (
    <div className={styles.companyList}>
      {companiesList?.length > 0 && companiesList.map((item) => (
        <div className={styles.companyItem} key={item.id}>
          <CompanyCard company={item.company}/>
        </div>
      ))}
    </div>
  )
}

export default CompanyCardList