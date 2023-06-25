/* eslint-disable no-unused-vars */

import { registInterpreter, Result } from 'app/models/abstractModels/util'
import { ReaderTPromise as M } from 'app/models/abstractModels/monads'
// import { check } from 'app/[lang]/chat/[chat_id]/interpreters/services/chat'
import { cookies } from 'next/headers'
import { flatMap } from 'lodash-es'
import { fetchJobsForYouLogin } from 'store/services/jobs/fetchJobsForYouLogin'

export const thousandsToNumber = (string) => {
    if (string !== 'Above 100K') {
        const number = parseInt(string?.split?.('K')?.[0], 10)
        return number * 1000
    } else {
        return 100001
    }
}
export const handleSalary = (salaryRanges, salaryList) => {
    const selected = salaryRanges?.map(seo => salaryList.find(item => item['seo-value'] === seo))
    const from = selected?.map(item => item.from).join(',')
    const to = selected?.map(item => item.to).join(',')
    return [from, to]
    // let salaryFrom = ''
    // let salaryTo = ''
    // if (salaryRanges?.length) {
    //     salaryFrom = salaryRanges
    //         .filter((salary) => salary !== 'below-30k' && salary !== 'above-200k')
    //         .map((salaryFrom) => thousandsToNumber('' + salaryFrom.split('-')[0]))

    //     salaryTo = salaryRanges
    //         .filter((salary) => salary !== 'below-30k' && salary !== 'above-200k')
    //         .map((salaryTo) => thousandsToNumber('' + salaryTo.split('-')[1]))

    //     if (salaryRanges.includes('below-30k')) {
    //         salaryFrom.push(0)
    //         salaryTo.push(30000)
    //     }
    //     if (salaryRanges.includes('above-200k')) {
    //         salaryFrom.push(200001)
    //         salaryTo.push(400000)
    //     }
    //     salaryFrom = salaryFrom.join(',')
    //     salaryTo = salaryTo.join(',')
    // }
    // return [salaryFrom, salaryTo]
}
export default registInterpreter(command =>
    command.cata({
        fetchData: () => M(context => {
            const { searchParams, config, preferences, preferenceId } = context
            const industryList = config.industry_lists
            const qualificationList = config.educations
            const salaryList = config.salary_range_filters
            const [salaryFrom, salaryTo] = handleSalary(searchParams.salary?.split?.(',') ?? [], salaryList)
            const workExperienceList = config.xp_lvls
            const jobTypeList = config.job_types
            const companySizeList = config.company_sizes
            const locationLists = flatMap(config.location_lists, item => item.locations)

            const queriyParams = {
                jobseekerPrefId: preferenceId,
                page: searchParams.page ?? 1,
                size: searchParams.size ?? 15,
                sort: searchParams.sort ?? 2,
                salary_from: salaryFrom,
                salary_to: salaryTo,
                ob_location_ids: locationLists.find(item => item?.['seo_value'] === searchParams.location)?.id ?? null,
                company_industry_ids: searchParams.industry?.split?.(',')?.map?.(key => industryList.find(item => item?.['seo-value'] === key)?.id).join(',') ?? null,
                job_type_ids: searchParams.jobTypes?.split?.(',')?.map?.(key => jobTypeList.find(item => item?.['seo-value'] === key)?.id).join(',') ?? null,
                xp_lvl_ids: searchParams.workExperience?.split?.(',')?.map?.(key => workExperienceList.find(item => item?.['seo-value'] === key)?.id).join(',') ?? null,
                degree_ids: searchParams.qualification?.split?.(',')?.map?.(key => qualificationList.find(item => item?.['seo-value'] === key)?.id).join(',') ?? null,
                // is_company_verified: Boolean(searchParams.verifiedCompany),
                job_location_ids: searchParams.location,
                company_size_ids: searchParams.companySizes?.split?.(',')?.map?.(key => companySizeList.find(item => item?.['seo-value'] === key)?.id).join(',') ?? null,
            }
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