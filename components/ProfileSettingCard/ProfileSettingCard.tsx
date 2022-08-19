/* Components */
import Text from '../Text'
import MaterialButton from '../MaterialButton'

/* Styles */
import styles from './ProfileSettingCard.module.scss'

type ProfileSettingCardProps = {
  title: string
  description: string
  buttonText: string
  onClick: () => void
}

const ProfileSettingCard = ({
  title,
  description,
  buttonText,
  onClick,
}: ProfileSettingCardProps) => {
  return (
    <div className={styles.cardContainer}>
      <Text textColor='primaryBlue' textStyle='xl' bold>
        {title}
      </Text>
      <Text tagName='p' textStyle='lg'>
        {description}
      </Text>
      <MaterialButton
        className={styles.cardButton}
        variant='outlined'
        capitalize={false}
        size='large'
        onClick={onClick}
        style={{ textTransform: 'none', fontSize: '16px', height: '44px' }}
      >
        {buttonText}
      </MaterialButton>
    </div>
  )
}

export default ProfileSettingCard
