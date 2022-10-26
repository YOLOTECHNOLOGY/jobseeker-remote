/* eslint-disable new-cap */
import { scripts,M } from 'imforbossjob'
import { update, updateChat } from './services/common'
const { utils } = scripts
const { RequestResult } = utils
export default command => command.cata({
    error: err => M(context => Promise.resolve().then(() => {
        context.handleError?.(err)
    })),
    end: type => M(context => Promise.resolve().then(() => {
        context.handleFinish(type)
    })),
    requestUpdate: () => M(context => {
        const chatId = context.getChatId()
        context.setLoading(true)
        return updateChat(chatId)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    syncData: data => M(context => Promise.resolve().then(() => {
        console.log({ context })
        context.updateData(data)
    })),
    showToast: (type, content) => M(context => Promise.resolve().then(() => {
        context.showToast(type, content)
    })),
    closeModals: () => M(context => Promise.resolve().then(() => {
        context.hideModals?.()
    })),
    changeChatRoom: chatId => M(context => Promise.resolve().then(() => {
        context.changeChat?.(chatId)
    })),
})

