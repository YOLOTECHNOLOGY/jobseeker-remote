/* eslint-disable react/no-unknown-property */
'use client'
import React, { useState, useTransition } from 'react'
import styles from './index.module.scss'
import { HomePageChat } from 'images'
import { useChatNow } from 'app/interpreters/chatNow'
import { hoverableFunc } from 'components/highLevel/hoverable'
import Image from 'next/image'
import classNames from 'classnames'
import MaterialButton from 'components/MaterialButton'
// import Button from '@mui/material/Button'

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
        id
    } = props
    const labels = [job_type, job_location, xp_lvl, degree].filter(a => a)
    const companyLabels = [company_industry, company_size, company_financing_stage].filter(a => a)
    const [showPopup, setShowPopup] = useState(false)
    const [loading, chatNow, modalChange] = useChatNow(props)
    // const imgChat = useMemo(() => <Image src={'/chat-circle-dots.svg'} width={16} height={16} alt={''} />, [])
    const [, startTransition] = useTransition()
    return <div className={styles.container}>
        <><div className={styles.topContainer}>
            <div className={styles.left}>

                {hoverableFunc(isHover => {
                    console.log({ isHover })
                    startTransition(() => {
                        setShowPopup(isHover)
                    })
                    return <div key={function_job_title + id} className={styles.titleContainer} title={`${function_job_title} (${job_region})`}>
                        <div className={styles.title}>{`${function_job_title} (${job_region})`}</div>
                        <div className={styles.salary}>{salary_range_value}</div>
                    </div>

                }, null, showPopup)}
                <div className={styles.labelContainer}>
                    {labels.map(label => <div key={label} className={styles.label}>{label}</div>)}
                </div>
                {hoverableFunc(isHover => {

                    return <div style={{ height: 24, display: 'flex', flexDirection: 'row' }}>
                        <div className={styles.recruiter}>
                            <div className={classNames({
                                [styles.info]: true,
                                [styles.isHover]: isHover
                            })}>
                                <svg width="32" height="32" transform='scale(0.5,0.5)' viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.67534 22.127C4.18645 19.6151 3.66565 16.646 4.21072 13.7772C4.75579 10.9085 6.32924 8.33732 8.63569 6.54646C10.9421 4.75559 13.823 3.86819 16.7373 4.05083C19.6517 4.23347 22.3992 5.47361 24.464 7.53842C26.5288 9.60322 27.7689 12.3507 27.9516 15.2651C28.1342 18.1794 27.2468 21.0603 25.4559 23.3667C23.6651 25.6731 21.0939 27.2466 18.2252 27.7917C15.3564 28.3367 12.3873 27.8159 9.87534 26.3271L5.72534 27.5021C5.55531 27.5518 5.37503 27.5549 5.20341 27.511C5.03178 27.4671 4.87513 27.3778 4.74986 27.2525C4.6246 27.1273 4.53534 26.9706 4.49144 26.799C4.44753 26.6274 4.45061 26.4471 4.50034 26.277L5.67534 22.127Z" fill="#136FD3" stroke="#136FD3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M17.4375 16C17.4375 16.7939 16.7939 17.4375 16 17.4375C15.2061 17.4375 14.5625 16.7939 14.5625 16C14.5625 15.2061 15.2061 14.5625 16 14.5625C16.7939 14.5625 17.4375 15.2061 17.4375 16Z" fill="white" stroke="white" stroke-width="0.125" />
                                    <path d="M11.4375 16C11.4375 16.7939 10.7939 17.4375 10 17.4375C9.20609 17.4375 8.5625 16.7939 8.5625 16C8.5625 15.2061 9.20609 14.5625 10 14.5625C10.7939 14.5625 11.4375 15.2061 11.4375 16Z" fill="white" stroke="white" stroke-width="0.125" />
                                    <path d="M23.4375 16C23.4375 16.7939 22.7939 17.4375 22 17.4375C21.2061 17.4375 20.5625 16.7939 20.5625 16C20.5625 15.2061 21.2061 14.5625 22 14.5625C22.7939 14.5625 23.4375 15.2061 23.4375 16Z" fill="white" stroke="white" stroke-width="0.125" />
                                </svg>
                                {`${[recruiter_full_name, recruiter_job_title].filter(a => a).join(' · ')}`}
                            </div>
                            <MaterialButton className={classNames({
                                [styles.button]: true,
                                [styles.isHover]: isHover
                            })}
                                style={{ height: 24 }}
                                isLoading={loading as boolean} onClick={chatNow as any}
                            >
                                <Image src={HomePageChat} width={16} height={16} alt={''} />
                                Chat Now
                            </MaterialButton>
                        </div>
                        {!!recruiter_is_online && <div className={styles.online}>
                            OnLine
                        </div>}
                    </div>
                }, { className: styles.recruiterContainer }, false)}
            </div>
            <div className={styles.right}>
                <div className={styles.company}>
                    <Image className={styles.logo} src={company_logo} width={24} height={24} alt='' />
                    <span>{company_name}</span>
                </div>
                <div className={styles.componylabels}>
                    {companyLabels.map(label => <div key={label} className={styles.label}>{label}</div>)}
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
            <div className={classNames({
                [styles.popupDetail]: true,
                [styles.hide]: !showPopup
            })}></div>
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