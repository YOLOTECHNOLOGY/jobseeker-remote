import styles from '../../index.module.scss'
import classNames from 'classnames/bind'
import Link from 'next/link'

import Image from 'next/image'

import {UploadDocIcon} from 'images' 

interface PropsType {
  isShowBtn: Boolean
  isShowArrowIcon?: Boolean
  className?: String
  text: string
}

const UploadResumeButton = ({ isShowBtn, className, text }: PropsType) => {
  return (
    <Link href={'/quick-upload-resume'} prefetch={true}>
      {isShowBtn ? (
        <div className={classNames([styles.uploadResumeButton, className])}>
          <div className={styles.uploadResumeButtonMain}>
            <Image className={styles.uploadResumeButtonImage} src={UploadDocIcon} width={60} height={60} alt='Upload resume' />
            <div className={styles.uploadResumeButtonRight}>
              <span className={styles.uploadResumeButtonText1}>Upload Resume</span>
              <span className={styles.uploadResumeButtonText2}>Apply Job! </span>
            </div>
          </div>
          <div className={classNames([styles.uploadResumeButtonUpload])}>Login</div>
        </div>
      ) : null}
    </Link>
  )
}

export default UploadResumeButton
