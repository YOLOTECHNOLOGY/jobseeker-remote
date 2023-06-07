'use client'
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { HomePageChat, SmallAppLogo } from 'images'
import { isMobile } from 'react-device-detect'
import Image from 'next/image'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import useChatNow from 'app/[lang]/hooks/useChatNow'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'
import { postSaveJobService } from 'store/services/jobs/postSaveJob'
import { deleteSaveJobService } from 'store/services/jobs/deleteSaveJob'
import { getCookie, setSourceCookie } from 'helpers/cookies'
import { fetchJobDetailService } from 'store/services/jobs/fetchJobDetail'
import { CircularProgress } from 'app/[lang]/components/MUIs'
import { addJobViewService } from 'store/services/jobs/addJobView'
import styles from '../../index.module.scss'
import { languageContext } from 'app/[lang]/components/providers/languageProvider'
import { useSelector } from 'react-redux'
import { getValueById } from 'helpers/config/getValueById'
import { getLang } from 'helpers/country'
import { QRCodeSVG } from 'qrcode.react'

const useShowPop = (titleHover, popHover) => {
  const [showPopup, setShowPopup] = useState(false)
  const titleHoverRef = useRef(titleHover)
  const popHoverRef = useRef(popHover)
  useEffect(() => {
    titleHoverRef.current = titleHover
    popHoverRef.current = popHover
  }, [titleHover, popHover])
  const timerRef = useRef<any>()
  const closeTimerRef = useRef<any>()

  useEffect(() => {
    if (titleHover && !popHover) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      timerRef.current = setTimeout(() => {
        if (titleHoverRef.current) {
          setShowPopup(true)
        }
        clearTimeout(timerRef.current)
        timerRef.current = null
      }, 300)
    } else if (!titleHover && !popHover) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }
      closeTimerRef.current = setTimeout(() => {
        if (!titleHoverRef.current && !popHoverRef.current) {
          setShowPopup(false)
        }
        clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }, 500)
    }
  }, [titleHover, popHover])
  return showPopup
}

const useSaveJob = (jobId, defaultSaved, accessToken, langKey) => {
  const [isSaved, setIsSaved] = useState(defaultSaved)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const save = useCallback(() => {
    if (isSaving) {
      return
    }
    if (!accessToken) {
      router.push(`${langKey}/get-started`, { forceOptimisticNavigation: true })
      return
    }
    if (!isSaved) {
      setIsSaving(true)
      postSaveJobService({ job_id: jobId, accessToken })
        .then(() => setIsSaved(true))
        .finally(() => setIsSaving(false))
    } else {
      setIsSaving(true)
      deleteSaveJobService(jobId)
        .then(() => setIsSaved(false))
        .finally(() => setIsSaving(false))
    }
  }, [isSaved, jobId, accessToken, isSaving])

  return [isSaved, isSaving, save]
}

const useJobDetail = (jobId) => {
  const [detailLoading, setDetailLoading] = useState(false)
  const [jobDetail, setJobDetail] = useState(null)
  const startLoading = useCallback(() => {
    if (!detailLoading && !jobDetail) {
      setDetailLoading(true)
      fetchJobDetailService({ jobId })
        .then((response) => setJobDetail(response.data.data))
        .finally(() => setDetailLoading(false))
    }
  }, [detailLoading, jobDetail])
  return [jobDetail, detailLoading, startLoading]
}

