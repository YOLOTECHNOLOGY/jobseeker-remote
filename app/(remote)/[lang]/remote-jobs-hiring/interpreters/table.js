
import { registInterpreter, Result } from 'app/models/abstractModels/util'
import { ReaderTPromise as M } from 'app/models/abstractModels/monads'
import { fetchJobsListService } from 'store/services/jobs/fetchJobsList'
// import { check } from 'app/[lang]/chat/[chat_id]/interpreters/services/chat'
import { cookies } from 'next/headers'
import { buildParams } from './encoder'
import { memoizeWithTime } from 'helpers/cache'

const fetchList = memoizeWithTime(
    fetchJobsListService,
    (params, token) => JSON.stringify(params) + token,
    180
)
export default registInterpreter(command =>
    command.cata({
        fetchData: () => M(context => {
            const { searchValues, config } = context
            const queriyParams = buildParams(config, searchValues)
            const token = cookies().get('accessToken')
            return fetchList(queriyParams, token?.value)
                .then(result => {
                    return ({
                        jobs: result.data?.data?.jobs,
                        page: result.data?.data?.page ?? 1,
                        totalPages: result.data?.data?.total_pages
                    })

                })
                .then(Result.success)
                .catch(Result.error)
        }),
        prepareProps: M.of,
    }))