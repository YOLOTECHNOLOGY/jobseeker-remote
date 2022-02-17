import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
// @ts-ignore
import { END } from 'redux-saga'

/* Redux Actions */
import { wrapper } from 'store'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'

// Components
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Text from 'components/Text'
import OnBoardLayout from 'components/OnBoardLayout'
import MaterialTextField from 'components/MaterialTextField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialSelectCheckmarks from 'components/MaterialSelectCheckmarks'

/* Helpers*/
import {
  getNoticePeriodList,
  getSmsCountryList,
  getJobCategoryList,
  getSalaryOptions
} from 'helpers/jobPayloadFormatter'

// Styles
import styles from './Onboard.module.scss'

const Step1 = (props: any) => {
  const { config } = props

  const noticeList = getNoticePeriodList(config)
  const smsCountryList = getSmsCountryList(config)
  const jobCategoryList = getJobCategoryList(config)
  const salaryFromOptions = getSalaryOptions(config)

  const [contactNumber, setContactNumber] = useState('')
  const [location, setLocation] = useState(null)
  const [noticePeriod, setNoticePeriod] = useState('')
  const [specialization, setSpecialization] = useState('')

  const [salaryFrom, setSalaryFrom] = useState(salaryFromOptions[0].value)
  const [salaryTo, setSalaryTo] = useState('')
  const [salaryToOptions, setSalaryToOptions] = useState([])
  const [hasSelectedSpecMore, setHasSelectedSpecMore] = useState(false)

  const { register, handleSubmit, formState: { errors }} = useForm()

  useEffect(() => {
    getSalaryToOptions(salaryFrom)
  }, [salaryFrom])
  
  useEffect(() => {
    getSalaryToOptions(salaryFrom)
  }, [])

  const getSalaryToOptions = (salaryFrom) => {
    const salaryOptions = getSalaryOptions(config, salaryFrom, true)
    setSalaryTo(salaryOptions[0].value)
    setSalaryToOptions(salaryOptions)
  }

  const onLocationSearch = (_, value) => setLocation(value)

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

  const handleNext = (data) => {
    setHasSelectedSpecMore(data.specialization.length > 3 ? true : false)


    // eslint-disable-next-line no-console
    console.log('data: ', data)
  }

  return (
    <OnBoardLayout
      headingText={<Text bold textStyle='xxxl' tagName='h2'>Let’s get you a job! 🎉👏 <br/> Tell us about yourself.</Text>}
      currentStep={1}
      totalStep={4}
      nextFnBtn={handleSubmit(handleNext)}
    >
      <div className={styles.StepForm}>
        <div className={styles.Step1Contact}>
          <MaterialBasicSelect
            className={styles.Step1ContactCountry}
            label='Country'
            value='Philippines'
            defaultValue='Philippines'
            options={smsCountryList}
          />
          <div className={styles.Step1ContactNumber}>
            <MaterialTextField
              fieldRef={{...register('contactNumber', { 
                required: {
                  value: true,
                  message: 'This field is required.'
                },
                minLength: {
                  value: 9,
                  message: 'Must be 9 characters or more.'
                }, 
                maxLength: {
                  value: 10,
                  message: 'Must be 10 characters or less.'
                }
              })}}
              className={styles.Step1ContactNumberField}
              label={requiredLabel('Contact Number')}
              size='small'
              type='number'
              error={errors.contactNumber ? true : false}
              value={contactNumber}
              defaultValue={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
            <Text className={styles.Step1ContactDigits} textStyle='sm' textColor='darkgrey'>9 - 10 digits</Text>
            {errors.contactNumber && errorText(errors.contactNumber.message)}
          </div>
        </div>

        <div className={styles.StepField}>
          <MaterialLocationField
            fieldRef={{...register('location', { 
              required: {
                value: true,
                message: 'This field is required.'
              }
            })}}
            className={styles.StepFullwidth}
            label={requiredLabel('Current Location')}
            error={errors.location ? true : false}
            defaultValue={location}
            onChange={onLocationSearch}
          />
          {errors.location && errorText(errors.location.message)}
        </div>

        <div className={styles.StepField}>
          <MaterialBasicSelect
            className={styles.StepFullwidth}
            fieldRef={{...register('notice_period', { 
              required: {
                value: true,
                message: 'This field is required.'
              }
            })}}
            label={requiredLabel('Availability')}
            value={noticePeriod}
            onChange={(e) => setNoticePeriod(e.target.value)}
            error={errors.notice_period ? true : false}
            options={noticeList}
          />
          {errors.notice_period && errorText(errors.notice_period.message)}
        </div>

        <div className={styles.StepField}>
          <MaterialSelectCheckmarks
            className={styles.StepFullwidth}
            fieldRef={{...register('specialization', { 
              required: {
                value: true,
                message: 'This field is required.'
              }
            })}}
            label={requiredLabel('I’m looking for jobs in these specializations')}
            value={specialization}
            onSelect={(e) => {
              setSpecialization(e)
              setHasSelectedSpecMore(e.length > 3 ? true : false)
            }}
            error={errors.specialization ? true : false || hasSelectedSpecMore}
            options={jobCategoryList}
          />
          <Text textStyle='xsm' textColor={hasSelectedSpecMore ? 'red' : 'darkgrey'}>(Max of 3 Categories)</Text>
          {errors.specialization && errorText(errors.specialization.message)}
        </div>

        <div className={styles.Step1Salary}>
          <Text textColor='darkgrey' textStyle='base' bold>
            Expected salary per month 
            <span className={styles.StepFieldRequired}>*</span>
          </Text>
          <div className={styles.Step1SalaryRanges}>
            <div className={styles.Step1SalaryRange}>
              <MaterialBasicSelect
                className={styles.StepFullwidth}
                fieldRef={{...register('salaryFrom', { 
                  required: {
                    value: true,
                    message: 'This field is required.'
                  }
                })}}
                label={requiredLabel('From')}
                value={salaryFrom}
                onChange={(e) => setSalaryFrom(e.target.value)}
                error={errors.salaryFrom ? true : false}
                options={salaryFromOptions}
              />
              {errors.salaryFrom && errorText(errors.salaryFrom.message)}
            </div>
            
            {salaryTo && (
              <div className={styles.Step1SalaryRange}>
                <MaterialBasicSelect
                  className={styles.StepFullwidth}
                  fieldRef={{...register('salaryTo', { 
                    required: {
                      value: true,
                      message: 'This field is required.'
                    }
                  })}}
                  label={requiredLabel('To')}
                  value={salaryTo}
                  onChange={(e) => setSalaryTo(e.target.value)}
                  error={errors.salaryTo ? true : false}
                  options={salaryToOptions}
                />
                {errors.salaryTo && errorText(errors.salaryTo.message)}
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.Step1Subscribe}>
          <FormControlLabel
            control={
              <Switch defaultChecked name='subscribe' />
            }
            label={<Text textStyle='sm'>I’d like to join Headhunt Me to discover more job opportunities.</Text>}
          />
        </div>
      </div>
    </OnBoardLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query }) => {
  store.dispatch(fetchConfigRequest())
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response

  return {
    props: {
      config,
    },
  }
})

export default Step1
