import { Button } from '@mui/material'

import styles from './UploadResumeButton.module.scss'
import { quickCreateResume } from 'images'

const UploadResumeButton = () => {
  return (
    <div
      className={styles.uploadResumeButton}
      style={{ backgroundImage: 'url(' + quickCreateResume + ')' }}
    >
      <Button className={styles.uploadResumeButton_button}>Upload Resume & Apply Job!</Button>
    </div>
  )
}

export default UploadResumeButton
