
import { ReaderTPromise as M } from 'app/abstractModels/monads'
import { registInterpreter } from 'app/abstractModels/util';
import { decoder } from './encoder';
// parseUrl: ['url'],

const interpreter = registInterpreter(command =>
    command.cata({
        parseUrl: config => M.do(context => {
            return decoder(config)(context.params.path, context.searchParams)
        }),
    }))

export default interpreter