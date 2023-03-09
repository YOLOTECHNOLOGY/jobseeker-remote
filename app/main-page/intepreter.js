
import { ReaderTPromise as M } from '../abstractModels/monads'
import { fetchConfigService } from "store/services/config/fetchConfig";
import { registInterpreter, Result } from '../abstractModels/util';
import { cache } from 'react'
import { pick,  mergeDeepLeft } from 'ramda'
const cachedConfig = cache(fetchConfigService)

const usedConfigProps = [
    ['inputs', 'location'],
    ['inputs', 'main_functions'],
    ['inputs', 'job_functions'],
    ['inputs', 'function_titles'],
]
const interpreter = registInterpreter(command =>
    command.cata({
        fetchData: () => M(() =>
            cachedConfig().then(data => Result.success({
                config: usedConfigProps.map(keypath => pick(keypath)(data)).reduce(mergeDeepLeft)
            }))
                .catch(Result.error)
        ),
        prepareProps: M.of,
    }))

export default interpreter