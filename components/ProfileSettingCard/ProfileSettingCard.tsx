/* Components */
import Text from '../Text'

/* Styles */
import styles from './ProfileSettingCard.module.scss'
/* Assets */
import {
  AddIcon
} from 'images'
type ProfileSettingCardProps = {
  title: string
  description: string
  // buttonText: string
  onClick: () => void
}

const ProfileSettingCard = ({
  title,
  description,
  // buttonText,
  onClick,
}: ProfileSettingCardProps) => {
  return (
    <div className={styles.cardContainer}>
      <div style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Text textColor='primaryBlue' textStyle='xl' bold style={{ fontSize: '24px' }}>
          {title}
        </Text>
        <span style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          width: '40px',
          height: '40px'
        }}>
          <img src={AddIcon} width='26' height='26' style={{ cursor: 'pointer' }} onClick={onClick} />
        </span>

      </div>

      <Text tagName='p' textStyle='lg'>
        {description}
      </Text>
      {/* <MaterialButton
        className={styles.cardButton}
        variant='outlined'
        capitalize={false}
        size='large'
        onClick={onClick}
        style={{ textTransform: 'none', fontSize: '16px', height: '44px' }}
      >
        {buttonText}
      </MaterialButton> */}
    </div >
  )
}

export default ProfileSettingCard
