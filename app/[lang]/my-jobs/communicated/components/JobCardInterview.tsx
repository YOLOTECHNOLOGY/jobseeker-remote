'use client'
import React from 'react'
import styles from '../index.module.scss'
import useChatNow from 'app/models/hooks/useChatNow'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'
import Tooltip from '@mui/material/Tooltip'
import Link from 'next/link'
import { transDate } from 'helpers/utilities'
import Image from 'next/image'
import { getCookie, userKey } from 'helpers/cookies'
// import useModalInterview from 'app/hooks/modalInterview'

const jobseekerDisplayStatusObject = {
  Pending: '#D2030F',
  Accepted: '#136FD3',
  Upcoming: '#136FD3',
  'In progress': '#136FD3',
  Declined: '#707070',
  Cancelled: '#707070',
  'Not accepted': '#707070',
  Completed: '#0EBD5C',
  'Not checked in': '#D2030F'
}

const JobCardInterview = (props: any) => {
  const { data, lang, langKey } = props
  const {
    interviewed_at: interviewedAt,
    full_address: fullAddress,
    jobseeker_display_status: jobseekerDisplayStatus
  } = data
  const userInfo = getCookie(userKey)

  const {
    pending,
    accepted,
    upcoming,
    InProgress,
    declined,
    cancelled,
    notAccepted,
    completed,
    notCheckedIn
  } = lang || {}
  const jobseekerDisplayStatusTrans = {
    Pending: pending,
    Accepted: accepted,
    Upcoming: upcoming,
    'In progress': InProgress,
    Declined: declined,
    Cancelled: cancelled,
    'Not accepted': notAccepted,
    Completed: completed,
    'Not checked in': notCheckedIn
  }
  const { name, logo_url: logoUrl } = data.company || {}
  const {
    job_title: jobTitle,
    salary_range_value: salaryRangeValue,
    status_key: status,
    external_apply_url: externalApplyUrl,
    is_exists: isExists,
    job_url: jobUrl
  } = data.job || {}
  const { avatar, full_name: fullName, phone_num: phoneNum } = data.recruiter || {}
  const workJobTitle = data.recruiter?.work_experience?.job_title
  const [loading, chatNow, modalChange] = useChatNow(props?.data?.job || {})
  return (
    <>
      <div
        // onClick={()=>modalInterview(data.job.chat_id)}
        className={`${styles.detail} 
      ${styles.interested} 
      ${status === 'closed' ? styles.jobClosed : null}`}
      >
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <Image src={avatar} width={30} height={30} alt='avatar' className={styles.avator} />
            <span className={styles.name}>
              {fullName}
              {fullName && workJobTitle ? <span className={styles.nameLine}> |</span> : null}
              {workJobTitle}
              {(workJobTitle || fullName) && phoneNum ? (
                <span className={styles.nameLine}> |</span>
              ) : null}
              {phoneNum}
            </span>
            <span
              className={styles.jobrStatus}
              style={{
                color: jobseekerDisplayStatusObject[jobseekerDisplayStatus] || '#136FD3',
                borderColor: jobseekerDisplayStatusObject[jobseekerDisplayStatus] || '#136FD3'
              }}
            >
              {jobseekerDisplayStatusTrans[jobseekerDisplayStatus]}
            </span>
          </div>
          <div className={styles.operator}>
            {status === 'closed' ? (
              <span className={styles.closedTip}>{lang?.JobClosed}</span>
            ) : (
              <>
                { userInfo?.id != data?.recruiter?.id && (
                    <MaterialButton
                      className={`${styles.chatBox} ${!isExists ? styles.chatIng : null}`}
                      capitalize={true}
                      variant='outlined'
                      style={{
                        height: 33,
                        textTransform: 'capitalize'
                      }}
                      isLoading={loading as boolean}
                      onClick={chatNow as any}
                    >
                      <Text textColor='white' bold>
                      {(() => {
                          if (externalApplyUrl) {
                            return lang?.applyNow
                          } else if (isExists) {
                            return lang?.continueChat
                          } else {
                            return lang?.chatNow
                          }
                        })()}
                      </Text>
                    </MaterialButton>
                  )
                }
              </>
            )}
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.leftContent}>
            <img src={logoUrl} className={styles.logo} alt={name} />
            <div className={styles.box}>
              <div className={styles.developer}>
                <Link href={'/' + langKey + jobUrl || ''} className={styles.title}>
                  {jobTitle}
                </Link>
                <p className={styles.salary}>{salaryRangeValue}</p>
              </div>
              <p className={styles.companyName}>{name}</p>
            </div>
          </div>
          <div className={styles.rightContent}>
            <p className={styles.time}>
              <span>{lang?.InterviewTime}</span>: {transDate(interviewedAt, 'all')}
            </p>
            <Tooltip title={fullAddress || ''} placement='top'>
              <p className={`${styles.time} ${styles.address}`}>
                <span>{lang?.address}</span>: {fullAddress}{' '}
              </p>
            </Tooltip>
          </div>
        </div>
      </div>
      {modalChange}
    </>
  )
}

export default JobCardInterview
