import { useState } from 'react'
import { useForm } from 'react-hook-form'

// Components
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Text from 'components/Text'
import OnBoardLayout from 'components/OnBoardLayout'
import MaterialTextField from 'components/MaterialTextField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialLocationField from 'components/MaterialLocationField'

// Styles
import styles from './Onboard.module.scss'

const Step1 = () => {
  const [contactNumber, setContactNumber] = useState('')
  const [availability, setAvailability] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const { register, handleSubmit, formState: { errors }} = useForm()

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
            value='+63'
            defaultValue='+63'
            options={[{label: '+63', value: '+63'}]}
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
          />
          {errors.location && errorText(errors.location.message)}
        </div>

        <div className={styles.StepField}>
          <MaterialBasicSelect
            className={styles.StepFullwidth}
            fieldRef={{...register('availability', { 
              required: {
                value: true,
                message: 'This field is required.'
              }
            })}}
            label={requiredLabel('Availability')}
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            error={errors.availability ? true : false}
            options={[{label: '', value: ''}, {label: '1 Month', value: '1 Month'}]}
          />
          {errors.availability && errorText(errors.availability.message)}
        </div>

        <div className={styles.StepField}>
          <MaterialBasicSelect
            className={styles.StepFullwidth}
            fieldRef={{...register('specialization', { 
              required: {
                value: true,
                message: 'This field is required.'
              }
            })}}
            label={requiredLabel('I’m looking for jobs in these specializations')}
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            error={errors.specialization ? true : false}
            options={[{label: '', value: ''}, {label: 'Fronten Developer', value: 'Fronten Developer'}]}
          />
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
                fieldRef={{...register('fromDate', { 
                  required: {
                    value: true,
                    message: 'This field is required.'
                  }
                })}}
                label={requiredLabel('From')}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                error={errors.fromDate ? true : false}
                options={[{label: '', value: ''}, {label: 'PHP', value: 'PHP'}]}
              />
              {errors.fromDate && errorText(errors.fromDate.message)}
            </div>
            
            <div className={styles.Step1SalaryRange}>
              <MaterialBasicSelect
                className={styles.StepFullwidth}
                fieldRef={{...register('toDate', { 
                  required: {
                    value: true,
                    message: 'This field is required.'
                  }
                })}}
                label={requiredLabel('To')}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                error={errors.toDate ? true : false}
                options={[{label: '', value: ''}, {label: 'PHP', value: 'PHP'}]}
              />
              {errors.toDate && errorText(errors.toDate.message)}
            </div>
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

export default Step1