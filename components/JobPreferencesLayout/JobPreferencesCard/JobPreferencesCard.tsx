/* Components */
import Text from '../../Text'

/* Styles */
import styles from './JobPreferencesCard.module.scss'

type JobPreferencesCardProps = {
  title: string
  jobTitle: string
  jobType: string
  expectedSalary: string
  workingLocation: string
  workingSetting: string
  availability: string
}

const JobPreferencesCard = ({
  title,
  jobTitle,
  jobType,
  expectedSalary,
  workingLocation,
  workingSetting,
  availability
}: JobPreferencesCardProps) => {
  return (
    <div className={styles.CardContainer}>
      <Text bold textColor='primaryBlue' textStyle='xl'>
        {title}
      </Text>
      <Text tagName='p' textStyle='lg'>
        We will find jobs that are of a good match to you based on your job preferences.
      </Text>
      <ul>
          <li>
              <Text textColor='lightgrey'>Desire job title:</Text>
              <Text>{jobTitle}</Text>
          </li>
          <li>
              <Text textColor='lightgrey'>Desire job type:</Text>
              <Text>{jobType}</Text>
          </li>
          <li>
              <Text textColor='lightgrey'>Expected salary:</Text>
              <Text>{expectedSalary}</Text>
          </li>
          <li>
              <Text textColor='lightgrey'>Desire working location:</Text>
              <Text>{workingLocation}</Text>
          </li>
          <li>
              <Text textColor='lightgrey'>Desire working setting:</Text>
              <Text>{workingSetting}</Text>
          </li>
          <li>
              <Text textColor='lightgrey'>Availability:</Text>
              <Text>{availability}</Text>
          </li>
      </ul>
    </div>
  )
}

export default JobPreferencesCard