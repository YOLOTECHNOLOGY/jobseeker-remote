import { taggedSum } from 'daggy'
import { Free } from 'fantasy-frees'
const DO = F => Free.liftFC(F)

export const ToChatStatus = taggedSum('ChatStatus', {
    notLogin: [],
    externalLink: ['link'],
    existSameJob: [],
    existDiffrentJob: [],
    notExist: []
})
export const Actions = taggedSum('ChatNowActions', {
    parseToChatStatus: [],
    redirectToLogin: [],
    redirectToExternal: ['link'],
    modalChangeChattingJob: [],
    redirectToChat: ['chatId'],
    requestChangeJob: [],
    createNewChat: []
})

export const chatNowScript = () => DO(Actions.parseToChatStatus)
    .chain(status => status.cata({
        notLogin: () => DO(Actions.redirectToLogin),
        externalLink: link => DO(Actions.redirectToExternal(link)),
        existSameJob: chatId => DO(Actions.redirectToChat(chatId)),
        existDiffrentJob: () => DO(Actions.modalChangeChattingJob),
        notExist: () => DO(Actions.createNewChat)
            .chain(chatId => DO(Actions.redirectToChat(chatId)))
    }))

export const switchJob = chatId => DO(Actions.requestChangeJob)
    .andThen(DO(redirectToChat(chatId)))
