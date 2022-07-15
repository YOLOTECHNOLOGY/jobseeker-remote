import globalErrorReducer from "./globalError";

import { combineReducers } from 'redux'

const errorReducers = combineReducers({
    globalError: globalErrorReducer,
  })
  
export default errorReducers