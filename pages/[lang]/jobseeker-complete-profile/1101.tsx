import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import classNames from 'classnames/bind'
import moment from 'moment'
import { isMobile } from 'react-device-detect'

// @ts-ignore
import { END } from 'redux-saga'

/* Redux Actions */
import { wrapper } from 'store'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import {
  fetchUserWorkExperienceRequest,
  fetchUserWorkExperienceQuickUploadResume
} from 'store/actions/users/fetchUserWorkExperience'
import { updateUserOnboardingInfoRequest } from 'store/actions/users/updateUserOnboardingInfo'

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
import TextEditor from 'components/TextEditor/TextEditor'
import MaterialDatePicker from 'components/MaterialDatePicker'

// Images
import { InfoIcon, AddOutlineIcon, PencilIcon, AccountSettingDeleteIconBin } from 'images'

/* Helpers */
import {
  // getLocationList,
  getIndustryList,
  getCountryList,
  getCurrencyList
} from 'helpers/jobPayloadFormatter'
import { removeEmptyOrNullValues } from 'helpers/formatter'
import { getItem } from 'helpers/localStorage'
import { getValueById } from 'helpers/config/getValueById'
import MaterialButton from 'components/MaterialButton'
import { handleNumericInput } from '../../../helpers/handleInput'
import JobFunctionSelector from 'components/JobFunctionSelector'
import ReadMore from 'components/ReadMore'
import { getDictionary } from 'get-dictionary'

// Styles
import styles from './Onboard.module.scss'

