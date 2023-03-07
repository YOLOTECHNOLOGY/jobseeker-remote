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
    just: M.of,
    requestImState: chatId => M(() =>
        Promise.resolve().then(() => {
            return updateChat(chatId)
                .then(result => RequestResult.success(result.data))
                .catch(error => RequestResult.error(error))
        })),
    updateImState: (chatId, data) => M(context => new Promise(resolve => {
        context.updateImState(chatId, data)
        setTimeout(()=>resolve({chatId,imSate:data}), 0)
    })),
    getLocalImState:chatId =>  M(context => new Promise(resolve => {
        const state =  context.getLocalImState(chatId)
        resolve(state)
    })),
    postPageNotification: (message, state) => M(context => Promise.resolve().then(() => {
        return context.postPageNotification(message, state)
    })),
    postLocalNotification: (message, state) => M(context => Promise.resolve().then(() => {
        return context.postLocalNotification(message, state)
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

