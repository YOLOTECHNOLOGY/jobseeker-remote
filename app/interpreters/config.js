
import { ReaderTPromise as M } from 'app/abstractModels/monads'
import { fetchConfigService } from "store/services/config/fetchConfig";
import { registInterpreter, Result } from 'app/abstractModels/util';
import { cache } from 'react'
import { mergeDeepLeft } from 'ramda'
const cachedConfig = cache(fetchConfigService)

export default usedConfigProps => {
    const valueForKeyPath = data => keypath => {
        if (!keypath.length) {
            return data
        } else {
            const [key] = keypath
            console.log({ keypath })
            const result = {
                [key]: data[key]
            }
            return result
        }
    }
    const interpreter = registInterpreter(command =>
        command.cata({
            fetchData: () => M(() =>
                cachedConfig().then(data => {
                    console.log({ data })
                    return Result.success({
                        config: usedConfigProps
                            .map(valueForKeyPath(data))
                            .reduce(mergeDeepLeft)
                    })
                }
                )).catch(Result.error),
            prepareProps: M.of,
        }))
    return interpreter
}


