/* Components */
import Text from 'components/Text'
import Link from 'components/Link'
import { RightArrowIcon } from 'images'
import Image from 'next/image'
/* Helpers */
import { formatTemplateString, truncateWords } from 'helpers/formatter'

// Styles
import styles from '../Companies.module.scss'
interface ICompanyCard {
  company: any
  transitions: Record<string, any>
  langKey: string
}

const CompanyCard = ({ company, transitions, langKey }: ICompanyCard) => {
  const companyUrl = company?.company_url || '/'

  return (
    <div className={styles.companyCard}>
      <div className={styles.companyCardLeft}>
        <Link to={'/' + langKey + companyUrl} className={styles.companyCardImage}>
          <Image
            fill={true}
            src={company?.logo_url || company?.logo}
            alt={company?.name}
          />
        </Link>
      </div>
      <div className={styles.companyCardRight}>
        <Text textStyle='lg' className={styles.companyCardName}>
          <Link to={'/' + langKey + companyUrl} title={company?.name}>{truncateWords(company.name, 60)}</Link>
        </Text>
        <Text textStyle='lg' tagName='p' className={styles.companyCardCategory}>
          {company?.industry}
        </Text>
        <Link to={`/${langKey}${companyUrl}/jobs`} className={styles.companyCardOpenings}>
          <Text textStyle='lg' bold>
            {formatTemplateString(transitions.allJobs, company.num_of_active_jobs)}
          </Text>
          <Image
            width={6}
            height={12}
            src={RightArrowIcon}
            alt='more icon'
            className={styles.arrowIcon}
          />
        </Link>
      </div>
    </div>
  )
}

export default CompanyCard
