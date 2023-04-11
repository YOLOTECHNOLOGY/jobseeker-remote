/* eslint-disable no-unused-vars */

import { registInterpreter, Result } from 'app/abstractModels/util'
import { ReaderTPromise as M } from 'app/abstractModels/monads'
// import { check } from 'helpers/interpreters/services/chat'
import { cookies } from 'next/headers'
import { fetchJobsForYouLogin } from 'store/services/jobs/fetchJobsForYouLogin'

export const thousandsToNumber = (string) => {
    if (string !== 'Above 100K') {
        const number = parseInt(string?.split?.('K')?.[0], 10)
        return number * 1000
    } else {
        return 100001
    }
}
export const handleSalary = (salaryRanges) => {
    let salaryFrom = ''
    let salaryTo = ''
    if (salaryRanges?.length) {
        salaryFrom = salaryRanges
            .filter((salary) => salary !== 'below-30k' && salary !== 'above-200k')
            .map((salaryFrom) => thousandsToNumber('' + salaryFrom.split('-')[0]))

        salaryTo = salaryRanges
            .filter((salary) => salary !== 'below-30k' && salary !== 'above-200k')
            .map((salaryTo) => thousandsToNumber('' + salaryTo.split('-')[1]))

        if (salaryRanges.includes('below-30k')) {
            salaryFrom.push(0)
            salaryTo.push(30000)
        }
        if (salaryRanges.includes('above-200k')) {
            salaryFrom.push(200001)
            salaryTo.push(400000)
        }
        salaryFrom = salaryFrom.join(',')
        salaryTo = salaryTo.join(',')
    }
    return [salaryFrom, salaryTo]
}
export default registInterpreter(command =>
    command.cata({
        fetchData: () => M(context => {
            const { searchParams, config, preferences, preferenceId } = context
            const industryList = config.industry_lists
            const qualificationList = config.educations
            const [salaryFrom, salaryTo] = handleSalary(searchParams.salary?.split?.(',') ?? [])
            const workExperienceList = config.xp_lvls
            const jobTypeList = config.job_types
            const companySizeList = config.company_sizes

            const queriyParams = {
                jobseekerPrefId: preferenceId,
                page: searchParams.page ?? 1,
                size: searchParams.size ?? 15,
                sort: searchParams.sort ?? 2,
                salary_from: salaryFrom,
                salary_to: salaryTo,
                company_industries: searchParams.industry?.split?.(',')?.map?.(key => industryList.find(item => item?.['seo-value'] === key)?.value).join(',') ?? null,
                job_types: searchParams.jobTypes?.split?.(',')?.map?.(key => jobTypeList.find(item => item?.['seo-value'] === key)?.value).join(',') ?? null,
                xp_lvls: searchParams.workExperience?.split?.(',')?.map?.(key => workExperienceList.find(item => item?.['seo-value'] === key)?.value).join(',') ?? null,
                degrees: searchParams.qualification?.split?.(',')?.map?.(key => qualificationList.find(item => item?.['seo-value'] === key)?.value).join(',') ?? null,
                // is_company_verified: Boolean(searchParams.verifiedCompany),
                company_sizes: searchParams.companySizes?.split?.(',')?.map?.(key => companySizeList.find(item => item?.['seo-value'] === key)?.value).join(',') ?? null,
            }
            console.log({ queriyParams, context })
            const token = cookies().get('accessToken')
            return fetchJobsForYouLogin(queriyParams, token.value)
                .then(result => ({
                    jobs: result.data?.data?.jobs,
                    page: result.data?.data?.page ?? 1,
                    totalPages: result.data?.data?.total_pages,
                    preferences
                }))
                // .then(data => {
                //     if (token?.value && data?.jobs?.length) {
                //         return check((data.jobs ?? []).map(job => job.recruiter_id).join(','), token.value)
                //             .then(response => {
                //                 const chats = response.data.data
                //                 return {
                //                     ...data,
                //                     jobs: data.jobs.map((job, index) => ({ ...job, chat: chats[index] })),
                //                 }
                //             })
                //     } else {
                //         return data
                //     }
                // })
                .then(Result.success)
                .catch(Result.error)
        }),
        prepareProps: M.of,
    }))