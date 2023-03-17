import React from 'react'
import styles from './index.module.scss'
const JobCard = (props: any) => {
    console.log({ props })
    const {
        function_job_title,
        job_region,
        salary_range_value,
        job_type,
        job_location,
        xp_lvl,
        degree
    } = props
    const labels = [job_type, job_location, xp_lvl, degree].filter(a => a)
    return <div className={styles.container}>
        <div className={styles.topContainer}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>{`${function_job_title} (${job_region})`}</div>
                <div className={styles.salary}>{salary_range_value}</div>
            </div>
            <div className={styles.labelContainer}>
                {labels.map(label => <div key={label} className={styles.label}>{label}</div>)}
            </div>
        </div >
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