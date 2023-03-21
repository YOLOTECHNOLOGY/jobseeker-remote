
import { registInterpreter, Result } from 'app/abstractModels/util'
import { ReaderTPromise as M } from 'app/abstractModels/monads'
import { fetchJobsListService } from 'store/services/jobs/fetchJobsList'
import { check } from 'helpers/interpreters/services/chat'
import { cookies } from 'next/headers'
import { flatMap } from 'lodash-es'
export const firstUpper = tmp => tmp.charAt(0).toUpperCase() + tmp.slice(1)
export const buildValue = seo => {
    return seo.split('_').map(firstUpper).join(' ')
}
export const transToValues = seos => seos ? seos.map(buildValue).join(',') : null
export const thousandsToNumber = (string) => {
    if (string !== 'Above 100K') {
        const number = parseInt(string.split('K')[0], 10)
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
            const { searchValues, config } = context
            const functionsTitleList = config.inputs.function_titles
            const jobFunctionList = config.inputs.job_functions
            const companySizeList = config.inputs.company_sizes
            const qualificationList = config.filters.educations
            const [salaryFrom, salaryTo] = handleSalary(searchValues.salary)
            const workExperienceList = config.inputs.xp_lvls
            const jobTypeList = config.inputs.job_types
            const locationLists = flatMap(config.inputs.location_lists, item => item.locations)
            const queriyParams = {
                query: searchValues.query,
                job_locations: transToValues(searchValues.location),
                job_locations: searchValues.location?.map?.(key => locationLists.find(item => item?.['seo_value'] === key)?.value).join(',') ?? null,

                salary_from: salaryFrom,
                salary_to: salaryTo,
                job_types: searchValues.jobType?.map?.(key => jobTypeList.find(item => item?.['seo-value'] === key)?.value).join(',') ?? null,
                xp_lvls: searchValues.workExperience?.map?.(key => workExperienceList.find(item => item?.['seo-value'] === key)?.value).join(',') ?? null,
                qualification: searchValues.qualification?.map?.(key => qualificationList.find(item => item?.['seo-value'] === key)?.value).join(',') ?? null,
                company_financing_stages: searchValues.financingStages?.join?.(',') ?? null,
                is_company_verified: Boolean(searchValues.verifiedCompany),
                job_functions_ids: searchValues?.jobFunctions?.split?.(',')?.map?.(seo => jobFunctionList.find(item => item.seo_value === seo)?.id)?.join?.(',') ?? null,
                main_functions: transToValues(searchValues.mainFunctions),
                company_sizes: searchValues.companySizes?.map?.(key => companySizeList.find(item => item?.['seo-value'] === key)?.value).join(',') ?? null,
                function_job_title_ids: searchValues?.functionTitles?.split?.(',')
                    ?.map?.(seo => functionsTitleList.find(item => item.seo_value === seo)?.id)
                    ?.join?.(',') ?? null,
                page: searchValues?.page?.[0] ?? 1,
                size: 15,
                source: 'web'
            }
            const token = cookies().get('accessToken')
            return fetchJobsListService(queriyParams, token?.value)
                .then(result => ({
                    jobs: result.data?.data?.jobs,
                    page: result.data?.data?.page ?? 1,
                    totalPages: result.data?.data?.total_pages
                }))
                .then(data => {
                    if (token?.value && data?.jobs?.length) {
                        return check((data.jobs ?? []).map(job => job.recruiter_id).join(','), token.value)
                            .then(response => {
                                const chats = response.data.data
                                return {
                                    ...data,
                                    jobs: data.jobs.map((job, index) => ({ ...job, chat: chats[index] }))
                                }
                            })
                    } else {
                        return data
                    }
                })
                .then(Result.success)
                .catch(Result.error)
        }),
        prepareProps: M.of,
    }))