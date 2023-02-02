import { all } from 'redux-saga/effects'

// Config
import watchFetchConfig from 'store/sagas/config/fetchConfig'

// Job
import watchFetchJobsList from 'store/sagas/jobs/fetchJobsList'
import watchFetchJobDetail from 'store/sagas/jobs/fetchJobDetail'
import watchFetchSimilarJobs from 'store/sagas/jobs/fetchSimilarJobs'
import watchFetchChatDetail from 'store/sagas/jobs/fetchChatDetail'
import watchFetchAppliedJobsList from 'store/sagas/jobs/fetchAppliedJobsList'
import watchFetchAppliedJobDetail from 'store/sagas/jobs/fetchAppliedJobDetail'
import watchWithdrawAppliedJob from 'store/sagas/jobs/withdrawAppliedJob'

import watchFetchSavedJobsList from 'store/sagas/jobs/fetchSavedJobsList'
import watchFetchSavedJobDetail from 'store/sagas/jobs/fetchSavedJobDetail'
import watchPostSaveJob from 'store/sagas/jobs/postSaveJob'
import watchDeleteSaveJob from 'store/sagas/jobs/deleteSaveJob'
import watchQuickApplyJob from 'store/sagas/jobs/quickApplyJob'
import watchApplyJob from 'store/sagas/jobs/applyJob'

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
import watchRegisterUser from 'store/sagas/users/registerUser'
import watchUpdateUserOnboardingInfo from 'store/sagas/users/updateUserOnboardingInfo'
import watchFetchUserOwnDetail from 'store/sagas/users/fetchUserOwnDetail'
import watchFetchUserDetail from 'store/sagas/users/fetchUserDetail'
import watchUploadUserResume from 'store/sagas/users/uploadUserResume'
import watchGenerateUserResume from 'store/sagas/users/generateUserResume'
import watchFetchUserWorkExperience from 'store/sagas/users/fetchUserWorkExperience'
import watchFetchUserEducation from 'store/sagas/users/fetchUserEducation'
import watchRedirectToNewJobseeker from 'store/sagas/users/redirectToNewJobseeker'
import watchGenerateVerifyEmailOTP from 'store/sagas/users/generateVerifyEmailOTP'
import watchCheckVerifyEmailOTP from 'store/sagas/users/checkVerifyEmailOTP'
import watchUpdateUserProfile from 'store/sagas/users/updateUserProfile'
import watchUpdateUserPreferences from 'store/sagas/users/updateUserPreferences'
import watchManageUserWorkExperiences from 'store/sagas/users/manageUserWorkExperiences'
import watchManageUserEducations from 'store/sagas/users/manageUserEducations'
import watchManageUserLicensesAndCertifications from 'store/sagas/users/manageUserLicensesAndCertifications'
import watchManageUserLinks from 'store/sagas/users/manageUserLinks'
import watchJobHiredServerSide from 'store/sagas/jobs/jobHiredServerSide'
// Courses
import watchFetchRecommendedCourses from 'store/sagas/courses/fetchRecommendedCourses'

// Auth
import watchSocialLogin from 'store/sagas/auth/socialLogin'
import watchLogin from 'store/sagas/auth/login'
import watchCheckResetPasswordCode from 'store/sagas/auth/checkResetPasswordCode'
import watchSendResetPasswordCode from 'store/sagas/auth/sendResetPasswordCode'

import watchResetPassword from 'store/sagas/auth/resetPassword'
import watchRegisterJobseeker from 'store/sagas/auth/registerJobseeker'
import jobseekersLoginSaga from 'store/sagas/auth/jobseekersLogin'
import jobseekersSocialLoginSaga from 'store/sagas/auth/jobseekersSocialLogin'

import watchLogout from 'store/sagas/auth/logout'

// Recruiters
import watchFetchRecruiterSubscriptionFeature from 'store/sagas/recruiters/fetchRecruiterSubscriptionFeature'

function* rootSaga() {
  yield all([
    watchFetchConfig(),
    watchFetchJobsList(),
    watchFetchJobDetail(),
    watchFetchSimilarJobs(),
    watchFetchChatDetail(),
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
    watchApplyJob(),
    watchJobHiredServerSide(),
    watchPostReport(),

    watchFetchJobAlertsList(),
    watchUpdateJobAlert(),
    watchDeleteJobAlert(),
    watchCreateJobAlert(),

    watchRegisterUser(),
    watchUpdateUserOnboardingInfo(),
    watchFetchUserOwnDetail(),
    watchFetchUserDetail(),
    watchUploadUserResume(),
    watchGenerateUserResume(),
    watchFetchUserWorkExperience(),
    watchFetchUserEducation(),
    watchRedirectToNewJobseeker(),
    watchGenerateVerifyEmailOTP(),
    watchCheckVerifyEmailOTP(),
    watchUpdateUserProfile(),
    watchUpdateUserPreferences(),
    watchManageUserWorkExperiences(),
    watchManageUserEducations(),
    watchManageUserLicensesAndCertifications(),
    watchManageUserLinks(),

    watchSocialLogin(),
    watchLogin(),
    watchCheckResetPasswordCode(),
    watchSendResetPasswordCode(),
    watchResetPassword(),
    watchLogout(),

    watchFetchRecruiterSubscriptionFeature(),

    watchRegisterJobseeker(),

    watchFetchRecommendedCourses(),

    jobseekersLoginSaga(),
    jobseekersSocialLoginSaga()
  ])
}

export default rootSaga
