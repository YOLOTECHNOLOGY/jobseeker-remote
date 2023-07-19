/* eslint-disable import/no-anonymous-default-export */

import { ReaderTPromise as M } from 'app/models/abstractModels/monads'
import { fetchConfigService } from "store/services/config/fetchConfig";
import { registInterpreter, Result } from 'app/models/abstractModels/util';
import { cache } from 'react'
import { mergeDeepLeft } from 'ramda'
import { getLang } from 'helpers/country';


const cachedConfig = cache(fetchConfigService)

export default usedConfigProps => {
    const valueForKeyPath = data => keypath => {
        if (!keypath.length) {
            return data
        } else {
            const [key] = keypath
            const result = {
                [key]: data[key]
            }
            return result
        }
    }
    const interpreter = registInterpreter(command =>
        command.cata({
            fetchData: () => M((content) => {
                const lang = getLang();
                return cachedConfig(lang).then(data => {
                    return Result.success({
                        config: usedConfigProps
                            .map(valueForKeyPath(data))
                            .reduce(mergeDeepLeft)
                    })
                }
                )
            }

            ).catch(Result.error),
            prepareProps: M.of,
        }))
    return interpreter
}


