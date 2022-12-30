import { UPDATE_IM_STATE } from 'store/types/chat/imState'

const initialState = {}

export default function imState(state = initialState, action) {
    switch (action.type) {
        case UPDATE_IM_STATE:
            return { ...state, [action?.payload?.chatId]: action.payload.imState }

        default:
            return { ...state }
    }
}