import { useEffect, useState } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

/* Components */
import Text from 'components/Text'
import Modal from 'components/Modal'
import MaterialTextField from 'components/MaterialTextField'
import TextEditor from 'components/TextEditor/TextEditor'

/* Actions */
import { manageUserLinksRequest } from 'store/actions/users/manageUserLinks'

/* Helpers */
import { urlValidation } from 'helpers/formValidation'

/* Styles */
import styles from './EditLinkModal.module.scss'

type EditLinkModalProps = {
  modalName: string
  showModal: boolean
  linkData: any
  handleModal: Function
}

const EditLinkModal = ({
  modalName,
  showModal,
  linkData,
  handleModal
}: EditLinkModalProps) => {

  const dispatch = useDispatch()

  const [linkUrl, setLinkUrl] = useState(null)
  const [linkTitle, setLinkTitle] = useState('')
  const [linkDescription, setLinkDescription] = useState('')
  const [hasValidationError, setHasValidationError] = useState(true)

  const isUpdating = useSelector((store: any) => store.users.manageUserLinks.fetching)
  const updateLinkSuccess = useSelector(
    (store: any) => store.users.manageUserLinks.response
  )

  const requiredLabel = (text: string) => {
		return (
			<>
				<span>{text}</span>
				<span className={styles.fieldRequired}>*</span>
			</>
		)
	}

  const errorText = (errorMessage: string) => {
		return (
			<Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
				{errorMessage}
			</Text>
		)
	}

  const {
    handleSubmit
  } = useForm()

  const handleResetForm = () => {
    setLinkUrl(null)
    setLinkTitle('')
    setLinkDescription('')
    setHasValidationError(true)
  }

  const handleCloseModal = () => {
    handleModal(modalName, false)
    handleResetForm()
  }

  const onSubmit = () => {
    const data = {
      url: linkUrl
    }

    if (linkTitle && linkTitle.length > 0) {
      data['title'] = linkTitle
    }

    if (linkDescription && linkDescription.length > 0) {
      data['description'] = linkDescription
    }

    const linkPayload = {
      isUpdate: linkData ? true : false,
      linkId: linkData ? linkData.id : null,
      linkData: data
    }

    dispatch(manageUserLinksRequest(linkPayload))
  }

  const validateInput = () => {
    if (linkUrl?.length > 0 && !urlValidation(linkUrl)) {
      setHasValidationError(false)
    } else {
      setHasValidationError(true)
    }
  }

  useEffect(() => {
    if (linkData) {
      setLinkUrl(linkData.url)
      setLinkTitle(linkData.title)
      setLinkDescription(linkData.description)
      validateInput()
    }
  }, [linkData])

  useEffect(() => {
    handleCloseModal()
  }, [updateLinkSuccess])

  useEffect(() => {
    validateInput()
  }, [linkUrl])

  const editLinkModal = (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div id='form' className={styles.form}>
          <div className={styles.field}>
            <MaterialTextField
              className={styles.fullWidth}
              label={requiredLabel('URL')}
              size='small'
              variant='outlined'
              value={linkUrl}
              defaultValue={linkUrl}
              onClick={() => setLinkUrl('https://')}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          </div>
          {linkUrl && (
            errorText(urlValidation(linkUrl))
          )}
          <div className={styles.field}>
            <MaterialTextField
              className={styles.fullWidth}
              label={'Title of link'}
              variant='outlined'
              value={linkTitle}
              defaultValue={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
            />
          </div>
          <div className={styles.editor}>
            <TextEditor value={linkDescription} setValue={setLinkDescription} />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <Modal
        showModal={showModal}
        handleModal={handleCloseModal}
        headerTitle='Links'
        firstButtonText='Cancel'
        secondButtonText='Save'
        isSecondButtonLoading={isUpdating}
        isSecondButtonDisabled={hasValidationError}
        firstButtonIsClose
        handleFirstButton={handleCloseModal}
        handleSecondButton={handleSubmit(onSubmit)}
        fullScreen
      >
        {editLinkModal}
      </Modal>
    </div>
  )

}

export default EditLinkModal