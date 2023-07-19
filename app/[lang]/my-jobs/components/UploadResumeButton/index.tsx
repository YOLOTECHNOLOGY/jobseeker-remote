import styles from './index.module.scss'
import cx from 'classnames/bind'
import Link from 'next/link'

import Image from 'next/image'

import { UploadDocIcon } from 'images'

interface PropsType {
  classNames?: string
  lang?: any
}

const UploadResumeButton = (props: PropsType) => {
  const { classNames, lang } = props
  console.log('lang', lang)
  return (
    <Link
      href={'/quick-upload-resume'}
      prefetch={true}
      className={cx([styles.uploadResumeButton, classNames])}
    >
      <div className={styles.uploadResumeButtonMain}>
        <Image
          className={styles.uploadResumeButtonImage}
          src={UploadDocIcon}
          width={60}
          height={60}
          alt='Upload resume'
        />
        <div className={styles.uploadResumeButtonRight}>
          <span className={styles.uploadResumeButtonText1}>Upload Resume</span>
          <span className={styles.uploadResumeButtonText2}>Apply Job! </span>
        </div>
      </div>
      <div className={cx([styles.uploadResumeButtonUpload])}>Login</div>
    </Link>
  )
}

export default UploadResumeButton
