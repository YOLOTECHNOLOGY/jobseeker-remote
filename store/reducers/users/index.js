import { combineReducers } from 'redux'

import registerUserReducer from './registerUser'
import updateUserCompleteProfileReducer from './updateUserCompleteProfile'

const usersReducers = combineReducers({
  registerUser: registerUserReducer,
  updateUserCompleteProfile: updateUserCompleteProfileReducer
})

export default usersReducers
