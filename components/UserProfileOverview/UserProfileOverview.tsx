import { Avatar } from '@mui/material'
import { DefaultAvatar, LocationIcon, MailIcon, MobileIcon, PencilIcon } from '../../images'
import Text from '../Text'
import styles from './UserProfileOverview.module.scss'

type UserProfileOverviewProps = {
  name: string
  location?: string
  email: string
  contactNumber?: string
  avatarUrl?: string
  handleEditClick: () => void
}

const UserProfileOverview = ({
  name,
  location,
  email,
  contactNumber,
  avatarUrl,
  handleEditClick,
}: UserProfileOverviewProps) => {
  return (
    <div className={styles.UserOverview}>
      <div className={styles.UserOverviewEditIcon} onClick={handleEditClick}>
        <img src={PencilIcon} width='24' height='24' />
      </div>
      <div className={styles.UserOverviewAvatar}>
        <Avatar sx={{ width: '80px', height: '80px' }} src={avatarUrl || DefaultAvatar} />
      </div>
      <div className={styles.UserOverviewName}>
        <Text bold={true} textColor='primaryBlue' textStyle='xl'>
          {name}
        </Text>
      </div>
      <div className={styles.UserOverviewInfo}>
        {location && (
          <div className={styles.UserOverviewInfoDetail}>
            <img src={LocationIcon} width='14' height='14' style={{ marginRight: '6px' }} />
            <Text textStyle='lg'>{location}</Text>
          </div>
        )}
        <div className={styles.UserOverviewInfoDetail}>
          <img src={MailIcon} width='14' height='14' style={{ marginRight: '6px' }} />
          <Text textStyle='lg'>{email}</Text>
        </div>
        {contactNumber && (
          <div className={styles.UserOverviewInfoDetail}>
            <img src={MobileIcon} width='14' height='14' style={{ marginRight: '6px' }} />
            <Text textStyle='lg'>{contactNumber}</Text>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfileOverview
