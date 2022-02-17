import React, { useState } from 'react'
import classNames from 'classnames/bind'
import { useForm } from 'react-hook-form'

// Components
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel';
import Image from 'next/image'

import Text from 'components/Text'
import OnBoardLayout from 'components/OnBoardLayout'
import MaterialTextField from 'components/MaterialTextField'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import TextEditorField from 'components/TextEditor/TextEditor'

// Images
import { 
  InfoIcon, 
  DeleteFilledIcon, 
  CreateFilledIcon, 
  AddOutlineIcon 
} from 'images'

// Styles
import styles from './Onboard.module.scss'
import MaterialButton from 'components/MaterialButton';

const Step3 = () => {
  const [showForm, setShowForm] = useState(false)

  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [isCurrentJob, setIsCurrentJob] = useState(false)
  const [fromMonth, setFromMonth] = useState('')
  const [fromYear, setFromYear] = useState('')
  const [toMonth, setToMonth] = useState('')
  const [toYear, setToYear] = useState('')
  const [jobFunction, setJobFunction] = useState('')
  const [industry, setIndustry] = useState('')
  const [salary, setSalary] = useState('')
  
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
      headingText={<Text bold textStyle='xxxl' tagName='h2'> Add your work experience 💼</Text>}
      currentStep={3}
      totalStep={4}
      // backFnBtn={() => console.log('back')}
      nextFnBtn={handleSubmit(handleNextOrSave)}
    >
      <div className={styles.StepNotice}>
        <Image src={InfoIcon} alt='' width='30' height='30' />
        <Text textStyle='base'>Fill in your complete work experiences will increase your chances of being shortlisted by 83%.</Text>
      </div>
      <div className={styles.StepDataList}>
        <div className={styles.StepDataItem}>
          <div className={styles.StepDataInfo}>
            <Text bold textStyle='base' tagName='p'>Project Manager</Text>
            <Text textStyle='base' tagName='p'>Bossjob</Text>
            <Text textStyle='base' tagName='p'>Manila - NCR Region</Text>
            <Text textStyle='base' tagName='p'>December 2017 to Present</Text>
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
          <Text textColor='primaryBlue' textStyle='sm'>Add a work experience</Text>
        </div>
      )}
      {showForm && (
        <div className={classNames(styles.StepForm, styles.Step3Form)}>
          <div className={styles.StepField}>
            <MaterialTextField
              fieldRef={{...register('jobTitle', { 
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
              fieldRef={{...register('companyName', { 
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
              fieldRef={{...register('companyLocation', { 
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
                  <Switch checked={isCurrentJob} onChange={() => setIsCurrentJob(!isCurrentJob)} name='currentJob' />
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
            <MaterialBasicSelect
              className={styles.StepFullwidth}
              label='Job Function'
              value={jobFunction}
              onChange={(e) => setJobFunction(e.target.value)}
              options={[{label: 'Full-time', value: 'full-time'}]}
            />
          </div>

          <div className={styles.StepField}>
            <MaterialBasicSelect
              className={styles.StepFullwidth}
              label='Industry'
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              options={[{label: 'Full-time', value: 'full-time'}]}
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
            <TextEditorField />
          </div>

          <div className={styles.StepField}>
            <FormControlLabel
              control={
                <Checkbox defaultChecked name='noWorkExperience' />
              }
              label={<Text textStyle='base'>I have no work experience</Text>}
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

export default Step3