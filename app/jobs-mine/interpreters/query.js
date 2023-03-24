
import { ReaderTPromise as M } from 'app/abstractModels/monads'
import { registInterpreter } from 'app/abstractModels/util';
import { decoder } from 'app/jobs-hiring/interpreters/encoder';
// parseUrl: ['url'],

const interpreter = registInterpreter(command =>
    command.cata({
        parseUrl: config => M.do(context => {
            // return context
            return decoder(config)(context.params.path, context.searchParams)
        }),
    }))

export default interpreter