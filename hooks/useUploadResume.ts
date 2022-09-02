import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
/* Redux Actions */
import { uploadUserResumeRequest } from 'store/actions/users/uploadUserResume'
import { maxFileSize } from '../helpers/handleInput'

const Step2 = (props: any) => {
  const currentStep = 2
  const router = useRouter()
  const dispatch = useDispatch()
  const { userDetail, accessToken } = props
  const redirect = router.query?.redirect
    ? `/jobseeker-complete-profile/1101?redirect=${router.query.redirect}`
    : '/jobseeker-complete-profile/1101'

  const [resume, setResume] = useState(null)
  const existingResume = userDetail?.resume || null
  const [isDisabled, setIsDisabled] = useState(userDetail.resume ? false : true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isCreatingResume, setIsCreatingResume] = useState(false)
  const [isDoneUpdating, setIsDoneUpdating] = useState(false)

  const isUploading = useSelector((store: any) => store.users.uploadUserResume.fetching)
  const uploadUserResumeState = useSelector((store: any) => store.users.uploadUserResume)

  useEffect(() => {
    if (uploadUserResumeState.error?.errors?.file[0]) {
      setErrorMessage(uploadUserResumeState.error.errors.file[0])
    }
  }, [uploadUserResumeState])

  useEffect(() => {
    if (resume) {
      if (maxFileSize(resume, 5)) {
        setErrorMessage('')
        if (localStorage.getItem('isCreateFreeResume'))
          localStorage.removeItem('isCreateFreeResume')
        setIsDoneUpdating(true)

        const payload = {
          redirect,
          resume,
          accessToken
        }
        dispatch(uploadUserResumeRequest(payload))
      } else {
        setErrorMessage('File size is too huge. Please upload file that is within 5MB.')
      }

      setIsDisabled(false)
    }
  }, [resume])

  return {
    existingResume,
    isDisabled,
    errorMessage,
    isCreatingResume,
    setIsCreatingResume,
    isDoneUpdating,
    isUploading,
    setResume,
    resume,
    currentStep,
    redirect
  }
}

export default Step2
