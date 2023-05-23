/* Vendors */
import moment from 'moment'

/* Components */
import { Avatar } from '@mui/material'
import Text from 'components/Text'
import ReadMore from 'components/ReadMore'

/* Helpers */
import useWindowDimensions from 'helpers/useWindowDimensions'

/* Images */
import {
  DefaultAvatar,
  LocationIcon,
  MailIcon,
  BriefcaseIcon,
  MobileIcon,
  PencilIcon,
  BodyIcon
} from '../../images'

/* Styles */
import styles from './UserProfileOverview.module.scss'
import { formatTemplateString } from 'helpers/formatter'

type UserProfileOverviewProps = {
  name: string
  location?: string
  email: string
  contactNumber?: string
  avatarUrl?: string
  description?: string
  birthdate?: string
  expLevel?: string
  lang?: object
  handleEditClick: () => void
}

const getAge = (birthDate) => {
  const now = moment(new Date())
  const then = moment(birthDate).format('YYYY-MM-DD')
  const age = now.diff(moment(then), 'years')
  return age
}

const UserProfileOverview = ({
  name,
  location,
  email,
  contactNumber,
  avatarUrl,
  description,
  birthdate,
  expLevel,
  lang,
  handleEditClick
}: UserProfileOverviewProps) => {
  const { width } = useWindowDimensions()
  const isMobile = width < 768 ? true : false
  let age 
  if (birthdate){
    age = getAge(birthdate)
  }
  
  const getYearString = (age: number) => {
    if(age > 1) {
      return formatTemplateString((lang as any).profile.year_other, {age})
    } else {
      return formatTemplateString((lang as any).profile.year_one, {age})
    }
  }

  return (
    <div className={styles.userOverview}>
      <div className={styles.userOverviewEditIcon} onClick={()=>handleEditClick()}>
        <img src={PencilIcon} width='24' height='24' />
      </div>
      <div className={styles.userOverviewAvatar}>
        <Avatar sx={{ width: '80px', height: '80px' }} src={avatarUrl || DefaultAvatar} />
      </div>
      <div className={styles.userOverviewName}>
        <Text bold={true} textColor='primaryBlue' textStyle='xl'>
          {name}
        </Text>
      </div>
      <div className={styles.userOverviewInfo}>
        {birthdate && age >= 16 && (
          <div className={styles.userOverviewInfoDetail}>
            <img src={BodyIcon} width='14' height='14' style={{ marginRight: '6px' }} />
            <Text textStyle='lg'>{getYearString(age)}</Text>
          </div>
        )}  
        {location && (
          <div className={styles.userOverviewInfoDetail}>
            <img src={LocationIcon} width='14' height='14' style={{ marginRight: '6px' }} />
            <Text textStyle='lg'>{location}</Text>
          </div>
        )}
        <div className={styles.userOverviewInfoDetail}>
          <img src={MailIcon} width='14' height='14' style={{ marginRight: '6px' }} />
          <Text textStyle='lg'>{email}</Text>
        </div>
        {contactNumber && (
          <div className={styles.userOverviewInfoDetail}>
            <img src={MobileIcon} width='14' height='14' style={{ marginRight: '6px' }} />
            <Text textStyle='lg'>{contactNumber}</Text>
          </div>
        )}
        {expLevel && (
          <div className={styles.userOverviewInfoDetail}>
            <img src={BriefcaseIcon} width='14' height='14' style={{ marginRight: '6px' }} />
            <Text textStyle='lg'>{expLevel}</Text>
          </div>
        )}
        {description && (
          <div className={styles.userOverviewInfoAbout}>
            <Text textColor='primaryBlue' textStyle='xl' bold>
              {(lang as any).profile.about}
            </Text>
            <ReadMore className={styles.readMore} size={isMobile ? 200 : 160} text={description} />
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfileOverview
