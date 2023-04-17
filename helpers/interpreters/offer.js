/* eslint-disable new-cap */
import { M, scripts } from 'imforbossjob'
import { accept, decline, detail } from './services/offer'
const { offerJobseeker: { OfferMessageActions, OfferDetailActions }, utils } = scripts
const { RequestResult } = utils

export default command => command.cata({
    modalOfferMessage: (applicationId, offerId, data) => M(context => new Promise(res => {
        context.modalOfferMessage({
            close: resolve(OfferMessageActions.close),
            view: resolve(OfferMessageActions.view),
            data, applicationId, offerId
        })
    })),

    modalOfferDetail: (applicationId, offerId, data) => M(context => new Promise(res => {
        context.modalOfferDetail({
            close: resolve(OfferDetailActions.close),
            accept: resolve(OfferDetailActions.accept),
            reject: resolve(OfferDetailActions.reject),
            data, applicationId, offerId
        })
    })),

    declineRequest: (applicationId, offerId) => M(() => {
        context.setLoading(true)
        return decline(applicationId, offerId)
            .then(result => RequestResult.success(result.data.data))
            .catch(RequestResult.error)
            .finally(() => context.setLoading(false))
    }),

    acceptRequest: (applicationId, offerId) => M(() => {
        context.setLoading(true)
        return accept(applicationId, offerId)
            .then(result => RequestResult.success(result.data.data))
            .catch(RequestResult.error)
            .finally(() => context.setLoading(false))
    }),

    requestOfferDetail: (applicationId, offerId) => M(() => {
        context.setLoading(true)
        return detail(applicationId, offerId)
            .then(result => RequestResult.success(result.data.data))
            .catch(RequestResult.error)
            .finally(() => context.setLoading(false))
    }),

    refreshDetail: data => M(context => Promise.resolve().then(() => {
        context.refreshOfferDetail(data)
    }))
})