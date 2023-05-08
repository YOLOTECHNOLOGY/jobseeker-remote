
import { registInterpreter, Result } from 'app/[lang]/abstractModels/util'
import { ReaderTPromise as M } from 'app/[lang]/abstractModels/monads'
import { cookies } from 'next/headers'
import { fetchJobsPreferences } from 'store/services/jobs/fetchJobsForYouLogin'
export default registInterpreter(command =>
    command.cata({
        fetchData: () => M(() => {
            const accessToken = cookies().get('accessToken')?.value
            return fetchJobsPreferences(null, accessToken)
                .then(result => {
                    return result.data.data
                })

                .then(Result.success)
                .catch(Result.error)
        }),
        prepareProps: M.of,
    }))