import { combineReducers } from 'redux'
import { HYDRATE } from 'next-redux-wrapper'
import { routerReducer } from 'connected-next-router'

import navigationBarReducers from './navigationBar'
import notificationBarReducers from './notificationBar'
import configReducers from './config'
import utilityReducers from './utility'
import jobsReducers from './jobs'
import companiesReducers from './companies'
import reportsReducers from './reports'
import alertsReducers from './alerts'
import usersReducers from './users'
import authReducers from './auth'
import recruitersReducers from './recruiters'
import coursesReducers from './courses'
import modalReducers from './modals'


// TODO: Import and List reducers here
const combinedReducer = combineReducers({
  navbar: navigationBarReducers,
  notificationbar: notificationBarReducers,
  config: configReducers,
  utility: utilityReducers,
  job: jobsReducers,
  companies: companiesReducers,
  reports: reportsReducers,
  alerts: alertsReducers,
  users: usersReducers,
  auth: authReducers,
  recruiters: recruitersReducers,
  router: routerReducer,
  courses: coursesReducers,
  modal: modalReducers
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
    if (typeof window !== 'undefined' && state?.router) {
      // preserve router value on client side navigation
      nextState.router = state.router
    }
    // preserve any client state on server when HYDRATE is triggered by doing so:
    return nextState
  } else {
    return combinedReducer(state, action)
  }
}

export default rootReducer
