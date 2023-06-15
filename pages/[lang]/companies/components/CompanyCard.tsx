/* Components */
import Text from 'components/Text'
import Link from 'components/Link'
import {RightArrowIcon} from 'images'
import Image from 'next/image'
/* Helpers */
import { formatTemplateString, truncateWords } from 'helpers/formatter'

// Styles
import styles from '../CompanyCardList.module.scss'
interface ICompanyCard {
  company: any
  transitions: Record<string, any>,
  langKey: string
}

const CompanyCard = ({ company, transitions,langKey }: ICompanyCard) => {
  const companyUrl = company?.company_url || '/'

  return (
    <div className={styles.companyCard}>
      <div className={styles.companyCardLeft}>
        <Link to={'/' + langKey + companyUrl}>
          <img
            src={company?.logo_url || company?.logo}
            alt={company?.name}
            className={styles.companyCardImage}
          />
        </Link>
      </div>
      <div className={styles.companyCardRight}>
        <div className={styles.companyCardName}>
          <Text textStyle='lg' bold>
            <Link to={'/' + langKey + companyUrl}>{truncateWords(company.name, 60)}</Link>
          </Text>
        </div>
        <Text textStyle='lg' tagName='p' className={styles.companyCardCategory}>
          {company?.industry}
        </Text>
        <Link to={`/${langKey}${companyUrl}/jobs`} className={styles.companyCardOpenings}>
          <Text textStyle='lg' bold>
            {formatTemplateString(transitions.allJobs, company.num_of_active_jobs)}
          </Text>
          <Image width={6} height={12} src={RightArrowIcon} alt='more icon' className={styles.arrowIcon} />
        </Link>
      </div>
    </div>
  )
}

export default CompanyCard
