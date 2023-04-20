import { useEffect, useMemo, useState, useRef } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'

/* Components */
import Modal from 'components/Modal'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialLocationField from 'components/MaterialLocationField'

/* Helpers */
import { getCountryList, getJobTypeList, getSalaryOptions } from 'helpers/jobPayloadFormatter'
import { flat } from 'helpers/formatter'

import { updateUserPreferencesRequest } from 'store/actions/users/updateUserPreferences'

/* Styles */
import styles from './EditJobPreferencesModal.module.scss'
import JobFunctionSelector from 'components/JobFunctionSelector'
import {getCountryKey,countryForCurrency}  from 'helpers/country'


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
  handleModal,
  preference
}: EditJobPreferencesModalProps) => {
  const locationList = useSelector(
    (store: any) => store.config.config.response?.location_lists
  )
  const currencyLists = useSelector((store: any) =>
    (store.config.config.response?.currency_lists ?? []).map((item) => ({
      label: item.value,
      value: item.key,
      id: item.id
    }))
  )
  const [initial, setInital] = useState(true)
  const formattedLocationList = flat(formatLocationConfig(locationList))
  const location = useMemo(() => {
    return formattedLocationList.find((l) => l.key === preference?.location_key)
  }, [formattedLocationList, preference?.location_key])
  // to add work setting
  const defaultValues = useMemo(() => {
    return {
      jobTitle: {
        id: preference?.function_job_title_id,
        value: preference?.function_job_title ?? ''
      },
      jobType: preference?.job_type_key,
      minSalary: preference?.salary_range_from ? Number(preference?.salary_range_from) : '',
      maxSalary: preference?.salary_range_to ? Number(preference?.salary_range_to) : '',
      location: location,
      industry: preference?.industry_key,
      country: preference?.country_key,
      currencyKey: preference?.currency_key ?? countryForCurrency[getCountryKey()]
    }
  }, [preference])
  const dispatch = useDispatch()
  const [maxSalaryOptions, setMaxSalaryOptions] = useState([])
  const isUpdating = useSelector((store: any) => store.users.updateUserPreferences.fetching)
  const response = useSelector((store: any) => store.users.updateUserPreferences.response)
  const countryList = getCountryList(config).map((country) => ({
    label: country.label,
    value: country.key
  }))
  const [isShowCountry, setIsShowCountry] = useState(preference?.location_key === 'overseas')
  const jobTypeList = getJobTypeList(config)
  const minSalaryOptions = getSalaryOptions(config)
  const { handleSubmit, getValues, setValue, control, reset } = useForm({ defaultValues })
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
    return (
      config?.industry_lists?.map((industry) => ({
        label: industry.value,
        value: industry.key
      })) ?? []
    )
  }, [config?.industry_lists])
  const getMaxSalaryOptions = (minSalary) => {
    const maxSalaryOptions = getSalaryOptions(config, minSalary, true)
    // setMaxSalary(maxSalaryOptions.length > 0 ? maxSalaryOptions[0].value : null)
    setValue('maxSalary', maxSalaryOptions.length > 0 ? maxSalaryOptions[0].value : '')
    setMaxSalaryOptions(maxSalaryOptions)
  }
  const onSubmit = (data) => {
    // to add workSetting
    const { jobTitle, jobType, minSalary, maxSalary, location, industry, country, currencyKey} =
      data // jobType is a key
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
          currency_key: currencyKey,
          currency_id: currencyLists.find(item => item.value === currencyKey)?.id ?? null,
          country_key: location?.key === 'overseas' ? country : 'ph'
        }
      }
    }

    dispatch(updateUserPreferencesRequest(payload))
    // setTimeout(() => handleCloseModal(true), 500)
  }
  const isUpdatingRef = useRef(isUpdating)

  useEffect(() => {
    if (!isUpdating && isUpdatingRef.current) {
      handleCloseModal(true)
    }
    isUpdatingRef.current = isUpdating
  }, [isUpdating])

  const handleCloseModal = (refresh = false) => {
    handleModal(modalName, false, refresh)
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
              return (
                <JobFunctionSelector
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
              )
            }}
          />
        </div>
        <div className={styles.jobPreferencesFormGroup}>
          <Controller
            control={control}
            name={'jobType'}
            rules={{ required: 'job type is required' }}
            render={({ field, fieldState }) => {
              return (
                <MaterialBasicSelect
                  className={styles.jobPreferencesFormInput}
                  label='Desired job type'
                  options={jobTypeList}
                  required
                  {...fieldState}
                  {...field}
                />
              )
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
              return (
                <MaterialLocationField
                  className={styles.jobPreferencesFormInput}
                  label='Desired working location'
                  required
                  {...fieldState}
                  {...field}
                  onChange={(_, location) => {
                    setIsShowCountry(location.key === 'overseas')
                    onChange(location)
                  }}
                />
              )
            }}
          />
        </div>

        <div className={styles.jobPreferencesFormGroup}>
          <Controller
            control={control}
            name={'currencyKey'}
            rules={{
              required: {
                value: true,
                message: 'currency is required'
              }
            }}
            render={({ field, fieldState }) => {
              const { value, onChange } = field
              return (
                <MaterialBasicSelect
                  className={styles.jobPreferencesFormInput}
                  label='Currency type'
                  options={currencyLists}
                  required
                  disabled
                  {...fieldState}
                  {...field}
                  value={value}
                  onChange={(e) => {
                    onChange(e)
                  }}
                />
              )
            }}
          />

          <div style={{ width: '20px', height: '24px' }}></div>
          <Controller
            control={control}
            name={'minSalary'}
            rules={{ validate: (value) => !!value || 'min salary is required' }}
            render={({ field, fieldState }) => {
              const { value, onChange } = field
              return (
                <MaterialBasicSelect
                  className={styles.jobPreferencesFormInput}
                  label='Expected min. salary'
                  options={minSalaryOptions}
                  required
                  {...fieldState}
                  {...field}
                  value={value}
                  onChange={(e) => {
                    setMinSalary(e.target.value)
                    onChange(e)
                  }}
                />
              )
            }}
          />

          <div style={{ width: '20px', height: '24px' }}></div>
          <Controller
            control={control}
            name={'maxSalary'}
            rules={{ validate: (value) => !!value || 'max salary is required' }}
            render={({ field, fieldState }) => {
              const { value } = field
              return (
                <MaterialBasicSelect
                  className={styles.jobPreferencesFormInput}
                  label='Expected max. salary'
                  rules={{ required: 'max salary is required' }}
                  required
                  options={maxSalaryOptions}
                  {...fieldState}
                  {...field}
                  value={value}
                />
              )
            }}
          />
        </div>

        {isShowCountry && (
          <div className={styles.jobPreferencesFormGroup}>
            <Controller
              control={control}
              name={'country'}
              rules={{ required: 'country is required when location is overseas' }}
              render={({ field, fieldState }) => {
                return (
                  <MaterialBasicSelect
                    className={styles.jobPreferencesFormInput}
                    label={'Country'}
                    options={countryList}
                    {...fieldState}
                    {...field}
                  />
                )
              }}
            />
          </div>
        )}
        <div className={styles.jobPreferencesFormGroup}>
          <Controller
            control={control}
            name={'industry'}
            rules={{ required: 'industry is required' }}
            render={({ field, fieldState }) => {
              return (
                <MaterialBasicSelect
                  className={styles.jobPreferencesFormInput}
                  label='Desired Industry'
                  required
                  options={industryOptions}
                  {...fieldState}
                  {...field}
                />
              )
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
      closeModalOnOutsideClick={true}
      className={styles.job_preferences_modal}
    >
      {modalJobPreferenceContent}
    </Modal>
  )
}

export default EditJobPreferencesModal
