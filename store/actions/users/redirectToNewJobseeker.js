import {
  REDIRECT_TO_NEW_JOBSEEKER_REQUEST,
  REDIRECT_TO_NEW_JOBSEEKER_SUCCESS,
  REDIRECT_TO_NEW_JOBSEEKER_FAILED
} from 'store/types/users/redirectToNewJobseeker'

const redirectToNewJobseekerRequest = (payload) => ({
  type: REDIRECT_TO_NEW_JOBSEEKER_REQUEST,
  payload,
})

const redirectToNewJobseekerSuccess = (payload) => ({
  type: REDIRECT_TO_NEW_JOBSEEKER_SUCCESS,
  payload,
})

const redirectToNewJobseekerFailed = (error) => ({
  type: REDIRECT_TO_NEW_JOBSEEKER_FAILED,
  error,
})

export { redirectToNewJobseekerRequest, redirectToNewJobseekerSuccess, redirectToNewJobseekerFailed }
