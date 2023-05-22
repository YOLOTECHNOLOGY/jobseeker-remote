import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import Modal from 'components/Modal'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import { getNoticePeriodList } from 'helpers/jobPayloadFormatter'
import { updateUserPreferencesRequest } from 'store/actions/users/updateUserPreferences'
import styles from './EditJobPreferencesAvailabilityModal.module.scss'

type EditJobPreferencesAvailabilityModalProps = {
  modalName: string
  showModal: boolean
  config: any
  userDetail: any
  lang: any
  handleModal: Function
}

const EditJobPreferencesAvailabilityModal = ({
  modalName,
  showModal,
  config,
  userDetail,
  handleModal,
  lang
}: EditJobPreferencesAvailabilityModalProps) => {
  const preferredAvailability = userDetail?.notice_period_id
  const dispatch = useDispatch()
  const [availability, setAvailability] = useState(preferredAvailability || null)

  const isUpdating = useSelector((store: any) => store.users.updateUserPreferences.fetching)
  const noticeList = getNoticePeriodList(config)
  const {
    register,
    handleSubmit,
    setValue,
    reset
  } = useForm({
    defaultValues: {
      noticePeriod: preferredAvailability
    }
  })
  // translate maps
  const langPreferences = lang.manageProfile.tab.preference

  useEffect(() => {
    if (userDetail && preferredAvailability) {
      setAvailability(userDetail.notice_period_id)
      setValue('noticePeriod', userDetail.notice_period_id)
    }
  }, [userDetail])
  const onSubmit = (data) => {
    const { noticePeriod } = data // jobType is a key
    
    const payload = {
      profile: {
        notice_period_id: noticePeriod
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
          <MaterialBasicSelect
            fieldRef={{
              ...register('noticePeriod')
            }}
            className={styles.jobPreferencesFormInput}
            label='Availability'
            value={availability}
            defaultValue={availability}
            options={noticeList}
            onChange={(e) => setAvailability(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
  return (
    <Modal
      showModal={showModal}
      handleModal={handleCloseModal}
      headerTitle={langPreferences.availableModal.title}
      firstButtonText={langPreferences.availableModal.btn1}
      secondButtonText={langPreferences.availableModal.btn2}
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

export default EditJobPreferencesAvailabilityModal
