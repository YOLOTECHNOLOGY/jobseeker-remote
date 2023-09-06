import React from 'react'
import styles from '../../index.module.scss'

import JobCard from '../jobCard'
import Empty from 'app/components/empty/empty'
import ChatDataProvider from '../ChatProvider'
import { fetchHotJobsListService, queryOnlineStatus } from 'store/services/jobs/fetchJobsList'
import { getCountryId } from 'helpers/country'
import { cookies } from 'next/headers'
import MobileCard from '../jobCard/index.mobile'

const hotJobListData = async (id, accessToken) => {
    const result = await fetchHotJobsListService(id, accessToken).catch(err => {
        return Promise.resolve(err)
    })
    return result
}

const fetchQueryOnlineStatus = async (userIds, accessToken) => {
    const result = await queryOnlineStatus(userIds, accessToken).catch(err => {
        return Promise.resolve(err)
    })
    return result
}
const HotJobTable = async () => {
    const accessToken = cookies().get('accessToken')?.value
    const result = await hotJobListData(
        getCountryId(),
        // 167,
        accessToken)

    const statusResult = await fetchQueryOnlineStatus(result?.data?.data?.jobs?.map(item => item.recruiter.id), accessToken)

    const jobs = result?.data?.data?.jobs?.map((item, i) => ({
        job_title: item.job_title,
        // job_region,
        company_size_id: item.company.company_size_id,
        salary_range_value: item.local_salary_range_value,
        recruiter_avatar: item.recruiter.avatar,

        recruiter_full_name: item.recruiter.full_name,
        recruiter_job_title: item.job_title,
        recruiter_is_online: Boolean(statusResult?.data?.data?.[i]?.is_online),
        recruiter_id: item.recruiter.id,
        recruiter_last_active_at: item.recruiter.last_active_at,
        job_skills: item.skills.map(item => item.value).join(','),
        company_logo: item.company.logo,
        company_name: item.company.name,
        job_benefits: item.benefits,
        external_apply_url: item.external_apply_url,
        id: item.id,
        // chat,
        is_saved: item.is_saved,
        job_url: item.job_url,
        company_url: item.company.company_url,
        is_urgent: item.is_urgent,
        job_type_id: item.job_type_id,
        job_location_id: item.job_location_id,
        xp_lvl_id: item.xp_lvl.id,
        degree_id: item.degree.id,
        company_financing_stage_id: item.company.financing_stage_id,
        company_industry_id: item.company.industry_id
    }))
    return (
        <>
            <h3 className={styles.hotjobTitle}><span>Popular jobs</span></h3>
            {
                jobs && jobs.length ?
                    <ChatDataProvider recruiterIds={jobs.map(job => job?.recruiter?.id).join(',')}>
                        <div className={styles.tableContainer}>
                            {jobs?.map((job) => {
                                return (
                                    <div className={styles.jobContainer} key={job?.id}>
                                        <JobCard {...job} cardType="hotjobs" />
                                    </div>
                                )
                            })}
                        </div>
                        <div className={styles.mobileContainer}>
                            {jobs?.map((job) => {
                                return (
                                    <div className={styles.jobContainer} key={job?.id}>
                                        <MobileCard {...job} />
                                    </div>
                                )
                            })}

                        </div>
                    </ChatDataProvider> : <Empty />
            }
        </>

    )

}

export default HotJobTable

