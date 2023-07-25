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
  const { style = {}, message = 'No data' } = props

  return (
    <div className={styles.main} style={style}>
      <Image src={ImageEmpty} width={362} height={247} alt='empty' />
      <div className={styles.message}>{message}</div>
    </div>
  )
}

export default Empty
