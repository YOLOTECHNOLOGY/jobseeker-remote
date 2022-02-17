import React, { useState } from 'react'
import classNames from 'classnames/bind'
import { useForm } from 'react-hook-form'

// Components
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel';

import Text from 'components/Text'
import OnBoardLayout from 'components/OnBoardLayout'
import MaterialTextField from 'components/MaterialTextField'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'

// Images
import { 
  DeleteFilledIcon, 
  CreateFilledIcon, 
  AddOutlineIcon 
} from 'images'

// Styles
import styles from './Onboard.module.scss'
import MaterialButton from 'components/MaterialButton';

const Step4 = () => {
  const [showForm, setShowForm] = useState(false)

  const [schoolName, setSchoolName] = useState('')
  const [educationLevel, setEducationLevel] = useState('')
  const [fromMonth, setFromMonth] = useState('')
  const [fromYear, setFromYear] = useState('')
  const [toMonth, setToMonth] = useState('')
  const [toYear, setToYear] = useState('')
  const [fieldStudy, setFieldStudy] = useState('')
  const [isCurrentStudying, setIsCurrentStudying] = useState(false)
  const [isSkipEducation, setIsSkipEducation] = useState(false)


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

  const handleNextOrSave = (data) => {
    // eslint-disable-next-line no-console
    console.log('data: ', data)
  }

  return (
    <OnBoardLayout
      headingText={<Text bold textStyle='xxxl' tagName='h2'>All about your education 🎓</Text>}
      currentStep={4}
      totalStep={4}
      // backFnBtn={() => console.log('back')}
      // nextFnBtn={() => console.log('next')}
    >
      <div className={styles.StepDataList}>
        <div className={styles.StepDataItem}>
          <div className={styles.StepDataInfo}>
            <Text bold textStyle='base' tagName='p'>School Name</Text>
            <Text textStyle='base' tagName='p'>Degree Type</Text>
            <Text textStyle='base' tagName='p'>December 2017 to Present</Text>
            <Text textStyle='base' tagName='p'>Manila - NCR Region</Text>
            <Text textStyle='base' tagName='p'>Field of Study</Text>
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
              // onClick={() => {}}
            >
              <img src={DeleteFilledIcon} width='18' height='18' />
            </div>
          </div>
        </div>
      </div>
      {!showForm && (
        <div className={styles.StepFormToggle} onClick={() => setShowForm(!showForm)}>
          <img src={AddOutlineIcon} width='18' height='18' />
          <Text textColor='primaryBlue' textStyle='sm'>Add a education</Text>
        </div>
      )}
      {showForm && (
        <div className={classNames(styles.StepForm, styles.Step4Form)}>
          <div className={styles.StepField}>
            <MaterialTextField
              refs={{...register('schoolName', { 
                required: {
                  value: true,
                  message: 'This field is required.'
                }
              })}}
              className={styles.StepFullwidth}
              label={requiredLabel('School Name')}
              size='small'
              value={schoolName}
              defaultValue={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              error={errors.schoolName ? true : false}
            />
            {errors.schoolName && errorText(errors.schoolName.message)}
          </div>

          <div className={styles.StepField}>
            <MaterialTextField
              refs={{...register('educationLevel', { 
                required: {
                  value: true,
                  message: 'This field is required.'
                }
              })}}
              className={styles.StepFullwidth}
              label={requiredLabel('School Name')}
              size='small'
              value={educationLevel}
              defaultValue={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              error={errors.educationLevel ? true : false}
            />
            {errors.educationLevel && errorText(errors.educationLevel.message)}
          </div>

          <div className={styles.StepFieldGroup}>
            <div className={styles.StepFieldHeader}>
              <Text textStyle='base' bold>Study Period<span className={styles.StepFieldRequired}>*</span></Text>
            </div>
            <div className={styles.StepFieldBody}>
              <FormControlLabel
                control={
                  <Switch checked={isCurrentStudying} onChange={() => setIsCurrentStudying(!isCurrentStudying)} name='currentStudent' />
                }
                label={<Text textStyle='base'>Currently attending</Text>}
              />
            </div>
          </div>

          <div className={styles.StepField}>
            <div className={styles.StepFieldHeader}>
              <Text textStyle='base' bold>From</Text>
            </div>
            <div className={classNames(styles.StepFieldBody, styles.StepFieldDate)}>
              <div className={styles.StepFieldDateItem}>
                <MaterialBasicSelect
                  className={styles.StepFullwidth}
                  fieldRef={{...register('fromMonth', { 
                    required: {
                      value: true,
                      message: 'This field is required.'
                    }
                  })}}
                  label={'Month'}
                  value={fromMonth}
                  onChange={(e) => setFromMonth(e.target.value)}
                  error={errors.fromMonth ? true : false}
                  options={[{label: '', value: ''}, {label: 'PHP', value: 'PHP'}]}
                />
                {errors.fromMonth && errorText(errors.fromMonth.message)}
              </div>
              <div className={styles.StepFieldDateItem}>
                <MaterialBasicSelect
                  className={styles.StepFullwidth}
                  fieldRef={{...register('fromYear', { 
                    required: {
                      value: true,
                      message: 'This field is required.'
                    }
                  })}}
                  label={'YearTo'}
                  value={fromYear}
                  onChange={(e) => setFromYear(e.target.value)}
                  error={errors.fromYear ? true : false}
                  options={[{label: '', value: ''}, {label: 'PHP', value: 'PHP'}]}
                />
                {errors.fromYear && errorText(errors.fromYear.message)}
              </div>
            </div>
          </div>

          <div className={styles.StepField}>
            <div className={styles.StepFieldHeader}>
              <Text textStyle='base' bold>To</Text>
            </div>
            <div className={classNames(styles.StepFieldBody, styles.StepFieldDate)}>
              <div className={styles.StepFieldDateItem}>
                <MaterialBasicSelect
                  className={styles.StepFullwidth}
                  fieldRef={{...register('toMonth', { 
                    required: {
                      value: true,
                      message: 'This field is required.'
                    }
                  })}}
                  label={'Month'}
                  value={toMonth}
                  onChange={(e) => setToMonth(e.target.value)}
                  error={errors.toMonth ? true : false}
                  options={[{label: '', value: ''}, {label: 'PHP', value: 'PHP'}]}
                />
                {errors.toMonth && errorText(errors.toMonth.message)}
              </div>
              <div className={styles.StepFieldDateItem}>
                <MaterialBasicSelect
                  className={styles.StepFullwidth}
                  fieldRef={{...register('toYear', { 
                    required: {
                      value: true,
                      message: 'This field is required.'
                    }
                  })}}
                  label={'Year'}
                  value={toYear}
                  onChange={(e) => setToYear(e.target.value)}
                  error={errors.toYear ? true : false}
                  options={[{label: '', value: ''}, {label: 'PHP', value: 'PHP'}]}
                />
                {errors.toYear && errorText(errors.toYear.message)}
              </div>
            </div>
          </div>

          <div className={styles.StepField}>
            <MaterialLocationField
              fieldRef={{...register('schoolLocation', { 
                required: {
                  value: true,
                  message: 'This field is required.'
                }
              })}}
              className={styles.StepFullwidth}
              label={requiredLabel('Location')}
              error={errors.schoolLocation ? true : false}
            />
            {errors.schoolLocation && errorText(errors.schoolLocation.message)}
          </div>

          <div className={styles.StepField}>
            <MaterialTextField
              className={styles.StepFullwidth}
              label={'Field of Study'}
              size='small'
              value={fieldStudy}
              defaultValue={fieldStudy}
              onChange={(e) => setFieldStudy(e.target.value)}
            />
          </div>

          <div className={styles.StepField}>
            <FormControlLabel
              control={
                <Checkbox checked={isSkipEducation} onChange={() => setIsSkipEducation(!isSkipEducation)} name='noEducation' />
              }
              label={<Text textStyle='base'>I do not want to enter my Education now</Text>}
            />
          </div>

          <div className={styles.StepFormActions}>
            <MaterialButton variant='contained' capitalize onClick={handleSubmit(handleNextOrSave)}>
              <Text textColor='white'>Save</Text>
            </MaterialButton>
            <MaterialButton variant='outlined' capitalize>
              <Text textColor='primaryBlue'>Cancel</Text>
            </MaterialButton>
          </div>
        </div>
      )}
    </OnBoardLayout>
  )
}

export default Step4