import { all } from 'redux-saga/effects'

// Config
import watchFetchConfig from 'store/sagas/config/fetchConfig'

// Job
import watchFetchJobsList from 'store/sagas/jobs/fetchJobsList'
import watchFetchJobDetail from 'store/sagas/jobs/fetchJobDetail'

// Companies 
import watchFetchFeaturedCompanies from 'store/sagas/companies/fetchFeaturedCompanies'
import watchFetchCompanyDetail from 'store/sagas/companies/fetchCompanyDetail'

// Reports 
import watchPostReport from 'store/sagas/reports/postReport'

// Alerts 
import watchFetchJobAlertsList from 'store/sagas/alerts/fetchJobAlertsList'
import watchUpdateJobAlert from 'store/sagas/alerts/updateJobAlert'
import watchDeleteJobAlert from 'store/sagas/alerts/deleteJobAlert'
import watchCreateJobAlert from 'store/sagas/alerts/createJobAlert'

function* rootSaga() {
  yield all([
    watchFetchConfig(),
    watchFetchJobsList(),
    watchFetchJobDetail(),
    watchFetchFeaturedCompanies(),
    watchFetchCompanyDetail(),
    
    watchPostReport(),

    watchFetchJobAlertsList(),
    watchUpdateJobAlert(),
    watchDeleteJobAlert(),
    watchCreateJobAlert()
  ])
}

export default rootSaga
