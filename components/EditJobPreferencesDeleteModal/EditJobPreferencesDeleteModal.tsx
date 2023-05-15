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
  lang: Record<string, any>
}

const EditJobPreferencesDeleteModal = ({
  modalName,
  showModal,
  userDetail,
  handleModal,
  preference,
  lang
}: EditJobPreferencesDeleteModalProps) => {
  const {
    manageProfile: {
      tab: {
        preference: { deleteModal }
      }
    }
  } = lang
  const dispatch = useDispatch()
  const isUpdating = useSelector((store: any) => store.users.updateUserPreferences.fetching)
  const onSubmit = () => {
    const payload = {
      preferences: {
        action: 'delete',
        preferenceId: preference.id
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
      headerTitle={deleteModal.title}
      firstButtonText={deleteModal.btn1}
      secondButtonText={deleteModal.btn2}
      isSecondButtonLoading={isUpdating}
      firstButtonIsClose
      handleFirstButton={handleModal}
      handleSecondButton={onSubmit}
      fullScreen
    >
      {deleteModal.tips}
    </Modal>
  )
}

export default EditJobPreferencesDeleteModal
