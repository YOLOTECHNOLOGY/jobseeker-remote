// Components
import Text from 'components/Text'
import CompanyCardList from 'components/Company/CompanyCardList'

// Styles
import styles from './Companies.module.scss'

const Companies = () => {
  return (
    <div className={styles.companies}>
      <Text>Companies</Text>
      <CompanyCardList />
    </div>
  )
}

export default Companies