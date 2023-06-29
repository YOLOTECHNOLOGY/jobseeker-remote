import { taggedSum } from 'daggy'
import { Free } from 'fantasy-frees'
const DO = F => Free.liftFC(F)

export const ToChatStatus = taggedSum('ChatStatus', {

    notLogin: [],
    externalLink: ['link'],
    existSameJob: [],
    notCompleteFile:[],
    existDiffrentJob: [],
    notExist: []
})
export const Actions = taggedSum('ChatNowActions', {
    isLogin: [],
    hasChatData: [],
    fetchChatData: [],
    parseToChatStatus: ['chatData'],
    redirectToLogin: [],
    modalCompleteFile:[],
    redirectToExternal: ['link'],
    modalChangeChattingJob: ['chatData'],
    redirectToChat: ['chatId'],
    requestChangeJob: ['chatData'],
    createNewChat: []
})

export const chatNowScript = () => DO(Actions.isLogin)
    .chain(login => {
        if (!login) {
            return DO(Actions.redirectToLogin)
        } else {
            return DO(Actions.hasChatData)
                .chain(chatData => {
                    if (chatData) {
                        return doChatScript(chatData)
                    } else {
                        return DO(Actions.fetchChatData)
                            .chain(doChatScript)
                    }
                })
        }
    })

const doChatScript = chatData => DO(Actions.parseToChatStatus(chatData))
    .chain(status => status.cata({
        notLogin: () => DO(Actions.redirectToLogin),
        notCompleteFile:() => DO(Actions.modalCompleteFile),
        externalLink: link => DO(Actions.redirectToExternal(link)),
        existSameJob: () => DO(Actions.redirectToChat(chatData.id || chatData.chat_id)),
        existDiffrentJob: () => DO(Actions.modalChangeChattingJob(chatData)),
        notExist: () => DO(Actions.createNewChat)
            .chain(chatId => DO(Actions.redirectToChat(chatId)))
    }))

export const switchJobScript = chatData => DO(Actions.requestChangeJob(chatData))
    .chain(chatId => DO(Actions.redirectToChat(chatId)))
