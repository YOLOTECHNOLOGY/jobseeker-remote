import { registInterpreter, Result } from 'app/models/abstractModels/util'
import { ReaderTPromise as M } from 'app/models/abstractModels/monads'
import { getCountryId } from 'helpers/country';
import { accessToken, getCookie } from 'helpers/cookies';
import { fetchSearchSuggestionService } from 'store/services/jobs/fetchSearchSuggestion';

export default registInterpreter(command =>
    command.cata({
        fetchData: () => M(context => {
            // return fetch(`${process.env.JOB_BOSSJOB_URL}/search-suggestion?size=10&query=${context.value}`, {
            //     headers: {
            //         'Country-Id': '' + getCountryId()
            //     }
            // })
            //     .then((resp) => resp.json())
            //     .then((data) => data.data.items)
            //     .then(Result.success)
            //     .catch(Result.error)
            const token = getCookie(accessToken)
            return fetchSearchSuggestionService({ size: 5, query: context.value }, token)
                .then((data) => data.data.data.items)
                .then(Result.success)
                .catch(Result.error)
        }),
        prepareProps: M.of,
    }))