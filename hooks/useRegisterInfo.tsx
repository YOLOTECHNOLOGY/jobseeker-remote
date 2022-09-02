import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { SnackbarOrigin } from '@mui/material/Snackbar'
import { useRouter } from 'next/router'
export interface SnackbarType extends SnackbarOrigin {
  open: boolean
}

const useRegisterInfo = () => {
  const router = useRouter()
  const isLoading = useSelector((store: any) => store.users.uploadUserResume.fetching)
  const userInfo = useSelector((store: any) => store.auth.registerJobseeker.response)
  const uploadResumeFile = useSelector((store: any) => store.users.uploadUserResume.file)
  const fileResponse = useSelector((store: any) => store.users.uploadUserResume.response)
  const userWorkExperiences = useSelector(
    (store: any) => store.users.fetchUserWorkExperience.response
  )

  const [SnackbarState, setSnackbarState] = useState<SnackbarType>({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  })

  const { vertical, horizontal, open } = SnackbarState

  const handleSnackbarClose = () => {
    setSnackbarState({ vertical: 'top', horizontal: 'center', open: false })
  }

  const isShowRegisterInfo = () => {
    if (uploadResumeFile?.size || userWorkExperiences.length) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    if (fileResponse?.id) {
      // setItem('isFromCreateResume', '1')
      router.push('/jobseeker-complete-profile/1')
    }
  }, [fileResponse])

  return {
    vertical,
    horizontal,
    open,
    handleSnackbarClose,
    isLoading,
    uploadResumeFile,
    setSnackbarState,
    userInfo,
    userWorkExperiences,
    isShowRegisterInfo
  }
}

export default useRegisterInfo
