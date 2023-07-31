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
        <Link prefetch={true} href={'/' + langKey + detail.job_url}>
          <div className={styles.job_titleWrapper}>
            <div className={styles.job_info_title}>{detail?.job_title}</div>
            <div className={styles.transBox}>
              <div className={styles.job_info_salary}>{detail?.local_salary_range_value}</div>
              <div className={styles.job_info_chat}>
                {/* <Image
                  src={HomePageChat}
                  alt='Boss job chat now'
                  width='18'
                  height='18'
                  quality={0}
                  style={{ paddingRight: '4px' }}
                />{' '} */}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='21'
                  height='21'
                  viewBox='0 0 21 21'
                  fill='none'
                >
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M16.0762 16.9424C15.2624 17.6591 14.3028 18.2118 13.246 18.558C12.4564 18.8192 11.6062 18.9588 10.7255 18.9588H2.17404C2.17404 18.9588 2.16797 18.9588 2.16797 18.9528V11.2273C2.16797 6.53857 5.96997 2.73657 10.6587 2.73657C12.9059 2.73657 14.9527 3.64152 16.4346 5.1113C17.9408 6.60538 18.87 8.68251 18.8336 10.9722C18.8093 12.4724 18.3781 13.8753 17.6493 15.0718C17.3152 15.6184 16.9144 16.1286 16.4649 16.578C16.343 16.7 16.221 16.8109 16.0936 16.9266L16.0936 16.9267L16.0762 16.9424ZM14.2156 11.5761C14.4646 11.337 14.4726 10.9413 14.2335 10.6924C13.9944 10.4434 13.5988 10.4354 13.3498 10.6744C12.6595 11.3373 11.6095 11.7286 10.5191 11.7468C9.43169 11.7649 8.38086 11.4113 7.66478 10.6861C7.42226 10.4405 7.02654 10.438 6.78092 10.6805C6.5353 10.923 6.53279 11.3188 6.77532 11.5644C7.78044 12.5823 9.1879 13.0191 10.54 12.9966C11.8891 12.9741 13.2598 12.4938 14.2156 11.5761Z'
                    fill='white'
                  />
                </svg>
                {home.jobCard.chatNow}
              </div>
            </div>
          </div>

          <div className={styles.job_tags}>
            <div>
              {jobLocation} <span>|</span>
            </div>
            <div>
              {xpLvlValue}
              <span>|</span>
            </div>
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
            {industry && financingStage ? <span>|</span> : null}
            {financingStage}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default memo(JobDetail)
