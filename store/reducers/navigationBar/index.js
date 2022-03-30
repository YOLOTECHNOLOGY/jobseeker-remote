import { combineReducers } from 'redux'

import toggleMenuReducer from './toggleMenu'

const navigationBarReducers = combineReducers({
  toggleMenu: toggleMenuReducer,
})

export default navigationBarReducers
