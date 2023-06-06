
import { registInterpreter, Result } from 'app/[lang]/abstractModels/util'
import { ReaderTPromise as M } from 'app/[lang]/abstractModels/monads'
import { fetchJobsListService } from 'store/services/jobs/fetchJobsList'
import { check } from 'helpers/interpreters/services/chat'
import { buildParams } from 'app/(jobs-hiring)/[lang]/jobs-hiring/interpreters/encoder'
import { getCookie } from 'helpers/cookies'

export default registInterpreter(command =>
    command.cata({
        fetchData: () => M(context => {
            const { searchValues, config } = context
            const queriyParams = buildParams(config, searchValues)
            const token = getCookie('accessToken')
            return fetchJobsListService(queriyParams, token)
                .then(result => ({
                    jobs: result.data?.data?.jobs,
                    page: result.data?.data?.page ?? 1,
                    totalPages: result.data?.data?.total_pages
                }))
                .then(data => {
                    if (token && data?.jobs?.length) {
                        return check((data.jobs ?? []).map(job => job.recruiter_id).join(','), token)
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