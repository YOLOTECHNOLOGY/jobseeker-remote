import { Button } from '@mui/material'

import styles from './UploadResumeButton.module.scss'
import { quickCreateResume, ncreaseUserConversionDetailsBackgroundarrowArrow } from 'images'
import classNames from 'classnames/bind'

interface PropsType {
  handleClick: Function
  isShowBtn: Boolean
  isShowArrowIcon?: Boolean
  className?: String
}

const UploadResumeButton = ({ handleClick, isShowBtn, isShowArrowIcon, className }: PropsType) => {
  return (
    <>
      {isShowBtn ? (
        <div
          className={classNames([
            styles.uploadResumeButton,
            isShowArrowIcon ? styles.arrowContainer : '',
            className
          ])}
          style={{ backgroundImage: 'url(' + quickCreateResume + ')' }}
        >
          <Button
            className={classNames([styles.uploadResumeButton_button])}
            onClick={(): void => handleClick()}
            style={{
              backgroundImage: isShowArrowIcon
                ? 'url(' + ncreaseUserConversionDetailsBackgroundarrowArrow + ')'
                : ''
            }}
          >
            Upload Resume & Apply Job!
          </Button>
        </div>
      ) : null}
    </>
  )
}

export default UploadResumeButton
