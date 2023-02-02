import { UPDATE_DEFAULT_CHAT_LIST } from 'store/types/chat/defaultChatList.js'

const initialState = []

export default function defaultChatList(state = initialState, action) {
  switch (action.type) {
    case UPDATE_DEFAULT_CHAT_LIST:
      return [...action.payload.chatList]
    default:
      return [...state]
  }
}
