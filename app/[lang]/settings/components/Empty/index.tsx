import React from 'react'
import styles from './index.module.scss'
import { Empty as ImageEmpty } from 'images'
import Image from 'next/image'

interface IProps {
  style?: object
  lang: any
  message?: string
}

const Empty = (props: IProps) => {
  const { lang } = props
  const { accountSetting } = lang
  const { style = {}, message = accountSetting?.noData } = props

  return (
    <div className={styles.main} style={style}>
      <div className={styles.image}>
        <Image src={ImageEmpty} fill={true} alt='empty' />
      </div>
      <div className={styles.message}>{message}</div>
    </div>
  )
}

export default Empty
