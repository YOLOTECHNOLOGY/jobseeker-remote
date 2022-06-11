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
  const companyUrl = `/company/${slugify(company?.name.toLowerCase() || '')}-${company?.id}`

  return (
    <div className={styles.companyCard}>
      <div className={styles.companyCardLeft}>
        <Link to={companyUrl}>
          <img src={company.logo_url || company.logo} alt={company.name} className={styles.companyCardImage}/>
        </Link>
      </div>
      <div className={styles.companyCardRight}>
        <Link to={companyUrl} className={styles.companyCardName}>
          <Text textStyle='lg' bold>{company.name}</Text>
        </Link>
        <Text textStyle='lg' tagName='p' className={styles.companyCardCategory}>{company?.industry}</Text>
        <Link to={`${companyUrl}/jobs`} className={styles.companyCardOpenings}>
          <Text textStyle='lg' bold>View {company.num_of_active_jobs} job openings</Text>
        </Link>
      </div>
    </div>
  )
}

export default CompanyCard