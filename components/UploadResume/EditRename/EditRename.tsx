import { useState, MouseEvent, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { isMobile } from 'react-device-detect'
// Mui components
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
// Icon
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
// Components
import Text from 'components/Text'
import Modal from 'components/Modal'
import MaterialTextField from 'components/MaterialTextField'
// Server
import { fetchRenameResumes, fetchSendResumeEmail } from 'store/services/jobs/fetchJobsCommunicated'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
// Style
import styles from './EditRename.module.scss'
import { getCookie } from 'helpers/cookies'
import { Alert, AlertColor, Snackbar } from '@mui/material'
import { fetchResumeDelete } from 'store/services/auth/fetchResumeDelete'

type propsType = {
  id: number
  name: string
  deleteResumeLoading: boolean
  handleDeleteResume: () => void
}

const EditRename = ({ id, name }: propsType) => {
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [showRenameModal, setShowRenameModal] = useState<boolean>(false)
  const [showSendMailModal, setShowSendMailModal] = useState<boolean>(false)
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false)
  const [showConfirmEmailModal, setShowConfirmEmailModal] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)

  const [showSnackbarModal, setShowSnackbarModal] = useState<boolean>(false)
  const [snackbarContent, setSnackbarContent] = useState<string>(
    'Resume has been renamed successfully'
  )
  const [snackbarType, setSnackbarType] = useState<AlertColor>('success')

  const [email, setEmail] = useState<string>('')
  const open = Boolean(anchorEl)

  const {
    // setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      mail: null
    }
  })

  const {
    setValue: reNameSetValue,
    register: reNameRegister,
    handleSubmit: reNameHandleSubmit,
    formState: { errors: reNameErrors }
  } = useForm({
    defaultValues: {
      reName: name.slice(0, name.lastIndexOf('.'))
    }
  })

  useEffect(() => {
    if (showRenameModal) {
      reNameSetValue('reName', name.slice(0, name.lastIndexOf('.')))
    }
  }, [showRenameModal])

  // useEffect(() => {
  //   if (showSendMailModal) {
  //     setValue('mail', null)
  //   }
  // }, [showSendMailModal])

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleCloseModal = () => {
    setShowRenameModal(false)
    setShowSendMailModal(false)
    setShowConfirmEmailModal(false)
    setShowMobileMenu(false)
  }

  const handleShowRenameModal = () => {
    handleCloseMenu()
    setShowRenameModal(true)
  }

  const handleShowSendMailModal = () => {
    handleCloseMenu()
    setShowSendMailModal(true)
  }

  const handleRename = ({ reName }: any) => {
    console.log('========>>////')
    setIsLoading(true)
    const type = name.slice(name.lastIndexOf('.'), name.length)

    const payload = {
      filename: reName + type,
      id
    }

    fetchRenameResumes(payload)
      .then(({ status }) => {
        if (status === 200) {
          handleRefreshResume()
          handleCloseModal()
          handleSnackbarContent('reName', 'success')
        }
      })
      .catch(({ response: { data } }) => {
        if (data.code) {
          console.log(data.code, '报错number')
          handleSnackbarContent('reName', 'warning', data.code)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleRefreshResume = () => {
    const accessToken = getCookie('accessToken')
    dispatch(fetchUserOwnDetailRequest({ accessToken }))
  }

  const handleConfirmMail = ({ mail }) => {
    setEmail(mail)
    setShowSendMailModal(false)
    setShowConfirmEmailModal(true)
  }

  const handleSendResumeToMail = () => {
    setIsLoading(true)
    const payload = {
      email,
      id
    }

    fetchSendResumeEmail(payload)
      .then(({ status }) => {
        console.log(status, 'status')
        if (status === 200) {
          handleCloseModal()
          handleSnackbarContent('mail', 'success')
        }
      })
      .catch(({ response: { data } }) => {
        if (data.code) {
          console.log(data.code, '报错number')
          handleSnackbarContent('mail', 'warning', data.code)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleFetchDeleteResume = () => {
    setIsDisabled(true)
    fetchResumeDelete(id)
      .then(({ status }) => {
        if (status === 200) {
          handleRefreshResume()
          handleSnackbarContent('delete', 'success')
        }
      })
      .catch(({ response: { data } }) => {
        if (data.code) {
          console.log(data.code, '报错number')
          handleSnackbarContent('delete', 'warning', data.code)
        }
      })
      .finally(() => {
        setIsDisabled(true)
        // setDeleteResumeLoading(false)
      })
  }

  const handleCloseMobileMenuModal = () => {
    setShowMobileMenu(false)
  }

  const errorText = (errorMessage: any) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='p'>
        {errorMessage}
      </Text>
    )
  }

  const handleConfirmBack = () => {
    setShowConfirmEmailModal(false)
    setShowSendMailModal(true)
  }

  const handleSnackbarContent = (
    type: 'reName' | 'mail' | 'delete',
    severity: AlertColor,
    errorCode?
  ) => {
    if (type == 'reName' && severity == 'success') {
      setSnackbarContent('Resume has been rename successfully')
    } else if (type == 'mail' && severity == 'success') {
      setSnackbarContent('Resume has been sent to your email successfully')
    } else if (type == 'delete' && severity == 'success') {
      setSnackbarContent('Resume has been deleted successfully')
    }

    if (severity) {
      setSnackbarType(severity)
    }

    setShowSnackbarModal(true)
  }

  return (
    <div className={styles.editRename}>
      {/* Init dom */}
      <IconButton
        aria-label='delete'
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={isMobile ? () => setShowMobileMenu(true) : handleClick}
      >
        <MoreHorizIcon />
      </IconButton>

      {/* Menu */}
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleShowRenameModal}>Rename</MenuItem>
        <MenuItem onClick={handleShowSendMailModal}>Send to email</MenuItem>
        <MenuItem onClick={handleFetchDeleteResume} disabled={isDisabled}>
          Delete
        </MenuItem>
      </Menu>

      {/* Rename */}
      <Modal
        showModal={showRenameModal}
        handleModal={handleCloseModal}
        headerTitle='Send to email'
        firstButtonText='Cancel'
        secondButtonText='Save'
        isSecondButtonLoading={isLoading}
        firstButtonIsClose
        handleFirstButton={handleCloseModal}
        handleSecondButton={reNameHandleSubmit(handleRename)}
        fullScreen
      >
        <p>Please rename your resume file.</p>
        <MaterialTextField
          refs={{
            ...reNameRegister('reName', {
              required: {
                value: true,
                message: 'Please rename your resume file.'
              },
              maxLength: { value: 30, message: 'Maximum length limit exceeded' },
              pattern: {
                value: /^\S.*\S$|(^\S{0,1}\S$)/,
                message: '不可以输入特殊字符'
              }
            })
          }}
          className={styles.editRename_renameField}
          name='reName'
          label='Resume file name'
          variant='outlined'
          autoComplete='off'
          error={reNameErrors.reName}
        />
        {reNameErrors.reName && errorText(reNameErrors.reName.message as any)}
      </Modal>

      {/* send */}
      <Modal
        showModal={showSendMailModal}
        handleModal={handleCloseModal}
        headerTitle='Send to email'
        firstButtonText='Cancel'
        secondButtonText='Send'
        isSecondButtonLoading={isLoading}
        firstButtonIsClose
        handleFirstButton={handleCloseModal}
        handleSecondButton={handleSubmit(handleConfirmMail)}
        fullScreen
      >
        <p> Please enter the email address to receive the resume.</p>
        <MaterialTextField
          refs={{
            ...register('mail', {
              required: {
                value: true,
                message: ' Please enter the email address to receive the resume.'
              },
              maxLength: { value: 30, message: 'Maximum length limit exceeded' },
              pattern: {
                value: /^[\w-\\.]+@([\w-]+\.)+[\w-]{1,9}$/i,
                message: 'E-mail format is incorrect'
              }
            })
          }}
          className={styles.editRename_renameField}
          name='mail'
          label='Email address'
          variant='outlined'
          autoComplete='off'
          error={errors.mail}
        />
        {errors.mail && errorText(errors.mail.message as any)}
      </Modal>

      {/* Confirm Email */}
      <Modal
        showModal={showConfirmEmailModal}
        handleModal={handleCloseModal}
        headerTitle='Send to email'
        firstButtonText='Back'
        secondButtonText='Confirm'
        isSecondButtonLoading={isLoading}
        handleFirstButton={handleConfirmBack}
        handleSecondButton={handleSendResumeToMail}
        fullScreen
      >
        <p>
          The email address you want to send is {email}, Please confirm that your email address is
          correct before sending
        </p>
      </Modal>

      {/* Mobile Menu */}
      <Modal
        showModal={showMobileMenu}
        handleModal={handleCloseMobileMenuModal}
        headerTitle='More'
        fullScreen
      >
        <MenuItem onClick={handleShowRenameModal}>Rename</MenuItem>
        <MenuItem onClick={handleShowSendMailModal}>Send to email</MenuItem>
        <MenuItem onClick={handleFetchDeleteResume} disabled={isDisabled}>
          Delete
        </MenuItem>
      </Modal>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={showSnackbarModal}
        onClose={() => setShowSnackbarModal(false)}
        key='resumeDelete'
      >
        <Alert onClose={() => setShowSnackbarModal(false)} severity={snackbarType}>
          {snackbarContent}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default EditRename
