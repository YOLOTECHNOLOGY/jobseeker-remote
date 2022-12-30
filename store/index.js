import { applyMiddleware, createStore } from 'redux'
import { createWrapper } from 'next-redux-wrapper'
import createSagaMiddleware from 'redux-saga'
import { initialRouterState, createRouterMiddleware } from 'connected-next-router'
import Router from 'next/router'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from 'store/reducers'
import rootSaga from 'store/sagas'
// import logger from 'redux-logger'

const persistConfig = {
  key: 'root',
  storage,
}
const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware
     // ,logger
    ))
  }
  return applyMiddleware(...middleware)
}

export const configureStore = (context) => {
  const routerMiddleware = createRouterMiddleware()
  const sagaMiddleware = createSagaMiddleware()
  const persistedReducer = persistReducer(persistConfig, rootReducer)
  const { asPath } = context.ctx || Router.router || {}
  let initialState
  if (asPath) {
    initialState = {
      router: initialRouterState(asPath)
    }
  }

  const store = createStore(persistedReducer, initialState, bindMiddleware([sagaMiddleware, routerMiddleware]))
  const persistor = persistStore(store)
  store.sagaTask = sagaMiddleware.run(rootSaga)
  
  return {store,persistor}
}

export const wrapper = createWrapper(context => configureStore(context).store, {
  debug: process.env.NODE_ENV === 'development'
})
