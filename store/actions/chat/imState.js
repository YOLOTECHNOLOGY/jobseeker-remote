import {
    UPDATE_IM_STATE,

} from 'store/types/chat/imState'

const updateImState = (payload) => ({
    type: UPDATE_IM_STATE,
    payload,
})


export { updateImState }