/* eslint-disable react/no-unknown-property */
'use client'
import React, { useState, useEffect, useRef, useCallback, useContext, useMemo } from 'react'
import styles from './index.module.scss'
import { HomePageChat } from 'images'
import useChatNow from 'app/[lang]/hooks/useChatNow'
import Image from 'next/image'
import classNames from 'classnames'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'
import { postSaveJobService } from 'store/services/jobs/postSaveJob'
import { deleteSaveJobService } from 'store/services/jobs/deleteSaveJob'
import { getCookie, setCookie } from 'helpers/cookies'
import { fetchJobDetailService } from 'store/services/jobs/fetchJobDetail'
import { CircularProgress } from 'app/[lang]/components/MUIs'
import { useParams, useRouter } from 'next/navigation'
import useNotSuitable from './hooks'
import NotSuitableModal from './notSuitable'
import { ChatInfoContext } from 'app/[lang]/components/chatInfoProvider'
import { Urgent } from './Urgent'
import { useSelector } from 'react-redux'
import { changeJobValue } from 'helpers/config/changeJobValue'
import { getValueById } from 'helpers/config/getValueById'
import { languageContext } from 'app/[lang]/components/providers/languageProvider'
import { QRCodeSVG } from 'qrcode.react'
import { SortContext } from '../searchForms/SortProvider'
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
      router.push(`/${langKey}` + '/get-started', { forceOptimisticNavigation: true })
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
  const { job, jobTitleId, preference } = props
  const { lang: langKey } = useParams()
  const config = useSelector((store: any) => store.config.config.response)

  const memoedJob = useMemo(() => {
    changeJobValue(config, job)
    return job
  }, [job])

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
  const [loading, chatNow, modalChange] = useChatNow({ ...job, chat })
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
    router.push(job_url, { forceOptimisticNavigation: true })
  }

  return (
    <div
      className={classNames({
        [styles.main]: true,
        [styles.aboutDisappear]: refreshing
      })}
    >
      <Urgent is_urgent={is_urgent} className={styles.urgent} />
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

            {/* <Image src={CloseIcon} alt='logo' width={13} height={13} /> */}
          </div>
          <div className={styles.topContainer}>
            <div
              className={styles.left}
              onClick={() => router.push(`/${langKey}` + job_url, { forceOptimisticNavigation: true })}
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
                          ; (chatNow as any)()
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
                window.location.href = `/${langKey}` + company_url
                // router.push(`/${langKey}` + company_url, { forceOptimisticNavigation: true })
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
            <div className={styles.benefits} title={job_benefits}>
              {job_benefits?.map((item) => item.name).filter(Boolean).join(' | ')}
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
                    ; (save as any)()
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
              <QRCodeSVG
                value={location?.origin + job_url}
                size={60}
                // imageSettings={{ src: SmallAppLogo, height: 10, width: 10, excavate: true }}
                className={styles.qrcode}
              />
              {/* <Image
                style={{ margin: '0px 6px' }}
                src={AppDownQRCode}
                height={60}
                width={60}
                alt={''}
              /> */}
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
