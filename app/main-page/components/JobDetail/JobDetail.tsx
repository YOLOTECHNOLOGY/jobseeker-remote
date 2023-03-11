// 'user client'
import { memo } from 'react'
import Link from 'next/Link'
import Avatar from '@mui/material/Avatar'
import { HomePageChat } from 'images'
import styles from '../../popularJobs.module.scss'
const JobDetail = ({ detail }: any) => {
  return (
    <div className={styles.job_detail}>
      <Link className={styles.job_info} href={detail.job_url} >
        <div className={styles.job_titleWrapper}>
          <div className={styles.job_info_title}>{detail?.job_title}</div>
          <div className={styles.job_info_salary}>{detail?.salary_range_value}</div>
          <div className={styles.job_info_chat} >
            <img src={HomePageChat} alt='Boss job chat now' width='18' height='18' /> Chat now
          </div>
        </div>

        <div className={styles.job_tags}>
          <div>{detail?.job_location}</div>
          <div>{detail?.xp_lvl}</div>
          <div>{detail?.degree}</div>
        </div>
      </Link>

      <Link
        className={styles.job_companyInfo}
        href={detail.company_url}
      >
        <div className={styles.job_avatarWrapper}>
          <Avatar alt={detail?.job_title} src={detail?.company_logo}></Avatar>
          <div className={styles.job_companyInfo_name}>{detail?.company_name}</div>
        </div>
        <div>{detail?.company_financing_stage}</div>
      </Link>
    </div>
  )
}

export default memo(JobDetail)
