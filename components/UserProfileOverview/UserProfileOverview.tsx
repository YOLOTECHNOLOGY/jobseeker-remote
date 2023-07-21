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
import { MouseOverPopover } from '../../app/components/popover/MouseOverPopover';

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
  address?: string;
  working_since?: string;
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
  address,
  working_since,
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
      <div className={styles.userOverviewNameLayout}>
        <MouseOverPopover className={styles.userOverviewName} value={name || '-'}></MouseOverPopover>
      </div>
      <div className={styles.userOverviewInfo}>

          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./location1.svg').default.src}
              width={24} height={24}
              style={{ marginRight: '6px' }}
              alt={'location'}
            />
            <MouseOverPopover value={location || '-'}></MouseOverPopover>
            {/* <Text textStyle='lg'>{location}</Text> */}
          </div>
          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./location.svg').default.src}
              width={24} height={24}
              style={{ marginRight: '6px' }}
              alt={'address'}
            />
            <MouseOverPopover value={address || '-'}></MouseOverPopover>
          </div>
                 
          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./birthday.svg').default.src} width={24} height={24} alt={'age'} style={{ marginRight: '6px' }} />
            <MouseOverPopover value={getYearString(age) || '-'}></MouseOverPopover>
          </div>

          {/* work since */}
          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./exp.svg').default.src}
              width={24} height={24}
              style={{ marginRight: '6px' }}
              alt={'location'}
            />
              <MouseOverPopover value={working_since || '-'}></MouseOverPopover>

          </div>

          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./email.svg').default.src}
              width={24} height={24}
              style={{ marginRight: '6px' }}
              alt={'email'}
            />
            <MouseOverPopover value={email || '-'}></MouseOverPopover>
          </div>

          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./tel.svg').default.src}
              width={24} height={24}
              style={{ marginRight: '6px' }}
              alt={'tel'}
            />
            <MouseOverPopover value={contactNumber || '-'}></MouseOverPopover>
          </div>

        {/* {description && (
          <div className={styles.userOverviewInfoAbout}>
            <Text textColor='primaryBlue' textStyle='xl' bold>
              {(lang as any).profile.about}
            </Text>
            <ReadMore className={styles.readMore} size={isMobile ? 200 : 160} text={description} />
          </div>
        )} */}
      </div>
    </div>
  )
}

export default UserProfileOverview
