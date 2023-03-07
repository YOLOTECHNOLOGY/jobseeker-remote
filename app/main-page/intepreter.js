
import { ReaderTPromise as M } from '../abstractModels/monads'
import { fetchConfigService } from "store/services/config/fetchConfig";
import { registInterpreter, Result } from '../abstractModels/util';
import { cache } from 'react'
const cachedConfig = cache(fetchConfigService)
const interpreter = registInterpreter(command =>
    command.cata({
        fetchData: () => M(() =>
            cachedConfig().then(data => Result.success({ config: data }))
                .catch(Result.error)
        ),
        prepareProps: M.of,
    }))

export default interpreter