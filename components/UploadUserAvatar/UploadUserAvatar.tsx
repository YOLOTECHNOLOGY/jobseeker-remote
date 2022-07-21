import { Avatar } from '@mui/material'
import { useState } from 'react'
import { compressImage } from 'helpers/imageCompression'
import { CameraIcon, DefaultAvatar } from '../../images'
import styles from './UploadUserAvatar.module.scss'

type UploadUserAvatarProps = {
  currentAvatarUrl?: string
}

const UploadUserAvatar = ({ currentAvatarUrl }: UploadUserAvatarProps) => {
  const [selectedFile, setSelectedFile] = useState(null)

  const handleChoosePhoto = () => {
    document.getElementById('uploadUserAvatar').click()
  }

  const handleChosenPhoto = async (e) => {
    const file = e.target.files[0]
    if (file) {
        const compressedFile = await compressImage(file, 100) // 100kb
        const preview = URL.createObjectURL(compressedFile)
        setSelectedFile(preview)
    }
  }

  return (
    <div>
      <div className={styles.UploadAvatar}>
        <div className={styles.UploadAvatarDisplay}>
          <Avatar sx={{ width: '80px', height: '80px' }} src={selectedFile || currentAvatarUrl || DefaultAvatar} />
          <input
            id='uploadUserAvatar'
            type='file'
            style={{ display: 'none' }}
            onChange={handleChosenPhoto}
          />
          <button onClick={handleChoosePhoto} className={styles.UploadAvatarButton}>
            <img src={CameraIcon} height='14' width='14' />
          </button>
        </div>
        <div className={styles.UploadAvatarText}>Max file size: 1MB</div>
      </div>
      <div className={styles.UploadAvatarError}>
      </div>
    </div>
  )
}

export default UploadUserAvatar
