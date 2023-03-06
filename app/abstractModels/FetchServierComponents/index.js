import { taggedSum } from 'daggy'
import { Free } from 'fantasy-frees'
import { CommonActions } from '../util'
const DO = F => Free.liftFC(F)
export const Actions = taggedSum('ServerFetchComponentsData', {
    fetchData: ['params'],
    prepareProps: ['data'],
})

export const serverDataScript = params => DO(Actions.fetchData(params))
    .chain(result => result.cata({
        success: data => DO(Actions.prepareProps(data)),
        error: error => DO(CommonActions.error(error))
    }))