import { useState, MouseEvent, useEffect, useContext } from 'react'
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
import { languageContext } from 'app/[lang]/components/providers/languageProvider'
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
  lang?: Record<string, any>
  displayClear: boolean
}

const EditRename = ({ id, name, lang, displayClear }: propsType) => {
  const dispatch = useDispatch()
  const {
    errorcode,
    manageProfile: {
      tab: {
        resume: { changeResume: transitions }
      }
    }
  } = lang || (useContext(languageContext) as any)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [showRenameModal, setShowRenameModal] = useState<boolean>(false)
  const [showSendMailModal, setShowSendMailModal] = useState<boolean>(false)
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false)
  const [showConfirmEmailModal, setShowConfirmEmailModal] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(!displayClear)

  const [showSnackbarModal, setShowSnackbarModal] = useState<boolean>(false)
  const [snackbarContent, setSnackbarContent] = useState<string>(
    transitions.resumeHasBeenRenameSuccessfully
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
    setIsDisabled(!displayClear)
  }, [displayClear])

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
        if (status === 200) {
          handleCloseModal()
          handleSnackbarContent('mail', 'success')
        }
      })
      .catch(({ response: { data } }) => {
        if (data.code) {
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
          handleCloseMenu()
        }
      })
      .catch(({ response: { data } }) => {
        if (data.code) {
          handleSnackbarContent('delete', 'warning', data.code,data.message)
        }
      })
      .finally(() => {
        setIsDisabled(false)
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
    errorCode?,
    message?
  ) => {
    if (type == 'reName' && severity == 'success') {
      setSnackbarContent(transitions.resumeHasBeenRenameSuccessfully)
    } else if (type == 'mail' && severity == 'success') {
      setSnackbarContent(transitions.resumeHasBeenSentToYourEmailSuccessfully)
    } else if (type == 'delete' && severity == 'success') {
      setSnackbarContent(transitions.resumeHasBeenDeletedSuccessfully)
    }

    if (errorCode) {
      setSnackbarContent(errorcode[errorCode] || message)
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
        <MenuItem onClick={handleShowRenameModal}>{transitions.rename}</MenuItem>
        <MenuItem onClick={handleShowSendMailModal}>{transitions.sendToEmail}</MenuItem>
        <MenuItem onClick={handleFetchDeleteResume} disabled={isDisabled}>
          {transitions.delete}
        </MenuItem>
      </Menu>

      {/* Rename */}
      <Modal
        showModal={showRenameModal}
        handleModal={handleCloseModal}
        headerTitle={transitions.sendToEmail}
        firstButtonText={transitions.cancel}
        secondButtonText={transitions.save}
        isSecondButtonLoading={isLoading}
        firstButtonIsClose
        handleFirstButton={handleCloseModal}
        handleSecondButton={reNameHandleSubmit(handleRename)}
        fullScreen
      >
        <p>{transitions.pleaseRenameYourResumeFile}</p>
        <MaterialTextField
          refs={{
            ...reNameRegister('reName', {
              required: {
                value: true,
                message: transitions.pleaseRenameYourResumeFile
              },
              maxLength: { value: 30, message: transitions.maximumLengthLimitExceeded },
              pattern: {
                value: /^\S.*\S$|(^\S{0,1}\S$)/,
                message: transitions.cannotEnterSpecialCharacters
              }
            })
          }}
          className={styles.editRename_renameField}
          name='reName'
          label={transitions.resumeFileName}
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
        headerTitle={transitions.sendToEmail}
        firstButtonText={transitions.cancel}
        secondButtonText={transitions.send}
        isSecondButtonLoading={isLoading}
        firstButtonIsClose
        handleFirstButton={handleCloseModal}
        handleSecondButton={handleSubmit(handleConfirmMail)}
        fullScreen
      >
        <p> {transitions.pleaseEnterTheEmailAddressToReceiveTheResume}</p>
        <MaterialTextField
          refs={{
            ...register('mail', {
              required: {
                value: true,
                message: transitions.pleaseEnterTheEmailAddressToReceiveTheResume
              },
              maxLength: { value: 30, message: transitions.maximumLengthLimitExceeded },
              pattern: {
                value: /^[\w-\\.]+@([\w-]+\.)+[\w-]{1,9}$/i,
                message: transitions.eMailFormatIsIncorrect
              }
            })
          }}
          className={styles.editRename_renameField}
          name='mail'
          label={transitions.emailAddress}
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
        headerTitle={transitions.sendToEmail}
        firstButtonText={transitions.back}
        secondButtonText={transitions.confirm}
        isSecondButtonLoading={isLoading}
        handleFirstButton={handleConfirmBack}
        handleSecondButton={handleSendResumeToMail}
        fullScreen
      >
        <p>
          {transitions.theEmailAddressYouWantToSendIs}{' '}
          <span style={{ color: '#2378E5' }}>{email}</span>,
          {transitions.pleaseConfirmThatYourEmailAddressIsCorrectBeforeSending}
        </p>
      </Modal>

      {/* Mobile Menu */}
      <Modal
        showModal={showMobileMenu}
        handleModal={handleCloseMobileMenuModal}
        headerTitle={transitions.more}
        fullScreen
      >
        <MenuItem onClick={handleShowRenameModal}>{transitions.rename}</MenuItem>
        <MenuItem onClick={handleShowSendMailModal}>{transitions.sendToEmail}</MenuItem>
        <MenuItem onClick={handleFetchDeleteResume} disabled={isDisabled}>
          {transitions.delete}
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
