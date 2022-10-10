/* eslint-disable new-cap */
import { scripts } from 'imforbossjob'
import { ReaderTPromise as M } from './monads'
const { utils, responseResumeJobseeker: { ModalActions } } = scripts
const { RequestResult } = utils

export default command => command.cata({
    modalSendResume: () => M(context => new Promise(resolve => {
        context.showSendResume({
            close: () => resolve(ModalActions.close),
            send: payload => resolve(ModalActions.send(payload))
        })
    })),
    requestSendResume: payload => M(context => {
        return new Promise((resolve,reject) => {
            console.log('payload', payload)
            context.setLoading(true)
            setTimeout(() => {
               resolve({ data: {} })
                 //reject('some error')
            }, 3000)
        }).then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    // updateSendResume: payload => M(context => new Promise(resolve => {
    //     const result = context.updateSendResume(payload)
    //     resolve(result)
    // })),
    requestDecline: payload => M(context => {
        return new Promise((resolve) => {
            console.log('payload', payload)
            context.setLoading(true)
            setTimeout(() => {
                resolve({ data: {} })
                // reject('some error')
            }, 3000)
        }).then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    finish: type => M(context => new Promise(resolve => {
        context.closeSendResume?.(type)
        resolve()
    })),
    error: error => M(context => new Promise(resolve => {
        context.onSendResumeError(error)
        resolve()
    }))
})