/* eslint-disable new-cap */
import { scripts, M } from 'imforbossjob'
import { updateChat } from './services/common'
const { utils } = scripts
const { RequestResult } = utils
export default command => command.cata({
    error: err => M(context => Promise.resolve().then(() => {
        context.handleError?.(err)
    })),
    end: type => M(context => Promise.resolve().then(() => {
        context.handleFinish(type)
    })),
    requestUpdate: () => M(context =>
        Promise.resolve().then(() => {
            const chatId = context.getChatId()
            context.setLoading(true)
            return updateChat(chatId)
                .then(result => RequestResult.success(result.data))
                .catch(error => RequestResult.error(error))
                .finally(() => context.setLoading(false))
        })

    ),
    syncData: data => M(context => new Promise(resolve => {
        context.updateData(data)
        setTimeout(resolve, 0)
    })),
    updatePath: (path, data) => M(context => new Promise(resolve => {
        context.updatePath(path, data)
        setTimeout(resolve, 0)
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
    updateTotalUnreadNumber: totalUnreadNumber => M(context => Promise.resolve().then(() => {
        context.updateTotalUnreadNumber?.(totalUnreadNumber)
    })),
})

