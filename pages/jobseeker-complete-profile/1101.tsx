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
import Checkbox from '@mui/material/Checkbox'
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
  getIndustryList
} from 'helpers/jobPayloadFormatter'
import { formatSalary } from 'helpers/formatter'

// Styles
import styles from './Onboard.module.scss'
import MaterialButton from 'components/MaterialButton'

const Step3 = (props: any) => {
  const currentStep = 3
  const router = useRouter()
  const dispatch = useDispatch()
  const { config, userDetail, accessToken } = props
  // console.log(userDetail, config)

  const locList = getLocationList(config)
  const jobCategoryList = getJobCategoryList(config)
  const industryList = getIndustryList(config)

  const [workExperience, setWorkExperience] = useState(userDetail?.work_experiences)
  const [showForm, setShowForm] = useState(workExperience?.length > 0 ? false : true)
  const [formCount, setFormCount] = useState(1)
  
  const { register, handleSubmit, formState: { errors }} = useForm()
  const userWorkExperiences = useSelector((store: any) => store.users.fetchUserWorkExperience.response)

  useEffect(() => {
    dispatch(fetchUserWorkExperienceRequest({accessToken}))
  }, [])

  useEffect(() => {
    if (userWorkExperiences) {
      setWorkExperience(userWorkExperiences || [])
      setShowForm(userWorkExperiences.length > 0 ? false : true)
    }
  }, [userWorkExperiences])
  
  const requiredLabel = (text: string) => {
    return (
      <>
        <span>{text}</span>
        <span className={styles.StepFieldRequired}>*</span>
      </>
    )
  }

  const errorText = (errorMessage: string) => {
    return <Text textStyle='sm' textColor='red' tagName='p' className={styles.StepFieldError}>{errorMessage}</Text>
  }

  const handleNextOrSave = (data) => {
    // eslint-disable-next-line no-console
    console.log('data: ', data)
    // const payload = {
    //   accessToken,
    //   company: "Accenture"
    //   company_industry_key: "accounting_and_finance"
    //   country_key: "ph"
    //   is_currently_work_here: 1
    //   job_category_id: [52]
    //   job_title: "Actuarial"
    //   location_key: "manila"
    //   salary: "20000"
    //   working_period_from: "2022-04-01"
    //   working_period_to: null
    // }
  }

  const WorkExperienceForm = (idx) => {
    const [jobTitle, setJobTitle] = useState('')
    const [companyName, setCompanyName] = useState('')
    // const [workLocation, setWorkLocation] = useState(null)
    const [isCurrentJob, setIsCurrentJob] = useState(false)
    const [workPeriodFromMonth, setWorkPeriodFromMonth] = useState(new Date())
    const [workPeriodFromYear, setWorkPeriodFromYear] = useState(new Date())
    const [workPeriodToMonth, setWorkPeriodToMonth] = useState(new Date())
    const [workPeriodToYear, setWorkPeriodToYear] = useState(new Date())
    const [jobFunction, setJobFunction] = useState('')
    const [industry, setIndustry] = useState('')
    const [salary, setSalary] = useState('')

    return (
      <div className={classNames(styles.StepForm, styles.Step3Form)} key={idx}>
        <div className={styles.StepField}>
          <MaterialTextField
            refs={{...register(`jobTitle-${idx}`, { 
              required: {
                value: true,
                message: 'This field is required.'
              }
            })}}
            className={styles.StepFullwidth}
            label={requiredLabel('Job Title')}
            size='small'
            value={jobTitle}
            defaultValue={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            error={errors.jobTitle ? true : false}
          />
          {errors.jobTitle && errorText(errors.jobTitle.message)}
        </div>

        <div className={styles.StepField}>
          <MaterialTextField
            refs={{...register(`companyName-${idx}`, { 
              required: {
                value: true,
                message: 'This field is required.'
              }
            })}}
            className={styles.StepFullwidth}
            label={requiredLabel('Company Name')}
            size='small'
            value={companyName}
            defaultValue={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            error={errors.companyName ? true : false}
          />
          {errors.companyName && errorText(errors.companyName.message)}
        </div>

        <div className={styles.StepField}>
          <MaterialLocationField
            fieldRef={{...register(`companyLocation-${idx}`, { 
              required: {
                value: true,
                message: 'This field is required.'
              }
            })}}
            className={styles.StepFullwidth}
            label={requiredLabel('Location')}
            error={errors.companyLocation ? true : false}
          />
          {errors.companyLocation && errorText(errors.companyLocation.message)}
        </div>

        <div className={styles.StepFieldGroup}>
          <div className={styles.StepFieldHeader}>
            <Text textStyle='base' bold>Working Period <span className={styles.StepFieldRequired}>*</span></Text>
          </div>
          <div className={styles.StepFieldBody}>
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

        <div className={styles.StepField}>
          <div className={styles.StepFieldHeader}>
            <Text textStyle='base' bold>From</Text>
          </div>
          <div className={classNames(styles.StepFieldBody, styles.StepFieldDate)}>
            <div className={styles.StepFieldDateItem}>
              <MaterialDatePicker
                label="Month"
                views={['month']}
                inputFormat="MMM"
                value={workPeriodFromMonth}
                onChange={(month) => setWorkPeriodFromMonth(month)}
              />
            </div>
            <div className={styles.StepFieldDateItem}>
              <MaterialDatePicker
                label="Year"
                views={['year']}
                inputFormat="yyyy"
                value={workPeriodFromYear}
                onChange={(year) => setWorkPeriodFromYear(year)}
              />
            </div>
          </div>
        </div>

        {!isCurrentJob && (
          <div className={styles.StepField}>
            <div className={styles.StepFieldHeader}>
              <Text textStyle='base' bold>To</Text>
            </div>
            <div className={classNames(styles.StepFieldBody, styles.StepFieldDate)}>
              <div className={styles.StepFieldDateItem}>
                <MaterialDatePicker
                  label="Month"
                  views={['month']}
                  inputFormat="MMM"
                  value={workPeriodToMonth}
                  onChange={(month) => setWorkPeriodToMonth(month)}
                />
              </div>
              <div className={styles.StepFieldDateItem}>
                <MaterialDatePicker
                  label="Year"
                  views={['year']}
                  inputFormat="yyyy"
                  value={workPeriodToYear}
                  onChange={(year) => setWorkPeriodToYear(year)}
                />
              </div>
            </div>
          </div>
        )}

        <div className={styles.StepField}>
          <MaterialSelectCheckmarks
            className={styles.StepFullwidth}
            fieldRef={{...register('specialization', { 
              required: {
                value: true,
                message: 'This field is required.'
              }
            })}}
            label={'Job Functions'}
            value={jobFunction}
            onSelect={(e) => {
              setJobFunction(e)
            }}
            options={jobCategoryList}
          />
        </div>

        <div className={styles.StepField}>
          <MaterialBasicSelect
            className={styles.StepFullwidth}
            label='Industry'
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            options={industryList}
          />
        </div>

        <div className={styles.StepField}>
          <MaterialTextField
            className={styles.StepFullwidth}
            label='Monthly Salary'
            size='small'
            value={salary}
            defaultValue={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>

        <div className={styles.Step3Editor}>
          <TextEditorField  />
        </div>
      </div>
    )
  }

  const getRegion = (location) => {
    if (!location) return
    location = location.toLowerCase().replace(/ /g, '_')
    return locList.filter((loc) => loc.key === location)[0].region
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

  return (
    <OnBoardLayout
      headingText={<Text bold textStyle='xxxl' tagName='h2'> Add your work experience 💼</Text>}
      currentStep={currentStep}
      totalStep={4}
      // backFnBtn={() => console.log('back')}
      nextFnBtn={handleSubmit(handleNextOrSave)}
      backFnBtn={() => router.push('/jobseeker-complete-profile/10')}
    >
      <div className={styles.StepNotice}>
        <Image src={InfoIcon} alt='' width='30' height='30' />
        <Text textStyle='base'>Fill in your complete work experiences will increase your chances of being shortlisted by 83%.</Text>
      </div>
      {workExperience?.length > 0 && (
        <div className={styles.StepDataList}>
          {workExperience.map((experience) => (
            <div className={styles.StepDataItem} key={experience.key}>
              <div className={styles.StepDataInfo}>
                <Text bold textStyle='base' tagName='p'>{experience.job_title}</Text>
                <Text textStyle='base' tagName='p'>{experience.company}</Text>
                <Text textStyle='base' tagName='p'>{experience.location} - {getRegion(experience.location)}</Text>
                <Text textStyle='base' tagName='p'>{moment(experience.working_period_from).format("MMMM yyyy")} to {experience.is_currently_work_here ? 'Present' : experience.working_period_to}</Text>
                <Text textStyle='base' tagName='p'>{experience.company_industry}</Text>
                <Text textStyle='base' tagName='p'>{formatSalary(experience.salary)} per month</Text>
                <Text textStyle='base' tagName='p'>{experience.description}</Text>
              </div>
              <div className={styles.StepDataActions}>
                <div 
                  className={styles.StepDataActionItem} 
                  // onClick={() => {}}
                >
                  <img src={CreateFilledIcon} width='18' height='18' />
                </div>
                <div 
                  className={styles.StepDataActionItem} 
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
        <div className={styles.Step3FormWrapper}>
          {[...Array(formCount).keys()].map((i) => (
            <WorkExperienceForm key={i} count={i}/>
          ))}
        </div>
      )}
      <div 
        className={styles.StepFormToggle} 
        onClick={() => {
          // setShowForm(!showForm)
          setFormCount(formCount + 1)
        }}
      >
        <img src={AddOutlineIcon} width='18' height='18' />
        <Text textColor='primaryBlue' textStyle='sm'>Add a work experience</Text>
      </div>
      <div className={styles.StepField}>
        <FormControlLabel
          control={
            <Checkbox defaultChecked name='noWorkExperience' />
          }
          label={<Text textStyle='base'>I have no work experience</Text>}
        />
      </div>
      {formCount > 1 && (
        <div className={styles.StepFormActions}>
          <MaterialButton variant='contained' capitalize onClick={handleSubmit(handleNextOrSave)}>
            <Text textColor='white'>Save</Text>
          </MaterialButton>
          <MaterialButton variant='outlined' capitalize>
            <Text textColor='primaryBlue'>Cancel</Text>
          </MaterialButton>
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