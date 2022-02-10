// Components
import OnBoardLayout from 'components/OnBoardLayout'
import Text from 'components/Text'
import Image from 'next/image'
import MaterialTextField from 'components/MaterialTextField'
import MaterialLocationField from 'components/MaterialLocationField'

// Images
import { InfoIcon } from 'images'

// Styles
import styles from './Onboard.module.scss'

const Step3 = () => {
  return (
    <OnBoardLayout
      headingText={<Text bold textStyle='xxxl' tagName='h2'> Add your work experience 💼</Text>}
      currentStep={3}
      totalStep={4}
    >
      <div className={styles.StepNotice}>
        <Image src={InfoIcon} alt='' width='30' height='30' />
        <Text textStyle='base'>Fill in your complete work experiences will increase your chances of being shortlisted by 83%.</Text>
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
      </div>
    </OnBoardLayout>
  )
}

export default Step3