const JobCard = (props: any) => {
  const {
    job_title,
    // job_region,
    company_size_id,
    salary_range_value,
    recruiter_avatar,
    // job_type,
    // job_location,
    // xp_lvl,
    // degree,
    recruiter_full_name,
    recruiter_job_title,
    recruiter_is_online,
    job_skills,
    company_logo,
    company_name,
    job_benefits,
    external_apply_url,
    id,
    chat,
    is_saved,
    job_url,
    company_url,
    is_urgent,
    job_type_id,
    job_location_id,
    xp_lvl_id,
    degree_id,
    company_financing_stage_id,
    company_industry_id
  } = props
  const config = useSelector((store: any) => store.config.config.response)
  const { search } = useContext(languageContext) as any
  const labels = [
    getValueById(config, job_type_id, 'job_type_id'),
    getValueById(config, job_location_id, 'location_id'),
    getValueById(config, xp_lvl_id, 'xp_lvl_id'),
    getValueById(config, degree_id, 'degree_id')
  ].filter((a) => a)

  const companyLabels = [
    getValueById(config, company_industry_id, 'industry_id'),
    getValueById(config, company_size_id, 'company_size_id'),
    getValueById(config, company_financing_stage_id, 'company_financing_stage_id')
  ].filter((a) => a)
  const langKey = getLang()
  const router = useRouter()
  const [loading, chatNow, modalChange] = useChatNow(props)
  const [titleHover, setTitleHover] = useState(false)
  const [popHover, setPopHover] = useState(false)
  const jobBenefitsValue = job_benefits
    .map((benefits) => getValueById(config, benefits.id, 'job_benefit_id', 'name'))
    ?.join(', ')
  const showPopup = useShowPop(titleHover, popHover)
  const accessToken = getCookie('accessToken')
  const [isSaved, isSaving, save] = useSaveJob(id, is_saved, accessToken, langKey)
  const [jobDetail, detailLoading, startLoading] = useJobDetail(id)
  // const industry =  getValueById(config,industry_id,'industry_id')
  const [isChatHover, setIsChatHover] = useState(false)
  useEffect(() => {
    if (showPopup && !jobDetail && !detailLoading) {
      startLoading()
    }
  }, [showPopup, jobDetail, detailLoading])
  useEffect(() => {
    if (showPopup) {
      addJobViewService({
        jobId: id,
        source: 'job_search', // this is usually used in search result
        status: accessToken ? 'protected' : 'public',
        device: isMobile ? 'mobile_web' : 'web'
      })
    }
  }, [showPopup])
  useEffect(() => {
    setSourceCookie('job_search')
  }, [])

  return (
    <div className={styles.jobCard}>
      {is_urgent ? (
        <div className={styles.urgent}>
          {
            <svg
              width='71'
              height='22'
              viewBox='0 0 71 22'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M64.5 0H70.5V3H64.5V0Z' fill='#66060B' />
              <path
                d='M0 10C0 4.47715 4.47715 0 10 0H70.5L62.2219 20.1405C61.7595 21.2655 60.6635 22 59.4472 22H0V10Z'
                fill='#D2030F'
              />
              <path
                d='M13.008 15.192C12.504 15.192 12.044 15.112 11.628 14.952C11.22 14.784 10.872 14.544 10.584 14.232C10.296 13.92 10.072 13.544 9.912 13.104C9.752 12.656 9.672 12.148 9.672 11.58V6.408H11.292V11.676C11.292 11.964 11.328 12.228 11.4 12.468C11.472 12.708 11.58 12.916 11.724 13.092C11.868 13.268 12.048 13.408 12.264 13.512C12.48 13.608 12.728 13.656 13.008 13.656C13.296 13.656 13.548 13.608 13.764 13.512C13.98 13.408 14.16 13.268 14.304 13.092C14.448 12.916 14.556 12.708 14.628 12.468C14.7 12.228 14.736 11.964 14.736 11.676V6.408H16.356V11.58C16.356 12.116 16.276 12.608 16.116 13.056C15.964 13.496 15.74 13.876 15.444 14.196C15.156 14.508 14.804 14.752 14.388 14.928C13.98 15.104 13.52 15.192 13.008 15.192ZM17.7893 9.12H19.2653V9.936H19.3613C19.4333 9.792 19.5293 9.66 19.6493 9.54C19.7693 9.42 19.9013 9.316 20.0453 9.228C20.1973 9.14 20.3573 9.072 20.5253 9.024C20.7013 8.976 20.8733 8.952 21.0413 8.952C21.2493 8.952 21.4253 8.972 21.5693 9.012C21.7213 9.052 21.8493 9.104 21.9533 9.168L21.5333 10.596C21.4373 10.548 21.3293 10.512 21.2093 10.488C21.0973 10.456 20.9573 10.44 20.7893 10.44C20.5733 10.44 20.3773 10.484 20.2013 10.572C20.0253 10.652 19.8733 10.768 19.7453 10.92C19.6253 11.072 19.5293 11.252 19.4573 11.46C19.3933 11.66 19.3613 11.88 19.3613 12.12V15H17.7893V9.12ZM25.1734 17.784C24.7574 17.784 24.3854 17.728 24.0574 17.616C23.7374 17.512 23.4574 17.372 23.2174 17.196C22.9774 17.028 22.7774 16.84 22.6174 16.632C22.4574 16.424 22.3414 16.216 22.2694 16.008L23.7694 15.408C23.8814 15.72 24.0654 15.96 24.3214 16.128C24.5774 16.304 24.8614 16.392 25.1734 16.392C25.6694 16.392 26.0614 16.236 26.3494 15.924C26.6374 15.62 26.7814 15.192 26.7814 14.64V14.232H26.6854C26.5014 14.488 26.2574 14.692 25.9534 14.844C25.6574 14.988 25.3054 15.06 24.8974 15.06C24.5454 15.06 24.2014 14.988 23.8654 14.844C23.5374 14.7 23.2454 14.496 22.9894 14.232C22.7334 13.96 22.5254 13.636 22.3654 13.26C22.2054 12.884 22.1254 12.464 22.1254 12C22.1254 11.536 22.2054 11.116 22.3654 10.74C22.5254 10.356 22.7334 10.032 22.9894 9.768C23.2454 9.496 23.5374 9.288 23.8654 9.144C24.2014 9 24.5454 8.928 24.8974 8.928C25.3054 8.928 25.6574 9.004 25.9534 9.156C26.2574 9.3 26.5014 9.5 26.6854 9.756H26.7814V9.12H28.2814V14.58C28.2814 15.076 28.2054 15.52 28.0534 15.912C27.9014 16.312 27.6894 16.648 27.4174 16.92C27.1454 17.2 26.8174 17.412 26.4334 17.556C26.0574 17.708 25.6374 17.784 25.1734 17.784ZM25.2334 13.644C25.4254 13.644 25.6134 13.608 25.7974 13.536C25.9894 13.464 26.1574 13.36 26.3014 13.224C26.4454 13.08 26.5614 12.908 26.6494 12.708C26.7374 12.5 26.7814 12.264 26.7814 12C26.7814 11.736 26.7374 11.5 26.6494 11.292C26.5614 11.084 26.4454 10.912 26.3014 10.776C26.1574 10.632 25.9894 10.524 25.7974 10.452C25.6134 10.38 25.4254 10.344 25.2334 10.344C25.0414 10.344 24.8534 10.38 24.6694 10.452C24.4854 10.524 24.3214 10.632 24.1774 10.776C24.0334 10.92 23.9174 11.096 23.8294 11.304C23.7414 11.504 23.6974 11.736 23.6974 12C23.6974 12.264 23.7414 12.5 23.8294 12.708C23.9174 12.908 24.0334 13.08 24.1774 13.224C24.3214 13.36 24.4854 13.464 24.6694 13.536C24.8534 13.608 25.0414 13.644 25.2334 13.644ZM35.2209 13.584C34.9489 14.064 34.5809 14.452 34.1169 14.748C33.6609 15.044 33.1009 15.192 32.4369 15.192C31.9889 15.192 31.5729 15.116 31.1889 14.964C30.8129 14.804 30.4849 14.584 30.2049 14.304C29.9249 14.024 29.7049 13.696 29.5449 13.32C29.3929 12.936 29.3169 12.516 29.3169 12.06C29.3169 11.636 29.3929 11.236 29.5449 10.86C29.6969 10.476 29.9089 10.144 30.1809 9.864C30.4529 9.576 30.7729 9.348 31.1409 9.18C31.5169 9.012 31.9289 8.928 32.3769 8.928C32.8489 8.928 33.2689 9.008 33.6369 9.168C34.0049 9.32 34.3129 9.536 34.5609 9.816C34.8089 10.088 34.9969 10.412 35.1249 10.788C35.2529 11.164 35.3169 11.572 35.3169 12.012C35.3169 12.068 35.3169 12.116 35.3169 12.156C35.3089 12.204 35.3049 12.248 35.3049 12.288C35.2969 12.328 35.2929 12.372 35.2929 12.42H30.8649C30.8969 12.66 30.9609 12.868 31.0569 13.044C31.1609 13.212 31.2849 13.356 31.4289 13.476C31.5809 13.588 31.7449 13.672 31.9209 13.728C32.0969 13.776 32.2769 13.8 32.4609 13.8C32.8209 13.8 33.1169 13.72 33.3489 13.56C33.5889 13.392 33.7769 13.184 33.9129 12.936L35.2209 13.584ZM33.7929 11.304C33.7849 11.2 33.7489 11.084 33.6849 10.956C33.6289 10.828 33.5409 10.708 33.4209 10.596C33.3089 10.484 33.1649 10.392 32.9889 10.32C32.8209 10.248 32.6169 10.212 32.3769 10.212C32.0409 10.212 31.7449 10.308 31.4889 10.5C31.2329 10.692 31.0529 10.96 30.9489 11.304H33.7929ZM37.8869 9.888H37.9829C38.1669 9.592 38.4149 9.36 38.7269 9.192C39.0389 9.016 39.3949 8.928 39.7949 8.928C40.1629 8.928 40.4869 8.988 40.7669 9.108C41.0469 9.228 41.2749 9.4 41.4509 9.624C41.6349 9.84 41.7709 10.104 41.8589 10.416C41.9549 10.72 42.0029 11.06 42.0029 11.436V15H40.4309V11.628C40.4309 11.204 40.3349 10.892 40.1429 10.692C39.9589 10.484 39.6869 10.38 39.3269 10.38C39.1109 10.38 38.9189 10.428 38.7509 10.524C38.5909 10.612 38.4509 10.736 38.3309 10.896C38.2189 11.048 38.1309 11.232 38.0669 11.448C38.0109 11.656 37.9829 11.88 37.9829 12.12V15H36.4109V9.12H37.8869V9.888ZM43.7348 10.464H42.7028V9.12H43.7348V7.32H45.3068V9.12H46.7468V10.464H45.3068V12.744C45.3068 12.88 45.3188 13.008 45.3428 13.128C45.3748 13.24 45.4308 13.336 45.5108 13.416C45.6228 13.544 45.7828 13.608 45.9908 13.608C46.1268 13.608 46.2348 13.596 46.3148 13.572C46.3948 13.54 46.4708 13.5 46.5428 13.452L46.9868 14.832C46.8028 14.92 46.6028 14.984 46.3868 15.024C46.1788 15.072 45.9468 15.096 45.6908 15.096C45.3948 15.096 45.1268 15.052 44.8868 14.964C44.6548 14.868 44.4588 14.74 44.2988 14.58C43.9228 14.22 43.7348 13.708 43.7348 13.044V10.464Z'
                fill='white'
              />
            </svg>
          }
        </div>
      ) : null}
      <>
        <div id={'job_card_container_' + id} className={styles.container}>
          <div className={styles.topContainer}>
            <div
              className={styles.left}
              onClick={() =>
                router.push(`${langKey}` + job_url, { forceOptimisticNavigation: true })
              }
            >
              <div
                key={job_title + id}
                onMouseEnter={() => setTitleHover(true)}
                onMouseLeave={() => setTitleHover(false)}
                className={styles.titleContainer}
                title={`${job_title}`}
              >
                <div className={styles.title}>{`${job_title}`}</div>
                <div className={styles.salary}>{salary_range_value}</div>
              </div>

              <div className={styles.labelContainer}>
                {labels.map((label) => (
                  <div key={label} className={styles.label}>
                    {label}
                  </div>
                ))}
              </div>
              <div
                className={styles.recruiterContainer}
                onMouseEnter={() => setIsChatHover(true)}
                onMouseLeave={() => setIsChatHover(false)}
              >
                <div style={{ height: 24, display: 'flex', flexDirection: 'row' }}>
                  <div className={styles.imgContainer}>
                    <Image
                      src={recruiter_avatar}
                      alt={''}
                      style={{ overflow: 'hidden', borderRadius: 12, marginRight: 6 }}
                      width={24}
                      height={24}
                    ></Image>
                    {!!recruiter_is_online && <div className={styles.isOnline} />}
                  </div>

                  <div className={styles.recruiter}>
                    <div
                      className={classNames({
                        [styles.info]: true,
                        [styles.isHover]: isChatHover
                      })}
                    >
                      {/* <div style={{ transform: 'scale(0.5,0.5)' }}>
                        <svg
                          width='32'
                          height='32'
                          viewBox='0 0 32 32'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M5.67534 22.127C4.18645 19.6151 3.66565 16.646 4.21072 13.7772C4.75579 10.9085 6.32924 8.33732 8.63569 6.54646C10.9421 4.75559 13.823 3.86819 16.7373 4.05083C19.6517 4.23347 22.3992 5.47361 24.464 7.53842C26.5288 9.60322 27.7689 12.3507 27.9516 15.2651C28.1342 18.1794 27.2468 21.0603 25.4559 23.3667C23.6651 25.6731 21.0939 27.2466 18.2252 27.7917C15.3564 28.3367 12.3873 27.8159 9.87534 26.3271L5.72534 27.5021C5.55531 27.5518 5.37503 27.5549 5.20341 27.511C5.03178 27.4671 4.87513 27.3778 4.74986 27.2525C4.6246 27.1273 4.53534 26.9706 4.49144 26.799C4.44753 26.6274 4.45061 26.4471 4.50034 26.277L5.67534 22.127Z'
                            fill='#136FD3'
                            stroke='#136FD3'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M17.4375 16C17.4375 16.7939 16.7939 17.4375 16 17.4375C15.2061 17.4375 14.5625 16.7939 14.5625 16C14.5625 15.2061 15.2061 14.5625 16 14.5625C16.7939 14.5625 17.4375 15.2061 17.4375 16Z'
                            fill='white'
                            stroke='white'
                            strokeWidth='0.125'
                          />
                          <path
                            d='M11.4375 16C11.4375 16.7939 10.7939 17.4375 10 17.4375C9.20609 17.4375 8.5625 16.7939 8.5625 16C8.5625 15.2061 9.20609 14.5625 10 14.5625C10.7939 14.5625 11.4375 15.2061 11.4375 16Z'
                            fill='white'
                            stroke='white'
                            strokeWidth='0.125'
                          />
                          <path
                            d='M23.4375 16C23.4375 16.7939 22.7939 17.4375 22 17.4375C21.2061 17.4375 20.5625 16.7939 20.5625 16C20.5625 15.2061 21.2061 14.5625 22 14.5625C22.7939 14.5625 23.4375 15.2061 23.4375 16Z'
                            fill='white'
                            stroke='white'
                            strokeWidth='0.125'
                          />
                        </svg>
                      </div> */}
                      {`${[recruiter_full_name, recruiter_job_title].filter((a) => a).join(' · ')}`}
                    </div>
                    <MaterialButton
                      className={classNames({
                        [styles.button]: true,
                        [styles.isHover]: isChatHover
                      })}
                      capitalize={true}
                      variant='outlined'
                      style={{ height: 24, textTransform: 'capitalize' }}
                      isLoading={loading as boolean}
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        ;(chatNow as any)()
                      }}
                    >
                      <Image src={HomePageChat} width={16} height={16} alt={''} />
                      <Text textColor='white' bold>
                        {(() => {
                          if (external_apply_url) {
                            return search.jobCard.apply
                          } else if (chat?.is_exists) {
                            return search.jobCard.continue
                          } else {
                            return search.jobCard.chat
                          }
                        })()}
                      </Text>
                    </MaterialButton>
                  </div>
                  {!!recruiter_is_online && (
                    <div className={styles.online}>{search.jobCard.online}</div>
                  )}
                </div>
              </div>
            </div>
            <div
              className={styles.right}
              onClick={(e) => {
                e.stopPropagation()
                router.push(`${langKey}` + company_url, { forceOptimisticNavigation: true })
              }}
            >
              <div className={styles.company}>
                <Image className={styles.logo} src={company_logo} width={50} height={50} alt='' />
                <div className={styles.labelContainer}>
                  <div className={styles.name}>{company_name}</div>
                  <div className={styles.componylabels}>
                    {companyLabels.map((label) => (
                      <div key={label} className={styles.label}>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.skills} title={(job_skills ?? '').split(',').join(' | ')}>
              {(job_skills ?? '').split(',').join(' | ')}
            </div>
            <div className={styles.benefits} title={job_benefits}>
              {jobBenefitsValue}
            </div>
          </div>
        </div>
        {/* hover */}
        <div
          className={classNames({
            [styles.popupDetail]: true,
            [styles.hide]: !showPopup
          })}
          onMouseEnter={() => setPopHover(true)}
          onMouseLeave={() => setPopHover(false)}
        >
          <div className={styles.popTop}>
            <div className={styles.popTopLeft}>
              <div title={`${job_title}`} className={styles.title}>
                {`${job_title}`}
              </div>
              <div
                className={styles.secondLabel}
                title={`${[recruiter_full_name, recruiter_job_title].filter((a) => a).join(' · ')}`}
              >
                {`${[recruiter_full_name, recruiter_job_title].filter((a) => a).join(' · ')}`}
              </div>
              <MaterialButton
                className={classNames({
                  [styles.save]: true
                })}
                capitalize={true}
                variant='outlined'
                style={{ textTransform: 'capitalize' }}
                isLoading={isSaving}
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  ;(save as any)()
                }}
              >
                <svg
                  width='18'
                  height='16'
                  viewBox='0 0 18 16'
                  fill={isSaved ? '#136FD3' : 'none'}
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M9 14.875C9 14.875 1.1875 10.5 1.1875 5.18751C1.1875 4.24836 1.51289 3.33821 2.1083 2.61193C2.70371 1.88564 3.53236 1.38808 4.45328 1.2039C5.37419 1.01971 6.33047 1.16029 7.15943 1.6017C7.98838 2.04311 8.63879 2.7581 9 3.62501V3.62501C9.36121 2.7581 10.0116 2.04311 10.8406 1.6017C11.6695 1.16029 12.6258 1.01971 13.5467 1.2039C14.4676 1.38808 15.2963 1.88564 15.8917 2.61193C16.4871 3.33821 16.8125 4.24836 16.8125 5.18751C16.8125 10.5 9 14.875 9 14.875Z'
                    stroke='#136FD3'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <Text textColor='#136FD3' bold style={{ marginLeft: 8 }}>
                  {isSaved ? search.jobCard.saved : search.jobCard.save}
                </Text>
              </MaterialButton>
            </div>
            <div className={styles.popTopRight}>
              <QRCodeSVG
                value={location?.origin + '/' + langKey + job_url}
                size={60}
                // imageSettings={{ src: SmallAppLogo, height: 10, width: 10, excavate: true }}
                className={styles.qrcode}
              />
              {search.jobCard.talkToBoss}
            </div>
          </div>
          <div className={styles.popContent}>
            {detailLoading ? (
              <CircularProgress color={'primary'} size={20} />
            ) : (
              <>
                <div className={styles.desTitle}>{search.jobCard.JD}</div>
                <div
                  className={styles.detail}
                  dangerouslySetInnerHTML={{
                    __html: jobDetail?.job_description_html ?? ''
                  }}
                />
              </>
            )}
          </div>
        </div>

        {modalChange}
      </>
    </div>
  )
}

export default JobCard
