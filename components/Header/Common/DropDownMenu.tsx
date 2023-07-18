import React from 'react'

import { useDispatch } from 'react-redux'

import Link from 'components/Link'
import Text from 'components/Text'

import { getLanguage, getCountryId } from 'helpers/country'
import { getValueById } from 'helpers/config/getValueById'

import { logoutRequest } from 'store/actions/auth/logout'

import styles from '../Header.module.scss'

interface IProps {
  langKey: string
  lang: any
  config: any
  pathname: string
  handleChangeNation: Function
}

const DropDownMenu = (props: IProps, ref: React.LegacyRef<HTMLDivElement>) => {
  const { langKey, lang, config, pathname, handleChangeNation } = props

  const { hiring, myJobs, accountSettings, logOut, change } = lang || {}

  const dispatch = useDispatch()

  const handleLogOut = () => {
    dispatch(logoutRequest())
  }

  return (
    <div className={styles.headerMenu} ref={ref}>
      <ul className={styles.headerMenuList}>
        <li className={styles.headerMenuItem}>
          <Link to={'/' + langKey + '/my-jobs?page=1'} className={styles.headerMenuLink}>
            <Text textStyle='base'>{myJobs}</Text>
          </Link>
        </li>
        <li className={`${styles.headerMenuItem} ${styles.headerMenuItemSet}`}>
          <Link to='/dashboard/profile/settings' className={styles.headerMenuLink}>
            <Text textStyle='base'>{accountSettings}</Text>
          </Link>
        </li>

        <li className={`${styles.headerMenuItem} ${styles.headerMenuItemSpe}`}>
          <Link
            to={process.env.BOSSHUNT_URL + '/boss'}
            aTag
            external
            className={styles.headerMenuLink}
          >
            <Text textStyle='base'>{hiring}</Text>
          </Link>
        </li>
        <li
          className={`${styles.headerMenuItem} ${styles.headerMenuItemSpe}`}
          onClick={() => handleChangeNation()}
        >
          <div className={styles.headerMenuLink}>
            <Text textStyle='base'>
              {getValueById(config, getCountryId(), 'country_id')}, {getLanguage()} -{' '}
              <span style={{ color: '#136FD3' }}>{change}</span>
            </Text>
          </div>
        </li>

        <li className={styles.headerMenuItem}>
          <div className={styles.headerMenuLink} onClick={() => handleLogOut()}>
            <Text textStyle='base'>{logOut}</Text>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default React.forwardRef(DropDownMenu)
