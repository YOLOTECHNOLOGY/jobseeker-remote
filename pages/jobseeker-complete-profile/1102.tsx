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

  const degreeList = getDegreeList(config)
  const countryList = getCountryList(config)
  const locList = getLocationList(config)

  const [showFormActions, setShowFormActions] = useState(false)
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
  const [showForm, setShowForm] = useState(educations?.length > 0 ? false : true)
  const [isDisabled, setIsDisabled] = useState(true)

  const userEducations = useSelector((store: any) => store.users.fetchUserEducation.response)
  const isUpdatingUserProfile = useSelector((store: any) => store.users.updateUserCompleteProfile.fetching)

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
      setShowForm(userEducations.length > 0 ? false : true)
    }
  }, [userEducations])

  useEffect(() => {
    const requireFields = school && degree
    const periodFrom = studyPeriodFromMonth && studyPeriodFromYear
    const periodTo = studyPeriodToMonth && studyPeriodToYear

    if (isCurrentStudying) {
      if (requireFields && periodFrom) {
        setShowFormActions(true)
        setIsDisabled(false)
      }

      if (!requireFields && !periodFrom) {
        setShowFormActions(false)
        setIsDisabled(true)
      }
    } else {
      if (requireFields && periodFrom && periodTo) {
        setShowFormActions(true)
        setIsDisabled(false)
      }

      if (!requireFields && !periodFrom && !periodTo) {
        setShowFormActions(false)
        setIsDisabled(true)
      }
    }
  }, [
    school, 
    degree, 
    location, 
    isCurrentStudying, 
    studyPeriodFromMonth,
    studyPeriodFromYear,
    studyPeriodToMonth,
    studyPeriodToYear
  ])

  useEffect(() => {
    if (hasNoEducation) {
      setIsDisabled(false)
      handleCancelForm()
    } 

    if (!hasNoEducation) {
      setIsDisabled(true)
      handleShowForm()
    }
  }, [hasNoEducation])

  const getLocation = (location) => {
    if (!location) return
    return locList.filter((loc) => loc.value.toLowerCase() === location.toLowerCase())
  }

  const onLocationSearch = (_, value) => {
    setIsShowCountry(value?.key === 'overseas' ? true : false)
    setLocation(value)
  }

  const handleShowForm = () => {
    setShowForm(!showForm)
    setIsEditing(false)
    handleResetForm()
  }

  const handleSelectEducation = (education) => {
    setIsEditing(true)
    setShowForm(true)
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
  }

  const handleCancelForm = () => {
    handleResetForm()
    setShowForm(false)
    setIsEditing(false)
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
      educationData
    }
    dispatch(updateUserCompleteProfileRequest(educationPayload))
  }

  const handleDeleteEducation = (id) => {
    const deletePayload = {
      accessToken,
      educationId: id,
      isDelete: true,
      currentStep
    }

    dispatch(updateUserCompleteProfileRequest(deletePayload))
  }

  return (
    <OnBoardLayout
      headingText={<Text bold textStyle='xxxl' tagName='h2'>All about your education 🎓</Text>}
      currentStep={4}
      totalStep={4}
      backFnBtn={() => router.push('/jobseeker-complete-profile/1101')}
      nextFnBtn={() => router.push('/')}
      isDisabled={showForm && isDisabled}
    >
      {educations.length > 0 && (
        <div className={styles.stepDataList}>
          {educations.map((education) => (
            <div className={styles.stepDataItem} key={education.id}>
              <div className={styles.stepDataInfo}>
                <Text bold textStyle='base' tagName='p'>{education.school}</Text>
                <Text textStyle='base' tagName='p'>{education.degree}</Text>
                <Text textStyle='base' tagName='p'>{moment(education.working_period_from).format("MMMM yyyy")} to {education.is_currently_studying ? 'Present' : education.working_period_to}</Text>
                <Text textStyle='base' tagName='p'>{education.location} - {getLocation(education.location)[0].region}</Text>
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
        <div className={classNames(styles.stepForm, styles.step4Form)}>
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
                  onDateChange={(value) => setStudyPeriodFromMonth(value)}
                />
              </div>
              <div className={styles.stepFieldDateItem}>
                <MaterialDatePicker
                  label="Year"
                  views={['year']}
                  inputFormat="yyyy"
                  value={studyPeriodFromYear}
                  onDateChange={(year) => setStudyPeriodFromYear(year)}
                />
              </div>
            </div>
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
                    onDateChange={(value) => setStudyPeriodToMonth(value)}
                  />
                </div>
                <div className={styles.stepFieldDateItem}>
                  <MaterialDatePicker
                    label="Year"
                    views={['year']}
                    inputFormat="yyyy"
                    value={studyPeriodToYear}
                    onDateChange={(year) => setStudyPeriodToYear(year)}
                  />
                </div>
              </div>
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

      {!showForm && !hasNoEducation && (
        <div className={styles.stepFormToggle} onClick={() => handleShowForm()}>
          <img src={AddOutlineIcon} width='18' height='18' />
          <Text textColor='primaryBlue' textStyle='sm'>Add a education</Text>
        </div>
      )}

      {showFormActions && showForm && (
        <div className={styles.stepFormActions}>
          <MaterialButton variant='contained' capitalize onClick={handleSaveForm} isLoading={isUpdatingUserProfile}>
            <Text textColor='white'>Save</Text>
          </MaterialButton>

          {isEditing && (
            <MaterialButton variant='outlined' capitalize onClick={handleCancelForm}>
              <Text textColor='primaryBlue'>Cancel</Text>
            </MaterialButton>
          )}
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
        destination: '/login?redirect=/jobseeker-complete-profile/1102', 
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