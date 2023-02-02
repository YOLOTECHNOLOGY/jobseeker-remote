import { combineReducers } from 'redux'

import defaultChatList from './defatultChatList'
import imState from './imState'
const companiesReducers = combineReducers({
    defaultChatList,
    imState
})

export default companiesReducers