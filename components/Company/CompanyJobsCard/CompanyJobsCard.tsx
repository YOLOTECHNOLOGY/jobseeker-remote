import slugify from 'slugify'

// Components
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'
import Link from 'components/Link'

// Styles
import styles from './CompanyJobsCard.module.scss'
import SeoText from '../../SeoText'

interface ICompanyJobsCard {
  id: number
  title: string
  location: string
  salary: string
  availability: string
}

const CompanyJobsCard = ({ title, location, salary, availability, id }: ICompanyJobsCard) => {
  return (
    <div className={styles.companyJobsCard}>
      <div className={styles.companyJobsCardLeft}>
        <Text textStyle='base' bold>
          {title}
        </Text>
        <SeoText tagName='h2'>{title}</SeoText>
        <div className={styles.companyJobsCardInfo}>
          <Text textStyle='base' className={styles.companyJobsCardLocation}>
            {location}
          </Text>
          <Text textStyle='base' className={styles.companyJobsCardSalary}>
            {salary}
          </Text>
          <Text textStyle='base' className={styles.companyJobsCardAvailability}>
            {availability}
          </Text>
        </div>
      </div>
      <div className={styles.companyJobsCardRight}>
        <Link to={`/job/${slugify(title.toLowerCase())}-${id}`}>
          <MaterialButton variant='outlined' capitalize className={styles.companyJobsCardApply}>
            <Text textStyle='base' textColor='primaryBlue' bold>
              Apply Now
            </Text>
          </MaterialButton>
        </Link>
      </div>
    </div>
  )
}

export default CompanyJobsCard
