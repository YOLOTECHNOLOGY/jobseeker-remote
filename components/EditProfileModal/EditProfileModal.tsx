import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import MaterialButton from '../MaterialButton'
import styles from './EditProfileModal.module.scss'
import Text from '../Text'
import ModalDialog from '../ModalDialog'
import UploadUserAvatar from '../UploadUserAvatar'
import MaterialTextField from '../MaterialTextField'
import MaterialBasicSelect from '../MaterialBasicSelect'
import { useForm } from 'react-hook-form'
import { getNoticePeriodList } from '../../helpers/jobPayloadFormatter'
import { useDispatch, useSelector } from 'react-redux'
import { flat } from '../../helpers/formatter'
import MaterialLocationField from '../MaterialLocationField'
import MaterialDatePicker from '../MaterialDatePicker'
import moment from 'moment'
import { updateUserCompleteProfileRequest } from '../../store/actions/users/updateUserCompleteProfile'

type EditProfileModalProps = {
  config: any
  userDetail: any
  accessToken: any
}

const dayList = []
const monthList = []
const yearList = []
for (let i = 1; i <= 31; ++i) {
  dayList.push({ value: i, label: i })
}
for (let i = 1; i <= 12; ++i) {
  monthList.push({ value: i, label: i })
}
const date = new Date()
for (let i = date.getFullYear(); i >= date.getFullYear() - 100; --i) {
  yearList.push({ value: i, label: i })
}

const formatLocationConfig = (locationList) => {
  const locationConfig = locationList?.map((region) => region.locations)
  // const formattedConfig = locationConfig.map((loc) => {
  //   return { ...loc, label: loc.value, value: loc.key }
  // })
  return locationConfig
}

const requiredLabel = (text: string) => {
  return (
    <>
      <span>{text}</span>
      <span className={styles.stepFieldRequired}>*</span>
    </>
  )
}

const errorText = (errorMessage: string) => {
  return (
    <Text textStyle='sm' textColor='red' tagName='p' className={styles.stepFieldError}>
      {errorMessage}
    </Text>
  )
}

