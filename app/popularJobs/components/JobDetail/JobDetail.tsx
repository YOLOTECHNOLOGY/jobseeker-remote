'user client'
import { memo } from 'react'

import Avatar from '@mui/material/Avatar'

import styles from '../../popularJobs.module.scss'

const JobDetail = ({ detail }: any) => {
  return (
    <div className={styles.job_detail}>
      <div className={styles.job_info}>
        <div className={styles.job_titleWrapper}>
          <div className={styles.job_info_title}>{detail?.job_title}</div>
          <div className={styles.job_info_salary}>{detail?.salary_range_value}</div>
        </div>

        <div className={styles.job_tags}>
          <div>{detail?.job_location}</div>
          <div>{detail?.xp_lvl}</div>
          <div>{detail?.degree}</div>
        </div>
      </div>

      <div className={styles.job_companyInfo}>
        <div className={styles.job_avatarWrapper}>
          <Avatar alt={detail?.job_title} src={detail?.company_logo}></Avatar>
          <div className={styles.job_companyInfo_name}>{detail?.company_name}</div>
        </div>
        <div>{detail?.company_financing_stage}</div>
      </div>
    </div>
  )
}

export default memo(JobDetail)
