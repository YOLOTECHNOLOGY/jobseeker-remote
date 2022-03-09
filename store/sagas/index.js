import { all } from 'redux-saga/effects'

// Config
import watchFetchConfig from 'store/sagas/config/fetchConfig'

// Job
import watchFetchJobsList from 'store/sagas/jobs/fetchJobsList'
import watchFetchJobDetail from 'store/sagas/jobs/fetchJobDetail'
import watchFetchSimilarJobs from 'store/sagas/jobs/fetchSimilarJobs'

import watchFetchAppliedJobsList from 'store/sagas/jobs/fetchAppliedJobsList'
import watchFetchAppliedJobDetail from 'store/sagas/jobs/fetchAppliedJobDetail'
import watchWithdrawAppliedJob from 'store/sagas/jobs/withdrawAppliedJob'

import watchFetchSavedJobsList from 'store/sagas/jobs/fetchSavedJobsList'
import watchFetchSavedJobDetail from 'store/sagas/jobs/fetchSavedJobDetail'
import watchPostSaveJob from 'store/sagas/jobs/postSaveJob'
import watchDeleteSaveJob from 'store/sagas/jobs/deleteSaveJob'

// Companies 
import watchFetchFeaturedCompanies from 'store/sagas/companies/fetchFeaturedCompanies'
import watchFetchCompanyDetail from 'store/sagas/companies/fetchCompanyDetail'
import watchFetchFeaturedCompaniesList from 'store/sagas/companies/fetchFeaturedCompaniesList'
import watchFetchSimilarCompany from 'store/sagas/companies/fetchSimilarCompany'

// Reports 
import watchPostReport from 'store/sagas/reports/postReport'

// Alerts 
import watchFetchJobAlertsList from 'store/sagas/alerts/fetchJobAlertsList'
import watchUpdateJobAlert from 'store/sagas/alerts/updateJobAlert'
import watchDeleteJobAlert from 'store/sagas/alerts/deleteJobAlert'
import watchCreateJobAlert from 'store/sagas/alerts/createJobAlert'

// Users 
import watchRegisterUser from 'store/sagas/users/registerUser'

// Auth
import watchSocialLogin from 'store/sagas/auth/socialLogin'
import watchLogin from 'store/sagas/auth/login'
import watchCheckResetPasswordCode from 'store/sagas/auth/checkResetPasswordCode'
import watchSendResetPasswordCode from 'store/sagas/auth/sendResetPasswordCode'

import watchResetPassword from 'store/sagas/auth/resetPassword'
import watchRegisterJobseeker from 'store/sagas/auth/registerJobseeker'
import watchRegisterRecruiter from 'store/sagas/auth/registerRecruiter'

// Recruiters
import watchFetchRecruiterSubscriptionFeature from 'store/sagas/recruiters/fetchRecruiterSubscriptionFeature'

// Users 
import watchFetchRecommendedCourses from 'store/sagas/courses/fetchRecommendedCourses'

function* rootSaga() {
  yield all([
    watchFetchConfig(),
    watchFetchJobsList(),
    watchFetchJobDetail(),
    watchFetchSimilarJobs(),
    
    watchFetchFeaturedCompanies(),
    watchFetchCompanyDetail(),
    watchFetchFeaturedCompaniesList(),
    watchFetchSimilarCompany(),

    watchFetchAppliedJobsList(),
    watchFetchAppliedJobDetail(),
    watchWithdrawAppliedJob(),

    watchFetchSavedJobsList(),
    watchFetchSavedJobDetail(),
    watchPostSaveJob(),
    watchDeleteSaveJob(),
    
    watchPostReport(),

    watchFetchJobAlertsList(),
    watchUpdateJobAlert(),
    watchDeleteJobAlert(),
    watchCreateJobAlert(),

    watchRegisterUser(),

    watchSocialLogin(),
    watchLogin(),
    watchCheckResetPasswordCode(),
    watchSendResetPasswordCode(),
    watchResetPassword(),

    watchFetchRecruiterSubscriptionFeature(),

    watchRegisterJobseeker(),
    watchRegisterRecruiter(),

    watchFetchRecommendedCourses()
  ])
}

export default rootSaga
