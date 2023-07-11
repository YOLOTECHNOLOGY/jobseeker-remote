'use client'
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { HomePageChat } from 'images'
import { isMobile } from 'react-device-detect'
import Image from 'next/image'
import classNames from 'classnames'
import { useParams, useRouter } from 'next/navigation'
import useChatNow from 'app/models/hooks/useChatNow'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'
import { postSaveJobService } from 'store/services/jobs/postSaveJob'
import { deleteSaveJobService } from 'store/services/jobs/deleteSaveJob'
import { getCookie, setSourceCookie } from 'helpers/cookies'
import { fetchJobDetailService } from 'store/services/jobs/fetchJobDetail'
import { CircularProgress } from 'app/components/MUIs'
import { addJobViewService } from 'store/services/jobs/addJobView'
import styles from '../../index.module.scss'
import { languageContext } from 'app/components/providers/languageProvider'
import { useSelector } from 'react-redux'
import { getValueById } from 'helpers/config/getValueById'
import { QRCodeSVG } from 'qrcode.react'
import { transState } from 'helpers/utilities'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { LoginModalContext } from 'app/components/providers/loginModalProvider'

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
  const { setShowLogin } = useContext(LoginModalContext)
  const save = useCallback(() => {
    if (isSaving) {
      return
    }
    if (!accessToken) {
      sessionStorage.setItem('redirectPage', window.location.pathname)
      setShowLogin(true)
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

const VIf = (props: { show: boolean; children: any }) => (props.show ? props.children : null)

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
    recruiter_last_active_at,
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
  const { lang: langKey } = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
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

  const handleChatNow = () => {
    ;(chatNow as any)().catch((err) => {
      const message = err?.response?.data?.message
      dispatch(
        displayNotification({
          open: true,
          message: message,
          severity: 'error'
        })
      )
    })
  }

  return (
    <div className={styles.jobCard}>
      <>
        <div id={'job_card_container_' + id} className={styles.container}>
          <div className={styles.topContainer}>
            <div
              className={styles.left}
              onClick={() => {
                // @ts-ignore
                router.push(`/${langKey}` + job_url)
              }}
            >
              <div
                key={job_title + id}
                onMouseEnter={() => setTitleHover(true)}
                onMouseLeave={() => setTitleHover(false)}
                className={styles.titleContainer}
                title={`${job_title}`}
              >
                <VIf show={!!is_urgent}>
                  <div className={styles.urgent}>Urgent</div>
                </VIf>
                <div className={styles.title}>{`${job_title}`}</div>
              </div>

              <div className={styles.labelContainer}>
                <div className={styles.salary}>{salary_range_value}</div>
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

                  {/* recruiter */}
                  <div className={styles.recruiter}>
                    <div
                      className={classNames({
                        [styles.info]: true,
                        [styles.isHover]: isChatHover
                      })}
                    >
                      {`${[recruiter_full_name, recruiter_job_title].filter((a) => a).join(' · ')}`}
                    </div>
                    <MaterialButton
                      className={classNames({
                        [styles.button]: true,
                        [styles.isHover]: isChatHover
                      })}
                      capitalize={true}
                      variant='outlined'
                      style={{ textTransform: 'capitalize', height: 25 }}
                      isLoading={loading as boolean}
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        // ;(chatNow as any)()
                        handleChatNow()
                      }}
                    >
                      <Text textColor='white' className={styles.chatButtonText}>
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

                  {transState(recruiter_last_active_at, search?.jobCard)?.state == 1 && (
                    <div className={styles.online}>{search.jobCard.online}</div>
                  )}
                </div>
              </div>
            </div>

            {/* card right part */}
            <div
              className={styles.right}
              onClick={(e) => {
                e.stopPropagation()
                console.log('pushCompany')
                window.location.href = `/${langKey}` + company_url
                // router.push(`/${langKey}` + company_url, { forceOptimisticNavigation: true })
              }}
            >
              <div className={styles.company}>
                <Image className={styles.logo} src={company_logo} width={48} height={48} alt='' />
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

          {/* card bottom */}
          <div className={styles.bottomContainer}>
            <div className={styles.skills} title={(job_skills ?? '').split(',').join(' | ')}>
              {(job_skills ?? '').split(',').join(' | ')}
            </div>
            <div className={styles.benefits} title={jobBenefitsValue}>
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
