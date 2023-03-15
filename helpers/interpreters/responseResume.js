/* eslint-disable new-cap */
import { scripts, M } from 'imforbossjob'
import { sendResume, decline, askSendResume, sendResumeDetail } from './services/resume'
const { utils, responseResumeJobseeker: { ModalActions } } = scripts
const { RequestResult } = utils

export default command => command.cata({
    openResume: data => M(() => Promise.resolve().then(() => {
        // const state = context.getState()
        window.open(data?.resume?.url, '_blank')
    })),
    modalSendResume: () => M(context => new Promise(resolve => {
        context.showSendResume({
            close: () => resolve(ModalActions.close),
            send: payload => resolve(ModalActions.send(payload))
        })
    })),
    requestResumeUrl: id => M(context => {
        context.setLoading(true)
        const applicationId = context.getApplicationId()
        return sendResumeDetail(applicationId, id)
            .then(result => RequestResult.success(result.data.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    requestSendResume: ({ applicationId, id }, params) => M(context => {
        context.setLoading(true)
        return sendResume(applicationId, id, params)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    requestAskSendResume: payload => M(context => {
        context.setLoading(true)
        console.log({ payload })
        return askSendResume(payload.applicationId, { resume_id: payload.resume_id })
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    requestDecline: ({ applicationId, id }) => M(context => {
        context.setLoading(true)
        return decline(applicationId, id)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    })
})