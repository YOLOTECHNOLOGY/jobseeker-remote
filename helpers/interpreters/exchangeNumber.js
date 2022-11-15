/* eslint-disable new-cap */
import { scripts,M } from 'imforbossjob'
import { create, accept, decline, sendOTP, verify } from './services/exchangeNumber'

const { utils, exchangeNumberJobseeker: { ModalActions } } = scripts
const { RequestResult, UserNumberValidation } = utils


export default command => command.cata({
    queryUserNumberValidation: () => M(context => new Promise(resolve => {
        const number = context.isUserNumberValidate()
        console.log('command',command)
        if (number) {
            resolve(UserNumberValidation.isValidate(number))
        } else {
            resolve(UserNumberValidation.notValidate)
        }
    })),
    modalExchangeNumber: status => {
        const step = status.cata({
            init: () => ('init'),
            OTPSended: () => ('OTPSended'),
            verified: () => ('verified')
        })
        return M(context => new Promise(resolve =>
            context.showExchangeNumber({
                step,
                sendOTP: payload => resolve(ModalActions.sendOTP(payload)),
                close: () => resolve(ModalActions.close),
                verify: payload => resolve(ModalActions.verify(payload)),
                sendNumber: payload => resolve(ModalActions.sendNumber(payload))
            })))
    },
    sendOTPRequest: () => M(context => {
        context.setLoading(true)
        return sendOTP()
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    startCountDown: () => M(context => {
        return Promise.resolve().then(context.startCountDown)
    }),
    verifyRequest: otp => M(context => {
        context.setLoading(true)
        return verify(otp).then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    sendNumberRequest: () => M(context => {
        const applicationId = context.getApplicationId()
        const id = context.getState()?.contact_exchange_request?.id
        context.setLoading(true)
        return create(applicationId, id)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    acceptRequest: () => M(context => {
        const applicationId = context.getApplicationId()
        const id = context.getState()?.contact_exchange_request?.id
        context.setLoading(true)
        return accept(applicationId, id)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    declineRequest: () => M(context => {
        const applicationId = context.getApplicationId()
        const id = context.getState()?.contact_exchange_request?.id
        context.setLoading(true)
        return decline(applicationId, id)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    copyNumber: () => M(context => {
        return navigator.clipboard.writeText(context.getState()?.contact_exchange_request?.recruiter_contact_num)
    }),
    updateUser: () => M(context => {
        return new Promise(resolve => {
            context.updateUser()
            resolve()
        })
    }),

})