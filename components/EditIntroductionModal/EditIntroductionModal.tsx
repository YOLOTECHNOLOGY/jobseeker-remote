import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import Modal from 'components/Modal'
import TextEditor from 'components/TextEditor/TextEditor'
import { updateUserPreferencesRequest } from 'store/actions/users/updateUserPreferences'
import styles from './EditIntroductionModal.module.scss'

type EditIntroductionModalProps = {
  modalName: string
  showModal: boolean
  userDetail: any
  lang: any
  handleModal: Function
}

const EditIntroductionModal = ({
  modalName,
  showModal,
  userDetail,
  handleModal,
  lang
}: EditIntroductionModalProps) => {
  const dispatch = useDispatch()
  const isUpdating = useSelector((store: any) => store.users.updateUserPreferences.fetching)
  const [description, setDescription] = useState('')

  const {
    handleSubmit,
    setValue,
    reset
  } = useForm({
    defaultValues: {
      description: ''
    }
  })
  // translate maps
  const langProfile = lang.manageProfile.tab.profile
  console.log('langProfile:', langProfile)
  useEffect(() => {
    if (userDetail && userDetail.description) {
      // setAvailability(userDetail.notice_period_id)
      // setValue('noticePeriod', userDetail.notice_period_id)
      setDescription(userDetail.description)
    }
  }, [userDetail])
  const onSubmit = (data) => {
    const { noticePeriod } = data // jobType is a key

    const payload = {
      profile: {
        description
      }
    }

    dispatch(updateUserPreferencesRequest(payload))
  }

  useEffect(() => {
    handleCloseModal()

  }, [userDetail])
  const handleCloseModal = () => {
    handleModal(modalName, false)
    reset()
  }
  const modalJobPreferenceContent = (
    <div className={styles.jobPreferences}>
      <div className={styles.jobPreferencesForm}>
        <div className={styles.jobPreferencesFormGroup}>
          <div className={styles.editor}>
            <TextEditor
              placeholder="请输入"
              value={description}
              setValue={setDescription}
            />
          </div>
        </div>

      </div>
    </div>
  )
  return (
    <Modal
      showModal={showModal}
      handleModal={handleCloseModal}
      headerTitle={langProfile?.introdutionModal?.title}
      firstButtonText={langProfile?.introdutionModal?.btn1}
      secondButtonText={langProfile?.introdutionModal?.btn2}
      isSecondButtonLoading={isUpdating}
      firstButtonIsClose
      handleFirstButton={handleCloseModal}
      handleSecondButton={handleSubmit(onSubmit)}
      fullScreen
    >
      {modalJobPreferenceContent}
    </Modal>
  )
}

export default EditIntroductionModal
