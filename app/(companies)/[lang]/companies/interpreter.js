
import { registInterpreter, Result } from 'app/[lang]/abstractModels/util'
import { ReaderTPromise as M } from 'app/[lang]/abstractModels/monads'
import { fetchCompanyFilterService } from 'store/services/companies2/fetchCompanyFilter'

export default registInterpreter(command =>
    command.cata({
        fetchData: () => M(() => {
            const searchFilterPayload = {
                size: 16,
                page: 1
            }
            return fetchCompanyFilterService(searchFilterPayload)
                .then(result => result.data.data)
                .then(Result.success)
                .catch(Result.error)
        }),
        prepareProps: M.of,
    }))