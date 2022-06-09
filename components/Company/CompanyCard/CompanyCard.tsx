import slugify from 'slugify'

// Components
import Text from 'components/Text'
import Link from 'components/Link'

// Styles
import styles from './CompanyCard.module.scss'

interface ICompanyCard {
  company: any
}

const CompanyCard = ({
  company
}: ICompanyCard) => {
  return (
    <div className={styles.companyCard}>
      <div className={styles.companyCardLeft}>
        <img src={company.logo_url || company.logo} alt={company.name} className={styles.companyCardImage}/>
      </div>
      <div className={styles.companyCardRight}>
        <Link to={`/company/${slugify(company?.name.toLowerCase() || '')}-${company?.id}`} className={styles.companyCardName}>
          <Text textStyle='lg' bold>{company.name}</Text>
        </Link>
        <Text textStyle='lg' tagName='p' className={styles.companyCardCategory}>{company?.industry}</Text>
        <Link to={`/company/${slugify(company?.name.toLowerCase() || '')}-${company?.id}/jobs`} className={styles.companyCardOpenings}>
          <Text textStyle='lg' bold>View {company.num_of_active_jobs} job openings</Text>
        </Link>
      </div>
    </div>
  )
}

export default CompanyCard