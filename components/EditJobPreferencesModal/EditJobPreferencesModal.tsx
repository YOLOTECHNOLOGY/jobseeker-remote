import { useEffect, useMemo, useState } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'

/* Components */
import Modal from 'components/Modal'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialLocationField from 'components/MaterialLocationField'

/* Helpers */
import { getJobTypeList, getSalaryOptions } from 'helpers/jobPayloadFormatter'
import { flat } from 'helpers/formatter'

import { updateUserPreferencesRequest } from 'store/actions/users/updateUserPreferences'

/* Styles */
import styles from './EditJobPreferencesModal.module.scss'
import JobFunctionSelector from 'components/JobFunctionSelector'

type EditJobPreferencesModalProps = {
  modalName: string
  showModal: boolean
  config: any
  userDetail: any
  handleModal: Function
  preference?: any
}

const formatLocationConfig = (locationList) => {
  const locationConfig = locationList?.map((region) => region.locations)
  return locationConfig
}

const EditJobPreferencesModal = ({
  modalName,
  showModal,
  config,
  userDetail,
  handleModal,
  preference
}: EditJobPreferencesModalProps) => {
  const locationList = useSelector(
    (store: any) => store.config.config.response?.inputs?.location_lists
  )
  const [initial, setInital] = useState(true)
  const formattedLocationList = flat(formatLocationConfig(locationList))
  const location = useMemo(() => {
    return formattedLocationList.find(l => l.key === preference?.location_key)
  }, [formattedLocationList, preference?.location_key])
  // to add work setting
  const defaultValues = useMemo(() => {
    return {
      jobTitle: { id: preference?.function_job_title_id, value: preference?.function_job_title ?? '' },
      jobType: preference?.job_type_key,
      minSalary: Number(preference?.salary_range_from) ?? undefined,
      maxSalary: Number(preference?.salary_range_to) ?? undefined,
      location: location,
      industry: preference?.industry_key
    }
  }, [preference])
  const dispatch = useDispatch()
  const [maxSalaryOptions, setMaxSalaryOptions] = useState([])
  const isUpdating = useSelector((store: any) => store.users.updateUserPreferences.fetching)
  const response = useSelector((store: any) => store.users.updateUserPreferences.response)

  const jobTypeList = getJobTypeList(config)
  const minSalaryOptions = getSalaryOptions(config)
  const {
    handleSubmit,
    getValues,
    setValue,
    control,
    reset
  } = useForm({ defaultValues })
  const [minSalary, setMinSalary] = useState(getValues().minSalary)
  useEffect(() => {
    getMaxSalaryOptions(minSalary)
  }, [minSalary])
  useEffect(() => {
    if (initial) {
      setInital(false)
    } else {
      handleCloseModal()
    }
  }, [response])
  const industryOptions = useMemo(() => {
    return config?.inputs?.industry_lists?.map(industry => ({ label: industry.value, value: industry.key })) ?? []
  }, [config?.inputs?.industry_lists])
  const getMaxSalaryOptions = (minSalary) => {
    const maxSalaryOptions = getSalaryOptions(config, minSalary, true)
    // setMaxSalary(maxSalaryOptions.length > 0 ? maxSalaryOptions[0].value : null)
    setValue('maxSalary', maxSalaryOptions.length > 0 ? maxSalaryOptions[0].value : null)
    setMaxSalaryOptions(maxSalaryOptions)
  }
  const onSubmit = (data) => {
    // to add workSetting
    const { jobTitle, jobType, minSalary, maxSalary, location, industry } = data // jobType is a key
    const payload = {
      preferences: {
        action: preference?.id ? 'update' : 'create',
        preferenceId: preference?.id,
        params: {
          job_title: jobTitle.value || '',
          function_job_title_id: jobTitle.id,
          function_job_title: jobTitle.value,
          job_type_key: jobType || '',
          location_key: location?.key || '',
          salary_range_from: Number(minSalary),
          salary_range_to: Number(maxSalary),
          industry_key: industry,
          currency_key: 'php',
          country_key: 'ph'
        }
      }
    }

    dispatch(updateUserPreferencesRequest(payload))
    setTimeout(handleCloseModal, 500)
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
          <Controller
            control={control}
            name={'jobTitle'}
            rules={{ required: 'job title is required' }}
            render={({ field, fieldState }) => {
              return <JobFunctionSelector
                className={styles.jobPreferencesFormInput}
                control={control}
                label='Desired job title'
                variant='outlined'
                autoComplete='off'
                jobTitle={preference?.function_job_title}
                title='Job function'
                helperText={fieldState?.error?.message}
                required
                {...fieldState}
                {...field}
              // onChange={(value)=>setValue('jobTitle',value)}
              />
            }}
          />

        </div>
        <div className={styles.jobPreferencesFormGroup}>
          <Controller
            control={control}
            name={'jobType'}
            rules={{ required: 'job type is required' }}
            render={({ field, fieldState }) => {
              return <MaterialBasicSelect
                className={styles.jobPreferencesFormInput}
                label='Desired job type'
                options={jobTypeList}
                required
                {...fieldState}
                {...field}
              />
            }}
          />
        </div>
        <div className={styles.jobPreferencesFormGroup}>
          <Controller
            control={control}
            name={'minSalary'}
            rules={{ validate: value => !!value || 'min salary is required' }}
            render={({ field, fieldState }) => {
              const { value, onChange } = field
              return <MaterialBasicSelect
                className={styles.jobPreferencesFormInput}
                label='Expected min. salary'
                options={minSalaryOptions}
                required
                {...fieldState}
                {...field}
                value={value || undefined}
                onChange={e => {
                  setMinSalary(e.target.value)
                  onChange(e)
                }}
              />
            }}
          />
          <div style={{ width: '20px', height: '24px' }}></div>
          <Controller
            control={control}
            name={'maxSalary'}
            rules={{ validate: value => !!value || 'max salary is required' }}
            render={({ field, fieldState }) => {
              const { value } = field
              return <MaterialBasicSelect
                className={styles.jobPreferencesFormInput}
                label='Max. salary'
                rules={{ required: 'max salary is required' }}
                required
                options={maxSalaryOptions}
                {...fieldState}
                {...field}
                value={value || undefined}
              />
            }}
          />
        </div>
        <div className={styles.jobPreferencesFormGroup}>
          <Controller
            control={control}
            name={'location'}
            rules={{ required: 'location is required' }}
            render={({ field, fieldState }) => {
              const { onChange } = field
              return <MaterialLocationField
                className={styles.jobPreferencesFormInput}
                label='Desired working location'
                required
                {...fieldState}
                {...field}
                onChange={(_, location) => {
                  onChange(location)
                }}
              />
            }}
          />

        </div>
        <div className={styles.jobPreferencesFormGroup}>
          <Controller
            control={control}
            name={'industry'}
            rules={{ required: 'industry is required' }}
            render={({ field, fieldState }) => {
              return <MaterialBasicSelect
                className={styles.jobPreferencesFormInput}
                label='Desired Industry'
                required
                options={industryOptions}
                {...fieldState}
                {...field}
              />
            }}
          />

        </div>
      </div>
    </div>
  )

  return (
    <Modal
      showModal={showModal}
      handleModal={handleCloseModal}
      headerTitle='Job Preference'
      firstButtonText='Cancel'
      secondButtonText='Save'
      isSecondButtonLoading={isUpdating}
      firstButtonIsClose
      handleFirstButton={handleCloseModal}
      handleSecondButton={handleSubmit(onSubmit)}
      fullScreen
      closeModalOnOutsideClick={false}
    >
      {modalJobPreferenceContent}
    </Modal>
  )
}

export default EditJobPreferencesModal
