import { registInterpreter, Result } from 'app/models/abstractModels/util'
import { ReaderTPromise as M } from 'app/models/abstractModels/monads'
import { getCountryId } from 'helpers/country'

export default registInterpreter((command) =>
  command.cata({
    fetchData: () =>
      M((context) => {
        const url = `${
          process.env.JOB_BOSSJOB_URL
        }/related-search?size=10&query=${encodeURIComponent(context.value)}`

        return fetch(url, {
          headers: {
            'Country-Id': '' + getCountryId(),
            'Content-Type': 'application/json'
          }
        })
          .then((resp) => resp.json())
          .then((data) => data.data.items)
          .then(Result.success)
          .catch(Result.error)
      }),
    prepareProps: M.of
  })
)
