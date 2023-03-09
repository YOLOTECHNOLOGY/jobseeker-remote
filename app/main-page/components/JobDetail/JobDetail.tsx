'user client'
import { memo } from 'react'
import { useRouter } from 'next/navigation'

import InsertCommentIcon from '@mui/icons-material/InsertComment'
import Avatar from '@mui/material/Avatar'

import { HomePageChat } from 'images'

import styles from '../../popularJobs.module.scss'

const JobDetail = ({ detail }: any) => {
  const router = useRouter()

  const handleGoToJobDetail = (patch: string) => {
    router.push(patch)
  }

  const handleGoToCompanyDetail = (patch: string) => {
    router.push(patch)
  }

  const handleOpenChatNow = (e) => {
    // e.stopPropagation()
  }

  return (
    <div className={styles.job_detail}>
      <div className={styles.job_info} onClick={() => handleGoToJobDetail(detail.job_url)}>
        <div className={styles.job_titleWrapper}>
          <div className={styles.job_info_title}>{detail?.job_title}</div>
          <div className={styles.job_info_salary}>{detail?.salary_range_value}</div>
          <div className={styles.job_info_chat} onClick={(e) => handleOpenChatNow(e)}>
            <img src={HomePageChat} alt='Boss job chat now' width='18' height='18' /> Chat now
          </div>
        </div>

        <div className={styles.job_tags}>
          <div>{detail?.job_location}</div>
          <div>{detail?.xp_lvl}</div>
          <div>{detail?.degree}</div>
        </div>
      </div>

      <div
        className={styles.job_companyInfo}
        onClick={() => handleGoToCompanyDetail(detail.company_url)}
      >
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
