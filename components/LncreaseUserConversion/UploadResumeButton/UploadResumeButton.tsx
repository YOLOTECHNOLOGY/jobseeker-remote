import { Button } from '@mui/material'

import styles from './UploadResumeButton.module.scss'
import { quickCreateResume } from 'images'
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
            // style={{
            //   backgroundImage: isShowArrowIcon
            //     ? 'url(' + ncreaseUserConversionDetailsBackgroundarrowArrow + ')'
            //     : ''
            // }}
          >
            <svg className={styles.arrowIcon} width="37" height="39" viewBox="0 0 37 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="37" height="39" fill="url(#pattern0)"/>
                <defs>
                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlinkHref="#image0_8903_136138" transform="translate(-0.225507) scale(0.0121059 0.011485)"/>
                </pattern>
                <image id="image0_8903_136138" width="102" height="96" xlinkHref="data:image/png;base64,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"/>
                </defs>
            </svg>

            Upload Resume & Apply Job!
          </Button>
        </div>
      ) : null}
    </>
  )
}

export default UploadResumeButton
