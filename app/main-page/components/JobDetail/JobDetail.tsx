// 'user client'
import { memo } from 'react'
import Link from 'next/link'
// import Avatar from '@mui/material/Avatar'
import { HomePageChat } from 'images'
import styles from '../../popularJobs.module.scss'
import Image from 'next/image'
const JobDetail = ({ detail }: any) => {
  return (
    <div className={styles.job_detail}>
      <Link prefetch={false} className={styles.job_info} href={detail.job_url}>
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
              Chat now
            </div>
          </div>
        </div>

        <div className={styles.job_tags}>
          <div>{detail?.job_location}</div>
          <div>{detail?.xp_lvl}</div>
          <div>{detail?.degree}</div>
        </div>
      </Link>

      <Link className={styles.job_companyInfo} href={detail.company_url}>
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
            {detail?.company_industry}
            {detail?.company_industry && detail?.company_financing_stage ? ' | ' : null}
            {detail?.company_financing_stage}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default memo(JobDetail)
