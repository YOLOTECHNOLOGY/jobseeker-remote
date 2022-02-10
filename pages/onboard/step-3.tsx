import classNames from 'classnames/bind'

// Components
import OnBoardLayout from 'components/OnBoardLayout'
import Text from 'components/Text'
import Image from 'next/image'
import MaterialTextField from 'components/MaterialTextField'
import MaterialLocationField from 'components/MaterialLocationField'
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel';
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import TextEditorField from 'components/TextEditor/TextEditor'

// Images
import { InfoIcon, DeleteFilledIcon, CreateFilledIcon } from 'images'

// Styles
import styles from './Onboard.module.scss'

const Step3 = () => {
  return (
    <OnBoardLayout
      headingText={<Text bold textStyle='xxxl' tagName='h2'> Add your work experience 💼</Text>}
      currentStep={3}
      totalStep={4}
      // backFnBtn={() => console.log('back')}
      // nextFnBtn={() => console.log('next')}
    >
      <div className={styles.StepNotice}>
        <Image src={InfoIcon} alt='' width='30' height='30' />
        <Text textStyle='base'>Fill in your complete work experiences will increase your chances of being shortlisted by 83%.</Text>
      </div>
      <div className={styles.Step3ExpList}>
        <div className={styles.Step3ExpItem}>
          <div className={styles.Step3ExpInfo}>
            <Text bold textStyle='base' tagName='p'>Project Manager</Text>
            <Text textStyle='base' tagName='p'>Bossjob</Text>
            <Text textStyle='base' tagName='p'>Manila - NCR Region</Text>
            <Text textStyle='base' tagName='p'>December 2017 to Present</Text>
          </div>
          <div className={styles.Step3ExpActions}>
            <div 
              className={styles.Step3ExpActionItem} 
              // onClick={() => {}}
            >
              <img src={CreateFilledIcon} width='18' height='18' />
            </div>
            <div 
              className={styles.Step3ExpActionItem} 
              // onClick={() => {}}
            >
              <img src={DeleteFilledIcon} width='18' height='18' />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.StepForm}>
        <MaterialTextField
          className={styles.StepFullwidth}
          label='Job Title *'
          size='small'
        />

        <MaterialTextField
          className={styles.StepFullwidth}
          label='Company Name *'
          size='small'
        />

        <MaterialLocationField
          className={styles.StepFullwidth}
          label='Location *'
        />

        <div className={styles.StepField}>
          <div className={styles.StepFieldHeader}>
            <Text textStyle='base' bold>Working Period *</Text>
          </div>
          <div className={styles.StepFieldBody}>
            <FormControlLabel
              control={
                <Switch defaultChecked name='currentJob' />
              }
              label={<Text textStyle='base'>I currently work here</Text>}
            />
          </div>
        </div>

        <div className={styles.StepField}>
          <div className={styles.StepFieldHeader}>
            <Text textStyle='base' bold>From</Text>
          </div>
          <div className={classNames(styles.StepFieldBody, styles.Step3Date)}>
            <MaterialBasicSelect
              label='Month'
              options={[{label: 'Full-time', value: 'full-time'}]}
            />
            <MaterialBasicSelect
              label='Year'
              options={[{label: 'Full-time', value: 'full-time'}]}
            />
          </div>
        </div>

        <div className={styles.StepField}>
          <div className={styles.StepFieldHeader}>
            <Text textStyle='base' bold>To</Text>
          </div>
          <div className={classNames(styles.StepFieldBody, styles.Step3Date)}>
            <MaterialBasicSelect
              label='Month'
              options={[{label: 'Full-time', value: 'full-time'}]}
            />
            <MaterialBasicSelect
              label='Year'
              options={[{label: 'Full-time', value: 'full-time'}]}
            />
          </div>
        </div>

        <MaterialBasicSelect
          className={styles.StepFullwidth}
          label='Job Function'
          options={[{label: 'Full-time', value: 'full-time'}]}
        />

        <MaterialBasicSelect
          className={styles.StepFullwidth}
          label='Industry'
          options={[{label: 'Full-time', value: 'full-time'}]}
        />

        <MaterialTextField
          className={styles.StepFullwidth}
          label='Monthly Salary'
          size='small'
        />

        <div className={styles.Step3Editor}>
          <TextEditorField />
        </div>

        <div className={styles.StepFullwidth}>
          <FormControlLabel
            control={
              <Checkbox defaultChecked name='noWorkExperience' />
            }
            label={<Text textStyle='base'>I have no work experience</Text>}
          />
        </div>
      </div>
    </OnBoardLayout>
  )
}

export default Step3