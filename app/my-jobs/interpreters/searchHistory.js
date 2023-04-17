import { registInterpreter, Result } from 'app/abstractModels/util'
import { ReaderTPromise as M } from 'app/abstractModels/monads'


export default registInterpreter(command =>
    command.cata({
        fetchData: () => M(context => {
            return fetch(`${process.env.JOB_BOSSJOB_URL}/search-suggestion?size=10&query=${context.value}`)
                .then((resp) => resp.json())
                .then((data) => data.data.items)
                .then(Result.success)
                .catch(Result.error)
        }),
        prepareProps: M.of,
    }))