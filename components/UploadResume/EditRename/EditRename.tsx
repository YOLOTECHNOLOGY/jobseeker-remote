import { useState, MouseEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
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
import MaterialButton from 'components/MaterialButton'
// Server
import { fetchRenameResumes, fetchSendResumeEmail } from 'store/services/jobs/fetchJobsCommunicated'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
// Style
import styles from './EditRename.module.scss'
import { getCookie } from 'helpers/cookies'
import { Alert, Snackbar } from '@mui/material'
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
  const [showConfirmEmailModal, setShowConfirmEmailModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [showSnackbarModal, setShowSnackbarModal] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const open = Boolean(anchorEl)

  const defaultValues = {
    reName: name.slice(0, name.lastIndexOf('.')),
    mail: null
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues
  })

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
          setShowSnackbarModal(true)
        }
      })
      .catch((error) => console.log(error))
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
          setShowConfirmEmailModal(false)
          setShowSnackbarModal(true)
        }
      })
      .catch(({ response: { data } }) => {
        if (data.code) {
          console.log(data.code, '报错number')
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
        }
      })
      .catch(({ response: { data } }) => {
        if (data.code) {
          console.log(data.code, '报错number')
        }
      })
      .finally(() => {
        setIsDisabled(true)
        // setDeleteResumeLoading(false)
      })
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

  return (
    <div className={styles.editRename}>
      <IconButton
        aria-label='delete'
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </IconButton>

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

      {/* rename */}
      <Modal
        showModal={showRenameModal}
        handleModal={handleCloseModal}
        headerTitle='Send to email'
        firstButtonText='Cancel'
        secondButtonText='Save'
        isSecondButtonLoading={isLoading}
        firstButtonIsClose
        handleFirstButton={handleCloseModal}
        handleSecondButton={handleSubmit(handleRename)}
        fullScreen
      >
        <p>Please rename your resume file.</p>
        <MaterialTextField
          refs={{
            ...register('reName', {
              required: {
                value: true,
                message: 'Please rename your resume file.'
              },
              maxLength: { value: 30, message: 'Maximum length limit exceeded' }
            })
          }}
          className={styles.editRename_renameField}
          name='reName'
          label='Resume file name'
          variant='outlined'
          autoComplete='off'
          error={errors.reName}
        />
        {errors.reName && errorText(errors.reName.message as any)}
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

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={showSnackbarModal}
        onClose={() => setShowSnackbarModal(false)}
        key='resumeDelete'
      >
        <Alert onClose={() => setShowSnackbarModal(false)} severity='success'>
          Resume has been renamed successfully
        </Alert>
      </Snackbar>
    </div>
  )
}

export default EditRename