const EditProfileModal = ({ config, userDetail, accessToken }: EditProfileModalProps) => {
  // eslint-disable-next-line
  const { avatar, first_name, last_name, location: userLocation } = userDetail

  const dispatch = useDispatch()

  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [open, setOpen] = useState(false)
  // eslint-disable-next-line
  const [firstName, setFirstName] = useState(first_name || '')
  // eslint-disable-next-line
  const [lastName, setlastName] = useState(last_name || '')
  const [birthdate, setBirthdate] = useState(null)
  const [summary, setSummary] = useState('')

  // const isUpdatingUserProfile = useSelector(
  //   (store: any) => store.users.updateUserCompleteProfile.fetching
  // )
  // const updateProfileSuccess = useSelector(
  //   (store: any) => store.users.updateUserCompleteProfile.response
  // )
  const xpLevelList = useSelector((store: any) => store.config.config.response?.inputs?.xp_lvls)
  const locationList = useSelector(
    (store: any) => store.config.config.response?.inputs?.location_lists
  )

  const formattedXpLevelList = xpLevelList.map((xp) => {
    return { ...xp, label: xp.value, value: xp.key }
  })
  const [yearsOfExperience, setYearsOfExperience] = useState(formattedXpLevelList[0].key)

  const noticeList = getNoticePeriodList(config)
  const [availability, setAvailability] = useState(noticeList[0].value)

  const formattedLocationList = flat(formatLocationConfig(locationList))
  const [location, setLocation] = useState(formattedLocationList[0])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  useEffect(() => {
    if (userDetail && userDetail.location) {
      if (userDetail.location) {
        const matchedLocation = formattedLocationList.find((loc) => {
          return loc.value == userLocation
        })
        setLocation(matchedLocation)
        setValue('location', matchedLocation)
      }
    }
    if (userDetail && userDetail.notice_period_id) {
      setAvailability(userDetail.notice_period_id)
      setValue('noticePeriod', userDetail.notice_period_id)
    }
    if (userDetail && userDetail.xp_lvl) {
      setYearsOfExperience(userDetail.xp_lvl)
      setValue('yearsOfExperience', userDetail.xp_lvl)
    }
  }, [userDetail])

  const onLocationSearch = (e, value) => {
    setLocation(value)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data) => {
    const { noticePeriod, firstName, lastName, summary } = data
    const avatar = selectedAvatar
    console.log('avatar: ', avatar)
    const avatarFile = avatar && new File([avatar], 'avatar')
    const payload = {
      profile: {
        avatar: selectedAvatar && avatarFile,
        first_name: firstName,
        last_name: lastName,
        birthdate: birthdate && moment(new Date(birthdate)).format('yyyy-MM-DD'),
        location_key: (location as any).key || '',
        xp_level_key: yearsOfExperience || '',
        notice_period_id: noticePeriod,
        description: summary.length > 0 && summary,
      },
      accessToken,
    }

    console.log(payload)
    dispatch(updateUserCompleteProfileRequest(payload))
  }

  return (
    <div>
      <MaterialButton variant='outlined' onClick={handleClickOpen}>
        Open form dialog
      </MaterialButton>
      <ModalDialog
        open={open}
        onClose={handleClose}
        headerTitle='About me'
        firstButtonText='Cancel'
        secondButtonText='Save'
        firstButtonIsClose
        // eslint-disable-next-line
        handleFirstButton={() => {}}
        handleSecondButton={handleSubmit(onSubmit)}
        fullScreen
      >
        <div className={styles.Profile}>
          <div className={styles.ProfileAvatar}>
            <UploadUserAvatar
              currentAvatarUrl={avatar}
              selectedAvatar={selectedAvatar}
              setSelectedAvatar={setSelectedAvatar}
            />
          </div>
          <div className={styles.ProfileForm}>
            <div className={styles.ProfileFormGroup}>
              <MaterialTextField
                refs={{
                  ...register('firstName'),
                }}
                className={styles.ProfileFormInput}
                name='firstName'
                label='First Name'
                variant='outlined'
                value={firstName}
                defaultValue={firstName}
                autoComplete='off'
                onChange={(e) => setFirstName(e.target.value)}
              />
              <div style={{ width: '20px' }}></div>
              <MaterialTextField
                refs={{
                  ...register('lastName'),
                }}
                className={styles.ProfileFormInput}
                name='lastName'
                label='Last Name'
                variant='outlined'
                value={lastName}
                size='small'
                defaultValue={lastName}
                autoComplete='off'
                onChange={(e) => setlastName(e.target.value)}
              />
            </div>
            <div className={styles.ProfileFormTitle}>
              <Text textStyle='lg' bold>
                Date of Birth
              </Text>
            </div>
            <div className={styles.ProfileFormGroup}>
              <MaterialDatePicker
                label='Date of birth'
                views={['year', 'month', 'day']}
                inputFormat='yyyy-MM-dd'
                value={birthdate}
                onDateChange={(value) => {
                  setBirthdate(value)
                }}
                fullWidth={true}
              />
              {/* <MaterialBasicSelect
                fieldRef={{
                  ...register('day'),
                }}
                className={styles.ProfileFormInput}
                label='Day'
                value={day}
                options={dayList}
                onChange={(e) => {
                  setDay(e.target.value)
                }}
              />
              <div style={{ width: '16px' }}></div>
              <MaterialBasicSelect
                fieldRef={{
                  ...register('month'),
                }}
                className={styles.ProfileFormInput}
                label='Month'
                value={month}
                options={monthList}
                onChange={(e) => {
                  setMonth(e.target.value)
                }}
              />
              <div style={{ width: '16px' }}></div>
              <MaterialBasicSelect
                fieldRef={{
                  ...register('year'),
                }}
                className={styles.ProfileFormInput}
                label='Year'
                value={year}
                options={yearList}
                onChange={(e) => {
                  setYear(e.target.value)
                }}
              /> */}
            </div>
            <div className={styles.ProfileFormGroup}>
              <MaterialLocationField
                fieldRef={{
                  ...register('location', {
                    required: {
                      value: true,
                      message: 'This field is required.',
                    },
                  }),
                }}
                className={styles.ProfileFormInput}
                label={requiredLabel('Current Location')}
                error={errors.location ? true : false}
                value={location}
                defaultValue={location}
                onChange={onLocationSearch}
              />
              {errors.location && errorText(errors.location.message)}
            </div>
            <div className={styles.ProfileFormGroup}>
              <MaterialBasicSelect
                fieldRef={{
                  ...register('yearsOfExperience'),
                }}
                className={styles.ProfileFormInput}
                label='Years of Experience'
                value={yearsOfExperience}
                options={formattedXpLevelList}
                onChange={(e) => {
                  setYearsOfExperience(e.target.value)
                }}
              />
            </div>
            <div className={styles.ProfileFormGroup}>
              <MaterialBasicSelect
                fieldRef={{
                  ...register('noticePeriod'),
                }}
                className={styles.ProfileFormInput}
                label='Availability'
                value={availability}
                options={noticeList}
                onChange={(e) => {
                  console.log(e.target.value)
                  setAvailability(e.target.value)
                }}
              />
            </div>
            <div className={styles.ProfileFormGroup}>
              <TextField
                {...register('summary')}
                className={styles.ProfileFormInput}
                style={{ paddingBottom: '24px' }}
                placeholder='Provide a career summary and briefly highlight your relevant experience, achievement and skills.'
                name='summary'
                variant='outlined'
                value={summary}
                autoComplete='off'
                onChange={(e) => {
                  setSummary(e.target.value)
                }}
                multiline
                rows={9}
              />
            </div>
          </div>
        </div>
      </ModalDialog>
    </div>
  )
}

export default EditProfileModal
