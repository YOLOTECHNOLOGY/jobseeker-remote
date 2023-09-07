/* Vendors */
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react';
/* Components */
import { Avatar, Button } from '@mui/material'
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
  BodyIcon,
  CloseIcon

} from '../../images'
import Image from 'next/image';

/* Styles */
import styles from './UserProfileOverview.module.scss'
import { flat, formatTemplateString } from 'helpers/formatter'
import { MouseOverPopover } from '../../app/components/popover/MouseOverPopover';
import { formatLocationConfig } from 'helpers/jobPayloadFormatter'
import { useManageProfileData } from 'app/[lang]/manage-profile/DataProvider'
import { config } from '../../middleware';
import configs from '../../app/(companies)/[lang]/companies/page';
import { getLang } from 'helpers/country'
import Toast from 'app/components/Toast'

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
  referral_code?: string;
  vip?: {
    is_vip: 0 | 1;
    ended_at: string;
  };
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
  vip,
  working_since,
  referral_code,
  handleEditClick
}: UserProfileOverviewProps) => {
  const { width } = useWindowDimensions()
  const isMobile = width < 768 ? true : false
  let age
  if (birthdate) {
    age = getAge(birthdate)
  }
  const { config } = useManageProfileData();
  const { location_lists } = config


  const formattedLocationList = location_lists.map(item => item.locations).flat();

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
  const [vipModal, setVipModal] = useState(false)

  useEffect(() => {
    // alert(referral_code)
    console.log('lang:', getLang())
  }, [referral_code])
  // const getResumeTemplateHostRef = useRef('')
  // if (process.env.ENV === 'production') {
  //   getResumeTemplateHostRef.current = 'https://bossjob.ph/'
  // }
  // else if (process.env.ENV === 'development') {
  //   getResumeTemplateHostRef.current = 'https://demo.bossjob.ph/'
  // }
  // else {
  //   getResumeTemplateHostRef.current = 'https://staging.bossjob.ph/'
  // }
  return (
    <>
      <div className={styles.userOverview}>
        <div className={styles.userOverviewEditIcon} onClick={() => handleEditClick()}>
          <Image src={require('./edit.svg').default.src} width={24} height={24} alt={'edit_icon'} />
        </div>
        <div className={styles.userOverviewAvatar}>
          {
            !vip.is_vip ?
              <Avatar sx={{ width: '110px', height: '110px', margin: 0 }} src={avatarUrl || DefaultAvatar} /> :
              <div className={styles.vipAvatar}>
                <Avatar sx={{ width: '110px', height: '110px', margin: 0, border: '3px solid #FFC248' }} src={avatarUrl || DefaultAvatar} />
                <Image
                  src={require('./vip_user_icon.png').default.src}
                  width={52}
                  height={21}
                  alt=""
                  style={{ position: 'absolute', bottom: 0, right: 0 }} />
              </div>
          }
        </div>
        {vip.is_vip ?
          <div className={styles.userOverviewNameLayout}>
            <MouseOverPopover className={`${styles.userOverviewName} ${styles.userOverviewNameLayoutVip}`} value={name || '-'}></MouseOverPopover>
            <p style={{ fontSize: '14px', marginTop: '8px', textAlign: 'center', color: '#515151' }}>
              <Image
                src={require('./icon_vip_expires.png').default.src}
                width={49}
                height={17}
                alt=""
              />
              <span style={{ marginLeft: '10px' }}>Expire date {vip?.ended_at}</span>
            </p>
          </div> :
          <div className={styles.userOverviewNameLayout}>
            <MouseOverPopover className={styles.userOverviewName} value={name || '-'}></MouseOverPopover>
          </div>}

        <div className={styles.userOverviewInfo}>

          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./location1.svg').default.src}
              width={24} height={24}
              style={{ marginRight: '6px' }}
              alt={'location'}
            />
            <MouseOverPopover className={styles.profileText} value={matchedLocation?.value || '-'}></MouseOverPopover>
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
            <MouseOverPopover className={styles.profileText} value={age ? getYearString(age) : '-'}></MouseOverPopover>
          </div>

          {/* work since */}
          <div className={styles.userOverviewInfoDetail}>
            <Image src={require('./exp.svg').default.src}
              width={24} height={24}
              style={{ marginRight: '6px' }}
              alt={'location'}
            />
            <MouseOverPopover className={styles.profileText} value={working_since ? String(working_since)?.split('-').slice(0, 2).join('-') : '-'}></MouseOverPopover>

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
      <div className={styles.vipImage} onClick={() => setVipModal(true)}>
        <Button
          variant='contained'
          className={styles.btn}
        >
          Get VIP for free
        </Button>
        <span className={styles.desc}>Invite friends to get AI resume coaching</span>
        <Image
          src={require('./vip_activity_image.png').default.src}
          width={514}
          height={268}
          alt="vip_activity_image"
        />
      </div>
      {vipModal && <VipShareModal
        referral_code={referral_code}
        lang={getLang()}
        // host={getResumeTemplateHostRef.current}
        handleCloseModal={() => setVipModal(false)} />}

    </>

  )
}
const VipShareModal = ({ referral_code, lang, handleCloseModal }) => {
  const copyTextRef = useRef(null)

  return (
    <div className={styles.vipShareWrapper}>
      <div className={styles.vipShareModal}>
        <img className={styles.close} src={CloseIcon} alt="" width="17" height="17" onClick={handleCloseModal} />
        <h1>INVITE FRIENDS TO GET <span style={{ color: '#004AFF' }}>AI RESUME COACHING</span></h1>
        <h3>Invite A friends to register with Bossjob and get VIP immediately</h3>
        <div className={styles.main}>
          <div className={styles.left}>
            <p>High-quality VIP resume template and AI  assistant <br /> to help you get high-paying Offer</p>
            <img src={require('./share_modal_image.png').default.src} alt="" />
          </div>
          <div className={styles.right}>
            <p className={styles.desc}>Instant access to VIP privileges for invitees and invitees</p>
            <div className={styles.featureContent}>
              <p>
                <Image src={require('./vip_share_icon1.svg').default.src} width={26} height={26} alt="add"></Image>
                Share registration
                login link
              </p>
              <span style={{
                fontSize: '20px',
                fontWeight: 'bold'
              }}>&gt;</span>
              <p>
                < Image src={require('./vip_share_icon2.svg').default.src} width={26} height={26} alt="add"></Image>
                new user registration automatically get VIP
              </p>
            </div>
            <p className={styles.links} ref={copyTextRef}>
              <a href={`${location.origin}/${lang}/get-started?referral_code=${referral_code}&invited_source=resume_template`} target="_blank">{`${location.origin}/${lang}/get-started?referral_code=${referral_code}&invited_source=resume_template`}</a></p>
            <Button
              variant="contained"
              className={styles.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(copyTextRef.current.innerText)
                Toast.success('Link copied success!')
              }}
            >
              Copy link to invite now
            </Button>
          </div >
        </div >
      </div >
    </div >
  )
}

export default UserProfileOverview
