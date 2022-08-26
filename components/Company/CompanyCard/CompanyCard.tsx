import { isMobile } from 'react-device-detect'

/* Components */
import Text from 'components/Text'
import Link from 'components/Link'
import MaterialDesktopTooltip from 'components/MaterialDesktopTooltip'
import MaterialMobileTooltip from 'components/MaterialMobileTooltip'

/* Helpers */
import { truncateWords } from 'helpers/formatter'

// Styles
import styles from './CompanyCard.module.scss'
interface ICompanyCard {
  company: any
}

// Assets
import { BlueTickIcon } from 'images'

const CompanyCard = ({
  company
}: ICompanyCard) => {
  const companyUrl = company?.company_url || '/'

  return (
    <div className={styles.companyCard}>
      <div className={styles.companyCardLeft}>
          <Link to={companyUrl}>
            <img src={company.logo_url || company.logo} alt={company.name} className={styles.companyCardImage}/>
          </Link>
      </div>
      <div className={styles.companyCardRight}>
        <div className={styles.companyCardName}>
          <Text textStyle='lg' bold>
            <Link to={companyUrl}>
              {truncateWords(company.name, 60)}
            </Link>
            {company?.is_verify && (isMobile ? (
              <MaterialMobileTooltip
                icon={BlueTickIcon}
                className={styles.companyCardTooltip}
                title='Verified'
              />
            ) : (
              <MaterialDesktopTooltip
                icon={BlueTickIcon}
                className={styles.companyCardTooltip}
                title='Verified'
              />
            ))}
          </Text>
        </div>
        <Text textStyle='lg' tagName='p' className={styles.companyCardCategory}>{company?.industry}</Text>
        <Link to={`${companyUrl}/jobs`} className={styles.companyCardOpenings}>
          <Text textStyle='lg' bold>View {company.num_of_active_jobs} job openings</Text>
        </Link>
      </div>
    </div>
  )
}

export default CompanyCard