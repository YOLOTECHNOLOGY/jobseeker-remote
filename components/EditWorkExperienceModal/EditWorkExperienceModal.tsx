/* eslint-disable camelcase */
import { useEffect, useState } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import classNames from 'classnames/bind'

/* Actions */
import { manageUserWorkExperiencesRequest } from 'store/actions/users/manageUserWorkExperiences'

/* Components */
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

import Text from 'components/Text'
import TextEditor from 'components/TextEditor/TextEditor'
import Modal from 'components/Modal'
import MaterialTextField from 'components/MaterialTextField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialDatePicker from 'components/MaterialDatePicker'
import MaterialSelectCheckmarks from 'components/MaterialSelectCheckmarks'

/* Helpers */
import { handleNumericInput } from 'helpers/handleInput'
import {
  getJobCategoryList,
  getLocationList,
  getIndustryList,
  getCountryList,
  getJobCategoryIds,
} from 'helpers/jobPayloadFormatter'

/* Styles */
import styles from './EditWorkExperienceModal.module.scss'

type EditWorkExperienceModalProps = {
  modalName: string
  showModal: boolean
  data:any
  config: any
  handleModal: Function
}

const dayList = []
const monthList = []
const yearList = []
for (let i = 1; i <= 31; ++i) {
  dayList.push({ value: i, label: i })
}
for (let i = 1; i <= 12; ++i) {
  monthList.push({ value: i, label: i })
}
const date = new Date()
for (let i = date.getFullYear(); i >= date.getFullYear() - 100; --i) {
  yearList.push({ value: i, label: i })
}

const errorText = (errorMessage: string) => {
  return (
    <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
      {errorMessage}
    </Text>
  )
}

