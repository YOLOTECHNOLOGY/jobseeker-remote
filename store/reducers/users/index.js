import { combineReducers } from 'redux'

import registerUserReducer from './registerUser'

const usersReducers = combineReducers({
  registerUser: registerUserReducer,
})

export default usersReducers
