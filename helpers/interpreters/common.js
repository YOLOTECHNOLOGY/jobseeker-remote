/* eslint-disable new-cap */
import { ReaderTPromise as M } from './monads'
import { scripts } from 'imforbossjob'
const { utils } = scripts
const { RequestResult } = utils
export default command => command.cata({
    error: err => M(context => Promise.resolve().then(() => {
        context.handleError?.(err)
        //context.hideModals?.()
    })),
    end: type => M(context => Promise.resolve().then(() => {
        context.handleFinish(type)
        context.hideModals?.()
    })),
    requestUpdate: payload => M(context => {
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
    syncData: data => M(context => Promise.resolve().then(() => {
        context.updateData(data)
    }))
})

