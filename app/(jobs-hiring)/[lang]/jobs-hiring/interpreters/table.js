
import { registInterpreter, Result } from 'app/models/abstractModels/util'
import { ReaderTPromise as M } from 'app/models/abstractModels/monads'
import { fetchJobsListService } from 'store/services/jobs/fetchJobsList'
import { check } from 'app/[lang]/chat/[chat_id]/interpreters/services/chat'
import { cookies } from 'next/headers'
import { buildParams } from './encoder'


export default registInterpreter(command =>
    command.cata({
        fetchData: () => M(context => {
            const { searchValues, config } = context
            const queriyParams = buildParams(config, searchValues)
            console.log({ queriyParams })
            const token = cookies().get('accessToken')
            return fetchJobsListService(queriyParams, token?.value)
                .then(result => {
                    return ({
                        jobs: result.data?.data?.jobs,
                        page: result.data?.data?.page ?? 1,
                        totalPages: result.data?.data?.total_pages
                    })

                })
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