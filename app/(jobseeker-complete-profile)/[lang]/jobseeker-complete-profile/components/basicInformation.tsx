import React, { useState, useEffect,useContext } from 'react'
import styles from '../index.module.scss'

import { CameraIcon, DefaultAvatar } from 'images'
import { Avatar } from '@mui/material'
import { compressImage } from 'helpers/imageCompression'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Controller, useForm } from 'react-hook-form'
import MaterialTextField from 'components/MaterialTextField'
import avatar1 from '../images/1.png'
import avatar2 from '../images/2.png'
import avatar3 from '../images/3.png'
import avatar4 from '../images/4.png'
import avatar5 from '../images/5.png'
import FootBtn from './footBtn'

import { uploadUserAvatarService } from 'store/services/users/uploadUserAvatar'
import { updateUserCompleteProfileService } from 'store/services/users/updateUserCompleteProfile'
import { LinkContext } from 'app/[lang]/components/providers/linkProvider'

import { usePathname } from 'next/navigation'
const avatarList = [avatar1, avatar2, avatar3, avatar4, avatar5]
const BasicInformation = (props: any) => {
  const {
    config: { notice_period_lists: noticePeriodLists },
    lang:{profile},
    userDetail,
    getUserInfo,
  } = props

  const { push } = useContext(LinkContext)
  const  isExperienced =  sessionStorage.getItem('isExperienced') || '1'
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [selectedAvatarDefault, setSelectedAvatarDefault] = useState<number>(-1)
  const [selectedAvailability, setSelectedAvailability] = useState<number>(1)
  const [selectedExperienced, setSelectedExperienced] = useState<string>(isExperienced)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    basicInformation,
    theseInformationWillBeShown,
    profilePhoto,
    uploadAphoto,
    havingArealPhoto,
    name,
    IAm,
    Next1,
    back,
    availability,
    firstName,
    lastName,
    experienced,
    freshGraduate,
    thisFieldIsRequired
  }  = profile || {} 

  const pathname = usePathname()
  const experiencedList = [
    {
      label: experienced,
      value: '1'
    },
    {
      label: freshGraduate,
      value: '2'
    }
  ]

  const { handleSubmit, setValue, control } = useForm({
    defaultValues: {
      firstName: '',
      lastName: ''
    }
  })
   useEffect(() => {
    if (userDetail?.id) {
      const { avatar, first_name, last_name, notice_period_id} = userDetail
      setPreview(avatar)
      setValue('firstName', first_name)
      setValue('lastName', last_name)
      setSelectedAvailability(notice_period_id || 1)
    }
  }, [userDetail])


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
      setSelectedAvatarDefault(-1)
    }
  }
  const handleChoosePhoto = () => {
    document.getElementById('uploadUserAvatar').click()
  }

  const handleUpdateProfile = async (data) => {

    const { firstName, lastName } = data || {}
    const payload = {
      first_name: firstName,
      last_name: lastName,
      notice_period_id: selectedAvailability
    }
    setLoading(true)
    if (selectedAvatar) {
      await uploadUserAvatarService(selectedAvatar)
    }

    updateUserCompleteProfileService(payload).then((res) => {
      if (res.data) {
        getUserInfo?.()
        let url = `${pathname}?step=2`
        sessionStorage.removeItem('isExperienced')
        if (selectedExperienced === '2') {
          sessionStorage.setItem('isExperienced','2')
          url = `${pathname}?step=3`
        }
        push(url)
        // router.push(url)
      }
    }).finally(()=>setLoading(false))
  }

  const changeAvator = async (item, index) => {
    setSelectedAvatarDefault(index)
    const xhr = new XMLHttpRequest()
    xhr.open('get', item.src, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (this.status == 200) {
        const file = new File([this.response], item.src, { type: 'image/*' })
        setSelectedAvatar(file)
      }
    }
    xhr.send()
  }

  return (
    <>
      <div className={styles.basicInfo}>
        <div className={styles.topModule}>
          <div className={styles.headerInfo}>
            <h2>{basicInformation}</h2>
            <p>{theseInformationWillBeShown}</p>
          </div>
          <div className={styles.container}>
            <h3>{profilePhoto}</h3>
            <p className={styles.uploadTips}>
              {uploadAphoto}
            </p>
            <ul className={styles.avatarList}>
              <li className={`${selectedAvatarDefault === -1 ? styles.active : ''}`}>
                <div className={styles.uploadAvatarDisplay} onClick={handleChoosePhoto}>
                  <Avatar sx={{ width: '58px', height: '58px' }} src={preview || DefaultAvatar} />
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
              </li>
              {avatarList.map((item, index) => (
                <li
                  key={index}
                  onClick={() => changeAvator(item, index)}
                  className={`${selectedAvatarDefault === index ? styles.active : ''}`}
                >
                  <Avatar sx={{ width: '100%', height: '100%' }} src={item.src || DefaultAvatar} />
                </li>
              ))}
            </ul>
            <p className={styles.photoTips}>
              <InfoOutlinedIcon sx={{ fontSize: '16px', color: '#FE574A', marginRight: '4px' }} />
              {havingArealPhoto}
            </p>

            <div className={styles.nameBox}>
              <p className={styles.name}>
                {name} <span>*</span>
              </p>
              <div>
                <div className={styles.nameFlex}>
                  <div className={styles.namesFirst}>
                    <Controller
                      control={control}
                      name={'firstName'}
                      rules={{ required: thisFieldIsRequired }}
                      render={({ field, fieldState }) => {
                        return (
                          <MaterialTextField
                            className={styles.stepFullwidth}
                            label={firstName}
                            required
                            {...fieldState}
                            {...field}
                          />
                        )
                      }}
                    />
                  </div>
                  <div className={styles.namesFirst}>
                    <Controller
                      control={control}
                      name={'lastName'}
                      rules={{ required: thisFieldIsRequired }}
                      render={({ field, fieldState }) => {
                        return (
                          <MaterialTextField
                            className={styles.stepFullwidth}
                            label={lastName}
                            required
                            {...fieldState}
                            {...field}
                          />
                        )
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.Im}>
              <p className={styles.name}>
                {IAm} <span>*</span>
              </p>
              <div className={styles.btnList} style={{flexWrap:'nowrap'}}>
                {experiencedList.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setSelectedExperienced(item.value)}
                    className={`${styles.btn}  ${
                      selectedExperienced === item.value ? styles.active : ''
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.availability}>
              <p className={styles.name}>
                {' '}
                {availability} <span>*</span>
              </p>
              <div className={styles.btnList}>
                {noticePeriodLists.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedAvailability(item.id)}
                    className={`${item.id === selectedAvailability ? styles.active : ''} ${
                      styles.btn
                    }`}
                  >
                    {item.value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <FootBtn
          showBack={false}
          loading={loading}
          backText = {back}
          rightText={Next1}
          handleClick={handleSubmit(handleUpdateProfile)}
        />
      </div>
    </>
  )
}

export default BasicInformation
