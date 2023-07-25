/* Vendors */
import moment from 'moment'

/* Components */
import { Avatar } from '@mui/material'

/* Helpers */
import useWindowDimensions from 'helpers/useWindowDimensions'
/* Images */
import {
  DefaultAvatar} from '../../images'
import Image from 'next/image';

/* Styles */
import styles from './UserProfileOverview.module.scss'
import { formatTemplateString } from 'helpers/formatter'
import { MouseOverPopover } from '../../app/components/popover/MouseOverPopover';
import { useManageProfileData } from 'app/[lang]/manage-profile/DataProvider'

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
  location_id?: number;
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
  location_id,
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
  const { config } = useManageProfileData();
  const {location_lists } = config


  const formattedLocationList = location_lists.map(item=>item.locations).flat();

  const matchedLocation = formattedLocationList.find((loc) => {
    return loc?.id == location_id
  })
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
            <MouseOverPopover className={styles.profileText}  value={matchedLocation?.value || '-'}></MouseOverPopover>
            {/* <Text textStyle='lg'>{location}</Text> */}
          </div>
          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./location.svg').default.src}
              width={24} height={24}
              style={{ marginRight: '6px' }}
              alt={'address'}
            />
            <MouseOverPopover className={styles.profileText} value={address || '-'}></MouseOverPopover>
          </div>
                 
          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./birthday.svg').default.src} width={24} height={24} alt={'age'} style={{ marginRight: '6px' }} />
            <MouseOverPopover className={styles.profileText} value={ age ? getYearString(age) : '-'}></MouseOverPopover>
          </div>

          {/* work since */}
          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./exp.svg').default.src}
              width={24} height={24}
              style={{ marginRight: '6px' }}
              alt={'location'}
            />
              <MouseOverPopover className={styles.profileText} value={ working_since ? String(working_since)?.split('-').slice(0,2).join('-') : '-'}></MouseOverPopover>

          </div>

          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./email.svg').default.src}
              width={24} height={24}
              style={{ marginRight: '6px' }}
              alt={'email'}
            />
            <MouseOverPopover className={styles.profileText} value={email || '-'}></MouseOverPopover>
          </div>

          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./tel.svg').default.src}
              width={24} height={24}
              style={{ marginRight: '6px' }}
              alt={'tel'}
            />
            <MouseOverPopover className={styles.profileText} value={contactNumber || '-'}></MouseOverPopover>
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
