/* eslint-disable new-cap */
import { scripts, M } from 'imforbossjob'
import { sendResume, decline, askSendResume } from './services/resume'
const { utils, responseResumeJobseeker: { ModalActions } } = scripts
const { RequestResult } = utils

export default command => command.cata({
    openResume: () => M(context => Promise.resolve().then(() => {
        const state = context.getState()
        window.open(state.resume_request?.resume?.url, '_blank')
    })),
    modalSendResume: () => M(context => new Promise(resolve => {
        context.showSendResume({
            close: () => resolve(ModalActions.close),
            send: payload => resolve(ModalActions.send(payload))
        })
    })),
    requestSendResume: payload => M(context => {
        context.setLoading(true)
        return sendResume(payload.applicationId, payload.requestResumeId, payload.params)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    requestAskSendResume: payload => M(context => {
        context.setLoading(true)
        return askSendResume(payload.applicationId, payload.params)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    requestDecline: () => M(context => {
        const applicationId = context.getApplicationId()
        const requestResumeId = context.getState?.()?.resume_request?.id
        context.setLoading(true)
        return decline(applicationId, requestResumeId)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    })
})