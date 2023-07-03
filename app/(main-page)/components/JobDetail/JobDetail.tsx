// 'user client'
import { memo, useContext } from 'react'
import Link from 'next/link'
// import Avatar from '@mui/material/Avatar'
import { HomePageChat } from 'images'
import styles from 'app/index.module.scss'
import Image from 'next/image'
import { languageContext } from 'app/components/providers/languageProvider'
import { getValueById } from 'helpers/config/getValueById'
import { addJobViewService } from 'store/services/jobs/addJobView'
import { isMobile } from 'react-device-detect'
import { getCookie, setCookie } from 'helpers/cookies'
import { useRouter } from 'next/navigation'

const JobDetail = ({ detail, config, langKey }: any) => {
  const router = useRouter()

  const accessToken = getCookie('accessToken')
  const { home } = useContext(languageContext) as any
  const jobLocation = getValueById(config, detail?.job_location_id, 'location_id')
  const financingStage = getValueById(
    config,
    detail?.company_financing_stage_id,
    'company_financing_stage_id'
  )
  const xpLvlValue = getValueById(config, detail?.xp_lvl_id, 'xp_lvl_id')
  const degreeValue = getValueById(config, detail?.degree_id, 'degree_id')
  const industry = getValueById(config, detail?.company_industry_id, 'industry_id')

  const handleAddJobView = (url) => {
    if (accessToken) {
      const params = {
        jobId: detail.id,
        source: 'home', // this is usually used in search result
        status: accessToken ? 'protected' : 'public',
        device: isMobile ? 'mobile_web' : 'web',
        reco_from: detail?.reco_from
      }
      setCookie('source', 'home')
      setCookie('reco_from', detail?.reco_from)
      // addJobViewService(params)
    }
  }

  return (
    <div className={styles.job_detail}>
      <div
        className={styles.job_info}
        onClick={() => handleAddJobView('/' + langKey + detail.job_url)}
      >
        <Link prefetch={false}  href={'/' + langKey + detail.job_url}>
          <div className={styles.job_titleWrapper}>
            <div className={styles.job_info_title}>{detail?.job_title}</div>
            <div className={styles.transBox}>
              <div className={styles.job_info_salary}>{detail?.local_salary_range_value}</div>
              <div className={styles.job_info_chat}>
                <Image
                  src={HomePageChat}
                  alt='Boss job chat now'
                  width='18'
                  height='18'
                  quality={0}
                  style={{ paddingRight: '4px' }}
                />{' '}
                {home.jobCard.chatNow}
              </div>
            </div>
          </div>

          <div className={styles.job_tags}>
            <div>{jobLocation}</div>
            <div>{xpLvlValue}</div>
            <div>{degreeValue}</div>
          </div>
        </Link>
      </div>

      <Link className={styles.job_companyInfo} href={'/' + langKey + detail.company_url}>
        <div className={styles.job_avatarWrapper}>
          <div className={styles.job_box}>
            <Image
              alt={detail?.job_title}
              src={detail?.company_logo}
              width={24}
              height={24}
              quality={0}
            ></Image>
            <div className={styles.job_companyInfo_name}>{detail?.company_name}</div>
          </div>
          <div className={styles.job_companyInfo_industry}>
            {industry}
            {industry && financingStage ? ' | ' : null}
            {financingStage}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default memo(JobDetail)
