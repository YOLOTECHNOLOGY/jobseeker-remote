import { useState } from 'react'
import { useSelector } from 'react-redux'
import { SnackbarOrigin } from '@mui/material/Snackbar'
export interface SnackbarType extends SnackbarOrigin {
  open: boolean
}

const QuickUploadResumeHook = () => {
  const isLoading = useSelector((store: any) => store.users.uploadUserResume.fetching)
  const uploadResumeFile = useSelector((store: any) => store.users.uploadUserResume.file)
  const [SnackbarState, setSnackbarState] = useState<SnackbarType>({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  })

  const { vertical, horizontal, open } = SnackbarState

  const handleSnackbarClose = () => {
    setSnackbarState({ vertical: 'top', horizontal: 'center', open: false })
  }

  return {
    vertical,
    horizontal,
    open,
    handleSnackbarClose,
    isLoading,
    uploadResumeFile,
    setSnackbarState
  }
}

export default QuickUploadResumeHook
