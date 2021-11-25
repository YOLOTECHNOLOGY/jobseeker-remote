import { all } from 'redux-saga/effects'

// Config
import watchFetchConfig from 'store/sagas/config/fetchConfig'

// Job
import watchFetchJobsList from 'store/sagas/jobs/fetchJobsList'

// Companies 
import watchFetchFeaturedCompanies from 'store/sagas/companies/fetchFeaturedCompanies'

function* rootSaga() {
  yield all([
    watchFetchConfig(),
    watchFetchJobsList(),
    watchFetchFeaturedCompanies(),
  ])
}

export default rootSaga
