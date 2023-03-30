"use client"
import React from 'react'
import styles from '../index.module.scss'
import useChatNow from 'app/hooks/useChatNow'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import {transDate} from 'helpers/utilities'

const  jobseekerDisplayStatusObject = {
  "Pending":'#D2030F',
  "Accepted":'#136FD3',
  "Upcoming":'#136FD3',
  "In progress":'#136FD3',
  "Declined":'#D2030F',
  "Cancelled":'#707070',
  "Not accepted":'#707070',
  "Completed": "#0EBD5C",
  "Not checked in":'##D2030F',
};


const JobCardInterview = (props: any) => {
  const {data } = props
  const {
    interviewed_at: interviewedAt,
    full_address: fullAddress,
    jobseeker_display_status: jobseekerDisplayStatus,
  } = data;
  const {
    name,
    logo_url: logoUrl
  } = data.company || {};
  const {
    job_title: jobTitle,
    salary_range_value: salaryRangeValue,
    status_key: status,
    external_apply_url: externalApplyUrl,
    is_exists: isExists,
    job_url:jobUrl
  } = data.job || {};
  const {
    avatar,
    full_name: fullName,
    phone_num: phoneNum
  } = data.recruiter || {};

  const { job_title: workJobTitle } = data.recruiter?.work_experience || {};

  const [loading, chatNow, modalChange] = useChatNow(props?.data || {})
 
  return (
    <>
      <div className={`${styles.detail} ${styles.interested} ${status === 'closed' ? styles.jobClosed : null}`} >
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <img src={avatar} className={styles.avator} />
            <span className={styles.name}>
              {fullName}
              {fullName && workJobTitle ?  <span className={styles.nameLine}> |</span> : null}  
              {workJobTitle}
              {
                (workJobTitle || fullName) && phoneNum ? <span className={styles.nameLine}> |</span> : null
              }
              {phoneNum}
            </span>
            <span className={styles.jobrStatus} style={{color : jobseekerDisplayStatusObject[jobseekerDisplayStatus] || '#136FD3'}}>{jobseekerDisplayStatus}</span>
          </div>
          <div className={styles.operator}>
            {
              status === 'closed' ? <span className={styles.closedTip}>Job closed</span> : (
                <>
                  <MaterialButton className={`${styles.chatBox} ${!isExists ? styles.chatIng : null}`}
                    capitalize={true}
                    variant='outlined'
                    style={{
                      height: 33,
                      textTransform: 'capitalize'
                    }}
                    isLoading={loading as boolean} onClick={chatNow as any}
                  >
                    <Text textColor='white' bold>
                      {(() => {
                        if (externalApplyUrl) {
                          return 'Apply Now'
                        } else if (isExists) {
                          return 'Continue Chat'
                        } else {
                          return 'Chat'
                        }
                      })()}
                    </Text>
                  </MaterialButton>
                </>
              )
            }
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.leftContent}>
            <img src={logoUrl} className={styles.logo} alt={name} />
            <div className={styles.box}>
              <div className={styles.developer}>
                <Link  href={jobUrl || ''} className={styles.title}>{jobTitle}</Link>
                <p className={styles.salary}>{salaryRangeValue}</p>
              </div>
              <p className={styles.companyName}>{name}</p>
            </div>
          </div>
          <div className={styles.rightContent}>
            <p className={styles.time}><span>Interview Time</span>: {transDate(interviewedAt,'all')}</p>
            <Tooltip title={fullAddress || ''} placement="top">
              <p className={`${styles.time} ${styles.address}`}><span>Address</span>: {fullAddress} </p>
            </Tooltip>
          </div>
        </div>
      </div>
      {modalChange}
    </>
  )
}

export default JobCardInterview
