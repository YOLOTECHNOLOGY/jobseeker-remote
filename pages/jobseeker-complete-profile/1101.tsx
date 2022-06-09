import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import classNames from 'classnames/bind'
import moment from 'moment'
// @ts-ignore
import { END } from 'redux-saga'

/* Redux Actions */
import { wrapper } from 'store'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { fetchUserWorkExperienceRequest } from 'store/actions/users/fetchUserWorkExperience'
import { updateUserCompleteProfileRequest } from 'store/actions/users/updateUserCompleteProfile'

// Components
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Image from 'next/image'
import Divider from '@mui/material/Divider';

import Text from 'components/Text'
import OnBoardLayout from 'components/OnBoardLayout'
import MaterialTextField from 'components/MaterialTextField'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import TextEditorField from 'components/TextEditor/TextEditor'
import MaterialDatePicker from 'components/MaterialDatePicker'
import MaterialSelectCheckmarks from 'components/MaterialSelectCheckmarks'

// Images
import { 
  InfoIcon, 
  DeleteFilledIcon, 
  CreateFilledIcon, 
  AddOutlineIcon 
} from 'images'

/* Helpers */
import {
  getJobCategoryList,
  getLocationList,
  getIndustryList,
  getCountryList,
  getJobCategoryIds,
} from 'helpers/jobPayloadFormatter'
import { formatSalary, removeEmptyOrNullValues } from 'helpers/formatter'
import { removeItem, setItem, getItem } from 'helpers/localStorage'
import { STORAGE_NAME } from 'helpers/richTextEditor'
import useWindowDimensions from 'helpers/useWindowDimensions'

// Styles
import styles from './Onboard.module.scss'
import MaterialButton from 'components/MaterialButton'
import { handleNumericInput } from '../../helpers/handleInput'

