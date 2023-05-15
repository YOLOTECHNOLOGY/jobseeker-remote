import { Avatar } from '@mui/material'
import { useEffect, useState } from 'react'
import { compressImage } from 'helpers/imageCompression'
import { CameraIcon, DefaultAvatar } from '../../images'
import styles from './UploadUserAvatar.module.scss'

type UploadUserAvatarProps = {
  currentAvatarUrl?: string
  selectedAvatar?: any
  setSelectedAvatar?: any
  tip: string
}

const UploadUserAvatar = ({ currentAvatarUrl, setSelectedAvatar, tip }: UploadUserAvatarProps) => {
  const [preview, setPreview] = useState(null)

  const handleChoosePhoto = () => {
    document.getElementById('uploadUserAvatar').click()
  }

  const handleChosenPhoto = async (e) => {
    const file = e.target.files[0]
    let img
    let aspectRatio
    if (file) {
      img = new Image()
      const objectUrl = URL.createObjectURL(file)
      img.onload = async function () {
        aspectRatio = this.width / this.height
        const compressedFile = await compressImage(file, 100, aspectRatio, 400) // 100kb
        const preview = URL.createObjectURL(compressedFile)
        let createNewFromData
        if ((compressedFile as any)?.name == undefined) {
          createNewFromData = new File([compressedFile], file.name, { type: 'image/*' })
          setSelectedAvatar(createNewFromData)
        } else {
          setSelectedAvatar(compressedFile)
        }

        setPreview(preview)
        URL.revokeObjectURL(objectUrl)
      }
      img.src = objectUrl
    }
  }

  useEffect(() => {
    if (currentAvatarUrl) {
    }
  }, [currentAvatarUrl])

  return (
    <div>
      <div className={styles.uploadAvatar}>
        <div className={styles.uploadAvatarDisplay} onClick={handleChoosePhoto}>
          <Avatar
            sx={{ width: '80px', height: '80px' }}
            src={preview || currentAvatarUrl || DefaultAvatar}
          />
          <input
            id='uploadUserAvatar'
            accept='image/*'
            type='file'
            style={{ display: 'none' }}
            onChange={handleChosenPhoto}
          />
          <button className={styles.uploadAvatarButton}>
            <img src={CameraIcon} height='14' width='14' />
          </button>
        </div>
        <div className={styles.uploadAvatarText}>
          {tip}
          {/* For the best visual results, we recommend uploading photo with a square shape or 1:1
          aspect ratio. */}
        </div>
      </div>
      <div className={styles.uploadAvatarError}></div>
    </div>
  )
}

export default UploadUserAvatar
