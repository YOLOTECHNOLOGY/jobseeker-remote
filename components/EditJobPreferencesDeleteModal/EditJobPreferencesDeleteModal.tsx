import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'components/Modal'
import { updateUserPreferencesRequest } from 'store/actions/users/updateUserPreferences'

type EditJobPreferencesDeleteModalProps = {
  modalName: string
  showModal: boolean
  config: any
  userDetail: any
  handleModal: Function
  preference: any
}

const EditJobPreferencesDeleteModal = ({
  modalName,
  showModal,
  userDetail,
  handleModal,
  preference
}: EditJobPreferencesDeleteModalProps) => {
  const dispatch = useDispatch()
  const isUpdating = useSelector((store: any) => store.users.updateUserPreferences.fetching)
  const onSubmit = () => {
    const payload = {
      preferences: {
        action:'delete',
        preferenceId:preference.id,
      }
    }
    
    dispatch(updateUserPreferencesRequest(payload))
  }
  useEffect(() => {
    handleCloseModal()
  }, [userDetail])
  const handleCloseModal = () => {
    handleModal(modalName, false)
  }

  return (
    <Modal
      showModal={showModal}
      handleModal={handleModal}
      headerTitle='Delete job preference'
      firstButtonText='Cancel'
      secondButtonText='Delete'
      isSecondButtonLoading={isUpdating}
      firstButtonIsClose
      handleFirstButton={handleModal}
      handleSecondButton={onSubmit}
      fullScreen
    >
      You are about to delete this job preference. This cannot be undone.
    </Modal>
  )
}

export default EditJobPreferencesDeleteModal
