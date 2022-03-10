// Components
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'

// Styles
import styles from './CompanyJobsCard.module.scss'

interface ICompanyJobsCard {
  title: string
  location: string
  salary: string
  availability: string
}

const CompanyJobsCard = ({
  title,
  location,
  salary,
  availability
}: ICompanyJobsCard) => {
  return (
    <div className={styles.companyJobsCard}>
      <div className={styles.companyJobsCardLeft}>
        <Text textStyle='base' bold>{title}</Text>
        <div className={styles.companyJobsCardInfo}>
          <Text textStyle='base' className={styles.companyJobsCardLocation}>{location}</Text>
          <Text textStyle='base' className={styles.companyJobsCardSalary}>{salary}</Text>
          <Text textStyle='base' className={styles.companyJobsCardAvailability}>{availability}</Text>
        </div>
      </div>
      <div className={styles.companyJobsCardRight}>
        <MaterialButton variant='outlined' capitalize className={styles.companyJobsCardApply}>
          <Text textStyle='base' textColor='primaryBlue' bold>Apply Now</Text>
        </MaterialButton>
      </div>
    </div>
  )
}

export default CompanyJobsCard