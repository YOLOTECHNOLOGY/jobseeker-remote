import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import moment from 'moment'
// @ts-ignore
import { END } from 'redux-saga'

/* Redux Actions */
import { wrapper } from 'store'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { fetchUserEducationRequest } from 'store/actions/users/fetchUserEducation'
import { updateUserCompleteProfileRequest } from 'store/actions/users/updateUserCompleteProfile'
import { generateUserResumeRequest } from 'store/actions/users/generateUserResume'

// Components
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel';

import Text from 'components/Text'
import OnBoardLayout from 'components/OnBoardLayout'
import MaterialTextField from 'components/MaterialTextField'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialDatePicker from 'components/MaterialDatePicker'

/* Helpers*/
import {
  getCountryList,
  getLocationList,
  getDegreeList
} from 'helpers/jobPayloadFormatter'
import { removeEmptyOrNullValues } from 'helpers/formatter'
import { getItem } from 'helpers/localStorage'
import useWindowDimensions from 'helpers/useWindowDimensions'

// Images
import { 
  DeleteFilledIcon, 
  CreateFilledIcon, 
  AddOutlineIcon 
} from 'images'

// Styles
import styles from './Onboard.module.scss'
import MaterialButton from 'components/MaterialButton';

const Step4 = (props: any) => {
  const { config, userDetail, accessToken } = props
  
  const currentStep = 4
  const router = useRouter()
  const dispatch = useDispatch()
  const backBtnUrl = router.query?.redirect ? `/jobseeker-complete-profile/1101?redirect=${router.query.redirect}` : '/jobseeker-complete-profile/1101'
  const { width } = useWindowDimensions()
  const isMobile = width < 768 ? true : false

  const degreeList = getDegreeList(config)
  const countryList = getCountryList(config)
  const locList = getLocationList(config)

  const [isEditing, setIsEditing] = useState(false)

  const [school, setSchool] = useState('')
  const [degree, setDegree] = useState('')
  const [location, setLocation] = useState(null)
  const [country, setCountry] = useState('')
  const [isShowCountry, setIsShowCountry] = useState(false)
  const [studyPeriodFromMonth, setStudyPeriodFromMonth] = useState(null)
  const [studyPeriodFromYear, setStudyPeriodFromYear] = useState(null)
  const [studyPeriodToMonth, setStudyPeriodToMonth] = useState(null)
  const [studyPeriodToYear, setStudyPeriodToYear] = useState(null)
  const [fieldStudy, setFieldStudy] = useState('')
  const [isCurrentStudying, setIsCurrentStudying] = useState(false)
  const [hasNoEducation, setHasNoEducation] = useState(false)
  const [educationId, setEducationId] = useState(null)
  const [educations, setEducations] = useState(userDetail?.educations)
  const [showForm, setShowForm] = useState(educations?.length === 0 ? true : false)
  const [isNextDisabled, setIsNextDisabled] = useState(true)
  const [isSaveDisabled, setIsSaveDisabled] = useState(true)
  const [hasErrorOnFromPeriod, setHasErrorOnFromPeriod] = useState(false)
  const [hasErrorOnToPeriod, setHasErrorOnToPeriod] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showErrorToComplete, setShowErrorToComplete] = useState(false)
  const [selectedEducation, setSelectedEducation] = useState(null)

  const userEducations = useSelector((store: any) => store.users.fetchUserEducation.response)
  const isUpdatingUserProfile = useSelector((store: any) => store.users.updateUserCompleteProfile.fetching)
  const isGeneratingUserResume = useSelector((store: any) => store.users.generateUserResume.fetching)
  const isCompletingUserProfile = useSelector((store: any) => store.users.completeUserProfile.fetching)

  const requiredLabel = (text: string) => {
    return (
      <>
        <span>{text}</span>
        <span className={styles.stepFieldRequired}>*</span>
      </>
    )
  }

  useEffect(() => {
    dispatch(fetchUserEducationRequest({accessToken}))
  }, [])

  useEffect(() => {
    if (userEducations) {
      setEducations(userEducations || [])
      setIsNextDisabled(userEducations.length > 0 ? false : true)
      setIsUpdating(false)
    }
  }, [userEducations])

  useEffect(() => {
    const periodFrom = `${moment(new Date(studyPeriodFromYear)).format('yyyy')}-${moment(new Date(studyPeriodFromMonth)).format('MM-DD')}`
    const periodTo = `${moment(new Date(studyPeriodToYear)).format('yyyy')}-${moment(new Date(studyPeriodToMonth)).format('MM-DD')}`
    
    setHasErrorOnToPeriod(moment(periodFrom).isAfter(periodTo) ? true : false)
  }, [
    studyPeriodFromMonth,
    studyPeriodFromYear,
    studyPeriodToMonth,
    studyPeriodToYear
  ])

  useEffect(() => {
    const requireFields = school && degree && location && studyPeriodFromMonth && studyPeriodFromYear
    const emptyRequiredFields = !school && !degree && !location && !studyPeriodFromMonth && !studyPeriodFromYear
    const isValidDate = !hasErrorOnFromPeriod && !hasErrorOnToPeriod

    if (isCurrentStudying) {
      if (emptyRequiredFields) setDisabledButton(emptyRequiredFields && !hasErrorOnFromPeriod ? true : false)
      setDisabledButton(requireFields && !hasErrorOnFromPeriod ? true : false)
    } else {
      if (emptyRequiredFields) setDisabledButton(emptyRequiredFields && isValidDate ? true : false)
      setDisabledButton(requireFields && isValidDate ? true : false)
    }

    if (requireFields) setShowErrorToComplete(false)
  }, [
    school, 
    degree, 
    location, 
    isCurrentStudying, 
    studyPeriodFromMonth,
    studyPeriodFromYear,
    studyPeriodToMonth,
    studyPeriodToYear,
    hasErrorOnFromPeriod,
    hasErrorOnToPeriod
  ])

  useEffect(() => {
    setIsUpdating(isUpdatingUserProfile)
  }, [isUpdatingUserProfile])

  useEffect(() => {
    if (hasNoEducation) {
      setIsNextDisabled(false)

      if (educations?.length === 0) {
        setShowForm(false)
        setIsEditing(false)
      } else {
        scrollToForm()
      }
    } 

    if (!hasNoEducation) {
      setIsNextDisabled(true)
      setShowForm(educations?.length === 0 ? true : false)
      setIsEditing(false)
    }
  }, [hasNoEducation])

  const setDisabledButton = (value) => {
    setIsSaveDisabled(!value)
    setIsNextDisabled(!value)
  }

  const scrollToForm = () => {
    const stepForm = document.getElementById('step4Form')
    stepForm?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    })
  }

  const getLocation = (location) => {
    if (!location) return
    return locList.filter((loc) => loc.value.toLowerCase() === location.toLowerCase())
  }

  const onLocationSearch = (_, value) => {
    setIsShowCountry(value?.key === 'overseas' ? true : false)
    setLocation(value)
  }

  const newEducationForm = () => {
    setShowForm(!showForm)
    setIsEditing(false)
    setIsNextDisabled(true)
  }

  const handleSelectEducation = (education) => {
    setSelectedEducation(education)
    setIsEditing(false)
    setShowForm(!showForm)
    setEducationId(education.id)
    setSchool(education.school)
    setDegree(degreeList.filter((degree) => degree.label === education.degree)[0].value)
    setLocation(getLocation(education.location)[0])
    if (education.location.toLowerCase() === 'overseas') {
      setCountry(countryList.filter((country) => country.key === education.country_key)[0].value)
      setIsShowCountry(true)
    }
    setStudyPeriodFromMonth(education.study_period_from)
    setStudyPeriodFromYear(education.study_period_from)
    setStudyPeriodToMonth(education.study_period_to)
    setStudyPeriodToYear(education.study_period_to)
    setFieldStudy(education.field_of_study)
    setIsCurrentStudying(education.is_currently_studying)
  }

  const handleResetForm = () => {
    setSchool('')
    setDegree('')
    setLocation(null)
    setCountry('')
    setIsShowCountry(false)
    setStudyPeriodFromMonth(null)
    setStudyPeriodFromYear(null)
    setStudyPeriodToMonth(null)
    setStudyPeriodToYear(null)
    setFieldStudy('')
    setIsCurrentStudying(false)
    setHasErrorOnFromPeriod(false)
    setHasErrorOnToPeriod(false)
    setShowErrorToComplete(false)
    setIsSaveDisabled(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setIsNextDisabled(userEducations.length > 0 ? false : true)

    if (selectedEducation) {
      handleResetForm()
    }

    setSelectedEducation(null)
  }

  const handleSaveForm = () => {
    // eslint-disable-next-line no-console
    const educationData = {
      school: school,
      country_key: country || 'ph',
      is_currently_studying: isCurrentStudying,
      study_period_from: `${moment(new Date(studyPeriodFromYear)).format('yyyy')}-${moment(new Date(studyPeriodFromYear)).format('MM-DD')}`,
      study_period_to: isCurrentStudying ? null : `${moment(new Date(studyPeriodToYear)).format('yyyy')}-${moment(new Date(studyPeriodToMonth)).format('MM-DD')}`,
      location_key: location?.key || '',
      field_of_study: fieldStudy,
      degree_key: degree
    }

    const educationPayload = {
      accessToken,
      currentStep,
      isUpdate: isEditing,
      educationId,
      educationData: removeEmptyOrNullValues(educationData)
    }
    dispatch(updateUserCompleteProfileRequest(educationPayload))

    setShowForm(false)
    handleResetForm()
  }

  const handleDeleteEducation = (id) => {
    const deletePayload = {
      accessToken,
      educationId: id,
      isDelete: true,
      currentStep
    }

    dispatch(updateUserCompleteProfileRequest(deletePayload))
    handleResetForm()
  }

  const handleLastStep = () => {
    const isCreateFreeResume = (getItem('isCreateFreeResume') || getItem('isFromCreateResume') === '1') ?? false
    const redirect = router.query?.redirect ? router.query?.redirect : null

    if (isCreateFreeResume) {
      dispatch(generateUserResumeRequest({ redirect, accessToken }))
    }
    
    if (!isCreateFreeResume) {
      dispatch(updateUserCompleteProfileRequest({ currentStep: 5, redirect, accessToken }))
    }
  }

  const handleNextBtn = () => {
    if (!isNextDisabled && showForm && (school && degree && location)) {
      handleLastStep()
      return
    }
    if (!isNextDisabled && !showForm) {
      handleLastStep()
      return
    }

    setShowErrorToComplete(true)
  }

  return (
    <OnBoardLayout
      headingText={<Text bold textStyle='xxxl' tagName='h2'>All about your education 🎓</Text>}
      currentStep={4}
      totalStep={4}
      isMobile={isMobile}
      backFnBtn={() => router.push(backBtnUrl)}
      nextFnBtn={() => handleNextBtn()}
      isNextDisabled={isNextDisabled}
      isUpdating={isGeneratingUserResume || isCompletingUserProfile}
    >
      {educations.length > 0 && (
        <div className={styles.stepDataList}>
          {educations.map((education) => (
            <div className={styles.stepDataItem} key={education.id}>
              <div className={styles.stepDataInfo}>
                <Text bold textStyle='base' tagName='p'>{education.school}</Text>
                <Text textStyle='base' tagName='p'>{education.degree}</Text>
                <Text textStyle='base' tagName='p'>{moment(education.working_period_from).format("MMMM yyyy")} to {education.is_currently_studying ? 'Present' : education.working_period_to}</Text>
                <Text textStyle='base' tagName='p'>{education.location} - {getLocation(education?.location)?.[0].region}</Text>
                <Text textStyle='base' tagName='p'>{education.field_of_study}</Text>
              </div>
              <div className={styles.stepDataActions}>
                <div 
                  className={styles.stepDataActionItem} 
                  onClick={() => handleSelectEducation(education)}
                >
                  <img src={CreateFilledIcon} width='18' height='18' />
                </div>
                <div 
                  className={styles.stepDataActionItem} 
                  onClick={() => handleDeleteEducation(education.id)}
                >
                  <img src={DeleteFilledIcon} width='18' height='18' />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div id="step4Form" className={classNames(styles.stepForm, styles.step4Form)}>
          <div className={styles.stepField}>
            <MaterialTextField
              className={styles.stepFullwidth}
              label={requiredLabel('School Name')}
              size='small'
              value={school}
              defaultValue={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </div>

          <div className={styles.stepField}>
            <MaterialBasicSelect
              className={styles.stepFullwidth}
              label={requiredLabel('Education Level')}
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              options={degreeList}
            />
          </div>

          <div className={styles.stepFieldGroup}>
            <div className={styles.stepFieldHeader}>
              <Text textStyle='base' bold>Study Period<span className={styles.stepFieldRequired}>*</span></Text>
            </div>
            <div className={styles.stepFieldBody}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={isCurrentStudying} 
                    onChange={() => setIsCurrentStudying(!isCurrentStudying)} 
                    name='currentStudent' 
                  />
                }
                label={<Text textStyle='base'>Currently attending</Text>}
              />
            </div>
          </div>

          <div className={styles.stepField}>
            <div className={styles.stepFieldHeader}>
              <Text textStyle='base' bold>From</Text>
            </div>
            <div className={classNames(styles.stepFieldBody, styles.stepFieldDate)}>
              <div className={styles.stepFieldDateItem}>
                <MaterialDatePicker
                  label="Month"
                  views={['month']}
                  inputFormat="MMM"
                  value={studyPeriodFromMonth}
                  onDateChange={(month) => {
                    setStudyPeriodFromMonth(month)
                  }}
                />
              </div>
              <div className={styles.stepFieldDateItem}>
                <MaterialDatePicker
                  isYear
                  label="Year"
                  views={['year']}
                  inputFormat="yyyy"
                  value={studyPeriodFromYear}
                  onDateChange={(year) => {
                    setStudyPeriodFromYear(year)
                  }}
                />
              </div>
            </div>
            
            {hasErrorOnFromPeriod && <Text textColor='red' textStyle='sm'>Start date must be earlier than completion date.</Text>}
          </div>

          {!isCurrentStudying && (
            <div className={styles.stepField}>
              <div className={styles.stepFieldHeader}>
                <Text textStyle='base' bold>To</Text>
              </div>
              <div className={classNames(styles.stepFieldBody, styles.stepFieldDate)}>
                <div className={styles.stepFieldDateItem}>
                  <MaterialDatePicker
                    label="Month"
                    views={['month']}
                    inputFormat="MMM"
                    value={studyPeriodToMonth}
                    onDateChange={(month) => {
                      setStudyPeriodToMonth(month)
                    }}
                  />
                </div>
                <div className={styles.stepFieldDateItem}>
                  <MaterialDatePicker
                    isYear
                    label="Year"
                    views={['year']}
                    inputFormat="yyyy"
                    value={studyPeriodToYear}
                    onDateChange={(year) => {
                      setStudyPeriodToYear(year)
                    }}
                  />
                </div>
              </div>
              
              {hasErrorOnToPeriod && <Text textColor='red' textStyle='sm'>Start date must be earlier than completion date.</Text>}
            </div>
          )}

          <div className={styles.stepField}>
            <MaterialLocationField
              className={styles.stepFullwidth}
              label={requiredLabel('Location')}
              value={location}
              defaultValue={location}
              onChange={onLocationSearch}
            />
          </div>

          {isShowCountry && (
            <div className={classNames(styles.stepField, styles.stepFieldCountry)}>
              <MaterialBasicSelect
                className={styles.stepFullwidth}
                label={requiredLabel('Country')}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                options={countryList}
              />
            </div>
          )}

          <div className={styles.stepField}>
            <MaterialTextField
              className={styles.stepFullwidth}
              label={'Field of Study'}
              size='small'
              value={fieldStudy}
              defaultValue={fieldStudy}
              onChange={(e) => setFieldStudy(e.target.value)}
            />
          </div>
        </div>
      )}

      {showErrorToComplete && (
        <Text textStyle='base' textColor='red' tagName='p'>Fill up the fields with (*) to proceed.</Text>
      )}

      {!showForm && (
        <div className={styles.stepFormToggle} onClick={() => newEducationForm()}>
          <img src={AddOutlineIcon} width='18' height='18' />
          <Text textColor='primaryBlue' textStyle='sm'>Add a education</Text>
        </div>
      )}

      {educations.length === 0 && (
        <div className={styles.stepField}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={hasNoEducation} 
                onChange={() => setHasNoEducation(!hasNoEducation)} 
                name='noEducation' 
              />
            }
            label={<Text textStyle='base'>I do not want to enter my Education now</Text>}
          />
        </div>
      )}

      {showForm && (
        <div className={styles.stepFormActions}>
          <MaterialButton className={styles.stepFormActionsleftBtn} variant='outlined' capitalize onClick={handleCancelForm}>
            <Text textColor='primaryBlue'>Cancel</Text>
          </MaterialButton>

          <MaterialButton disabled={isSaveDisabled} variant='contained' capitalize onClick={() => handleSaveForm()} isLoading={isUpdating}>
            <Text textColor='white'>Save</Text>
          </MaterialButton>
        </div>
      )}

      {!showForm && isMobile &&  (
        <div className={styles.stepFormActions}>
          <MaterialButton className={styles.stepFormActionsleftBtn} variant='outlined' capitalize onClick={() => router.push(backBtnUrl)}>
            <Text textColor='primaryBlue'>Back</Text>
          </MaterialButton>

          <MaterialButton variant='contained' disabled={isNextDisabled} capitalize onClick={() => handleNextBtn()} isLoading={isUpdating}>
            <Text textColor='white'>Next</Text>
          </MaterialButton>
        </div>
      )}
    </OnBoardLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return { 
      redirect: { 
        destination: '/login/jobseeker?redirect=/jobseeker-complete-profile/1102', 
        permanent: false, 
      }
    }
  }

  store.dispatch(fetchConfigRequest())
  store.dispatch(fetchUserOwnDetailRequest({accessToken}))
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response
  const userDetail = storeState.users.fetchUserOwnDetail.response

  return {
    props: {
      config,
      userDetail,
      accessToken
    },
  }
})
export default Step4