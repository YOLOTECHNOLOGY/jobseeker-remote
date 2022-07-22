import styles from './ProfileSettingCard.module.scss'
import Text from '../Text'
import MaterialButton from '../MaterialButton'

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
    <div className={styles.CardContainer}>
      <Text textColor='primaryBlue' textStyle='xl'>
        {title}
      </Text>
      <Text tagName='p' textStyle='lg'>
        {description}
      </Text>
      <MaterialButton
        className={styles.CardButton}
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
