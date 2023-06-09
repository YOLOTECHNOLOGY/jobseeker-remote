import React, { useState, useMemo } from 'react'
import styles from '../index.module.scss'
import { CameraIcon, DefaultAvatar} from 'images'
import { Avatar } from '@mui/material'
import { compressImage } from 'helpers/imageCompression'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Controller, useForm } from 'react-hook-form'
import MaterialTextField from 'components/MaterialTextField'
import LoadingButton from '@mui/lab/LoadingButton'
import avatar1 from '../images/1.png'
import avatar2 from '../images/2.png'
import avatar3 from '../images/3.png'
import avatar4 from '../images/4.png'
import avatar5 from '../images/5.png'
const avatarList = [ avatar1, avatar2,avatar3,avatar4, avatar5]

const BasicInformation = (props: any) => {
  console.log({props})
  const {config:{
    notice_period_lists:noticePeriodLists
  }} = props
   
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [selectedAvatarDefault,setSelectedAvatarDefault] = useState<number>(0);
  const [selectedAvailability, setSelectedAvailability] = useState<number>(1)
 
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false);
  function handleClick() {
    // setLoading(true);
  }
  console.log({avatarList})
  const { userDetail } = props

  const defaultValues = useMemo(() => {
    const result = {
      firstName: userDetail?.first_name,
      lastName: userDetail?.last_name
    }
    return result
  }, [userDetail])
  const { handleSubmit, setValue, getValues, control } = useForm({ defaultValues })

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
  const handleChoosePhoto = () => {
    document.getElementById('uploadUserAvatar').click()
  }
  return (
    <div className={styles.basicInfo}>
      <div className={styles.topModule}>
      <div className={styles.headerInfo}>
        <h2>Basic Information</h2>
        <p>These information will be shown to Boss when you apply for a job.</p>
      </div>
      <div className={styles.container}>
        <h3>Profile photo</h3>
        <p className={styles.uploadTips}>
          Upload a photo ( max 5 MB) or choose one from Bossjob default avatars
        </p>
        <ul className={styles.avatarList}>
          <li>
            <div className={styles.uploadAvatarDisplay} onClick={handleChoosePhoto}>
              <Avatar sx={{ width: '65px', height: '65px' }} src={preview || DefaultAvatar} />
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
          {
            avatarList.map((item,index)=> <li key={index} onClick={()=>setSelectedAvatarDefault(index)}  className={`${selectedAvatarDefault === index ? styles.active : '' }`}>  
            <Avatar sx={{ width: '100%', height: '100%' }} src={item.src || DefaultAvatar} />
            </li>)
          }         
        </ul>
        <p className={styles.photoTips}>
          <InfoOutlinedIcon sx={{ fontSize: '16px', color: '#FE574A', marginRight: '4px' }} />
          Having a real photo as your profile picture help build trust with potential employers{' '}
        </p>

        <div className={styles.nameBox}>
          <p className={styles.name}>
            Name <span>*</span>
          </p>
          <div>
            <div className={styles.nameFlex}>
              <div className={styles.namesFirst}>
                <Controller
                  control={control}
                  name={'firstName'}
                  rules={{ required: '' }}
                  render={({ field, fieldState }) => {
                    return (
                      <MaterialTextField
                        className={styles.stepFullwidth}
                        label={'First name'}
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
                  rules={{ required: '' }}
                  render={({ field, fieldState }) => {
                    return (
                      <MaterialTextField
                        className={styles.stepFullwidth}
                        label={'Last name'}
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
         <p className={styles.name}>  I am <span>*</span></p>
         <div className={styles.btnList}>
           <button className={`${styles.btn} ${styles.active}`}>Experienced</button>
           <button className={styles.btn}>Experienced</button>
        </div> 
       </div>

       <div className={styles.availability}>
         <p className={styles.name}> Availability <span>*</span></p>
         <div className={styles.btnList}>  
           {
            noticePeriodLists.map(item=><button
               key={item.id}
               onClick={()=>setSelectedAvailability(item.id)}
              className={`${item.id === selectedAvailability ? styles.active: '' } ${styles.btn}`}>
               {item.value}
             </button>)
           }
         
        </div> 
       </div>
      </div>
      </div>


      <div className={styles.next}>
        <LoadingButton
          onClick={handleClick}
          loading={loading}
        
          variant="contained"
          sx={{
            width:'202px',
            height:'44px',
            textTransform: 'capitalize',
            background:  "#F0F0F0",
            color: "#707070",
            boxShadow:'none',
            borderRadius: '10px'
          }}
        >
          <span>Next (1/4)</span>
        </LoadingButton>
      </div>
     

    </div>
  )
}

export default BasicInformation
