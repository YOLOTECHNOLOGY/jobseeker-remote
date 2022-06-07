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
import watchQuickApplyJob from 'store/sagas/jobs/quickApplyJob'

// Companies
import watchFetchCompanyDetail from 'store/sagas/companies/fetchCompanyDetail'
import watchFetchFeaturedCompaniesList from 'store/sagas/companies/fetchFeaturedCompaniesList'
import watchFetchSimilarCompany from 'store/sagas/companies/fetchSimilarCompany'
import watchFetchCompanySuggestions from 'store/sagas/companies/fetchCompanySuggestions'
import watchFetchCompanyFilter from 'store/sagas/companies/fetchCompanyFilter'

// Reports
import watchPostReport from 'store/sagas/reports/postReport'

// Alerts
import watchFetchJobAlertsList from 'store/sagas/alerts/fetchJobAlertsList'
import watchUpdateJobAlert from 'store/sagas/alerts/updateJobAlert'
import watchDeleteJobAlert from 'store/sagas/alerts/deleteJobAlert'
import watchCreateJobAlert from 'store/sagas/alerts/createJobAlert'

// Users
import WatchRegisterUser from 'store/sagas/users/registerUser'
import WatchUpdateUserCompleteProfile from 'store/sagas/users/updateUserCompleteProfile'
import watchFetchUserOwnDetail from 'store/sagas/users/fetchUserOwnDetail'
import watchUploadUserResume from 'store/sagas/users/uploadUserResume'
import watchGenerateUserResume from 'store/sagas/users/generateUserResume'
import watchFetchUserWorkExperience from 'store/sagas/users/fetchUserWorkExperience'
import watchFetchUserEducation from 'store/sagas/users/fetchUserEducation'
import watchRedirectToNewJobseeker from 'store/sagas/users/redirectToNewJobseeker'
import watchGenerateVerifyEmailOTP from 'store/sagas/users/generateVerifyEmailOTP'
import watchCheckVerifyEmailOTP from 'store/sagas/users/checkVerifyEmailOTP'

// Courses
import watchFetchRecommendedCourses from 'store/sagas/courses/fetchRecommendedCourses'

// Auth
import watchSocialLogin from 'store/sagas/auth/socialLogin'
import watchLogin from 'store/sagas/auth/login'
import watchCheckResetPasswordCode from 'store/sagas/auth/checkResetPasswordCode'
import watchSendResetPasswordCode from 'store/sagas/auth/sendResetPasswordCode'

import watchResetPassword from 'store/sagas/auth/resetPassword'
import watchRegisterJobseeker from 'store/sagas/auth/registerJobseeker'

import watchLogout from 'store/sagas/auth/logout'

// Recruiters
import watchFetchRecruiterSubscriptionFeature from 'store/sagas/recruiters/fetchRecruiterSubscriptionFeature'

function* rootSaga() {
  yield all([
    watchFetchConfig(),
    watchFetchJobsList(),
    watchFetchJobDetail(),
    watchFetchSimilarJobs(),

    watchFetchCompanyDetail(),
    watchFetchFeaturedCompaniesList(),
    watchFetchSimilarCompany(),
    watchFetchCompanySuggestions(),
    watchFetchCompanyFilter(),

    watchFetchAppliedJobsList(),
    watchFetchAppliedJobDetail(),
    watchWithdrawAppliedJob(),

    watchFetchSavedJobsList(),
    watchFetchSavedJobDetail(),
    watchPostSaveJob(),
    watchDeleteSaveJob(),
    watchQuickApplyJob(),

    watchPostReport(),

    watchFetchJobAlertsList(),
    watchUpdateJobAlert(),
    watchDeleteJobAlert(),
    watchCreateJobAlert(),

    WatchRegisterUser(),
    WatchUpdateUserCompleteProfile(),
    watchFetchUserOwnDetail(),
    watchUploadUserResume(),
    watchGenerateUserResume(),
    watchFetchUserWorkExperience(),
    watchFetchUserEducation(),
    watchRedirectToNewJobseeker(),
    watchGenerateVerifyEmailOTP(),
    watchCheckVerifyEmailOTP(),

    watchSocialLogin(),
    watchLogin(),
    watchCheckResetPasswordCode(),
    watchSendResetPasswordCode(),
    watchResetPassword(),
    watchLogout(),

    watchFetchRecruiterSubscriptionFeature(),

    watchRegisterJobseeker(),

    watchFetchRecommendedCourses(),
  ])
}

export default rootSaga
