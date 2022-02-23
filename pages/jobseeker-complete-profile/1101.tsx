import { useState, useEffect } from 'react'
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
// import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Image from 'next/image'

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

/* Helpers*/
import {
  getJobCategoryList,
  getLocationList,
  getIndustryList,
  getCountryList,
  getJobCategoryIds,
} from 'helpers/jobPayloadFormatter'
import { formatSalary } from 'helpers/formatter'
import { removeItem, setItem } from 'helpers/localStorage'
import { STORAGE_NAME } from 'helpers/richTextEditor'

// Styles
import styles from './Onboard.module.scss'
import MaterialButton from 'components/MaterialButton'

const Step3 = (props: any) => {
  const currentStep = 3
  const router = useRouter()
  const dispatch = useDispatch()
  const { config, userDetail, accessToken } = props
  // console.log(userDetail)

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
  const [workPeriodFromMonth, setWorkPeriodFromMonth] = useState(new Date())
  const [workPeriodFromYear, setWorkPeriodFromYear] = useState(new Date())
  const [workPeriodToMonth, setWorkPeriodToMonth] = useState(new Date())
  const [workPeriodToYear, setWorkPeriodToYear] = useState(new Date())
  const [jobFunction, setJobFunction] = useState('')
  const [industry, setIndustry] = useState('')
  const [salary, setSalary] = useState('')
  const [description, setDescription] = useState('')
  const [workExperienceId, setWorkExperienceId] = useState(null)

  const [workExperience, setWorkExperience] = useState(userDetail?.work_experiences)
  const [showForm, setShowForm] = useState(workExperience?.length > 0 ? false : true)
  const [showFormActions, setShowFormActions] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  const { register, formState: { errors }} = useForm()
  const userWorkExperiences = useSelector((store: any) => store.users.fetchUserWorkExperience.response)

  useEffect(() => {
    removeItem(STORAGE_NAME)
    dispatch(fetchUserWorkExperienceRequest({accessToken}))
  }, [])

  useEffect(() => {
    if (userWorkExperiences) {
      setWorkExperience(userWorkExperiences || [])
      setShowForm(userWorkExperiences.length > 0 ? false : true)
    }
  }, [userWorkExperiences])

  useEffect(() => {
    const requireFields = jobTitle && companyName && location
    const periodFrom = workPeriodFromMonth && workPeriodFromYear
    const periodTo = workPeriodToMonth && workPeriodToYear

    if (isCurrentJob) {
      setShowFormActions(requireFields && periodFrom ? true : false)
    } else {
      setShowFormActions(requireFields && periodFrom && periodTo ? true : false)
    }
  }, [
    jobTitle, 
    companyName, 
    location, 
    isCurrentJob, 
    workPeriodFromMonth,
    workPeriodFromYear,
    workPeriodToMonth,
    workPeriodToYear
  ])
  
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
    if (!value) return ''
    value = JSON.parse(value)
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
        textEditorValue = `<p>${value[0].children[0].text}</p>`
        break
    }
    return textEditorValue
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
    setWorkPeriodFromMonth(null)
    setWorkPeriodFromYear(null)
    setWorkPeriodToMonth(null)
    setWorkPeriodToYear(null)
    setSalary('')
    setIndustry('')
    setCountry('')
    setIsShowCountry(false)
    removeItem(STORAGE_NAME)
    setDescription('')
    setJobFunction('')
  }

  const handleShowForm = () => {
    setShowForm(!showForm)
    setIsEditing(false)
    handleResetForm()
  }

  const handleSelectWorkExperience = (workExperience) => {
    setShowForm(true)
    setWorkExperienceId(workExperience.id)
    setJobTitle(workExperience.job_title)
    setCompanyName(workExperience.company)
    setLocation(getLocation(workExperience.location)[0])
    setIsCurrentJob(workExperience.is_currently_work_here)
    setWorkPeriodFromMonth(workExperience.working_period_from)
    setWorkPeriodFromYear(workExperience.working_period_from)
    setWorkPeriodToMonth(workExperience.working_period_to)
    setWorkPeriodToYear(workExperience.working_period_to)
    setSalary(workExperience.salary)
    setIndustry(industryList.filter((industry) => industry.label === workExperience.company_industry)[0].value)
    if (workExperience.location.toLowerCase() === 'overseas') {
      setCountry(countryList.filter((country) => country.key === workExperience.country_key)[0].value)
      setIsShowCountry(true)
    }
    setItem(STORAGE_NAME, workExperience.description)
    setDescription(workExperience.description)
    setJobFunction('')
  }

  const handleDeleteExperience = (id) => {
    const deletePayload = {
      accessToken,
      workExperienceId: id,
      isDelete: true,
      currentStep
    }

    dispatch(updateUserCompleteProfileRequest(deletePayload))
  }

  const handleSaveForm = () => {
    // eslint-disable-next-line no-console
    const workExperienceData = {
      job_title: jobTitle,
      company: companyName,
      country_key: country || 'ph',
      company_industry_key: industry,
      is_currently_work_here: isCurrentJob,
      job_category_id: jobFunction?.length > 0 ? getJobCategoryIds(config, jobFunction) : [],
      salary: Number(salary),
      working_period_from: `${moment(new Date(workPeriodFromYear)).format('yyyy')}-${moment(new Date(workPeriodFromMonth)).format('MM-DD')}`,
      working_period_to: isCurrentJob ? null : `${moment(new Date(workPeriodToYear)).format('yyyy')}-${moment(new Date(workPeriodToMonth)).format('MM-DD')}`,
      description: `${description}`,
      location_key: location?.key || ''
    }

    const workExperiencesPayload = {
      accessToken,
      currentStep,
      isUpdate: isEditing,
      workExperienceId,
      workExperienceData
    }
    dispatch(updateUserCompleteProfileRequest(workExperiencesPayload))
  }

  const handleCancelForm = () => {
    handleResetForm()
    setShowForm(false)
    setIsEditing(false)
  }

  return (
    <OnBoardLayout
      headingText={<Text bold textStyle='xxxl' tagName='h2'> Add your work experience 💼</Text>}
      currentStep={currentStep}
      totalStep={4}
      // nextFnBtn={() => console.log('Next')}
      backFnBtn={() => router.push('/jobseeker-complete-profile/10')}
    >
      <div className={styles.stepNotice}>
        <Image src={InfoIcon} alt='' width='30' height='30' />
        <Text textStyle='base'>Fill in your complete work experiences will increase your chances of being shortlisted by 83%.</Text>
      </div>
      {workExperience?.length > 0 && (
        <div className={styles.stepDataList}>
          {workExperience.map((experience) => (
            <div className={styles.stepDataItem} key={experience.key}>
              <div className={styles.stepDataInfo}>
                <Text bold textStyle='base' tagName='p'>{experience.job_title}</Text>
                <Text textStyle='base' tagName='p'>{experience.company}</Text>
                <Text textStyle='base' tagName='p'>{experience.location} - {getLocation(experience.location)[0].region}</Text>
                <Text textStyle='base' tagName='p'>{moment(experience.working_period_from).format("MMMM yyyy")} to {experience.is_currently_work_here ? 'Present' : experience.working_period_to}</Text>
                <Text textStyle='base' tagName='p'>{experience.company_industry}</Text>
                <Text textStyle='base' tagName='p'>{formatSalary(experience.salary)} per month</Text>
                <Text textStyle='base' tagName='p'>Description: </Text>
                
                <div className={styles.stepDataDescription} dangerouslySetInnerHTML={{__html: displayDescription(experience.description)}} />
              </div>
              <div className={styles.stepDataActions}>
                <div 
                  className={styles.stepDataActionItem} 
                  onClick={() => {
                    setIsEditing(true)
                    handleSelectWorkExperience(experience)
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
          <div className={classNames(styles.stepForm, styles.step3Form)}>
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
                  fieldRef={{...register('country', { 
                    required: {
                      value: true,
                      message: 'This field is required.'
                    }
                  })}}
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
                    label="Month"
                    views={['month']}
                    inputFormat="MMM"
                    value={workPeriodFromMonth}
                    onDateChange={(value) => setWorkPeriodFromMonth(value)}
                  />
                </div>
                <div className={styles.stepFieldDateItem}>
                  <MaterialDatePicker
                    label="Year"
                    views={['year']}
                    inputFormat="yyyy"
                    value={workPeriodFromYear}
                    onDateChange={(year) => setWorkPeriodFromYear(year)}
                  />
                </div>
              </div>
            </div>

            {!isCurrentJob && (
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
                      value={workPeriodToMonth}
                      onDateChange={(month) => setWorkPeriodToMonth(month)}
                    />
                  </div>
                  <div className={styles.stepFieldDateItem}>
                    <MaterialDatePicker
                      label="Year"
                      views={['year']}
                      inputFormat="yyyy"
                      value={workPeriodToYear}
                      onDateChange={(year) => setWorkPeriodToYear(year)}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className={styles.stepField}>
              <MaterialSelectCheckmarks
                className={styles.stepFullwidth}
                fieldRef={{...register('jobCategory')}}
                label={'Job Functions'}
                name='jobCategory'
                value={jobFunction}
                defaultValue={jobFunction}
                onSelect={(e) => setJobFunction(e)}
                options={jobCategoryList}
              />
            </div>

            <div className={styles.stepField}>
              <MaterialBasicSelect
                {...register('industry')}
                className={styles.stepFullwidth}
                label='Industry'
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                options={industryList}
              />
            </div>

            <div className={styles.stepField}>
              <MaterialTextField
                refs={{...register('salary')}}
                className={styles.stepFullwidth}
                label='Monthly Salary'
                size='small'
                value={salary}
                defaultValue={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
            
            <div className={styles.step3Editor}>
              <TextEditorField
                {...register('jobDescription')}
                fieldOnChange={(value) => setDescription(value)}
              />
            </div>
          </div>
        </div>
      )}

      {!showForm && (
        <div 
          className={styles.stepFormToggle} 
          onClick={() => handleShowForm() }
        >
          <img src={AddOutlineIcon} width='18' height='18' />
          <Text textColor='primaryBlue' textStyle='sm'>Add a work experience</Text>
        </div>
      )}

      {/* <div className={styles.stepField}>
        <FormControlLabel
          control={
            <Checkbox defaultChecked name='noWorkExperience' />
          }
          label={<Text textStyle='base'>I have no work experience</Text>}
        />
      </div> */}

      {showFormActions && showForm && (
        <div className={styles.stepFormActions}>
          <MaterialButton variant='contained' capitalize onClick={handleSaveForm}>
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