const Step3 = (props: any) => {
  const quickUpladResumeType = getItem('quickUpladResume')
  const currentStep = 3
  const totalStep = quickUpladResumeType ? 3 : 4
  const currentStepPure = quickUpladResumeType ? 2 : 3
  const router = useRouter()
  const dispatch = useDispatch()
  const { userDetail, accessToken, lang } = props
  const isFromCreateResume = getItem('isFromCreateResume') === '1'
  const config = useSelector((store: any) => store?.config?.config?.response)
  useEffect(() => {
    dispatch(fetchConfigRequest())
  }, [])
  const nextBtnUrl = router.query?.redirect
    ? `/jobseeker-complete-profile/1102?redirect=${router.query.redirect}`
    : '/jobseeker-complete-profile/1102'
  let backBtnUrl = router.query?.redirect
    ? `/jobseeker-complete-profile/${isFromCreateResume ? '1' : '10'}?redirect=${
        router.query.redirect
      }`
    : `/jobseeker-complete-profile/${isFromCreateResume ? '1' : '10'}`

  if (quickUpladResumeType && quickUpladResumeType === 'upFile') {
    backBtnUrl = '/jobseeker-complete-profile/1'
  } else {
    if (accessToken) {
      backBtnUrl = '/jobseeker-complete-profile/1'
    } else {
      backBtnUrl = '/quick-upload-resume'
    }
  }

  // const locList = getLocationList(config)
  const industryList = getIndustryList(config)
  const countryList = getCountryList(config).map((country) => ({
    label: country.label,
    value: country.key
  }))
  const currencyList = getCurrencyList(config)

  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [location, setLocation] = useState(null)
  const [country, setCountry] = useState('')
  const [isShowCountry, setIsShowCountry] = useState(false)
  const [isCurrentJob, setIsCurrentJob] = useState(false)
  const [workPeriodFrom, setWorkPeriodFrom] = useState(null)
  const [workPeriodTo, setWorkPeriodTo] = useState(null)
  const [jobFunction, setJobFunction] = useState({ id: undefined, value: '' })
  const [industry, setIndustry] = useState('')
  const [salary, setSalary] = useState('')
  const [salaryType, setSalaryType] = useState('')
  const [description, setDescription] = useState('')
  const [hasErrorOnFromPeriod, setHasErrorOnFromPeriod] = useState(false)
  const [hasErrorOnToPeriod, setHasErrorOnToPeriod] = useState(false)

  const [workExperienceId, setWorkExperienceId] = useState(null)
  const [workExperience, setWorkExperience] = useState(
    userDetail?.work_experiences ? userDetail?.work_experiences : []
  )
  const [showForm, setShowForm] = useState(false)
  const [isSaveDisabled, setIsSaveDisabled] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isNextDisabled, setIsNextDisabled] = useState(true)
  const [hasNoWorkExperience, setHasNoWorkExperience] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState(null)
  const [showErrorToComplete, setShowErrorToComplete] = useState(false)
  const deleteLoadingRef = useRef(false)
  // increase user conversion quick upload resume
  const [isQuickUpladResume] = useState(
    quickUpladResumeType && quickUpladResumeType === 'onLine' && !accessToken
  )
  const [selectArrayIndex, setSelectArrayIndex] = useState(null)

  const {
    formState: { errors }
  } = useForm()
  const userWorkExperiences = useSelector(
    (store: any) => store.users.fetchUserWorkExperience.response
  )
  const isUpdatingUserProfile = useSelector(
    (store: any) => store.users.updateUserOnboardingInfo.fetching
  )
  const countryLabel = useMemo(() => {
    return countryList.find((item) => item.value === country)?.label
  }, [country, countryList])
  useEffect(() => {
    if (!isQuickUpladResume) {
      dispatch(fetchUserWorkExperienceRequest({ accessToken }))
    }
    setShowErrorToComplete(false)
  }, [])

  useEffect(() => {
    if (userWorkExperiences) {
      setWorkExperience(userWorkExperiences.length ? userWorkExperiences : [])
      setIsNextDisabled(userWorkExperiences.length > 1 ? false : true)
      if (userWorkExperiences.length === 1) {
        const experience = userWorkExperiences[0]
        const requireFields =
          !experience.job_title || !experience.company || !experience.working_period_from
        if (experience.is_currently_work_here && requireFields) {
          //  || experience.working_period_to
          setSelectedExperience(experience)
          setShowForm(true)
          setIsEditing(true)
          // setIsNextDisabled(true)
        } else if (
          !experience.is_currently_work_here &&
          (requireFields || !experience.working_period_to)
        ) {
          setSelectedExperience(experience)
          setShowForm(true)
          setIsEditing(true)
        } else {
          setIsNextDisabled(false)
        }
      }
      setIsUpdating(false)
    }
    deleteLoadingRef.current = false
  }, [userWorkExperiences])

  useEffect(() => {
    if (selectedExperience) {
      scrollToForm()
      setShowForm(true)
      setWorkExperienceId(selectedExperience.id)
      setJobTitle(selectedExperience.job_title)
      setCompanyName(selectedExperience.company)
      // setLocation(selectedExperience.location ? getLocation(selectedExperience.location)[0] : null)
      setIsCurrentJob(selectedExperience.is_currently_work_here)
      setWorkPeriodFrom(selectedExperience.working_period_from)
      setWorkPeriodTo(selectedExperience.working_period_to)
      setSalary(selectedExperience.salary)
      if (selectedExperience.company_industry_id)
        setIndustry(
          industryList.filter(
            (industry) => industry.id === selectedExperience.company_industry_id
          )[0].value
        )
      setSalaryType(
        currencyList.find((item) => item.id === selectedExperience.currency_id)?.value || ''
      )
      if (selectedExperience.location && selectedExperience.location.toLowerCase() === 'overseas') {
        setCountry(selectedExperience.country_key)
        setIsShowCountry(true)
      }
      setDescription(selectedExperience.description)
      setJobFunction({
        id: selectedExperience.function_job_title_id,
        value: getValueById(
          config,
          selectedExperience.function_job_title_id,
          'function_job_title_id'
        )
      })
    }
  }, [selectedExperience])

  useEffect(() => {
    setIsUpdating(isUpdatingUserProfile)
  }, [isUpdatingUserProfile])

  useEffect(() => {
    if (showForm) scrollToForm()
  }, [showForm])

  useEffect(() => {
    const periodFrom = moment(new Date(workPeriodFrom))
    const periodTo = moment(new Date(workPeriodTo))

    setHasErrorOnToPeriod(moment(periodFrom).isAfter(periodTo) ? true : false)
  }, [workPeriodFrom, workPeriodTo])

  useEffect(() => {
    const requireFields = jobTitle && companyName && workPeriodFrom
    const emptyRequiredFields = !jobTitle && !companyName && !workPeriodFrom
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
    hasErrorOnToPeriod
  ])

  useEffect(() => {
    if (hasNoWorkExperience) {
      setIsNextDisabled(false)

      if (workExperience?.length === 0) {
        setShowForm(false)
        setIsEditing(false)
      } else {
        scrollToForm()
      }
    }

    if (!hasNoWorkExperience) {
      setIsNextDisabled(userWorkExperiences.length > 0 ? false : true)
      setShowForm(workExperience?.length === 0 ? true : false)
      setIsEditing(false)
    }
  }, [hasNoWorkExperience])

  const setDisabledButton = (value) => {
    setIsSaveDisabled(!value)
    if (userWorkExperiences.length > 0 ? false : true) {
      setIsNextDisabled(!value)
    }
  }

  const requiredLabel = (text: string) => {
    return (
      <>
        <span>{text}</span>
        <span className={styles.stepFieldRequired}>*</span>
      </>
    )
  }

  const errorText = (errorMessage: any) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='p' className={styles.stepFieldError}>
        {errorMessage}
      </Text>
    )
  }

  // const onLocationSearch = (_, value) => {
  //   setIsShowCountry(value?.key === 'overseas' ? true : false)
  //   setLocation(value)
  // }

  // const getLocation = (location) => {
  //   if (!location) return
  //   return locList.filter((loc) => loc?.value.toLowerCase() === location.toLowerCase())
  // }

  const handleResetForm = () => {
    setJobTitle('')
    setWorkExperienceId(null)
    setCompanyName('')
    setLocation('')
    setIsCurrentJob(false)
    setWorkPeriodFrom(null)
    setWorkPeriodTo(null)
    setSalary('')
    setSalaryType('')
    setIndustry('')
    setCountry('')
    setIsShowCountry(false)
    setDescription('')
    setJobFunction({ value: '', id: undefined })
    setHasErrorOnFromPeriod(false)
    setHasErrorOnToPeriod(false)
    setIsUpdating(false)
    setIsSaveDisabled(true)
    setShowErrorToComplete(false)

    setSelectedExperience(null)
  }

  const newExperienceForm = () => {
    setShowForm(!showForm)
    setIsEditing(false)
    setIsNextDisabled(true)
    setSelectArrayIndex(null)
  }

  const handleDeleteExperience = (id, index?) => {
    if (deleteLoadingRef.current) return
    deleteLoadingRef.current = true
    const deletePayload = {
      accessToken,
      workExperienceId: id,
      isDelete: true,
      currentStep
    }

    if (isQuickUpladResume) {
      userWorkExperiences.splice(index, 1)
      dispatch(fetchUserWorkExperienceQuickUploadResume(null))
      dispatch(fetchUserWorkExperienceQuickUploadResume(userWorkExperiences))
    } else {
      dispatch(updateUserOnboardingInfoRequest(deletePayload))
      handleResetForm()
    }
  }

  const handleSaveForm = (proceedingPath = '') => {
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
      salary: Number(salary),
      currency_id: currencyList.find((item) => item.value === salaryType)?.id,
      working_period_from: moment(new Date(workPeriodFrom)).format('yyyy-MM-DD'),
      working_period_to: isCurrentJob ? null : moment(new Date(workPeriodTo)).format('yyyy-MM-DD'),
      description: description ? description : '',
      location_key: location?.key || '',
      function_job_title_id: jobFunction.id,
      function_job_title: jobFunction.value,
      // isQuickUpladResume
      job_categories: null,
      industry: null,
      country: null,
      location: null,
      id: null
    }
    const workExperiencesPayload = {
      accessToken,
      currentStep,
      isUpdate: isEditing,
      workExperienceId,
      workExperienceData: removeEmptyOrNullValues(workExperienceData),
      proceedingPath
    }

    if (!isQuickUpladResume) {
      dispatch(updateUserOnboardingInfoRequest(workExperiencesPayload))
    } else {
      workExperienceData.function_job_title_id = jobFunction.id
      workExperienceData.function_job_title = jobFunction.value
      workExperienceData.industry = matchedIndustry?.[0]?.key || null
      workExperienceData.country = countryLabel
      workExperienceData.location = location?.key || ''
      workExperienceData.id = Math.round(Math.random() * 1000)

      if (Object.keys(userWorkExperiences).length) {
        if (selectArrayIndex !== null) {
          userWorkExperiences.splice(selectArrayIndex, 1, workExperienceData)
          dispatch(fetchUserWorkExperienceQuickUploadResume(userWorkExperiences))
        } else {
          dispatch(
            fetchUserWorkExperienceQuickUploadResume(
              userWorkExperiences.concat([workExperienceData])
            )
          )
        }
      } else {
        dispatch(fetchUserWorkExperienceQuickUploadResume([workExperienceData]))
      }
    }

    handleResetForm()
    setShowForm(false)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    if (selectedExperience) {
      handleResetForm()
    }

    setSelectedExperience(null)
    setIsNextDisabled(!workExperience?.length && !hasNoWorkExperience)
  }

  const handleNextBtn = () => {
    if (!isNextDisabled && showForm && jobTitle && companyName) {
      handleSaveForm(nextBtnUrl)
      return
    }

    if (isNextDisabled && showForm) {
      setShowErrorToComplete(true)
      return
    }
    if (isQuickUpladResume) {
      if (hasNoWorkExperience) {
        // no workExperience
        dispatch(fetchUserWorkExperienceQuickUploadResume({ hasNoWorkExperience: true }))
      }
      router.push('/quick-upload-resume')
    } else {
      router.push(nextBtnUrl)
    }
  }

  const scrollToForm = () => {
    const stepForm = document.getElementById('step3Form')
    stepForm?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    })
  }
  const {
    addYourWorkExperience,
    fillInYourCompleteWork,
    workingPeriod,
    currentlyWorkHere,
    from,
    startDateMustBeEarlier,
    to,
    monthlySalary,
    currency,
    addWorkExperience,
    fillUpTheRequired,
    noWorkExperience,
    cancel,
    save,
    back,
    JobTitleText,
    companyNameText,
    monthYear,
    placeholder,
    readMore,
    readLess
  } = lang?.profile || {}
  return (
    <OnBoardLayout
      headingText={
        <Text bold textStyle='xxxl' tagName='h2'>
          {' '}
          {addYourWorkExperience} 💼
        </Text>
      }
      currentStep={currentStepPure}
      totalStep={totalStep}
      isMobile={isMobile}
      nextFnBtn={() => handleNextBtn()}
      isNextDisabled={isNextDisabled}
      backFnBtn={() => router.push(backBtnUrl)}
      isUpdating={isUpdating}
      lang={lang?.profile}
    >
      <div className={styles.stepNotice}>
        <img src={InfoIcon} alt='' width='30' height='30' />
        <Text textStyle='base'>{fillInYourCompleteWork}</Text>
      </div>
      {workExperience?.length > 0 && (
        <div className={styles.stepDataList}>
          {workExperience.map((experience, index) => (
            <div className={styles.stepDataItem} key={experience.id}>
              <div className={styles.stepDataInfo}>
                <Text bold textStyle='base' tagName='p'>
                  {experience?.job_title}
                </Text>
                {/* <br /> */}
                <Text textStyle='base' tagName='p'>
                  {experience?.company +
                    ' | ' +
                    (location?.value ? location?.value + ',' : '') +
                    getValueById(config, experience?.country_id, 'country_id')}
                </Text>

                <Text textStyle='base' style={{ color: '#707070' }} tagName='p'>
                  {((from, to) => {
                    const years = to.diff(from, 'year')
                    const month = to.diff(from, 'month') - years * 12 || (years ? 0 : 1)
                    return `${from?.format?.('MMMM yyyy')}-${
                      experience?.is_currently_work_here
                        ? lang?.profile?.present
                        : to?.format?.('MMMM yyyy')
                    } (${years || ''}${
                      years
                        ? `${lang?.profile?.year}${years !== 1 ? lang?.profile?.months : ''}`
                        : ''
                    }${month ? ' ' + month : ''}${
                      month
                        ? `${lang?.profile?.month}${month !== 1 ? lang?.profile?.months : ''}`
                        : ''
                    })`
                  })(
                    moment(experience?.working_period_from),
                    experience?.is_currently_work_here
                      ? moment()
                      : moment(experience.working_period_to)
                  )}
                </Text>

                <br />
                {(experience?.function_job_title ?? null) && (
                  <Text textStyle='base' style={{ color: '#707070' }} tagName='p'>
                    {lang?.profile?.jobFunction}:{' '}
                    {getValueById(
                      config,
                      experience.function_job_title_id,
                      'function_job_title_id'
                    )}
                  </Text>
                )}

                {experience?.company_industry && (
                  <Text textStyle='base' style={{ color: '#707070' }} tagName='p'>
                    {lang?.profile?.industry}:{' '}
                    {getValueById(config, experience.company_industry_id, 'industry_id')}
                  </Text>
                )}
                {/* {experience?.salary && (
                  <Text textStyle='base' tagName='p'>
                    {formatSalary(experience?.salary)} per month
                  </Text>
                )} */}

                {experience?.description && (
                  <>
                    {' '}
                    <br />
                    <div className={styles.stepDataDescription}>
                      <Text textStyle='base' tagName='p'>
                        {lang?.profile?.description}:{' '}
                      </Text>
                      <ReadMore
                        expandText={readMore}
                        shirkText={readLess}
                        size={350}
                        text={experience.description}
                      />
                      {/* <div
                      className={styles.stepDataDescription}
                      dangerouslySetInnerHTML={{ __html: experience.description }}
                    /> */}
                    </div>
                  </>
                )}
              </div>
              <div className={styles.stepDataActions}>
                <div
                  className={styles.stepDataActionItem}
                  onClick={() => {
                    setShowForm(!showForm)
                    setSelectArrayIndex(index)
                    setIsEditing(true)
                    setSelectedExperience(experience)
                  }}
                >
                  <img src={PencilIcon} width='22' height='22' />
                </div>
                <div
                  className={styles.stepDataActionItem}
                  onClick={() => {
                    handleDeleteExperience(experience.id, index)
                  }}
                >
                  <img src={AccountSettingDeleteIconBin} width='14' height='14' />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className={styles.step3FormWrapper}>
          <div id='step3Form' className={classNames(styles.stepForm, styles.step3Form)}>
            <div className={styles.stepField}>
              <MaterialTextField
                className={styles.stepFullwidth}
                label={requiredLabel(JobTitleText)}
                size='small'
                value={jobTitle}
                defaultValue={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className={styles.stepField}>
              <MaterialTextField
                className={styles.stepFullwidth}
                label={requiredLabel(companyNameText)}
                size='small'
                value={companyName}
                defaultValue={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className={styles.stepField}>
              {/* <MaterialLocationField
                className={styles.stepFullwidth}
                label={requiredLabel('Location')}
                value={location}
                defaultValue={location}
                onChange={onLocationSearch}
              /> */}
            </div>

            {isShowCountry && (
              <div className={classNames(styles.stepField, styles.stepFieldCountry)}>
                <MaterialBasicSelect
                  className={styles.stepFullwidth}
                  label={requiredLabel('Country')}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  error={errors.country ? true : false}
                  options={countryList}
                />
                {errors.country && errorText(errors.country.message as string)}
              </div>
            )}

            <div className={styles.stepFieldGroup}>
              <div className={styles.stepFieldHeader}>
                <Text textStyle='base' bold>
                  {workingPeriod} <span className={styles.stepFieldRequired}>*</span>
                </Text>
              </div>
              <div className={styles.stepFieldBody}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isCurrentJob}
                      onChange={() => setIsCurrentJob(!isCurrentJob)}
                      name='currentJob'
                    />
                  }
                  label={<Text textStyle='base'>{currentlyWorkHere}</Text>}
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
                    value={workPeriodFrom}
                    onDateChange={(value) => {
                      setWorkPeriodFrom(value)
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

            {!isCurrentJob && (
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
                      value={workPeriodTo}
                      onDateChange={(value) => {
                        setWorkPeriodTo(value)
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
            <div id='jobFunction' className={styles.stepField}>
              <JobFunctionSelector
                className={styles.stepFullwidth}
                label={lang?.profile?.jobFunction}
                title={lang?.profile?.jobFunction}
                lang={lang}
                name='jobFunction'
                isTouched
                value={jobFunction}
                onChange={(value) => setJobFunction(value)}
              />
            </div>

            <div className={styles.stepField}>
              <MaterialBasicSelect
                className={styles.stepFullwidth}
                label={lang?.profile?.industry}
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value)
                }}
                options={industryList}
              />
            </div>
            <div className={styles.stepField}>
              <MaterialBasicSelect
                className={styles.stepFullwidth}
                label={currency}
                value={salaryType}
                onChange={(e) => {
                  setSalaryType(e.target.value)
                }}
                options={currencyList}
              />
            </div>
            <div className={styles.stepField}>
              <MaterialTextField
                className={styles.stepFullwidth}
                label={monthlySalary}
                size='small'
                value={salary}
                defaultValue={salary}
                onChange={(e) => setSalary(handleNumericInput(e.target.value))}
              />
            </div>

            <div className={styles.step3Editor}>
              <TextEditor value={description} setValue={setDescription} placeholder={placeholder} />
            </div>
          </div>
        </div>
      )}

      {!showForm && (
        <div className={styles.stepFormToggle} onClick={() => newExperienceForm()}>
          <img src={AddOutlineIcon} width='18' height='18' />
          <Text textColor='primaryBlue' textStyle='sm'>
            {addWorkExperience}
          </Text>
        </div>
      )}

      {showErrorToComplete && (
        <Text textStyle='base' textColor='red' tagName='p'>
          {fillUpTheRequired}
        </Text>
      )}

      {workExperience?.length === 0 && (
        <div className={styles.stepField}>
          <FormControlLabel
            control={
              <Checkbox
                name='noWorkExperience'
                onChange={() => setHasNoWorkExperience(!hasNoWorkExperience)}
                checked={hasNoWorkExperience}
              />
            }
            label={<Text textStyle='base'>{noWorkExperience}</Text>}
          />
        </div>
      )}

      {showForm && (
        <React.Fragment>
          <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
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
          <Divider className={styles.divider} />

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
              <Text textColor='white'>Next</Text>
            </MaterialButton>
          </div>
        </React.Fragment>
      )}
    </OnBoardLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, query }) => {
  const accessToken = req.cookies.accessToken
  const lang = await getDictionary(query.lang as 'en-US')
  if (!accessToken) {
    return {
      redirect: {
        destination: '/get-started?redirect=/jobseeker-complete-profile/1',
        permanent: false,
        lang
      }
    }
  }

  store.dispatch(fetchUserOwnDetailRequest({ accessToken }))
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const userDetail = storeState.users.fetchUserOwnDetail.response
  return {
    props: {
      userDetail,
      accessToken,
      lang
    }
  }
})

export default Step3
