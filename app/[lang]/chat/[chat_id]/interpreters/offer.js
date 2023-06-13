/* eslint-disable new-cap */
import { M, scripts } from 'imforbossjob'
import { accept, decline, detail } from './services/offer'
const { offerJobseeker: { OfferMessageActions, OfferDetailActions }, utils } = scripts
const { RequestResult } = utils

export default command => command.cata({
    modalOfferMessage: (applicationId, offerId, data) => M(context => new Promise(resolve => {
        context.modalOfferMessage({
            close: () => resolve(OfferMessageActions.close),
            view: () => resolve(OfferMessageActions.view),
            data, applicationId, offerId
        })
    })),

    modalOfferDetail: (applicationId, offerId, data) => M(context => new Promise(resolve => {
        context.modalOfferDetail({
            close: () => resolve(OfferDetailActions.close),
            accept: () => resolve(OfferDetailActions.accept),
            reject: () => resolve(OfferDetailActions.reject),
            toChat: () => resolve(OfferDetailActions.toChat),
            data, applicationId, offerId
        })
    })),
    redirectToChat: data => M(context => Promise.resolve().then(() => {
        const router = context.getRouter()
        const lang = context.getLang()
        if(!window.location.pathname?.includes('chat')){
            router.push(`/${lang}/chat/${data?.chat_id ?? 'list'}`)
        }
    })),
    declineRequest: (applicationId, offerId) => M(context => {
        context.setLoading(true)
        return decline(applicationId, offerId)
            .then(result => RequestResult.success(result.data.data))
            .catch(RequestResult.error)
            .finally(() => context.setLoading(false))
    }),

    acceptRequest: (applicationId, offerId) => M(context => {
        context.setLoading(true)
        return accept(applicationId, offerId)
            .then(result => RequestResult.success(result.data.data))
            .catch(RequestResult.error)
            .finally(() => context.setLoading(false))
    }),

    requestOfferDetail: (applicationId, offerId) => M(context => {
        context.setLoading(true)
        return detail(applicationId, offerId)
            .then(result => RequestResult.success(result.data.data))
            .catch(RequestResult.error)
            .finally(() => context.setLoading(false))
    }),

    refreshDetail: data => M(context => Promise.resolve().then(() => {
        context.refreshOfferDetail({ data })
    }))
})