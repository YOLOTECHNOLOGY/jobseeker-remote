/* Components */
import Text from 'components/Text'
import Link from 'components/Link'
// import { RightArrowIcon } from 'images'
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

  const viewJobString = () => {
    return formatTemplateString(transitions.allJobs, {
      totalActiveJobs:
        company.num_of_active_jobs > 0 ? `<span>${company.num_of_active_jobs}</span>` : ''
    })
  }

  return (
    <div className={styles.companyCard}>
      <div className={styles.companyCardLeft}>
        <Link to={'/' + langKey + companyUrl} target='_blank' className={styles.companyCardImage}>
          <Image fill={true} src={company?.logo_url || company?.logo} alt={company?.name} />
        </Link>
      </div>
      <div className={styles.companyCardRight}>
        <div className={styles.companyCardName}>
          <Link to={'/' + langKey + companyUrl} title={company?.name} target='_blank'>
            {truncateWords(company.name, 60)}
          </Link>
        </div>
        <p className={styles.companyCardCategory} title={company?.industry}>
          {company?.industry}
        </p>
        <Link
          to={`/${langKey}${companyUrl}/jobs`}
          target='_blank'
          className={styles.companyCardOpenings}
        >
          <p dangerouslySetInnerHTML={{ __html: viewJobString() }}></p>
        </Link>
      </div>
    </div>
  )
}

export default CompanyCard
