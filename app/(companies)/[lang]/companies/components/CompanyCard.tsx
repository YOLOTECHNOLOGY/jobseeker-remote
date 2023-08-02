/* Components */
import Link from 'components/Link'
import Image from 'next/image'
/* Helpers */
import { formatTemplateString, truncateWords } from 'helpers/formatter'

// Styles
import styles from '../Companies.module.scss'
import { useMemo } from 'react'
import { getValueById } from 'helpers/config/getValueById'
import {CompanyDetail} from './../typed'
interface ICompanyCard {
  company: CompanyDetail
  transitions: Record<string, any>
  langKey: string
  config: any
}

const CompanyCard = (props: ICompanyCard) => {
  const { company, transitions, langKey, config } = props

  const companyUrl = company?.company_url || '/'

  const viewJobString = () => {
    return formatTemplateString(transitions.allJobs, {
      totalActiveJobs: `<span>${company.num_of_active_jobs}</span>`
    })
  }

  const industryValue = useMemo(() => {
    return getValueById(config, company?.industry_id, 'industry_id') || company?.industry
  }, [company?.industry])
  return (
    <div className={styles.compnayCardWrapper}>
      <div className={styles.companyCard}>
        <div className={styles.companyCardLeft}>
          <Link to={'/' + langKey + companyUrl} target='_blank' className={styles.companyCardImage}>
            <Image fill={true} src={company?.logo_url || company?.logo} alt={company?.name} />
          </Link>
          <div className={styles.companyVerify}>
            <Image alt={'fill'} fill src={`${process.env.S3_BUCKET_URL}/companies/verify1.svg`}></Image>
          </div>
        </div>
        <div className={styles.companyCardRight}>
          <div className={styles.companyCardName}>
            <Link to={'/' + langKey + companyUrl} title={company?.name} target='_blank'>
              {truncateWords(company.name, 60)}
            </Link>
          </div>
          <p className={styles.companyCardCategory} title={industryValue}>
            {industryValue}
          </p>
          <div className={styles.split}>
            <div className={styles.split_hover}></div>
          </div>
          <Link
            to={`/${langKey}${companyUrl}/jobs`}
            target='_blank'
            className={styles.companyCardOpenings}
          >
            <p dangerouslySetInnerHTML={{ __html: viewJobString() }}></p>
            <span>View More</span>
          </Link>
        </div>
      </div>
      <Link
            to={`/${langKey}${companyUrl}/jobs`}
            target='_blank'
            className={styles.companyCardOpenings + ' ' + styles.mobileOpenings}
            
          >
            <p dangerouslySetInnerHTML={{ __html: viewJobString() }}></p>
        </Link>
    </div>

  )
}

export default CompanyCard
