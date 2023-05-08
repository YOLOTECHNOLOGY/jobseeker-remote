import React, { useState, useEffect ,useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import moment from 'moment'
import { isMobile } from 'react-device-detect'

// @ts-ignore
import { END } from 'redux-saga'

/* Redux Actions */
import { wrapper } from 'store'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { fetchUserEducationRequest } from 'store/actions/users/fetchUserEducation'
import { updateUserOnboardingInfoRequest } from 'store/actions/users/updateUserOnboardingInfo'
import { generateUserResumeRequest } from 'store/actions/users/generateUserResume'

// Components
import Switch from '@mui/material/Switch'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

import Text from 'components/Text'
import OnBoardLayout from 'components/OnBoardLayout'
import MaterialTextField from 'components/MaterialTextField'
// import MaterialLocationField from 'components/MaterialLocationField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialDatePicker from 'components/MaterialDatePicker'
import ModalVerifyEmail from 'components/ModalVerifyEmail'

/* Helpers*/
import { getCountryList, getLocationList, getDegreeList } from 'helpers/jobPayloadFormatter'
import { removeEmptyOrNullValues } from 'helpers/formatter'
import { getCookie } from 'helpers/cookies'
import { getItem } from 'helpers/localStorage'

// Images
import { AddOutlineIcon, PencilIcon, AccountSettingDeleteIconBin } from 'images'

// Styles
import styles from './Onboard.module.scss'
import MaterialButton from 'components/MaterialButton'
import { getDictionary } from 'get-dictionary'
const Step4 = (props: any) => {
  const { userDetail, accessToken,lang } = props

  const quickUpladResumeType = getItem('quickUpladResume')
  const currentStep = 4
  const totalStep = quickUpladResumeType ? 3 : 4
  const router = useRouter()
  const dispatch = useDispatch()
  const backBtnUrl = router.query?.redirect
    ? `/jobseeker-complete-profile/1101?redirect=${router.query.redirect}`
    : '/jobseeker-complete-profile/1101'
  const config = useSelector((store: any) => store?.config?.config?.response)

  useEffect(() => {
    dispatch(fetchConfigRequest())
  }, [])
  const degreeList = getDegreeList(config)?.filter?.(item => item.key !== "not_required")
  const countryList = getCountryList(config)
  const locList = getLocationList(config)

  const authCookie = getCookie('accessToken') || null
  const userCookie = getCookie('user') || null

  const [isEditing, setIsEditing] = useState(false)

  const [isShowModal, setIsShowModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [school, setSchool] = useState('')
  const [degree, setDegree] = useState('')
  const [location, setLocation] = useState(null)
  const [country, setCountry] = useState('')
  const [isShowCountry, setIsShowCountry] = useState(false)
  const [studyPeriodFrom, setStudyPeriodFrom] = useState(null)
  const [studyPeriodTo, setStudyPeriodTo] = useState(null)
  const [fieldStudy, setFieldStudy] = useState('')
  const [isCurrentStudying, setIsCurrentStudying] = useState(false)
  const [hasNoEducation, setHasNoEducation] = useState(false)
  const [educationId, setEducationId] = useState(null)
  const [educations, setEducations] = useState(userDetail?.educations ? userDetail?.educations : [])
  const [showForm, setShowForm] = useState(educations?.length === 0 ? true : false)
  const [isNextDisabled, setIsNextDisabled] = useState(true)
  const [isSaveDisabled, setIsSaveDisabled] = useState(true)
  const [hasErrorOnFromPeriod, setHasErrorOnFromPeriod] = useState(false)
  const [hasErrorOnToPeriod, setHasErrorOnToPeriod] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showErrorToComplete, setShowErrorToComplete] = useState(false)
  const [selectedEducation, setSelectedEducation] = useState(null)
  const [missingFields, setMissingFields] = useState<Array<string>>([])
  const deleteLoadingRef = useRef(false);
  const userEducations = useSelector((store: any) => store.users.fetchUserEducation.response)
  const isUpdatingUserProfile = useSelector(
    (store: any) => store.users.updateUserOnboardingInfo.fetching
  )
  const isGeneratingUserResume = useSelector(
    (store: any) => store.users.generateUserResume.fetching
  )
  const isCompletingUserProfile = useSelector(
    (store: any) => store.users.completeUserProfile.fetching
  )
  const completeUserProfileError = useSelector(
    (store: any) => store.users.completeUserProfile.error
  )

  const requiredLabel = (text: string) => {
    return (
      <>
        <span>{text}</span>
        <span className={styles.stepFieldRequired}>*</span>
      </>
    )
  }

  useEffect(() => {
    setIsAuthenticated(authCookie ? true : false)
  }, [])

  useEffect(() => {
    dispatch(fetchUserEducationRequest({ accessToken }))
  }, [])

  useEffect(() => {
    if (userEducations) {
      setEducations(userEducations || [])
      setIsNextDisabled(userEducations.length > 1 ? false : true)
      setIsUpdating(false)

      if (userEducations.length === 1) {
        const experience = userEducations[0]
        const requireFields =
          !experience.school ||
          // !experience.degree ||
          // !experience.location ||
          !experience.study_period_from ||
          !degreeList.filter((degree) => degree.value === experience.degree_key)[0]?.value

        if (experience.is_currently_studying && requireFields) {
          handleSelectEducation(experience)
          setShowForm(true)
          setIsEditing(true)
        } else if (
          !experience.is_currently_studying &&
          (requireFields || !experience.study_period_to)
        ) {
          handleSelectEducation(experience)
          setShowForm(true)
          setIsEditing(true)
        } else {
          setIsNextDisabled(false)
        }
      }
    }
    deleteLoadingRef.current = false;
  }, [userEducations])

  useEffect(() => {
    const periodFrom = moment(new Date(studyPeriodFrom))
    const periodTo = moment(new Date(studyPeriodTo))

    setHasErrorOnToPeriod(moment(periodFrom).isAfter(periodTo) ? true : false)
  }, [studyPeriodFrom, studyPeriodTo])

  useEffect(() => {
    const requireFields = school && degree  && studyPeriodFrom
    const emptyRequiredFields = !school && !degree  && !studyPeriodFrom
    const isValidDate = !hasErrorOnFromPeriod && !hasErrorOnToPeriod

    if (isCurrentStudying) {
      if (emptyRequiredFields)
        setDisabledButton(emptyRequiredFields && !hasErrorOnFromPeriod ? true : false)
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
    studyPeriodFrom,
    studyPeriodTo,
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

  useEffect(() => {
    if (!completeUserProfileError) {
      setMissingFields([])
    }
    const errorData = completeUserProfileError?.response?.data?.data
    if (errorData) {
      if (errorData.missing_profiles) {
        setMissingFields(errorData.missing_profiles)
      }
    }
  }, [completeUserProfileError])

  const setDisabledButton = (value) => {
    setIsSaveDisabled(!value)
    setIsNextDisabled(!value)
    if(userEducations?.length >=1){
      setIsNextDisabled(false)
    }
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
    return locList.filter((loc) => loc?.value.toLowerCase() === location.toLowerCase())
  }

  // const onLocationSearch = (_, value) => {
  //   setIsShowCountry(value?.key === 'overseas' ? true : false)
  //   setLocation(value)
  // }

  const newEducationForm = () => {
    setShowForm(!showForm)
    setIsEditing(false)
    setIsNextDisabled(true)
  }

  const handleSelectEducation = (education) => {
    scrollToForm()
    setSelectedEducation(education)
    setIsEditing(true)
    setShowForm(!showForm)
    setEducationId(education.id)
    setSchool(education.school)
    setDegree(degreeList.filter((degree) => degree.value === education.degree_key)[0]?.value)
    setLocation(education.location ? getLocation(education.location)[0] : null)
    if (education.location && education.location.toLowerCase() === 'overseas') {
      setCountry(countryList.filter((country) => country.key === education.country_key)[0].value)
      setIsShowCountry(true)
    }
    setStudyPeriodFrom(education.study_period_from)
    setStudyPeriodTo(education.study_period_to)
    setFieldStudy(education.field_of_study)
    setIsCurrentStudying(education.is_currently_studying)
  }

  const handleResetForm = () => {
    setSchool('')
    setDegree('')
    setLocation(null)
    setCountry('')
    setIsShowCountry(false)
    setStudyPeriodFrom(null)
    setStudyPeriodTo(null)
    setFieldStudy('')
    setIsCurrentStudying(false)
    setHasErrorOnFromPeriod(false)
    setHasErrorOnToPeriod(false)
    setShowErrorToComplete(false)
    setIsSaveDisabled(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setIsNextDisabled(userEducations.length >= 1 ? false : true)

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
      study_period_from: moment(new Date(studyPeriodFrom)).format('yyyy-MM-DD'),
      study_period_to: isCurrentStudying
        ? null
        : moment(new Date(studyPeriodTo)).format('yyyy-MM-DD'),
     // location_key: location?.key || '',
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
    dispatch(updateUserOnboardingInfoRequest(educationPayload))

    handleResetForm()
    setShowForm(false)
  }

  const handleDeleteEducation = (id) => {
    if(deleteLoadingRef.current) return
    deleteLoadingRef.current = true;
    const deletePayload = {
      accessToken,
      educationId: id,
      isDelete: true,
      currentStep
    }

    dispatch(updateUserOnboardingInfoRequest(deletePayload))
    handleResetForm()
  }

  const completePorfile = () => {
    const isCreateFreeResume =
      (getItem('isCreateFreeResume') || getItem('isFromCreateResume') === '1') ?? false
    const isRegisterModuleRedirect = getItem('isRegisterModuleRedirect')
    const isChatRedirect = localStorage.getItem('isChatRedirect')
    let redirect = router.query?.redirect ? router.query?.redirect : null

    if (isRegisterModuleRedirect && !quickUpladResumeType) {
      redirect = isRegisterModuleRedirect
    }
    if (isChatRedirect) {
      redirect = isChatRedirect
      localStorage.removeItem('isChatRedirect')
    }
    if (isCreateFreeResume || quickUpladResumeType === 'onLine') {
      dispatch(generateUserResumeRequest({ redirect, accessToken }))
    }

    if (quickUpladResumeType === 'onLine') {
      return
    }
    if (!isCreateFreeResume) {
      dispatch(updateUserOnboardingInfoRequest({ currentStep: 5, redirect, accessToken }))
    }
  }

  const handleNextBtn = () => {
    if (!isNextDisabled && ((showForm && school && degree ) || !showForm)) {
      if (!userCookie.is_email_verify) {
        setIsShowModal(true)
      } else {
        completePorfile()
      }

      return
    }

    setShowErrorToComplete(true)
  }

  const handleCloseModal = () => {
    setIsShowModal(false)
    completePorfile()
  }

  const {
    allAboutYourEducation,
    present,
    schoolName,
    educationLevel,
    studyPeriod,
    currentlyAttending,
    fieldOfStudy,
    fillUpTheFieldsWith,
    addAEducation,
    notWantToEnterEducation,
    startDateMustBeEarlier,
    cancel,
    save,
    from,
    to,
    monthYear,
    next,
    back
  } = lang
  return (
    <OnBoardLayout
      headingText={
        <Text bold textStyle='xxxl' tagName='h2'>
          {allAboutYourEducation} 🎓
        </Text>
      }
      currentStep={totalStep}
      totalStep={totalStep}
      isMobile={isMobile}
      backFnBtn={() => router.push(backBtnUrl)}
      nextFnBtn={() => handleNextBtn()}
      isNextDisabled={isNextDisabled}
      isUpdating={isGeneratingUserResume || isCompletingUserProfile}
      lang={lang}
    >
      {educations?.length > 0 && (
        <div className={styles.stepDataList}>
          {educations.map((education) => (
            <div className={styles.stepDataItem} key={education.id}>
              <div className={styles.stepDataInfo}>
                <Text bold textStyle='base' tagName='p'>
                  {education?.school}
                </Text>
                <br />
                <Text textStyle='base' tagName='p'>
                  {education?.degree_key}
                </Text>
                <Text textStyle='base' tagName='p'>
                  {moment(education?.study_period_from).format('MMMM yyyy')} to{' '}
                  {education?.is_currently_studying
                    ? present
                    : moment(education?.study_period_to).format('MMMM yyyy')}
                </Text>
                <br />
                {/* <Text textStyle='base' tagName='p'>
                  {education?.location} -{' '}
                  {getLocation(education?.location)?.[0]?.region_display_name}
                </Text> */}
                <Text textStyle='base' tagName='p'>
                  {education?.field_of_study}
                </Text>
              </div>
              <div className={styles.stepDataActions}>
                <div
                  className={styles.stepDataActionItem}
                  onClick={() => {
                    handleSelectEducation(education)
                  }}
                >
                  <img src={PencilIcon} width='22' height='22' />
                </div>
                <div
                  className={styles.stepDataActionItem}
                  onClick={() => handleDeleteEducation(education.id)}
                >
                  <img src={AccountSettingDeleteIconBin} width='14' height='14' />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div id='step4Form' className={classNames(styles.stepForm, styles.step4Form)}>
          <div className={styles.stepField}>
            <MaterialTextField
              className={styles.stepFullwidth}
              label={requiredLabel(schoolName)}
              size='small'
              value={school}
              defaultValue={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </div>

          <div className={styles.stepField}>
            <MaterialBasicSelect
              className={styles.stepFullwidth}
              label={requiredLabel(educationLevel)}
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              options={degreeList}
            />
          </div>

          <div className={styles.stepFieldGroup}>
            <div className={styles.stepFieldHeader}>
              <Text textStyle='base' bold>
               {studyPeriod} <span className={styles.stepFieldRequired}>*</span>
              </Text>
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
                label={<Text textStyle='base'>{currentlyAttending}</Text>}
              />
            </div>
          </div>

          <div className={styles.stepField}>
            <div className={styles.stepFieldHeader}>
              <Text textStyle='base' bold>
               {from}
              </Text>
            </div>
            <div className={classNames(styles.stepFieldBody, styles.stepFieldDate)}>
              <div className={styles.stepFieldDateItem}>
                <MaterialDatePicker
                  label={monthYear}
                  views={['year', 'month']}
                  inputFormat='MMM yyyy'
                  value={studyPeriodFrom}
                  onDateChange={(value) => {
                    setStudyPeriodFrom(value)
                  }}
                />
              </div>
            </div>

            {hasErrorOnFromPeriod && (
              <Text textColor='red' textStyle='sm'>
               {startDateMustBeEarlier}
              </Text>
            )}
          </div>

          {!isCurrentStudying && (
            <div className={styles.stepField}>
              <div className={styles.stepFieldHeader}>
                <Text textStyle='base' bold>
                  {to}
                </Text>
              </div>
              <div className={classNames(styles.stepFieldBody, styles.stepFieldDate)}>
                <div className={styles.stepFieldDateItem}>
                  <MaterialDatePicker
                    label={monthYear}
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
                 {startDateMustBeEarlier}
                </Text>
              )}
            </div>
          )}

          {/* <div className={styles.stepField}>
            <MaterialLocationField
              className={styles.stepFullwidth}
              label={requiredLabel('Location')}
              value={location}
              defaultValue={location}
              onChange={onLocationSearch}
            />
          </div> */}

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
              label={fieldOfStudy}
              size='small'
              value={fieldStudy}
              defaultValue={fieldStudy}
              onChange={(e) => setFieldStudy(e.target.value)}
            />
          </div>
        </div>
      )}

      {showErrorToComplete && (
        <Text textStyle='base' textColor='red' tagName='p'>
        {fillUpTheFieldsWith}
        </Text>
      )}
      {missingFields.length > 0 && (
        <Text textStyle='base' textColor='red' tagName='p'>
          {`Missing following fields: ${missingFields.reduce((message, missingField, index) => {
            return index == 0 ? missingField : message + ', ' + missingField
          })}`}
        </Text>
      )}

      {!showForm && (
        <div className={styles.stepFormToggle} onClick={() => newEducationForm()}>
          <img src={AddOutlineIcon} width='18' height='18' />
          <Text textColor='primaryBlue' textStyle='sm'>
            {addAEducation}
          </Text>
        </div>
      )}

      {educations?.length === 0 && (
        <div className={styles.stepField}>
          <FormControlLabel
            control={
              <Checkbox
                checked={hasNoEducation}
                onChange={() => setHasNoEducation(!hasNoEducation)}
                name='noEducation'
              />
            }
            label={<Text textStyle='base'>{notWantToEnterEducation}</Text>}
          />
        </div>
      )}

      {showForm && (
        <React.Fragment>
          <Divider className={styles.divider} />

          <div className={styles.stepFormActions}>
            <MaterialButton
              className={styles.stepFormActionsleftBtn}
              variant='outlined'
              capitalize
              onClick={handleCancelForm}
            >
              <Text textColor='primaryBlue'>{cancel}</Text>
            </MaterialButton>

            <MaterialButton
              disabled={isSaveDisabled}
              variant='contained'
              capitalize
              onClick={() => handleSaveForm()}
              isLoading={isUpdating}
            >
              <Text textColor='white'>{save}</Text>
            </MaterialButton>
          </div>
        </React.Fragment>
      )}

      {!showForm && isMobile && (
        <React.Fragment>
          <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
          <div className={styles.stepFormActions}>
            <MaterialButton
              className={styles.stepFormActionsleftBtn}
              variant='outlined'
              capitalize
              onClick={() => router.push(backBtnUrl)}
            >
              <Text textColor='primaryBlue'>{back}</Text>
            </MaterialButton>

            <MaterialButton
              variant='contained'
              disabled={isNextDisabled}
              capitalize
              onClick={() => handleNextBtn()}
              isLoading={isUpdating}
            >
              <Text textColor='white'>{next}</Text>
            </MaterialButton>
          </div>
        </React.Fragment>
      )}

      <ModalVerifyEmail
        email={isAuthenticated && userCookie ? userCookie.email : ''}
        isShowModal={isShowModal}
        handleModal={handleCloseModal}
      />
    </OnBoardLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req ,query}) => {
  const accessToken = req.cookies.accessToken
  const lang:any = await getDictionary(query.lang as 'en') || {}
  if (!accessToken) {
    return {
      redirect: {
        destination: '/get-started?redirect=/jobseeker-complete-profile/1102',
        permanent: false,
        lang:lang.profile
      }
    }
  }

  // store.dispatch(fetchConfigRequest())
  store.dispatch(fetchUserOwnDetailRequest({ accessToken }))
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  // const config = storeState.config.config.response
  const userDetail = storeState.users.fetchUserOwnDetail.response

  return {
    props: {
      // config,
      userDetail,
      accessToken,
      lang:lang.profile
    }
  }
})
export default Step4
