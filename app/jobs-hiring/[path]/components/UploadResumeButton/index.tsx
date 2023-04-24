
import styles from '../../index.module.scss'
import { quickCreateResume, ncreaseUserConversionDetailsBackgroundarrowArrow } from 'images'
import classNames from 'classnames/bind'
import Link from 'next/link'
interface PropsType {
  isShowBtn: Boolean
  isShowArrowIcon?: Boolean
  className?: String
}

const UploadResumeButton = ({ isShowBtn, isShowArrowIcon, className }: PropsType) => {
  return (
    <Link
      href={'/quick-upload-resume'}
      prefetch={true}
    >
      {isShowBtn ? (
        <div
          className={classNames([
            styles.uploadResumeButton,
            isShowArrowIcon ? styles.arrowContainer : '',
            className
          ])}
          style={{ backgroundImage: 'url(' + quickCreateResume + ')' }}
        >
          <div
            className={classNames([styles.uploadResumeButton_button])}
            style={{
              backgroundImage: isShowArrowIcon
                ? 'url(' + ncreaseUserConversionDetailsBackgroundarrowArrow + ')'
                : ''
            }}
          >
            Upload Resume & Apply Job!
          </div>
        </div>
      ) : null}
    </Link>
  )
}

export default UploadResumeButton
