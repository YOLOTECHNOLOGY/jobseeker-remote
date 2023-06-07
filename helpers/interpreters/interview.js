/* eslint-disable new-cap */
import { scripts, M } from 'imforbossjob'
import { accept, decline, cancel, checkIn, reportIssue, askResult, attend } from './services/interview'
const { utils,
    interviewJobseeker: {
        InterviewAttendedStatus,
        AcceptModalActions,
        ConfirmModalActions,
        DetailModalActions,
        IssueModalActions,
        CancelDetailModalActions,
        CancelModalActions,
        InterviewStatus,
        AttendModalActions,
        AskResultFailedModalActions
    }
} = scripts
const { RequestResult } = utils

export default command => command.cata({
    queryInterviewStatus: () => M(context => new Promise(resolve => {
        const interviewData = context.getState?.()?.interview
        if (interviewData?.status === 'Pending interview approval') {
            resolve(InterviewStatus.pendingApproval)
        } else if (interviewData?.cancelled_role) {
            resolve(InterviewStatus.cancelled)
        } else {
            resolve(InterviewStatus.detail)
        }
    })),

    queryAttendStatus: () => M(context => Promise.resolve().then(() => {
        const interviewData = context.getState?.()?.interview
        if (interviewData?.checked_in_at) {
            return InterviewAttendedStatus.attended
        } else if (interviewData?.jobseeker_mark_jobseeker_attended) {
            return InterviewAttendedStatus.attended
        } else if (interviewData?.jobseeker_mark_jobseeker_attended === false) {
            return InterviewAttendedStatus.notAttended
        } else {
            return InterviewAttendedStatus.unknow
        }
    })),
    queryTimeEnableForAskingResult: () => M(context => Promise.resolve().then(() => {
        return context?.canAskResult()
    })),

    modalAttend: () => M(context => new Promise(resolve => {
        context.showAttend({
            send: payload => resolve(AttendModalActions.send(payload)),
            back: () => resolve(AttendModalActions.back),
            close: () => resolve(AttendModalActions.close)
        })
    })),
    modalAskResultFailed: payload => M(context => new Promise(resolve => {
        const type = payload.cata({
            notAttended: () => 'notAttended',
            notTime: () => 'notTime'
        })
        context.showAskFailed({
            type,
            close: () => resolve(AskResultFailedModalActions.close)
        })
    })),
    modalAccept: () => M(context => new Promise(resolve => {
        context.showAccept({
            accept: () => resolve(AcceptModalActions.accept),
            declined: payload => resolve(AcceptModalActions.declined(payload)),
            close: () => resolve(AcceptModalActions.close)
        })
    })),
    modalCancel: () => M(context => new Promise(resolve => {
        context.showCancel({
            close: () => resolve(CancelModalActions.close),
            send: payload => resolve(CancelModalActions.send(payload)),
            back: () => resolve(CancelModalActions.back)
        })
    })),
    modalCancelDetail: () => M(context => new Promise(resolve => {
        context.showCancelDetail({
            close: () => resolve(CancelDetailModalActions.close)
        })
    })),
    modalConfirm: () => M(context => new Promise(resolve => {
        context.showConfirm({
            accept: payload => resolve(ConfirmModalActions.accept(payload)),
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
        context.showIssue({
            close: () => resolve(IssueModalActions.close),
            send: payload => resolve(IssueModalActions.send(payload)),
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
    requestAttend: payload => M(context => {
        context.setLoading(true)
        return attend(payload.applicationId, payload.inviteInterviewId, payload.params)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error?.response?.data?.message))
            .finally(() => context.setLoading(false))
    }),
    requestAskResult: () => M(context => {
        context.setLoading(true)
        const applicationId = context.getApplicationId?.()
        const imState = context.getState?.()
        return askResult(applicationId, imState?.interview?.id)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
})