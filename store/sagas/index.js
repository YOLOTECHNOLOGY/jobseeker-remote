import { all } from 'redux-saga/effects'

// Config
import watchFetchConfig from 'store/sagas/config/fetchConfig'

// Job
import watchFetchJobsList from 'store/sagas/jobs/fetchJobsList'

function* rootSaga() {
  yield all([
    watchFetchConfig(),
    watchFetchJobsList(),
  ])
}

export default rootSaga
