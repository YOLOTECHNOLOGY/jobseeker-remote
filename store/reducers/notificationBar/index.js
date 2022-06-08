import { combineReducers } from 'redux'

import notificationBarReducer from './notificationBar'

const notificationBarReducers = combineReducers({
    notification: notificationBarReducer
})

export default notificationBarReducers
