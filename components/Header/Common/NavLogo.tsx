import React from 'react'
import Link from 'components/Link'
import Image from 'next/image'

import { BossjobLogo } from 'images'

import styles from '../Header.module.scss'

interface IProps {
  langKey: string
}

const Logo = (props: IProps) => {
  const { langKey } = props

  return (
    <div className={styles.headerLogo}>
      <Link title='Home' to={'/' + langKey}>
        <Image
          width={124}
          height={32}
          src={BossjobLogo}
          title='Bossjob logo'
          alt='Bossjob logo'
          style={{
            marginTop: '3px'
          }}
        />
      </Link>
    </div>
  )
}

export default Logo
