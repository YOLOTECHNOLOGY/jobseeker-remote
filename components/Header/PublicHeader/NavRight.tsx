import React,{useState} from 'react'
import Image from 'next/image'
import classNames from 'classnames/bind'
import { usePathname } from 'next/navigation'

/* Style */
import styles from '../Header.module.scss'

/* components */
import Link from 'components/Link'
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'
// nation
import SwitchNation from 'components/SwitchNation/SwitchNation'
import { getCountryKey } from 'helpers/country'
import DialogLogin from 'app/components/LoginDialog'

/* Images */
import {navbar_location_icon } from 'images'

interface IProps {
  lang: any
}

const NavRight = (props: IProps) => {
  const {lang} = props

  const { getStarted, hiring } = lang || {}

  const pathname = usePathname()
  const [openSwitchNationModal, setOpenSwitchNationModal] = useState<boolean>(false)
  const [open, setOpen] = useState(false)

  return (<>
      <ul className={styles.headerLinksList}>
        <React.Fragment>
          <li className={classNames([styles.headerLink, styles.headerLinkRightItem])}>
            <Link title='Employer' to={process.env.BOSSHUNT_URL + '/boss'} aTag>
              <Text textStyle='base' className={styles.headerLinkText}>
                {hiring}
              </Text>
            </Link>
          </li>
          <li className={classNames([styles.headerLink, styles.headerLinkRightItem])}>
            {!pathname?.includes?.('/get-started') ? (
              <MaterialButton
                variant='outlined'
                size='medium'
                capitalize
                className={styles.getStartedButton}
                onClick={() => setOpen(true)}
              >
                <span>{getStarted}</span>
              </MaterialButton>
            ) : (
              <MaterialButton
                variant='outlined'
                size='medium'
                capitalize
                className={styles.getStartedButton}
              >
                <span>{getStarted} </span>
              </MaterialButton>
            )}
          </li>
          <li className={classNames([styles.headerLink, styles.headerLinkRightItem])}>
            <div
              className={styles.countryItem}
              onClick={() => {
                setOpenSwitchNationModal(true)
              }}
            >
              <Image
                src={navbar_location_icon}
                className={styles.locationIcon}
                width={16}
                height={16}
                alt={'location'}
              ></Image>
              <span className={styles.label}>{getCountryKey().toUpperCase()}</span>
            </div>
          </li>
        </React.Fragment>
      </ul>

      {/* Dialog Login Modal */}
      {open && <DialogLogin open={open} handleClose={() => setOpen(false)} />}

      {/* switch nation */}
      <SwitchNation
        lang={lang}
        open={openSwitchNationModal}
        close={() => setOpenSwitchNationModal(false)}
      />
    </>)
}

export default NavRight
