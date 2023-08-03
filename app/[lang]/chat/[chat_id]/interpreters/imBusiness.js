/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable new-cap */
import { M, scripts } from 'imforbossjob'
import { requestFirstService } from './services/imBusiness'
const { utils } = scripts
const { RequestResult } = utils
const retry = (fn, max, currentTime = 1) => {
    return (...args) => fn(...args)
        .catch((e) => {
            if (currentTime <= max) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(retry(fn, max, currentTime + 1)(...args))
                    }, currentTime * 1000)
                })
            } else {
                return Promise.reject(e)
            }
        })
}
export default command => command.cata({
    isFirstMessage: () => M(context => new Promise(resolve => {
        const imState = context.getState()
        resolve(imState?.chatStatus === 'New' && imState?.initiated_role === 'recruiter')
    })),
    isFirstReceivedMessage: chatId =>
        M(
            context => {
                const imState = context.getState()
                return new Promise(resolve => {
                    const delete_status = context.getLocalImState(chatId)?.delete_status
                    resolve(!!delete_status || imState?.chatStatus === 'New' && imState?.initiated_role === 'jobseeker')
                })
            }

        ),
    requestFirst: aChatId => M(context => {
        context.setLoading(true)
        const chatId = aChatId || context.getChatId()
        return retry(requestFirstService, 5)(chatId)
            // return retry(() => Promise.reject(new Error('123')), 5)(chatId)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),

})

