import { registInterpreter, Result } from 'app/[lang]/abstractModels/util'
import { ReaderTPromise as M } from 'app/[lang]/abstractModels/monads'
import { getCountryId } from 'helpers/country';

export default registInterpreter(command =>
    command.cata({
        fetchData: () => M(context => {
            return fetch(`${process.env.JOB_BOSSJOB_URL}/search-suggestion?size=10&query=${context.value}`,{
                headers:{
                    'Country-Id': getCountryId()
                  } 
            })
                .then((resp) => resp.json())
                .then((data) => data.data.items)
                .then(Result.success)
                .catch(Result.error)
        }),
        prepareProps: M.of,
    }))