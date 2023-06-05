/* eslint-disable new-cap */
import { scripts, M } from 'imforbossjob'
import {autoSendResumeDetail,autoSendResumeUpdate,autoSendResumeDelete} from './services/autoSendResume'
const { utils, autoSendResume: { EnableActions, DisableActions } } = scripts
const { RequestResult } = utils


export default command => command.cata({
    requestDetail: () => M(context => {
        context.setLoading(true)
        const applicationId = context.getApplicationId()
        return autoSendResumeDetail(applicationId)
            .then(result => RequestResult.success(result.data.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    isEnabled: data => M(() => Promise.resolve().then(() => {
        return data?.auto_sent_resume_id
    })),
    modalEnableResume: data => M(context => new Promise(resolve => {
        context.showEnableAutoResume({
            close: () => resolve(EnableActions.close),
            send: resumeId => resolve(EnableActions.send(resumeId)),
            data
        })
    })),
    modalDisableResume: data => M(context => new Promise(resolve => {
        context.showDisableAutoResume({
            close: () => resolve(DisableActions.close),
            send: payload => resolve(DisableActions.send(payload)),
            change: () => resolve(DisableActions.change),
            data
        })
    })),
    requestEnable: resumeId => M(context => {
        context.setLoading(true)
        const applicationId = context.getApplicationId()
        return autoSendResumeUpdate(applicationId, resumeId)
            .then(result => RequestResult.success(result.data.data))
            .catch(error => RequestResult.error(error?.response?.data?.message))
            .finally(() => context.setLoading(false))
    }),
    requestDisable: () => M(context => {
        context.setLoading(true)
        const applicationId = context.getApplicationId()
        return autoSendResumeDelete(applicationId)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    })
})