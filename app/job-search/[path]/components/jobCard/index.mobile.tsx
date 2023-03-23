/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './index.module.scss'
import { HomePageChat, AppDownQRCode } from 'images'
import useChatNow from 'app/hooks/useChatNow'
import { hoverableFunc } from 'components/highLevel/hoverable'
import Image from 'next/image'
import classNames from 'classnames'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'
import { postSaveJobService } from 'store/services/jobs/postSaveJob'
import { deleteSaveJobService } from 'store/services/jobs/deleteSaveJob'
import { getCookie } from 'helpers/cookies'
import { fetchJobDetailService } from 'store/services/jobs/fetchJobDetail'
import { CircularProgress } from 'app/components/MUIs'
import { useRouter } from 'next/navigation'
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
            }, 500)
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

const useSaveJob = (jobId, defaultSaved, accessToken) => {
    const [isSaved, setIsSaved] = useState(defaultSaved)
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()
    const save = useCallback(() => {
        if (isSaving) {
            return
        }
        if (!accessToken) {
            router.push('/get-started', { forceOptimisticNavigation: true })
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
                .then(response => setJobDetail(response.data.data))
                .finally(() => setDetailLoading(false))
        }
    }, [detailLoading, jobDetail])
    return [jobDetail, detailLoading, startLoading]
}

const JobCard = (props: any) => {
    const {
        function_job_title,
        job_region,
        salary_range_value,
        job_type,
        job_location,
        xp_lvl,
        degree,
        recruiter_full_name,
        recruiter_job_title,
        recruiter_is_online,
        job_skills,
        company_logo,
        company_name,
        company_industry,
        company_size,
        company_financing_stage,
        job_benefits,
        external_apply_url,
        id,
        chat,
        is_saved,
        job_url
    } = props
    const labels = [job_type, job_location, xp_lvl, degree].filter(a => a)
    const companyLabels = [company_industry, company_size, company_financing_stage].filter(a => a)
    const router = useRouter()
    const [loading, chatNow, modalChange] = useChatNow(props)
    const [titleHover, setTitleHover] = useState(false)
    const [popHover, setPopHover] = useState(false)

    const showPopup = useShowPop(titleHover, popHover)
    const accessToken = getCookie('accessToken')
    const [isSaved, isSaving, save] = useSaveJob(id, is_saved, accessToken)
    const [jobDetail, detailLoading, startLoading] = useJobDetail(id)
    useEffect(() => {
        if (showPopup && !jobDetail && !detailLoading) {
            startLoading()
        }
    }, [showPopup, jobDetail, detailLoading])
    return <div className={styles.main}>
        <>
            <div
                id={'job_card_container_' + id}
                className={styles.container}
                onClick={() => router.push(job_url, { forceOptimisticNavigation: true })}
            >
                <div className={styles.topContainer}>
                    
                    <div className={styles.right}>
                        <div className={styles.company}>
                            <Image className={styles.logo} src={company_logo} width={50} height={50} alt='' />
                            <div className={styles.labelContainer}>
                                <div className={styles.name}>{company_name}</div>
                                <div className={styles.componylabels}>
                                    {companyLabels.map(label => <div key={label} className={styles.label}>
                                        {label}
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div >
                <div className={styles.bottomContainer}>
                    <div className={styles.skills} title={(job_skills ?? '').split(',').join(' | ')}>
                        {(job_skills ?? '').split(',').join(' | ')}
                    </div>
                    <div className={styles.benefits} title={job_benefits}>
                        {job_benefits}
                    </div>
                </div>
            </div>
         

            {modalChange}
        </>
    </div>
}

export default JobCard
// {
//     "job_type": "Full-time",
//     "function_job_title_id": 1,
//     "recruiter_is_online": 0,
//     "xp_lvl": "< 1 Yr Exp",
//     "job_benefits": "Equity Incentive",
//     "expired_at": "2023-06-01T08:25:33.000000Z",
//     "is_duplicate": 0,
//     "job_skills": "Algorithms & Data Structures",
//     "company_address": null,
//     "recruiter_full_name": "Sss Sss",
//     "sub_function": "Backend",
//     "company_logo": "https://dev-assets.bossjob.com/companies/31466/logo/image-picker-3d4fb3f6-7be1-40c1-81e2-17ac7867949f-2566-0000081fed40d802.jpg",
//     "refreshed_at": "17 March 2023",
//     "updated_at": "2023-03-16T23:00:05.000000Z",
//     "is_salary_hidden": 0,
//     "company_url": "/company/s-31466",
//     "id": 167018,
//     "job_title": "Java Developer",
//     "company_financing_stage": "Series A",
//     "status_key": "active",
//     "company_id": 31466,
//     "salary_range_to": 15000,
//     "highlighted": 0,
//     "salary_range_from": 10000,
//     "company_country": null,
//     "degree": "Edu not required",
//     "recruiter_id": 2846710,
//     "recruiter_job_title": "hr",
//     "is_company_verify": true,
//     "job_country_key": "ph",
//     "function_job_title": "Java Developer",
//     "recruiter_last_active_at": "2023-03-16 11:38:35",
//     "company_industry": "Accounting & Finance",
//     "job_function_id": 1,
//     "job_region": "National Capital Region",
//     "company_name": "s",
//     "job_country": "Philippines",
//     "main_function": "Information Technology",
//     "company_location": null,
//     "recruiter_avatar": "https://dev-assets.bossjob.com/users/2846710/avatars/icon-avatar-4.png",
//     "job_location": "Caloocan",
//     "job_url": "/job/java-developer-167018",
//     "is_featured": 0,
//     "company_size": "51 - 100",
//     "salary_range_value": "₱10K - ₱15K",
//     "is_saved": false,
//     "is_urgent": false
// }