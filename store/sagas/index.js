import { all } from 'redux-saga/effects'

// Config
import watchFetchConfig from 'store/sagas/config/fetchConfig'

function* rootSaga() {
  yield all([
    watchFetchConfig(),
  ])
}

export default rootSaga
