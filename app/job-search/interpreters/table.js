
import { registInterpreter, Result } from 'app/abstractModels/util'
import { ReaderTPromise as M } from 'app/abstractModels/monads'
import { fetchJobsListService } from 'store/services/jobs/fetchJobsList'

export const firstUpper = tmp => tmp.charAt(0).toUpperCase() + tmp.slice(1)
export const buildValue = seo => {
    return seo.split('-').map(firstUpper).join(' ')
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
    console.log({ salaryRanges })
    if (salaryRanges?.length) {
        salaryFrom = salaryRanges
            .filter((salary) => salary !== 'below-30k' && salary !== 'above-200k')
            .map((salaryFrom) => thousandsToNumber('' + salaryFrom.split(' - ')[0]))

        salaryTo = salaryRanges
            .filter((salary) => salary !== 'below-30k' && salary !== 'above-200k')
            .map((salaryTo) => thousandsToNumber('' + salaryTo.split(' - ')[1]))

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
            //             degrees: 
            // function_job_title_ids: 
            // is_company_verified: false
            // job_functions_ids: 
            // job_locations: Caloocan
            // job_types: 
            // main_functions: 
            // page: 1
            // query: 
            // salary_from: 
            // salary_to: 
            // size: 30
            // sort: 2
            // source: web
            // xp_lvls:
            const functionsTitleList = config.inputs.function_titles
            const jobFunctionList = config.inputs.job_functions
            const [salaryFrom, salaryTo] = handleSalary(searchValues.salary)
            const queriyParams = {
                query: searchValues.query,
                job_locations: transToValues(searchValues.location),
                salary_from: salaryFrom,
                salary_to: salaryTo,
                job_types: transToValues(searchValues.jobType),
                xp_lvls: transToValues(searchValues.workExperience),
                is_company_verified: Boolean(searchValues.verifiedCompany),
                job_functions_ids: searchValues?.jobFunctions?.split?.(',')?.map?.(seo => jobFunctionList.find(item => item.seo_value === seo)?.id)?.join?.(',') ?? null,
                main_functions: transToValues(searchValues.mainFunctions),
                job_functions_ids: transToValues(searchValues.jobFunctions),
                function_job_title_ids: searchValues?.functionTitles?.split?.(',')
                    ?.map?.(seo => functionsTitleList.find(item => item.seo_value === seo)?.id)
                    ?.join?.(',') ?? null,
                page: searchValues?.page ?? 1,
                size: 15,
                source: 'web'
            }
            console.log({ queriyParams })
            return fetchJobsListService(queriyParams)
                .then(result => ({
                    jobs: result.data?.data?.jobs,
                    page: result.data?.data?.page ?? 1,
                    totalPages: result.data?.data?.total_pages
                }))
                .then(Result.success)
                .catch(Result.error)
        }),
        prepareProps: M.of,
    }))