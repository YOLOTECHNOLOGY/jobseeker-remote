/* Vendors */
import moment from 'moment'

/* Components */
import { Avatar } from '@mui/material'
import Text from 'components/Text'
import ReadMore from 'components/ReadMore'

/* Helpers */
import useWindowDimensions from 'helpers/useWindowDimensions'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
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
import Image from 'next/image';

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
  if (birthdate) {
    age = getAge(birthdate)
  }

  const getYearString = (age: number) => {
    if (age > 1) {
      return formatTemplateString((lang as any).profile.year_other, { age })
    } else {
      return formatTemplateString((lang as any).profile.year_one, { age })
    }
  }

  return (
    <div className={styles.userOverview}>
      <div className={styles.userOverviewEditIcon} onClick={() => handleEditClick()}>
        <Image src={require('./edit.svg').default.src} width={24} height={24} alt={'edit_icon'} />
      </div>
      <div className={styles.userOverviewAvatar}>
        <Avatar sx={{ width: '110px', height: '110px', margin: 0 }} src={avatarUrl || DefaultAvatar} />
      </div>
      <div className={styles.userOverviewName}>
        {name}
      </div>
      <div className={styles.userOverviewInfo}>
        {birthdate && age >= 16 && (
          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./birthday.svg').default.src} width={24} height={24} alt={'age'} style={{ marginRight: '6px' }} />
            <Text textStyle='lg'>{getYearString(age)}</Text>
          </div>
        )}
        {location && (
          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./location.svg').default.src}
              width={24} height={24}
              style={{ marginRight: '6px' }}
              alt={'location'}
            />
            <Text textStyle='lg'>{location}</Text>
          </div>
        )}
        {email && (
          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./email.svg').default.src}
              width={24} height={24}
              style={{ marginRight: '6px' }}
              alt={'location'}
            />
            {/* <img src={MailIcon} style={{ marginRight: '6px' }} /> */}
            {/* <EmailOutlinedIcon style={{ fontSize: '15px', color: '#2379ea', marginRight: '6px' }} /> */}
            <Text textStyle='lg'>{email}</Text>
          </div>
        )}

        {contactNumber && (
          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./tel.svg').default.src}
              width={24} height={24}
              style={{ marginRight: '6px' }}
              alt={'location'}
            />
            <Text textStyle='lg'>{contactNumber}</Text>
          </div>
        )}
        {expLevel && (
          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./exp.svg').default.src}
              width={24} height={24}
              style={{ marginRight: '6px' }}
              alt={'location'}
            />
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