const Step3 = (props: any) => {
  const currentStep = 3
  const router = useRouter()
  const dispatch = useDispatch()
  const { config, userDetail, accessToken } = props
  const isFromCreateResume = getItem('isFromCreateResume') === '1'
  const { width } = useWindowDimensions()
  const isMobile = width < 768 ? true : false
  
  const nextBtnUrl = router.query?.redirect ? `/jobseeker-complete-profile/1102?redirect=${router.query.redirect}` : '/jobseeker-complete-profile/1102'
  const backBtnUrl = router.query?.redirect ? `/jobseeker-complete-profile/${isFromCreateResume ? '1' : '10'}?redirect=${router.query.redirect}` : `/jobseeker-complete-profile/${isFromCreateResume ? '1' : '10'}`

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

  const [workExperienceId, setWorkExperienceId] = useState(null)
  const [workExperience, setWorkExperience] = useState(userDetail?.work_experiences)
  const [showForm, setShowForm] = useState(workExperience?.length === 0 ? true : false)
  const [isSaveDisabled, setIsSaveDisabled] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isNextDisabled, setIsNextDisabled] = useState(true)
  const [hasNoWorkExperience, setHasNoWorkExperience] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState(null)
  const [showErrorToComplete, setShowErrorToComplete] = useState(false)
  
  const { formState: { errors }} = useForm()
  const userWorkExperiences = useSelector((store: any) => store.users.fetchUserWorkExperience.response)
  const isUpdatingUserProfile = useSelector((store: any) => store.users.updateUserCompleteProfile.fetching)

  useEffect(() => {
    removeItem(STORAGE_NAME)
    dispatch(fetchUserWorkExperienceRequest({accessToken}))
    setShowErrorToComplete(false)
  }, [])

  useEffect(() => {
    if (userWorkExperiences) {
      setWorkExperience(userWorkExperiences || [])
      setIsNextDisabled(userWorkExperiences.length > 0 ? false : true)
      setIsUpdating(false)
    }
  }, [userWorkExperiences])

  useEffect(() => {
    if (selectedExperience) {
      scrollToForm()
      setShowForm(true)

      setWorkExperienceId(selectedExperience.id)
      setJobTitle(selectedExperience.job_title)
      setCompanyName(selectedExperience.company)
      setLocation(selectedExperience.location ? getLocation(selectedExperience.location)[0] : null)
      setIsCurrentJob(selectedExperience.is_currently_work_here)
      setWorkPeriodFrom(selectedExperience.working_period_from)
      setWorkPeriodTo(selectedExperience.working_period_to)
      setSalary(selectedExperience.salary)
      if (selectedExperience.company_industry) setIndustry(industryList.filter((industry) => industry.label === selectedExperience.company_industry)[0].value)
      if (selectedExperience.location && selectedExperience.location.toLowerCase() === 'overseas') {
        setCountry(countryList.filter((country) => country.key === selectedExperience.country_key)[0].value)
        setIsShowCountry(true)
      }
      if (selectedExperience.description) setItem(STORAGE_NAME, selectedExperience.description)
      
      setDescription(selectedExperience.description)
      setJobFunction(selectedExperience.job_categories)
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
  }, [
    workPeriodFrom,
    workPeriodTo
  ])

  useEffect(() => {
    const requireFields = jobTitle && companyName && location && workPeriodFrom
    const emptyRequiredFields = !jobTitle && !companyName && !location && !workPeriodFrom
    const isValidDate = !hasErrorOnFromPeriod && !hasErrorOnToPeriod

    if (isCurrentJob) {
      if (emptyRequiredFields) setDisabledButton(emptyRequiredFields && !hasErrorOnFromPeriod ? true : false)
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
      setIsNextDisabled(true)
      setShowForm(workExperience?.length === 0 ? true : false)
      setIsEditing(false)
    }
  }, [hasNoWorkExperience])

  const setDisabledButton = (value) => {
    setIsSaveDisabled(!value)
    setIsNextDisabled(!value)
  }
  
  const requiredLabel = (text: string) => {
    return (
      <>
        <span>{text}</span>
        <span className={styles.stepFieldRequired}>*</span>
      </>
    )
  }

  const errorText = (errorMessage: string) => {
    return <Text textStyle='sm' textColor='red' tagName='p' className={styles.stepFieldError}>{errorMessage}</Text>
  }

  const displayDescription = (value) => {
    try {
      value = JSON.parse(value)
      if (!value) return ''
      
      let textEditorValue = ''
      switch(value[0].type) {
        case 'numbered-list':
          const numberedLists = ['<ol>']
          value[0].children.map((item) => {
            numberedLists.push(`<li>${item.children[0].text}</li>`)
          })
          numberedLists.push('</ol>')
          textEditorValue = numberedLists.join('')
          break
        case 'bulleted-list':
          const bulletedLists = ['<ul>']
          value[0].children.map((item) => {
            bulletedLists.push(`<li>${item.children[0].text}</li>`)
          })
          bulletedLists.push('</ul>')
          textEditorValue = bulletedLists.join('')
          break
        default:
          textEditorValue = value[0].children[0].text ? `<p>${value[0].children[0].text}</p>` : ''
          break
      }
      return textEditorValue
    } catch(e) {
      return value
    }
  }

  const onLocationSearch = (_, value) => {
    setIsShowCountry(value?.key === 'overseas' ? true : false)
    setLocation(value)
  }

  const getLocation = (location) => {
    if (!location) return
    return locList.filter((loc) => loc.value.toLowerCase() === location.toLowerCase())
  }

  const handleResetForm = () => {
    setJobTitle('')
    setWorkExperienceId(null)
    setCompanyName('')
    setLocation('')
    setIsCurrentJob(false)
    setWorkPeriodFrom(null)
    setWorkPeriodTo(null)
    setSalary('')
    setIndustry('')
    setCountry('')
    setIsShowCountry(false)
    removeItem(STORAGE_NAME)
    setDescription('')
    setJobFunction([])
    setHasErrorOnFromPeriod(false)
    setHasErrorOnToPeriod(false)
    setIsUpdating(false)
    setIsSaveDisabled(true)
    removeItem(STORAGE_NAME)
    setShowErrorToComplete(false)
  }

  const newExperienceForm = () => {
    setShowForm(!showForm)
    setIsEditing(false)
    setIsNextDisabled(true)
  }

  const handleDeleteExperience = (id) => {
    const deletePayload = {
      accessToken,
      workExperienceId: id,
      isDelete: true,
      currentStep
    }

    dispatch(updateUserCompleteProfileRequest(deletePayload))
    handleResetForm()
  }

  const handleSaveForm = (proceedingPath='') => {
    // eslint-disable-next-line no-console
    const workExperienceData = {
      job_title: jobTitle,
      company: companyName,
      country_key: country || 'ph',
      company_industry_key: industry,
      is_currently_work_here: isCurrentJob,
      job_category_ids: jobFunction?.length > 0 ? getJobCategoryIds(config, jobFunction).join(',') : '',
      salary: Number(salary),
      working_period_from: moment(new Date(workPeriodFrom)).format('yyyy-MM-DD'),
      working_period_to: isCurrentJob ? null : moment(new Date(workPeriodTo)).format('yyyy-MM-DD'),
      description: description ? description : '',
      location_key: location?.key || ''
    }

    const workExperiencesPayload = {
      accessToken,
      currentStep,
      isUpdate: isEditing,
      workExperienceId,
      workExperienceData: removeEmptyOrNullValues(workExperienceData),
      proceedingPath
    }
    dispatch(updateUserCompleteProfileRequest(workExperiencesPayload))

    handleResetForm()
    setShowForm(false)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setIsNextDisabled(userWorkExperiences.length > 0 ? false : true)

    if (selectedExperience) {
      handleResetForm()
    }

    setSelectedExperience(null)
  }

  const handleNextBtn = () => {
    if (!isNextDisabled && showForm && (jobTitle && companyName && location)) {
      handleSaveForm(nextBtnUrl)
      return
    }

    if (isNextDisabled && showForm) {
      setShowErrorToComplete(true)
      return
    }

    router.push(nextBtnUrl)
  }

  const scrollToForm = () => {
    const stepForm = document.getElementById('step3Form')
    stepForm?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    })
  }

  return (
    <OnBoardLayout
      headingText={<Text bold textStyle='xxxl' tagName='h2'> Add your work experience 💼</Text>}
      currentStep={currentStep}
      totalStep={4}
      isMobile={isMobile}
      nextFnBtn={() => handleNextBtn()}
      isNextDisabled={isNextDisabled}
      backFnBtn={() => router.push(backBtnUrl)}
      isUpdating={isUpdating}
    >
      <div className={styles.stepNotice}>
        <Image src={InfoIcon} alt='' width='30' height='30' />
        <Text textStyle='base'>Fill in your complete work experiences will increase your chances of being shortlisted by 83%.</Text>
      </div>
      {workExperience?.length > 0 && (
        <div className={styles.stepDataList}>
          {workExperience.map((experience) => (
            <div className={styles.stepDataItem} key={experience.id}>
              <div className={styles.stepDataInfo}>
                <Text bold textStyle='base' tagName='p'>{experience?.job_title}</Text>
                <br/>
                <Text textStyle='base' tagName='p'>{experience?.company}</Text>
                <Text textStyle='base' tagName='p'>{experience?.location} - {getLocation(experience?.location)?.[0].region_display_name}</Text>
                <Text textStyle='base' tagName='p'>{moment(experience?.working_period_from).format("MMMM yyyy")} to {experience?.is_currently_work_here ? 'Present' : moment(experience.working_period_to).format("MMMM yyyy")}</Text>
                <br/>
                {experience?.job_categories.length > 0 && <Text textStyle='base' tagName='p'>{experience?.job_categories.join(', ')}</Text>}
                {experience?.company_industry && <Text textStyle='base' tagName='p'>{experience?.company_industry}</Text>}
                {experience?.salary && <Text textStyle='base' tagName='p'>{formatSalary(experience?.salary)} per month</Text>}
                <br/>
                {experience?.description && displayDescription(experience?.description) && (
                  <>
                    <Text textStyle='base' tagName='p'>Description: </Text>
                    <div className={styles.stepDataDescription} dangerouslySetInnerHTML={{__html: displayDescription(experience.description)}} />
                  </>
                )}
              </div>
              <div className={styles.stepDataActions}>
                <div 
                  className={styles.stepDataActionItem} 
                  onClick={() => {
                    setShowForm(!showForm)

                    setIsEditing(true)
                    setSelectedExperience(experience)
                  }}
                >
                  <img src={CreateFilledIcon} width='18' height='18' />
                </div>
                <div 
                  className={styles.stepDataActionItem} 
                  onClick={() => handleDeleteExperience(experience.id)}
                >
                  <img src={DeleteFilledIcon} width='18' height='18' />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showForm && (
        <div className={styles.step3FormWrapper}>
          <div id="step3Form" className={classNames(styles.stepForm, styles.step3Form)}>
            <div className={styles.stepField}>
              <MaterialTextField
                className={styles.stepFullwidth}
                label={requiredLabel('Job Title')}
                size='small'
                value={jobTitle}
                defaultValue={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className={styles.stepField}>
              <MaterialTextField
                className={styles.stepFullwidth}
                label={requiredLabel('Company Name')}
                size='small'
                value={companyName}
                defaultValue={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

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
                  error={errors.country ? true : false}
                  options={countryList}
                />
                {errors.country && errorText(errors.country.message)}
              </div>
            )}

            <div className={styles.stepFieldGroup}>
              <div className={styles.stepFieldHeader}>
                <Text textStyle='base' bold>Working Period <span className={styles.stepFieldRequired}>*</span></Text>
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
                  label={<Text textStyle='base'>I currently work here</Text>}
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
                    label="Month Year"
                    views={['year', 'month']}
                    inputFormat="MMM yyyy"
                    value={workPeriodFrom}
                    onDateChange={(value) => {
                      setWorkPeriodFrom(value)
                    }}
                  />
                </div>
              </div>
              {hasErrorOnFromPeriod && <Text textColor='red' textStyle='sm'>Start date must be earlier than completion date.</Text>}
            </div>

            {!isCurrentJob && (
              <div className={styles.stepField}>
                <div className={styles.stepFieldHeader}>
                  <Text textStyle='base' bold>To</Text>
                </div>
                <div className={classNames(styles.stepFieldBody, styles.stepFieldDate)}>
                  <div className={styles.stepFieldDateItem}>
                    <MaterialDatePicker
                      label="Month Year"
                      views={['year', 'month']}
                      inputFormat="MMM yyyy"
                      value={workPeriodTo}
                      onDateChange={(value) => {
                        setWorkPeriodTo(value)
                      }}
                    />
                  </div>
                </div>
                {hasErrorOnToPeriod && <Text textColor='red' textStyle='sm'>Start date must be earlier than completion date.</Text>}
              </div>
            )}

            <div id="jobFunction" className={styles.stepField}>
              <MaterialSelectCheckmarks
                className={styles.stepFullwidth}
                label={'Job Functions'}
                name='jobCategory'
                value={jobFunction}
                onSelect={(e) => setJobFunction(e)}
                options={jobCategoryList}
              />
            </div>

            <div className={styles.stepField}>
              <MaterialBasicSelect
                className={styles.stepFullwidth}
                label='Industry'
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                options={industryList}
              />
            </div>

            <div className={styles.stepField}>
              <MaterialTextField
                className={styles.stepFullwidth}
                label='Monthly Salary (PHP)'
                size='small'
                value={salary}
                defaultValue={salary}
                onChange={(e) => setSalary(handleNumericInput(e.target.value))}
              />
            </div>
            
            <div className={styles.step3Editor}>
              <TextEditorField
                fieldOnChange={(value) => setDescription(value) }
              />
            </div>
          </div>
        </div>
      )}

      {!showForm && (
        <div 
          className={styles.stepFormToggle} 
          onClick={() => newExperienceForm() }
        >
          <img src={AddOutlineIcon} width='18' height='18' />
          <Text textColor='primaryBlue' textStyle='sm'>Add a work experience</Text>
        </div>
      )}

      {showErrorToComplete && (
        <Text textStyle='base' textColor='red' tagName='p'>Fill up the required field to proceed.</Text>
      )}

      {workExperience.length === 0 && (
        <div className={styles.stepField}>
          <FormControlLabel
            control={
              <Checkbox
                name='noWorkExperience' 
                onChange={() => setHasNoWorkExperience(!hasNoWorkExperience)}
                checked={hasNoWorkExperience}
              />
            }
            label={<Text textStyle='base'>I have no work experience</Text>}
          />
        </div>
      )}

      {showForm && (
        <React.Fragment>
          <Divider style={{ marginTop: '20px', marginBottom: '20px'}}/>
          <div className={styles.stepFormActions}>
            <MaterialButton className={styles.stepFormActionsleftBtn} variant='outlined' capitalize onClick={handleCancelForm}>
              <Text textColor='primaryBlue'>Cancel</Text>
            </MaterialButton>

            <MaterialButton disabled={isSaveDisabled} variant='contained' capitalize onClick={() => handleSaveForm()} isLoading={isUpdating}>
              <Text textColor='white'>Save</Text>
            </MaterialButton>
          </div>
        </React.Fragment>
      )}

      {!showForm && isMobile &&  (
        <React.Fragment>
          <Divider className={styles.divider} />
          
          <div className={styles.stepFormActions}>
            <MaterialButton className={styles.stepFormActionsleftBtn} variant='outlined' capitalize onClick={() => router.push(backBtnUrl)}>
              <Text textColor='primaryBlue'>Back</Text>
            </MaterialButton>

            <MaterialButton variant='contained' disabled={isNextDisabled} capitalize onClick={() => handleNextBtn()} isLoading={isUpdating}>
              <Text textColor='white'>Next</Text>
            </MaterialButton>
          </div>
        </React.Fragment>
      )}
    </OnBoardLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return { 
      redirect: { 
        destination: '/login/jobseeker?redirect=/jobseeker-complete-profile/1101', 
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

export default Step3