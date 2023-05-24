"use client"
import React from 'react'
import styles from '../index.module.scss'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import useChatNow from 'app/[lang]/hooks/useChatNow'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'
import Link from 'next/link';
import { getValueById } from 'helpers/config/getValueById'
const JobCardNormal = (props: any) => {
  const { handelSave, data, loadingChat, tabValue, index,lang,config,langKey } = props
  const {
    industry_id,
   // company_size: companySize,
   company_size_id,
  //  financing_stage: financingStage,
    financing_stage_id,
    name,
    logo_url: logoUrl
  } = data.company || {};

 
  const {
    job_title: jobTitle,
    local_salary_range_value: salaryRangeValue,
    xp_lvl: xpLvl,
    status_key: status,
    external_apply_url: externalApplyUrl,
    is_exists: isExists,
    job_url: jobUrl
  } = data.job || {};
  const {id:degreeId } = data.job?.degree || {};
  const {id:locationId} = data.job?.location || {};
  const { avatar, full_name: fullName, } = data.recruiter || {};
  const workJobTitle = data.recruiter?.work_experience?.job_title;
  const [loading, chatNow, modalChange] = useChatNow(data?.job || {})

  const financingStage = getValueById(config,financing_stage_id,'company_financing_stage_id')
  const xpLvlValue = getValueById(config,xpLvl?.id,'xp_lvl_id')
  const degreeValue = getValueById(config,degreeId,'degree_id')
  const locationValue = getValueById(config,locationId,'location_id')
  const industry =  getValueById(config,industry_id,'industry_id')
  const companySize =  getValueById(config,company_size_id,'company_size_id')
 
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
              status === 'closed' ? <span className={styles.closedTip}>{lang?.JobClosed}</span> : (
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
                          return lang?.applyNow
                        } else if (isExists) {
                          return lang?.continueChat
                        } else {
                          return lang?.chatNow
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
                     {lang?.undoSave}
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
              <Link href={ '/' + langKey + jobUrl || ''} className={styles.title}>{jobTitle}</Link>
              <p className={styles.salary}>{salaryRangeValue}</p>
            </div>
            <span className={styles.tag}>{locationValue}</span>
            <span className={styles.tag}>{xpLvlValue}</span>
            <span className={styles.tag}>{degreeValue}</span>
          </div>
          <div className={styles.rightContent}>
            <img src={logoUrl} className={styles.logo} alt={name} />
            <div className={styles.companyInfo}>
              <div className={styles.company}>  {name}</div>
              <span className={styles.tag}>{industry}</span>
              <span className={styles.tag}>{companySize} {lang?.employees}</span>
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
