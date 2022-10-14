/* eslint-disable new-cap */
import { scripts } from 'imforbossjob'
import { ReaderTPromise as M } from './monads'
import { accept, decline, cancel, checkIn, reportIssue, askResult } from './services/interview'
const { utils,
    interviewJobseeker: {
        AcceptModalActions,
        ConfirmModalActions,
        DetailModalActions,
        IssueModalActions
    }
} = scripts
const { RequestResult } = utils

export default command => command.cata({
    modalAccept: () => M(context => new Promise(resolve => {
        context.showAccept({
            accept: () => resolve(AcceptModalActions.accept),
            declined: payload => resolve(AcceptModalActions.declined(payload)),
            close: () => resolve(AcceptModalActions.close)
        })
    })),
    modalConfirm: () => M(context => new Promise(resolve => {
        context.showConfirm({
            accept: () => resolve(ConfirmModalActions.accept),
            back: () => resolve(ConfirmModalActions.back),
            close: () => resolve(ConfirmModalActions.close)
        })
    })),
    modalDetail: () => M(context => new Promise(resolve => {
        context.showDetail({
            checkIn: payload => resolve(DetailModalActions.checkIn(payload)),
            cancel: payload => resolve(DetailModalActions.cancel(payload)),
            reportIssue: payload => resolve(DetailModalActions.reportIssue(payload)),
            askResult: () => resolve(DetailModalActions.askResult),
            close: () => resolve(DetailModalActions.close)
        })
    })),
    modalIssue: () => M(context => new Promise(resolve => {
        context.showConfirm({
            close: () => resolve(IssueModalActions.close),
            send: () => resolve(IssueModalActions.send),
            back: () => resolve(IssueModalActions.back)
        })
    })),
    requestAccept: payload => M(context => {
        context.setLoading(true)
        return accept(payload.applicationId, payload.inviteInterviewId)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    requestDecline: payload => M(context => {
        context.setLoading(true)
        return decline(payload.applicationId, payload.inviteInterviewId, payload.params)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    requestCancel: payload => M(context => {
        context.setLoading(true)
        return cancel(payload.applicationId, payload.inviteInterviewId, payload.params)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    requestCheckIn: payload => M(context => {
        context.setLoading(true)
        return checkIn(payload.applicationId, payload.inviteInterviewId)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    requestReportIssue: payload => M(context => {
        context.setLoading(true)
        return reportIssue(payload.applicationId, payload.inviteInterviewId, payload.params)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    requestAskResult: payload => M(context => {
        context.setLoading(true)
        return askResult(payload.applicationId, payload.inviteInterviewId)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
})