/* eslint-disable new-cap */
import { scripts } from 'imforbossjob'
import { ReaderTPromise as M } from './monads'
import { create, accept, decline } from './services/exchangeNumber'

const { utils } = scripts
const { RequestResult } = utils

export default command => command.cata({
    requestAskChange: () => M(context => {
        const applicationId = context.getApplicationId()
        const id = context.getState().contact_exchange_request.id
        context.setLoading(true)
        return create(applicationId, id)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    requestAccept: () => M(context => {
        const applicationId = context.getApplicationId()
        const id = context.getState().contact_exchange_request.id
        context.setLoading(true)
        return accept(applicationId, id)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    requestDecline: () => M(context => {
        const applicationId = context.getApplicationId()
        const id = context.getState().contact_exchange_request.id
        context.setLoading(true)
        return decline(applicationId, id)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    copyNumber: () => M(context => {
        console.log()
        return navigator.clipboard.writeText(context.getState()?.contact_exchange_request?.recruiter_contact_num)
    })

})