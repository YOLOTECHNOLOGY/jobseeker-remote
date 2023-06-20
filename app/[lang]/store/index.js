// @ts-nocheck
import { applyMiddleware, createStore } from 'redux'
import { createWrapper } from 'next-redux-wrapper'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from 'store/reducers'
import logger from 'redux-logger'
import rootSaga from 'store/sagas'
import createSagaMiddleware from 'redux-saga'

const persistConfig = {
  key: 'chat',
  storage,
  writeFailHandler: error => {
    console.log('persistFail', error)
  },
  whitelist: ['chat'],
  stateReconciler: (localState, state, mergedState) => {
    const result = { ...mergedState }
    result.chat = localState?.chat
    return result
  }
}
const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware
      , process.env.ENV === 'development' && logger
    ))
  }
  return applyMiddleware(...middleware)
}
export let persistor
export const configureStore = () => {
  const persistedReducer = persistReducer(persistConfig, rootReducer)
  const sagaMiddleware = createSagaMiddleware()

  const initialState = {}


  const store = createStore(persistedReducer, initialState, bindMiddleware([sagaMiddleware]))
  store.sagaTask = sagaMiddleware.run(rootSaga)
  persistor = persistStore(store)

  store.persistor = persistor
  return store
}

export const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development'
})
