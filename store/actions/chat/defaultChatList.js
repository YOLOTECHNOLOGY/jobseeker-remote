import {
    UPDATE_DEFAULT_CHAT_LIST,

} from 'store/types/chat/defaultChatList'

const updateDefaultChatList = (payload) => ({
    type: UPDATE_DEFAULT_CHAT_LIST,
    payload,
})


export { updateDefaultChatList }