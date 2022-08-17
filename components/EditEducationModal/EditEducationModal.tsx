import { useEffect, useState } from 'react'

/* Components */
import Modal from 'components/Modal'
import MaterialTextField from 'components/MaterialTextField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialDatePicker from 'components/MaterialDatePicker'
import MaterialLocationField from 'components/MaterialLocationField'
import Text from 'components/Text'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

/* Actions */
import { manageUserEducationsRequest } from 'store/actions/users/manageUserEducations'

/* Helpers*/
import { getDegreeOptions, getCountryOptions } from 'helpers/optionsFormatter'
import {
  getLocationList
} from 'helpers/jobPayloadFormatter'

/* Vendors */
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames/bind'
import moment from 'moment'

/* Styles */
import styles from './EditEducationModal.module.scss'


type EditEducationModalProps = {
  modalName: string
  showModal: boolean
  config: any
  education: any
  handleModal: Function
}

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

const EditEducationModal = ({
  modalName,
  showModal,
  config,
  education,
  handleModal,
}: EditEducationModalProps) => {
  const dispatch = useDispatch()

  const degreeOptions = getDegreeOptions(config)
  const countryOptions = getCountryOptions(config)
  const locList = getLocationList(config)

  const [school, setSchool] = useState('')
  const [degreeKey, setDegreeKey] = useState(null)
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false)
  const [studyPeriodFrom, setStudyPeriodFrom] = useState(null)
  const [studyPeriodTo, setStudyPeriodTo] = useState(null)
  const [hasErrorOnToPeriod, setHasErrorOnToPeriod] = useState(false)
  const [location, setLocation] = useState(null)
  const [countryKey, setCountryKey] = useState(null)
  const [isShowCountry, setIsShowCountry] = useState(false)
  const [fieldOfStudy, setFieldOfStudy] = useState('')
  const [hasValidationError, setHasValidationError] = useState(true)

  const isUpdating = useSelector((store: any) => store.users.manageUserEducations.fetching)
  const updateEducationSuccess = useSelector(
    (store: any) => store.users.manageUserEducations.response
  )

  const getLocation = (locationKey) => {
    if (!locationKey) return
    return locList.filter((loc) => loc.key === locationKey)
  }

  const {
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleResetForm = () => {
    setSchool('')
    setDegreeKey(null)
    setIsCurrentlyStudying(false)
    setStudyPeriodFrom(null)
    setStudyPeriodTo(null)
    setHasErrorOnToPeriod(false)
    setLocation(null)
    setCountryKey(null)
    setFieldOfStudy('')
    setHasValidationError(true)
  }

  const handleCloseModal = () => {
    handleModal(modalName, false)
    handleResetForm()
  }

  const onChangeLocation = (_, value) => {
    setLocation(value)
  }

  const onSubmit = () => {
    const data = {
      school: school.trim(),
      degree_key: degreeKey,
      is_currently_studying: isCurrentlyStudying,
      study_period_from: moment(new Date(studyPeriodFrom)).format('yyyy-MM-DD'),
      study_period_to: isCurrentlyStudying === true ? null : moment(new Date(studyPeriodTo)).format('yyyy-MM-DD'),
      location_key: location?.key,
      country_key: countryKey,
    }

    const trimmedFieldOfStudy = fieldOfStudy.trim()

    if (trimmedFieldOfStudy.length > 0) {
      data["field_of_study"] = trimmedFieldOfStudy
    } 

    const educationPayload = {
      isUpdate: education ? true : false,
      educationId: education ? education.id : null,
      educationData: data,
    }
    dispatch(manageUserEducationsRequest(educationPayload))
  }

  const validateInput = () => {
    const trimmedSchool = school.trim()

    if (
      trimmedSchool.length > 0 &&
      degreeKey !== null &&
      studyPeriodFrom !== null &&
      (isCurrentlyStudying === true || studyPeriodTo !== null) &&
      !moment(studyPeriodFrom).isAfter(studyPeriodTo) &&
      location !== null &&
      (location?.key !== 'overseas' || countryKey !== null)
    ) {
      setHasValidationError(false)
    } else {
      setHasValidationError(true)
    }
  }

  useEffect(() => {
    if (education) {
      setSchool(education.school)
      setDegreeKey(education.degree_key)
      setIsCurrentlyStudying(education.is_currently_studying)
      setStudyPeriodFrom(education.study_period_from)
      setStudyPeriodTo(education.study_period_to)
      setLocation(education.location ? getLocation(education.location_key)[0] : null)
      setCountryKey(education.country_key)
      setFieldOfStudy(education.field_of_study)
      setHasValidationError(true)
      validateInput()
    }
  }, [education])

  useEffect(() => {
    const periodFrom = moment(new Date(studyPeriodFrom))
    const periodTo = moment(new Date(studyPeriodTo))

    setHasErrorOnToPeriod(moment(periodFrom).isAfter(periodTo) ? true : false)
  }, [studyPeriodFrom, studyPeriodTo])

  useEffect(() => {
    setIsShowCountry(location?.key === 'overseas')
  }, [location])

  useEffect(() => {
    handleCloseModal()
  }, [updateEducationSuccess])

  useEffect(() => {
    validateInput()
  }, [
    school,
    degreeKey,
    studyPeriodFrom,
    studyPeriodTo,
    isCurrentlyStudying,
    location,
    countryKey
  ])

  return (
    <div>
      <Modal
        showModal={showModal}
        handleModal={handleCloseModal}
        headerTitle='Education'
        firstButtonText='Cancel'
        secondButtonText='Save'
        isSecondButtonLoading={isUpdating}
        isSecondButtonDisabled={hasValidationError}
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
                  label={requiredLabel('School Name')}
                  size='small'
                  value={school}
                  defaultValue={school}
                  onChange={(e) => setSchool(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <MaterialBasicSelect
                  className={styles.fullWidth}
                  label={requiredLabel('Education Level')}
                  value={degreeKey}
                  onChange={(e) => setDegreeKey(e.target.value)}
                  options={degreeOptions}
                />
              </div>
              <div className={styles.field}>
                <div>
                  <Text textStyle='lg' bold>
                    Study Period<span className={styles.fieldRequired}>*</span>
                  </Text>
                </div>
                <div>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isCurrentlyStudying}
                        onChange={() => setIsCurrentlyStudying(!isCurrentlyStudying)}
                        name='isCurrentlyStudying'
                      />
                    }
                    label={<Text textStyle='lg'>Currently attending</Text>}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <div className={styles.fieldHeader}>
                  <Text textStyle='base' bold>
                    From
                  </Text>
                </div>
                <div className={classNames(styles.fieldDate)}>
                  <div className={styles.fieldDateItem}>
                    <MaterialDatePicker
                      label='Month Year'
                      views={['year', 'month']}
                      inputFormat='MMM yyyy'
                      value={studyPeriodFrom}
                      onDateChange={(value) => {
                        setStudyPeriodFrom(value)
                      }}
                    />
                  </div>
                </div>
              </div>
              {!isCurrentlyStudying && (
                <div className={styles.field}>
                  <div className={styles.fieldHeader}>
                    <Text textStyle='base' bold>
                      To
                    </Text>
                  </div>
                  <div className={classNames(styles.fieldDate)}>
                    <div className={styles.fieldDateItem}>
                      <MaterialDatePicker
                        label='Month Year'
                        views={['year', 'month']}
                        inputFormat='MMM yyyy'
                        value={studyPeriodTo}
                        onDateChange={(value) => {
                          setStudyPeriodTo(value)
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
              <div className={styles.field}>
                <MaterialLocationField
                  className={styles.fullWidth}
                  label={requiredLabel('Location')}
                  value={location}
                  defaultValue={location}
                  onChange={onChangeLocation}
                />
              </div>
              {isShowCountry && (
                <div className={classNames(styles.field)}>
                  <MaterialBasicSelect
                    className={styles.fullWidth}
                    label={requiredLabel('Country')}
                    value={countryKey}
                    onChange={(e) => setCountryKey(e.target.value)}
                    error={errors.country ? true : false}
                    options={countryOptions}
                  />
                  {errors.country && errorText(errors.country.message)}
                </div>
              )}
              <div className={styles.field}>
                <MaterialTextField
                  className={styles.fullWidth}
                  label={'Field of Study'}
                  size='small'
                  value={fieldOfStudy}
                  defaultValue={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default EditEducationModal