const EditWorkExperienceModal = ({
  modalName,
  showModal,
  data,
  config,
  handleModal,
}: EditWorkExperienceModalProps) => {
  const dispatch = useDispatch()

  const locList = getLocationList(config)
  const jobCategoryList = getJobCategoryList(config)
  const industryList = getIndustryList(config)
  const countryList = getCountryList(config)

  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [location, setLocation] = useState(null)
  const [country, setCountry] = useState('')
  const [isShowCountry, setIsShowCountry] = useState(false)
  const [isCurrentJob, setIsCurrentJob] = useState(false)
  const [workPeriodFrom, setWorkPeriodFrom] = useState(null)
  const [workPeriodTo, setWorkPeriodTo] = useState(null)
  const [jobFunction, setJobFunction] = useState([])
  const [industry, setIndustry] = useState('')
  const [salary, setSalary] = useState('')
  const [description, setDescription] = useState('')
  const [hasErrorOnFromPeriod, setHasErrorOnFromPeriod] = useState(false)
  const [hasErrorOnToPeriod, setHasErrorOnToPeriod] = useState(false)

  const [isNextDisabled, setIsNextDisabled] = useState(true)
  const [showErrorToComplete, setShowErrorToComplete] = useState(false)

  const isUpdating = useSelector((store: any) => store.users.manageUserWorkExperiences.fetching)
  const updateWorkExpSuccess = useSelector(
    (store: any) => store.users.manageUserWorkExperiences.response
  )

  const {
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    setShowErrorToComplete(false)
  }, [])

  useEffect(() => {
    if (data) {
      setIsNextDisabled(data.length > 0 ? false : true)
    }
  }, [data])

  useEffect(() => {
    if (data) {
      setJobTitle(data.job_title)
      setCompanyName(data.company)
      setLocation(data.location ? getLocation(data.location)[0] : null)
      setIsCurrentJob(data.is_currently_work_here)
      setWorkPeriodFrom(data.working_period_from)
      setWorkPeriodTo(data.working_period_to)
      setSalary(data.salary)
      if (data.company_industry)
        setIndustry(
          industryList.filter(
            (industry) => industry.label === data.company_industry
          )[0].value
        )
      if (data.location && data.location.toLowerCase() === 'overseas') {
        setCountry(
          countryList.filter((country) => country.key === data.country_key)
        )
        setIsShowCountry(true)
      }

      setDescription(data.description)
      setJobFunction(data.job_categories || [])
    }
  }, [data])

  useEffect(() => {
    handleCloseModal()
  }, [updateWorkExpSuccess])

  useEffect(() => {
    const periodFrom = moment(new Date(workPeriodFrom))
    const periodTo = moment(new Date(workPeriodTo))

    setHasErrorOnToPeriod(moment(periodFrom).isAfter(periodTo) ? true : false)
  }, [workPeriodFrom, workPeriodTo])

  useEffect(() => {
    const requireFields = jobTitle && companyName && location && workPeriodFrom
    const emptyRequiredFields = !jobTitle && !companyName && !location && !workPeriodFrom
    const isValidDate = !hasErrorOnFromPeriod && !hasErrorOnToPeriod

    if (isCurrentJob) {
      if (emptyRequiredFields)
        setDisabledButton(emptyRequiredFields && !hasErrorOnFromPeriod ? true : false)
      setDisabledButton(requireFields && !hasErrorOnFromPeriod ? true : false)
    } else {
      if (emptyRequiredFields) setDisabledButton(emptyRequiredFields && isValidDate ? true : false)
      setDisabledButton(requireFields && isValidDate ? true : false)
    }

    if (requireFields) setShowErrorToComplete(false)
  }, [
    jobTitle,
    companyName,
    location,
    isCurrentJob,
    workPeriodFrom,
    workPeriodTo,
    hasErrorOnFromPeriod,
    hasErrorOnToPeriod,
  ])

  const setDisabledButton = (value) => {
    setIsNextDisabled(!value)
  }

  const requiredLabel = (text: string) => {
    return (
      <>
        <span>{text}</span>
        <span className={styles.fieldRequired}>*</span>
      </>
    )
  }

  const onSubmit = () => {
     // eslint-disable-next-line no-console
     const matchedIndustry = industryList.filter((option) => {
       return option.value === industry
     })

     const workExperienceData = {
       job_title: jobTitle,
       company: companyName,
       country_key: country || 'ph',
       company_industry_key: matchedIndustry?.[0]?.key || null,
       is_currently_work_here: isCurrentJob,
       job_category_ids:
         jobFunction?.length > 0 ? getJobCategoryIds(config, jobFunction).join(',') : '',
       salary: salary ? Number(salary) : null,
       working_period_from: moment(new Date(workPeriodFrom)).format('yyyy-MM-DD'),
       working_period_to: isCurrentJob ? null : moment(new Date(workPeriodTo)).format('yyyy-MM-DD'),
       description: description ? description : '',
       location_key: location?.key || '',
     }

     const workExperiencesPayload = {
       isUpdate: data ? true : false,
       workExperienceId: data ? data.id : null,
       workExperienceData: workExperienceData,
     }   
     dispatch(manageUserWorkExperiencesRequest(workExperiencesPayload))
  }

  const handleResetForm = () => {
    setJobTitle('')
    setCompanyName('')
    setLocation('')
    setIsCurrentJob(false)
    setWorkPeriodFrom(null)
    setWorkPeriodTo(null)
    setSalary('')
    setIndustry('')
    setCountry('')
    setIsShowCountry(false)
    setDescription('')
    setJobFunction([])
    setHasErrorOnFromPeriod(false)
    setHasErrorOnToPeriod(false)
    setShowErrorToComplete(false)
  }

  const getLocation = (location) => {
    if (!location) return
    return locList.filter((loc) => loc.value.toLowerCase() === location.toLowerCase())
  }

  const onLocationSearch = (_, value) => {
    setIsShowCountry(value?.key === 'overseas' ? true : false)
    setLocation(value)
  }

  const handleCloseModal = () => {
    handleModal(modalName, false)
    handleResetForm()
  }

  return (
    <div>
      <Modal
        showModal={showModal}
        handleModal={handleCloseModal}
        headerTitle='Work experience'
        firstButtonText='Cancel'
        secondButtonText='Save'
        isSecondButtonLoading={isUpdating}
        isSecondButtonDisabled={isNextDisabled}
        firstButtonIsClose
        handleFirstButton={handleCloseModal}
        handleSecondButton={handleSubmit(onSubmit)}
        fullScreen
      >
        <div className={styles.container}>
          <div className={styles.formWrapper}>
            <div id='form' className={styles.form}>
              <div className={styles.field}>
                <MaterialTextField
                  className={styles.fullWidth}
                  label={requiredLabel('Job Title')}
                  size='small'
                  value={jobTitle}
                  defaultValue={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <MaterialTextField
                  className={styles.fullWidth}
                  label={requiredLabel('Company Name')}
                  size='small'
                  value={companyName}
                  defaultValue={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <MaterialLocationField
                  className={styles.fullWidth}
                  label={requiredLabel('Location')}
                  value={location}
                  defaultValue={location}
                  onChange={onLocationSearch}
                />
              </div>

              {isShowCountry && (
                <div className={classNames(styles.field, styles.fieldCountry)}>
                  <MaterialBasicSelect
                    className={styles.fullWidth}
                    label={requiredLabel('Country')}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    error={errors.country ? true : false}
                    options={countryList}
                  />
                  {errors.country && errorText(errors.country.message)}
                </div>
              )}

              <div className={styles.fieldGroup}>
                <div className={styles.fieldHeader}>
                  <Text textStyle='base' bold>
                    Working Period <span className={styles.fieldRequired}>*</span>
                  </Text>
                </div>
                <div className={styles.fieldBody}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isCurrentJob}
                        onChange={() => setIsCurrentJob(!isCurrentJob)}
                        name='currentJob'
                      />
                    }
                    label={<Text textStyle='base'>I currently work here</Text>}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <div className={styles.fieldHeader}>
                  <Text textStyle='base' bold>
                    From
                  </Text>
                </div>
                <div className={classNames(styles.fieldBody, styles.fieldDate)}>
                  <div className={styles.fieldDateItem}>
                    <MaterialDatePicker
                      label='Month Year'
                      views={['year', 'month']}
                      inputFormat='MMM yyyy'
                      value={workPeriodFrom}
                      onDateChange={(value) => {
                        setWorkPeriodFrom(value)
                      }}
                    />
                  </div>
                </div>
                {hasErrorOnFromPeriod && (
                  <Text textColor='red' textStyle='sm'>
                    Start date must be earlier than completion date.
                  </Text>
                )}
              </div>

              {!isCurrentJob && (
                <div className={styles.field}>
                  <div className={styles.fieldHeader}>
                    <Text textStyle='base' bold>
                      To
                    </Text>
                  </div>
                  <div className={classNames(styles.fieldBody, styles.fieldDate)}>
                    <div className={styles.fieldDateItem}>
                      <MaterialDatePicker
                        label='Month Year'
                        views={['year', 'month']}
                        inputFormat='MMM yyyy'
                        value={workPeriodTo}
                        onDateChange={(value) => {
                          setWorkPeriodTo(value)
                        }}
                      />
                    </div>
                  </div>
                  {hasErrorOnToPeriod && (
                    <Text textColor='red' textStyle='sm'>
                      Start date must be earlier than completion date.
                    </Text>
                  )}
                </div>
              )}

              <div id='jobFunction' className={styles.field}>
                <MaterialSelectCheckmarks
                  className={styles.fullWidth}
                  label={'Job Functions'}
                  name='jobCategory'
                  value={jobFunction}
                  onSelect={(e) => setJobFunction(e)}
                  options={jobCategoryList}
                />
              </div>

              <div className={styles.field}>
                <MaterialBasicSelect
                  className={styles.fullWidth}
                  label='Industry'
                  value={industry}
                  onChange={(e) => {
                    setIndustry(e.target.value)
                  }}
                  options={industryList}
                />
              </div>

              <div className={styles.field}>
                <MaterialTextField
                  className={styles.fullWidth}
                  label='Monthly Salary (PHP)'
                  size='small'
                  value={salary}
                  defaultValue={salary}
                  onChange={(e) => setSalary(handleNumericInput(e.target.value))}
                />
              </div>

              <div className={styles.editor}>
                <TextEditor value={description} setValue={setDescription} />
              </div>
            </div>
          </div>

          {showErrorToComplete && (
            <Text textStyle='base' textColor='red' tagName='p'>
              Fill up the required field to proceed.
            </Text>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default EditWorkExperienceModal
