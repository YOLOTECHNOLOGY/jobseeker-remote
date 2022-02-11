import React, { useState } from 'react'
import classNames from 'classnames/bind'

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
  const requiredLabel = (text: string) => {
    return (
      <>
        <span>{text}</span>
        <span className={styles.StepFieldRequired}>*</span>
      </>
    )
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
              className={styles.StepFullwidth}
              label={requiredLabel('School Name')}
              size='small'
            />
          </div>

          <div className={styles.StepField}>
            <MaterialTextField
              className={styles.StepFullwidth}
              label={requiredLabel('Education Level')}
              size='small'
            />
          </div>

          <div className={styles.StepFieldGroup}>
            <div className={styles.StepFieldHeader}>
              <Text textStyle='base' bold>Study Period<span className={styles.StepFieldRequired}>*</span></Text>
            </div>
            <div className={styles.StepFieldBody}>
              <FormControlLabel
                control={
                  <Switch defaultChecked name='currentStudent' />
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
                  label='Month'
                  options={[{label: 'Full-time', value: 'full-time'}]}
                />
              </div>
              <div className={styles.StepFieldDateItem}>
                <MaterialBasicSelect
                  label='Year'
                  options={[{label: 'Full-time', value: 'full-time'}]}
                />
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
                  label='Month'
                  options={[{label: 'Full-time', value: 'full-time'}]}
                />
              </div>
              <div className={styles.StepFieldDateItem}>
                <MaterialBasicSelect
                  label='Year'
                  options={[{label: 'Full-time', value: 'full-time'}]}
                />
              </div>
            </div>
          </div>

          <div className={styles.StepField}>
            <MaterialLocationField
            className={styles.StepFullwidth}
            label={requiredLabel('Location')}
          />
          </div>

          <div className={styles.StepField}>
            <MaterialTextField
              className={styles.StepFullwidth}
              label='Field of Study'
              size='small'
            />
          </div>

          <div className={styles.StepField}>
            <FormControlLabel
              control={
                <Checkbox defaultChecked name='noEducation' />
              }
              label={<Text textStyle='base'>I do not want to enter my Education now</Text>}
            />
          </div>

          <div className={styles.StepFormActions}>
            <MaterialButton variant='contained' capitalize>
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