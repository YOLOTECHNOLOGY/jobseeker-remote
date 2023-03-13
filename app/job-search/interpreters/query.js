
import { ReaderTPromise as M } from 'app/abstractModels/monads'
import { registInterpreter } from 'app/abstractModels/util';

// parseUrl: ['url'],

const interpreter = registInterpreter(command =>
    command.cata({
        parseUrl: () => M.do(context => {
            console.log({ context })
            return context
        }),
    }))

export default interpreter