"use client"
import React from 'react'
import styles from '../index.module.scss'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import useChatNow from 'app/hooks/useChatNow'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'
import Link from 'next/link';
const JobCardNormal = (props: any) => {
  const { handelSave, data, loadingChat, tabValue, index } = props
  const {
    industry,
    company_size: companySize,
    financing_stage: financingStage,
    name,
    logo_url: logoUrl
  } = data.company || {};
  const {
    job_title: jobTitle,
    salary_range_value: salaryRangeValue,
    xp_lvl: xpLvl,
    status_key: status,
    external_apply_url: externalApplyUrl,
    is_exists: isExists,
    job_url: jobUrl
  } = data.job || {};
  const { value } = data.job?.degree || {};
  const { value: locationValue } = data.job?.location || {};
  const { avatar, full_name: fullName, } = data.recruiter || {};
  const workJobTitle = data.recruiter?.work_experience?.job_title;

  const [loading, chatNow, modalChange] = useChatNow(data?.job || {})

  return (
    <>
      <div className={`${styles.detail} ${status === 'closed' ? styles.jobClosed : null}`} >
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <img src={avatar} className={styles.avator} />
            <span className={styles.name}>{fullName}
              <span className={styles.nameLine}> |</span>{workJobTitle}
            </span>
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
                          return 'Chat Now'
                        }
                      })()}
                    </Text>
                  </MaterialButton>

                  {
                    tabValue === 'saved' ? <MaterialButton onClick={() => handelSave(data, index)} className={`${styles.chatBox} ${!isExists ? styles.chatIng : null}`}
                      capitalize={true}
                      variant='outlined'
                      style={{
                        height: 33,
                        textTransform: 'capitalize'
                      }}
                      isLoading={loadingChat}
                    >
                      <FavoriteOutlinedIcon className={styles.saveIcon} />
                      Undo Save
                    </MaterialButton> : null
                  }


                </>
              )
            }
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.leftContent}>
            <div className={styles.developer}>
              <Link href={jobUrl || ''} className={styles.title}>{jobTitle}</Link>
              <p className={styles.salary}>{salaryRangeValue}</p>
            </div>
            <span className={styles.tag}>{locationValue}</span>
            <span className={styles.tag}>{xpLvl?.value}</span>
            <span className={styles.tag}>{value}</span>
          </div>
          <div className={styles.rightContent}>
            <img src={logoUrl} className={styles.logo} alt={name} />
            <div className={styles.companyInfo}>
              <div className={styles.company}>  {name}</div>
              <span className={styles.tag}>{industry}</span>
              <span className={styles.tag}>{companySize} Employees</span>
              {
                financingStage && <span className={styles.tag}>{financingStage}</span>
              }
            </div>
          </div>
        </div>
      </div>
      {modalChange}
    </>
  )
}

export default JobCardNormal
