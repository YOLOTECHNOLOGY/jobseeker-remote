import React from 'react'
import Link from 'components/Link'
import Text from 'components/Text'
import classNames from 'classnames'
import { usePathname } from 'next/navigation'

import styles from '../Header.module.scss'

interface IProps {
  langKey: string
  lang: any
}

const NavLeft = (props: IProps) => {
  const { langKey, lang } = props
  const pathname = usePathname()

  const { home, careerGuide, companies, findJobs } = lang || {}

  return (
    <ul className={styles.headerLinksList}>
      <React.Fragment>
        <li className={styles.headerLink}>
          {pathname != '/' + langKey && pathname != '/' ? (
            <Link title='Home' to={'/' + langKey}>
              <Text textStyle='base' className={styles.headerLinkText}>
                {home}
              </Text>
            </Link>
          ) : (
            <Text
              textStyle='base'
              className={classNames([styles.headerLinkText, styles.headerLinkTextCurrentPage])}
            >
              {home}
            </Text>
          )}
        </li>
        <li className={styles.headerLink}>
          {!pathname?.includes('/jobs-hiring/') ? (
            // <Link title='Jobs' to={'/' + langKey + '/jobs-hiring/job-search'}>
            //   <Text textStyle='base' className={styles.headerLinkText}>
            //     {findJobs}
            //   </Text>
            // </Link>
            <a title='Jobs' href={'/' + langKey + '/jobs-hiring/job-search'}>
              <Text textStyle='base' className={styles.headerLinkText}>
                {findJobs}
              </Text>
            </a>
          ) : (
            <Text
              textStyle='base'
              className={classNames([styles.headerLinkText, styles.headerLinkTextCurrentPage])}
            >
              {findJobs}
            </Text>
          )}
        </li>
        <li className={styles.headerLink}>
          {!pathname.includes('/companies') ? (
            <Link title='Companies' to={'/' + langKey + '/companies'}>
              <Text textStyle='base' className={styles.headerLinkText}>
                {companies}
              </Text>
            </Link>
          ) : (
            <Text
              textStyle='base'
              className={classNames([styles.headerLinkText, styles.headerLinkTextCurrentPage])}
            >
              {companies}
            </Text>
          )}
        </li>

        <li className={styles.headerLink}>
          {!pathname.includes('/talents') ? (
            <Link title='APP' to={'/' + langKey + '/talents'} aTag>
              <Text textStyle='base' className={styles.headerLinkText}>
                APP
              </Text>
            </Link>
          ) : (
            <Text
              textStyle='base'
              className={classNames([styles.headerLinkText, styles.headerLinkTextCurrentPage])}
            >
              APP
            </Text>
          )}
        </li>

        <li className={styles.headerLink} style={{ position: 'relative' }}>
          <Link title='Career Guide' to='https://blog.bossjob.ph' external>
            <Text textStyle='base' className={styles.headerLinkText}>
              {careerGuide}
            </Text>
          </Link>
        </li>
      </React.Fragment>
    </ul>
  )
}

export default NavLeft
