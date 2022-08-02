/* eslint-disable camelcase */
import { useEffect, useState } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import moment from 'moment'

/* Actions */ 

/* Components */
import Text from 'components/Text'
import { TextField } from '@mui/material'
import ModalDialog from 'components/ModalDialog'
import UploadUserAvatar from 'components/UploadUserAvatar'
import MaterialTextField from 'components/MaterialTextField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialDatePicker from 'components/MaterialDatePicker'

/* Helpers */
import { getNoticePeriodList } from 'helpers/jobPayloadFormatter'
import { flat } from 'helpers/formatter'

import { updateUserProfileRequest } from 'store/actions/users/updateUserProfile'

/* Styles */
import styles from './EditProfileModal.module.scss'

type EditProfileModalProps = {
  modalName: string
  showModal: boolean
  config: any
  userDetail: any
  handleModal: Function
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
    <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
      {errorMessage}
    </Text>
  )
}

const EditProfileModal = ({
  modalName,
  showModal,
  config,
  userDetail,
  handleModal,
}: EditProfileModalProps) => {
  const { avatar, first_name, last_name, location: userLocation, description } = userDetail

  const dispatch = useDispatch()

  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [firstName, setFirstName] = useState(first_name || '')
  const [lastName, setlastName] = useState(last_name || '')
  const [birthdate, setBirthdate] = useState(null)
  const [summary, setSummary] = useState(description || '')

  const isUpdatingUserProfile = useSelector((store: any) => store.users.updateUserProfile.fetching)
  const updateProfileSuccess = useSelector(
    (store: any) => store.users.updateUserProfile.response
  )

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

  useEffect(() => {
    handleCloseModal()
  }, [updateProfileSuccess])

  const onLocationSearch = (e, value) => {
    setLocation(value)
  }

  const onSubmit = (data) => {
    const { noticePeriod, firstName, lastName, summary } = data
    const avatar = selectedAvatar
    console.log('avatar: ', avatar)
    const avatarFile = avatar && new File([avatar], 'avatar')
    console.log('avatarFile', avatarFile)
    console.log('selectedAvatar', selectedAvatar)
    const payload = {
        avatar: selectedAvatar,
        first_name: firstName,
        last_name: lastName,
        birthdate: birthdate && moment(new Date(birthdate)).format('yyyy-MM-DD'),
        location_key: (location as any).key || '',
        xp_level_key: yearsOfExperience || '',
        notice_period_id: noticePeriod,
        description: summary.length > 0 ? summary : '',
    }

    console.log('payload', payload)
    dispatch(updateUserProfileRequest(payload))
  }

  const handleCloseModal = () => {
    handleModal(modalName, false)
  }

  return (
    <div>
      <ModalDialog
        open={showModal}
        onClose={handleCloseModal}
        headerTitle='About me'
        firstButtonText='Cancel'
        secondButtonText='Save'
        isSecondButtonLoading={isUpdatingUserProfile}
        firstButtonIsClose
        // eslint-disable-next-line
        handleFirstButton={handleCloseModal}
        handleSecondButton={handleSubmit(onSubmit)}
        fullScreen
      >
        <div className={styles.profile}>
          <div className={styles.profileAvatar}>
            <UploadUserAvatar
              currentAvatarUrl={avatar}
              selectedAvatar={selectedAvatar}
              setSelectedAvatar={setSelectedAvatar}
            />
          </div>
          <div className={styles.profileForm}>
            <div className={styles.profileFormGroup}>
              <MaterialTextField
                refs={{
                  ...register('firstName'),
                }}
                className={styles.profileFormInput}
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
                className={styles.profileFormInput}
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
            <div className={styles.profileFormTitle}>
              <Text textStyle='lg' bold>
                Date of Birth
              </Text>
            </div>
            <div className={styles.profileFormGroup}>
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
                className={styles.profileFormInput}
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
                className={styles.profileFormInput}
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
                className={styles.profileFormInput}
                label='Year'
                value={year}
                options={yearList}
                onChange={(e) => {
                  setYear(e.target.value)
                }}
              /> */}
            </div>
            <div className={styles.profileFormGroup}>
              <MaterialLocationField
                fieldRef={{
                  ...register('location', {
                    required: {
                      value: true,
                      message: 'This field is required.',
                    },
                  }),
                }}
                className={styles.profileFormInput}
                label={requiredLabel('Current Location')}
                error={errors.location ? true : false}
                value={location}
                defaultValue={location}
                onChange={onLocationSearch}
              />
              {errors.location && errorText(errors.location.message)}
            </div>
            <div className={styles.profileFormGroup}>
              <MaterialBasicSelect
                fieldRef={{
                  ...register('yearsOfExperience'),
                }}
                className={styles.profileFormInput}
                label='Years of Experience'
                value={yearsOfExperience}
                options={formattedXpLevelList}
                onChange={(e) => {
                  setYearsOfExperience(e.target.value)
                }}
              />
            </div>
            <div className={styles.profileFormGroup}>
              <MaterialBasicSelect
                fieldRef={{
                  ...register('noticePeriod'),
                }}
                className={styles.profileFormInput}
                label='Availability'
                value={availability}
                options={noticeList}
                onChange={(e) => {
                  console.log(e.target.value)
                  setAvailability(e.target.value)
                }}
              />
            </div>
            <div className={styles.profileFormGroup}>
              <div className={styles.descriptionField}>
                <TextField
                  {...register('summary', {
                    required: {
                      value: true,
                      message: 'This field is required.',
                    },
                  })}
                  className={styles.profileFormInput}
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
                {errors.summary && errorText(errors.summary.message)}
              </div>
            </div>
          </div>
        </div>
      </ModalDialog>
    </div>
  )
}

export default EditProfileModal
