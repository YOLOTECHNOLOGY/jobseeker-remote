import { combineReducers } from 'redux'
import { HYDRATE } from 'next-redux-wrapper'

import navigationBarReducers from './navigationBar'
import configReducers from './config'
import utilityReducers from './utility'
import jobsReducers from './jobs'
import companiesReducers from './companies'
import reportsReducers from './reports'
import alertsReducers from './alerts'
import usersReducers from './users'
import coursesReducers from './courses'


// TODO: Import and List reducers here
const combinedReducer = combineReducers({
  navbar: navigationBarReducers,
  config: configReducers,
  utility: utilityReducers,
  job: jobsReducers,
  companies: companiesReducers,
  reports: reportsReducers,
  alerts: alertsReducers,
  users: usersReducers,
  courses: coursesReducers
})

/* 
  Note:
  Please note that your reducer must have the HYDRATE action handler. 
  HYDRATE action handler must properly reconciliate the hydrated state 
  on top of the existing state (if any).
*/
const rootReducer = (state, action) => {
  if (action.type === HYDRATE) {
    // Attention! This will overwrite client state!
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    }
    // preserve any client state on server when HYDRATE is triggered by doing so:
    return nextState
  } else {
    return combinedReducer(state, action)
  }
}

export default rootReducer
