import { Button } from '@mui/material'

import styles from './UploadResumeButton.module.scss'

const UploadResumeButton = () => {
  return (
    <div className={styles.uploadResumeButton}>
      <Button className={styles.uploadResumeButton_button}>Upload Resume & Apply Job!</Button>
    </div>
  )
}

export default UploadResumeButton
