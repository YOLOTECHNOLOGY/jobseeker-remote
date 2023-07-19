import { registInterpreter, Result } from 'app/models/abstractModels/util'
import { ReaderTPromise as M } from 'app/models/abstractModels/monads'
import { cookies } from 'next/headers'
import { accountSetting } from 'store/services/auth/accountSetting'

export default registInterpreter(command =>
    command.cata({
        fetchData: () => M(() => {
            const accessToken = cookies().get('accessToken')?.value
            return accountSetting({ accessToken })
                .then(result => {
                    return result.data.data
                })

                .then(Result.success)
                .catch(Result.error)
        }),
        prepareProps: M.of,
    }))