// Components
import OnBoardLayout from 'components/OnBoardLayout'
import Text from 'components/Text'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialTextField from 'components/MaterialTextField'
import MaterialLocationField from 'components/MaterialLocationField'
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

// Styles
import styles from './Onboard.module.scss'

const Step1 = () => {
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
      headingText={<Text bold textStyle='xxxl' tagName='h2'>Let’s get you a job! 🎉👏 <br/> Tell us about yourself.</Text>}
      currentStep={1}
      totalStep={4}
      // nextFnBtn={() => console.log('Next after step 1')}
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
              className={styles.Step1ContactNumberField}
              label={requiredLabel('Contact Number')}
              size='small'
            />
            <Text className={styles.Step1ContactDigits} textStyle='sm' textColor='darkgrey'>9 - 10 digits</Text>
          </div>
        </div>

        <div className={styles.StepField}>
          <MaterialLocationField
            className={styles.StepFullwidth}
            label={requiredLabel('Current Location')}
          />
        </div>

        <div className={styles.StepField}>
          <MaterialBasicSelect
            className={styles.StepFullwidth}
            label={requiredLabel('Availability')}
            value='Daily'
            defaultValue='Daily'
            options={[{label: 'Daily', value: 'Daily'}]}
          />
        </div>

        <div className={styles.StepField}>
          <MaterialBasicSelect
            className={styles.StepFullwidth}
            label={requiredLabel('I’m looking for jobs in these specializations')}
            value='Fronten Developer'
            defaultValue='Fronten Developer'
            options={[{label: 'Fronten Developer', value: 'Fronten Developer'}]}
          />
        </div>

        <div className={styles.Step1Salary}>
          <Text textColor='darkgrey' textStyle='base' bold>
            Expected salary per month 
            <span className={styles.StepFieldRequired}>*</span>
          </Text>
          <div className={styles.Step1SalaryRanges}>
            <MaterialBasicSelect
              className={styles.Step1SalaryRange}
              label='From'
              value='PHP'
              defaultValue='PHP'
              options={[{label: 'PHP', value: 'PHP'}]}
            />
            <MaterialBasicSelect
              className={styles.Step1SalaryRange}
              label='To'
              value='PHP'
              defaultValue='PHP'
              options={[{label: 'PHP', value: 'PHP'}]}
            />
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