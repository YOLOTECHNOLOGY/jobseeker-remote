/* eslint-disable react/no-unknown-property */
'use client'
import React, { useState, useEffect, useRef, useCallback, useContext, useMemo } from 'react'
import styles from './web.module.scss'
import { HomePageChat } from 'images'
import useChatNow from 'app/models/hooks/useChatNow'
import Image from 'next/image'
import classNames from 'classnames'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'
import { postSaveJobService } from 'store/services/jobs/postSaveJob'
import { deleteSaveJobService } from 'store/services/jobs/deleteSaveJob'
import { getCookie, setCookie } from 'helpers/cookies'
import { fetchJobDetailService } from 'store/services/jobs/fetchJobDetail'
import { CircularProgress } from 'app/components/MUIs'
import { useParams, useRouter } from 'next/navigation'
import useNotSuitable from './hooks'
import NotSuitableModal from '../notSuitable'
import { ChatInfoContext } from 'app/components/chatInfoProvider'
import { useSelector } from 'react-redux'
import { changeJobValue } from 'helpers/config/changeJobValue'
import { getValueById } from 'helpers/config/getValueById'
import { languageContext } from 'app/components/providers/languageProvider'
import { QRCodeSVG } from 'qrcode.react'
import { SortContext } from '../searchForms/SortProvider'
import { cloneDeep } from 'lodash-es'
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

const useSaveJob = (jobId, defaultSaved, accessToken, jobTitleId) => {
  const [isSaved, setIsSaved] = useState(defaultSaved)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { lang: langKey } = useParams()
  const save = useCallback(() => {
    if (isSaving) {
      return
    }
    if (!accessToken) {
      router.push(`/${langKey}` + '/get-started', { scroll: true })
      return
    }
    if (!isSaved) {
      setIsSaving(true)
      postSaveJobService({ job_id: jobId, accessToken, job_title_id: jobTitleId })
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
  const { sort } = useContext(SortContext)
  const { job: originJob, jobTitleId, preference } = props
  const { lang: langKey } = useParams()
  const config = useSelector((store: any) => store.config.config.response)
  const memoedJob = useMemo(() => {
    const job = cloneDeep(originJob)
    changeJobValue(config, job)
    return job
  }, [originJob])

  const jobBenefits = useMemo(() => {
    const benefits = originJob?.job_benefits || []
    return benefits
      .map((benefit) => {
        return getValueById(config, benefit.id, 'job_benefit_id', 'name')
      })
      .filter(Boolean)
      .join(' | ')
  }, [originJob?.job_benefits, config])

  const {
    job_title,
    salary_range_value,

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
    //  company_industry,
    //   company_size,
    //   company_financing_stage,
    recruiter_avatar,
    job_benefits,
    external_apply_url,
    id,
    recruiter_id,
    is_saved,
    job_url,
    company_url,
    is_urgent,
    job_type_id,
    job_location_id,
    xp_lvl_id,
    degree_id,
    company_industry_id,
    company_size_id,
    company_financing_stage_id,
    reco_from
  } = memoedJob
  const { chatInfos } = useContext(ChatInfoContext)
  const chat = useMemo(() => {
    return chatInfos.find((chatInfo) => chatInfo.recruiter_id === recruiter_id)
  }, [chatInfos])
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
  const router = useRouter()
  const [loading, chatNow, modalChange] = useChatNow({ ...originJob, chat })
  const [titleHover, setTitleHover] = useState(false)
  const [popHover, setPopHover] = useState(false)

  const showPopup = useShowPop(titleHover, popHover)
  const accessToken = getCookie('accessToken')
  const [isSaved, isSaving, save] = useSaveJob(id, is_saved, accessToken, jobTitleId)
  const [jobDetail, detailLoading, startLoading] = useJobDetail(id)

  useEffect(() => {
    if (showPopup && !jobDetail && !detailLoading) {
      startLoading()
    }
  }, [showPopup, jobDetail, detailLoading])

  const modalProps = useNotSuitable(preference.id, id)
  const { showSelection, refreshing } = modalProps
  const [isChatHover, setIsChatHover] = useState(false)

  const handleRouterToPath = (job_url: string) => {
    sort == '1' ? setCookie('source', 'reco-latest') : setCookie('source', 'reco')
    setCookie('reco_from', reco_from)
    router.push(`/${langKey}` + job_url, { scroll: true })
  }

  return (
    <div
      className={classNames({
        [styles.jobCard]: true,
        [styles.aboutDisappear]: refreshing
      })}
    >
      <>
        <div id={'job_card_container_' + id} className={styles.container}>
          <div className={styles.closeButton} onClick={showSelection}>
            <svg
              width='18'
              height='18'
              viewBox='0 0 18 18'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M14.0625 3.9375L3.9375 14.0625'
                stroke='#707070'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M14.0625 14.0625L3.9375 3.9375'
                stroke='#707070'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <div className={styles.topContainer}>
            <div className={styles.left} onClick={() => handleRouterToPath(job_url)}>
              <div
                key={job_title + id}
                onMouseEnter={() => setTitleHover(true)}
                onMouseLeave={() => setTitleHover(false)}
                className={styles.titleContainer}
                title={`${job_title}`}
              >
                {!!is_urgent ? <div className={styles.urgent}>Urgent</div> : null}
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
                      style={{ height: 25, textTransform: 'capitalize' }}
                      isLoading={loading as boolean}
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        ;(chatNow as any)()
                      }}
                    >
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
                window.location.href = `/${langKey}` + company_url
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
              {(job_skills ?? '').split(',').filter(Boolean).join(' | ')}
            </div>
            <div className={styles.benefits} title={'benefits'}>
              {jobBenefits}
            </div>
          </div>
        </div>
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
                  {isSaved ? search?.jobCard?.saved : search?.jobCard?.save}
                </Text>
              </MaterialButton>
            </div>

            <div className={styles.popTopRight}>
              <QRCodeSVG value={location?.origin + job_url} size={60} className={styles.qrcode} />
              Talk to Boss anywhere
            </div>
          </div>
          <div className={styles.popContent}>
            {detailLoading ? (
              <CircularProgress color={'primary'} size={20} />
            ) : (
              <>
                <div className={styles.desTitle}>Job Description</div>
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
      <NotSuitableModal {...modalProps} lang={props.lang} />
    </div>
  )
}

export default JobCard
