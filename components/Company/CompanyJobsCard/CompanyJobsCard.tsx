// Components
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'
import Link from 'components/Link'

// Styles
import styles from './CompanyJobsCard.module.scss'
import MetaText from '../../MetaText'

interface ICompanyJobsCard {
  title: string
  location: string
  salary: string
  availability: string
  jobUrl: string
  chatText: string
}

const CompanyJobsCard = ({
  title,
  location,
  salary,
  availability,
  jobUrl,
  chatText
}: ICompanyJobsCard) => {
  const host =
    typeof window === 'undefined' ? process.env.NEXT_PUBLIC_HOST_PATH : window?.location.host

  return (
    <div className={styles.companyJobsCard}>
      <div className={styles.companyJobsCardLeft}>
        <Text textStyle='lg' bold>
          {title}
        </Text>
        <MetaText>{title}</MetaText>
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
        <Link to={`${host}${jobUrl}`} external>
          <MaterialButton variant='outlined' capitalize className={styles.companyJobsCardApply}>
            <Text textStyle='base' textColor='primaryBlue' bold>
              {chatText}
            </Text>
          </MaterialButton>
        </Link>
      </div>
    </div>
  )
}

export default CompanyJobsCard
