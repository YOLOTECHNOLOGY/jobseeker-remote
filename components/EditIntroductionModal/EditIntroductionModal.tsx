import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import Modal from 'components/Modal'
import { updateUserProfileRequest } from 'store/actions/users/updateUserProfile'
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
  const isUpdating = useSelector((store: any) => store.users.updateUserProfile.fetching)
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
  const onSubmit = () => {
    const payload = {
      description
    }
    dispatch(updateUserProfileRequest(payload))
  }
  const handleCloseModal = () => {
    handleModal(modalName, null, false)
    reset()
    // setDescription('')
  }

  useEffect(() => {
    handleCloseModal()
    reset()
  }, [userDetail])

  useEffect(() => {
    if (userDetail && userDetail.description) {
      // setAvailability(userDetail.notice_period_id)
      // setValue('noticePeriod', userDetail.notice_period_id)
      setDescription(userDetail.description)
    }
  }, [userDetail])

  const modalJobPreferenceContent = (
    <div className={styles.jobPreferences}>
      <div className={styles.jobPreferencesForm}>
        <div className={styles.jobPreferencesFormGroup}>
          <div className={styles.editor}>
            {/* <TextEditor
              placeholder="请输入"
              value={description}
              setValue={setDescription}
              className={styles.introductionEditor}
            /> */}
            <textarea
              className={styles.textarea}
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            ></textarea>
          </div>
        </div>

      </div>
    </div>
  )
  return (
    <Modal
      showModal={showModal}
      handleModal={handleCloseModal}
      headerTitle={langProfile?.introductionModal?.title}
      firstButtonText={langProfile?.introductionModal?.btn1}
      secondButtonText={langProfile?.introductionModal?.btn2}
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
