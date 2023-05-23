/* eslint-disable react/no-unknown-property */
'use client'
import React, { } from 'react'
import styles from './index.mobile.module.scss'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { CloseIcon } from 'images'
import useNotSuitable from './hooks'
import NotSuitableModal from './notSuitable'
import classNames from 'classnames'
import { getValueById } from 'helpers/config/getValueById'
import { useSelector } from 'react-redux'
const JobCard = (props: any) => {
    const {
        job_title,
        salary_range_value,
        // job_type,
       // job_location,
        // xp_lvl,
        // degree,
        recruiter_full_name,
        recruiter_job_title,
        // company_logo,
        company_name,
        id,
        job_url,
        preference,
        recruiter_avatar,
        recruiter_last_active_at,
        job_type_id,
        job_location_id,
        xp_lvl_id,
        degree_id,
    } = props
    const config = useSelector((store: any) => store.config.config.response)
    const labels = [
        getValueById(config,job_type_id,'job_type_id'), 
        getValueById(config,job_location_id,'location_id'),
        getValueById(config,xp_lvl_id,'xp_lvl_id'),
        getValueById(config,degree_id,'degree_id'),
    ].filter(a => a)
    const router = useRouter()
    const modalProps = useNotSuitable(preference.id, id)
    const { showSelection, refreshing } = modalProps

    const transTime = (time: string) => {
        return new Date().getTime() - new Date(time).getTime() > 1000 * 60 * 60 * 1
      }
    
    return <div className={
        classNames({
            [styles.main]: true,
            [styles.aboutDisappear]: refreshing
        })
    }>
        <div
            id={'job_card_container_' + id}
            className={styles.container}
            onClick={() => {
                // e.stopPropagation()
                router.push(job_url, { forceOptimisticNavigation: true })
            }}
        >

            <div
                key={job_title + id}
                className={styles.titleContainer}
                title={`${job_title}`}
            >
                <div className={styles.title}>{`${job_title}`}</div>
                <div className={styles.salary}>{salary_range_value}</div>
            </div>
            <div
                className={styles.companyName}

            >{company_name}</div>
            <div className={styles.labelContainer}>
                {labels.map(label => <div key={label} className={styles.label}>{label}</div>)}
            </div>
            <div className={styles.recruiterContainer}>
                <div className={styles.info}>
                    <div className={`${styles.avator}  ${transTime(recruiter_last_active_at) ? styles.avator2 : ''
                  }`}>
                     <Image className={styles.image} src={recruiter_avatar} height={17} width={17} alt={''} />
                    </div>
                   
                    <div
                        className={styles.hrTitle}
                        title={`${[recruiter_full_name, recruiter_job_title].filter(a => a).join(' · ')}`}
                    >
                        {`${[recruiter_full_name, recruiter_job_title].filter(a => a).join(' · ')}`}
                    </div>
                </div>
                <div className={styles.fullName}>
                    { getValueById(config,job_location_id,'location_id')}
                </div>
            </div>
            <div className={styles.closeButton} onClick={e => {
                e.stopPropagation()
                showSelection()
            }}>
                <Image src={CloseIcon} alt='logo' width={13} height={13} />
            </div>
        </div>
        <NotSuitableModal {...modalProps} />
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