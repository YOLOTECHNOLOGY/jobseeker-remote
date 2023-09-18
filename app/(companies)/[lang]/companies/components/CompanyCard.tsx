/* Components */
import Link from 'components/Link'
import Image from 'next/image'
/* Helpers */
import { formatTemplateString, truncateWords } from 'helpers/formatter'

// Styles
import styles from '../Companies.module.scss'
import { useMemo } from 'react'
import { getValueById } from 'helpers/config/getValueById'
import { CompanyDetail } from './../typed'
import { isMobile } from 'react-device-detect'
import { setCookie } from 'helpers/cookies'
import { getDeviceUuid } from 'helpers/guest'

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

  const sendViewCompany = async () => {
    const device_udid = await getDeviceUuid()
    const params = {
      id: company?.id,
      payload: {
        source: 'company_search',
        device: isMobile ? 'mobile_web' : 'web',
        country_id: company?.country_id || '',
        device_udid
      }
    }
    setCookie('view-company-buried', JSON.stringify(params))
  }

  const industryValue = useMemo(() => {
    return getValueById(config, company?.industry_id, 'industry_id') || company?.industry
  }, [company?.industry])
  return (
    <div className={styles.compnayCardWrapper}>
      <div className={styles.companyCard}>
        <div className={styles.companyCardLeft}>
          <Link
            to={'/' + langKey + companyUrl}
            target='_blank'
            className={styles.companyCardImage}
            onClick={sendViewCompany}
          >
            <Image fill={true} src={company?.logo_url || company?.logo} alt={company?.name} />
          </Link>
          <div className={styles.companyVerify}>
            <Image
              alt={'fill'}
              fill
              src={`${process.env.S3_BUCKET_URL}/companies/verify1.svg`}
            ></Image>
          </div>
        </div>
        <div className={styles.companyCardRight}>
          <div className={styles.companyCardName}>
            <Link
              to={'/' + langKey + companyUrl}
              title={company?.name}
              target='_blank'
              onClick={sendViewCompany}
            >
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
            onClick={sendViewCompany}
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
        onClick={sendViewCompany}
      >
        <p dangerouslySetInnerHTML={{ __html: viewJobString() }}></p>
      </Link>
    </div>
  )
}

export default CompanyCard
