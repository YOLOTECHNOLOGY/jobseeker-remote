import { useEffect, useMemo, useState, useRef, useContext } from 'react'

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
import { getCountryId, getCountryKey, countryForCurrency } from 'helpers/country'

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
  lang: Record<string, any>
}

const formatLocationConfig = (locationList) => {
  const locationConfig = locationList?.map((region) => region.locations)
  return locationConfig
}

const getIdByValue = (options: any[], value) => {
  const selectedOption = options.find((item) => item.value === value)
  return selectedOption?.id
}
const EditJobPreferencesModal = ({
  modalName,
  showModal,
  config,
  handleModal,
  preference,
  lang
}: EditJobPreferencesModalProps) => {
  const {
    manageProfile: {
      tab: {
        preference: { editModal }
      }
    }
  } = lang
  const locationList = useSelector((store: any) => store.config.config.response?.location_lists)
  const currencyLists = useSelector((store: any) =>
    (store.config.config.response?.currency_lists ?? []).map((item) => ({
      label: item.value,
      value: item.key,
      id: item.id
    }))
  )
  console.log('currencyLists:', currencyLists)
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
      currencyKey: preference?.currency_key ?? countryForCurrency(getCountryKey())
    }
  }, [preference])

  console.log('defaultValues:', preference?.currency_key)
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
  const { handleSubmit, getValues, setValue, control, reset, trigger } = useForm({ defaultValues })
  const [minSalary, setMinSalary] = useState(getValues().minSalary)
  const [maxSalary, setMaxSalary] = useState(getValues().maxSalary)

  // useEffect(() => {
  //   if (minSalary) {
  //     getMaxSalaryOptions(minSalary)
  //   }
  // }, [minSalary])

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
        value: industry.key,
        id: industry.id
      })) ?? []
    )
  }, [config?.industry_lists])
  // const getMaxSalaryOptions = (minSalary) => {
  //   const maxSalaryOptions = getSalaryOptions(config, minSalary, true)
  //   setMaxSalary(maxSalaryOptions.length > 0 ? Number(preference?.salary_range_from_to) : '')
  //   setValue('maxSalary', maxSalaryOptions.length > 0 ? Number(preference?.salary_range_to) : '')
  //   setMaxSalaryOptions(maxSalaryOptions)
  //   trigger('maxSalary')
  // }
  useEffect(() => {
    // if (maxSalaryOptions?.length) {
    setValue('maxSalary', Number(preference?.salary_range_to) || '')
    setValue('minSalary', Number(preference?.salary_range_from) || '')
    // }

  }, [preference?.salary_range_to, preference?.salary_range_from,
    // maxSalaryOptions
  ])

  // useEffect(() => {
  //   minSalary && setMaxSalary(preference?.salary_range_to)
  // }, [minSalary, preference?.salary_range_to, maxSalaryOptions])
  const onSubmit = (data) => {
    // to add workSetting
    const { jobTitle, jobType, minSalary, maxSalary, location, industry, currencyKey } = data // jobType is a key
    const industry_id = getIdByValue(industryOptions, industry)
    const job_type_id = getIdByValue(jobTypeList, jobType)
    const payload = {
      preferences: {
        action: preference?.id ? 'update' : 'create',
        preferenceId: preference?.id,
        params: {
          job_title: jobTitle.value || '',
          function_job_title_id: jobTitle.id,
          function_job_title: jobTitle.value,
          job_type_key: jobType || '',
          job_type_id,
          location_key: location?.key || '',
          location_id: location?.id || '',
          salary_range_from: Number(minSalary),
          salary_range_to: Number(maxSalary),
          industry_key: industry,
          industry_id,
          currency_key: currencyKey,
          currency_id: currencyLists.find((item) => item.value === currencyKey)?.id ?? null,
          country_key: getCountryKey(),
          country_id: getCountryId()
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
            rules={{
              validate: (data) => !!data.value || lang.editJobPreferencesModal.validate.jobTitle
            }}
            render={({ field, fieldState }) => {
              return (
                <JobFunctionSelector
                  className={styles.jobPreferencesFormInput}
                  control={control}
                  label={editModal.jobTitle}
                  variant='outlined'
                  autoComplete='off'
                  jobTitle={preference?.function_job_title}
                  title={lang.profile.desiredJobFunction}
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
            rules={{ required: lang.editJobPreferencesModal.validate.jobType }}
            render={({ field, fieldState }) => {
              return (
                <MaterialBasicSelect
                  className={styles.jobPreferencesFormInput}
                  label={editModal.jobType}
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
            rules={{ required: lang.editJobPreferencesModal.validate.location }}
            render={({ field, fieldState }) => {
              const { onChange } = field
              return (
                <MaterialLocationField
                  className={styles.jobPreferencesFormInput}
                  label={editModal.location}
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
                message: lang.editJobPreferencesModal.validate.currency
              }
            }}
            render={({ field, fieldState }) => {
              const { value, onChange } = field
              return (
                <MaterialBasicSelect
                  className={styles.jobPreferencesFormInput}
                  label={editModal.currencyType}
                  IconComponent={null}
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
            rules={{
              validate: (value) => !!value || lang.editJobPreferencesModal.validate.minSalary
            }}
            render={({ field, fieldState }) => {
              const { value, onChange } = field
              return (
                <MaterialBasicSelect
                  className={styles.jobPreferencesFormInput}
                  label={editModal.minSalary}
                  options={minSalaryOptions.filter(item => item.value < 200000)}
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
            rules={{
              validate: (value) => !!value || lang.editJobPreferencesModal.validate.maxSalary
            }}
            render={({ field, fieldState }) => {
              const { value, onChange } = field
              return (
                <MaterialBasicSelect
                  className={styles.jobPreferencesFormInput}
                  label={editModal.maxSalary}
                  required
                  options={minSalaryOptions.filter(item => item.value > getValues('minSalary'))}
                  {...fieldState}
                  {...field}
                  value={value}
                  onChange={(e) => {
                    setMaxSalary(e.target.value)
                    onChange(e)
                  }}
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
              rules={{ required: lang.editJobPreferencesModal.validate.country }}
              render={({ field, fieldState }) => {
                return (
                  <MaterialBasicSelect
                    className={styles.jobPreferencesFormInput}
                    label={editModal.country}
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
            rules={{ required: lang.editJobPreferencesModal.validate.industry }}
            render={({ field, fieldState }) => {
              return (
                <MaterialBasicSelect
                  className={styles.jobPreferencesFormInput}
                  label={editModal.industry}
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
      headerTitle={editModal.title}
      firstButtonText={editModal.btn1}
      secondButtonText={editModal.btn2}
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
