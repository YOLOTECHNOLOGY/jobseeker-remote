// Components
import OnBoardLayout from 'components/OnBoardLayout'
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'

// Styles
import styles from './Onboard.module.scss'

const Step2 = () => {
  return (
    <OnBoardLayout
      headingText={<Text bold textStyle='xxxl' tagName='h2'>Add your resume 📄</Text>}
      currentStep={2}
      totalStep={4}
    >
      <div className={styles.StepForm}>
        <Text className={styles.Step2Caption} textStyle='xl'>
          You can build an online resume to apply for jobs and export it <br/> with different templates. You can also upload your resume, it <br/>will be saved to your profile.
        </Text>

        <div className={styles.Step2Upload}>
          <Text textColor='red' textStyle='xsm' className={styles.Step2UploadError}>Error message here*</Text>
          <MaterialButton
            variant='contained'
            capitalize
          >
            <Text textColor='white' bold>Upload your Resume</Text>
          </MaterialButton>
          <Text textColor='darkgrey' textStyle='xsm' className={styles.Step2UploadAllowed}>PDF, DOC, DOCX. file, max 5MB</Text>
        </div>

        <Text textStyle='lg' className={styles.Step2UploadDivider}>OR</Text>

        <div className={styles.Step2Create}>
          <MaterialButton
            variant='outlined'
            size='large'
            capitalize
          >
            <Text textColor='primary' bold>Create Free Resume</Text>
          </MaterialButton>
        </div>
      </div>
    </OnBoardLayout>
  )
}

export default Step2