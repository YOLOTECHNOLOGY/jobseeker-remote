import { Button } from '@mui/material'

import styles from './UploadResumeButton.module.scss'
import { quickCreateResume } from 'images'

interface PropsType {
  handleClick: Function
  isShowBtn: boolean
}

const UploadResumeButton = ({ handleClick, isShowBtn }: PropsType) => {
  return (
    <>
      {isShowBtn ? (
        <div
          className={styles.uploadResumeButton}
          style={{ backgroundImage: 'url(' + quickCreateResume + ')' }}
        >
          <Button className={styles.uploadResumeButton_button} onClick={(): void => handleClick()}>
            Upload Resume & Apply Job!
          </Button>
        </div>
      ) : null}
    </>
  )
}

export default UploadResumeButton
