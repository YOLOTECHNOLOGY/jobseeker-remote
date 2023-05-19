/* eslint-disable camelcase */
import { useEffect, useState } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import moment from 'moment'

/* Components */
import Text from 'components/Text'
import { TextField } from '@mui/material'
import Modal from 'components/Modal'
import UploadUserAvatar from 'components/UploadUserAvatar'
import MaterialTextField from 'components/MaterialTextField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialDatePicker from 'components/MaterialDatePicker'

/* Helpers */
import { flat } from 'helpers/formatter'

import { updateUserProfileRequest } from 'store/actions/users/updateUserProfile'

/* Styles */
import styles from './EditProfileModal.module.scss'
import { getCountryId } from 'helpers/country'

type EditProfileModalProps = {
  modalName: string
  showModal: boolean
  config: any
  userDetail: any
  handleModal: Function
  lang: Record<string, any>
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
  //   return { ...loc, label: loc?.value, value: loc.key }
  // })
  return locationConfig
}

const requiredLabel = (text: string) => {
  return (
    <>
      <span>{text}</span>
      <span className={styles.requiredField}>*</span>
    </>
  )
}

const errorText = (errorMessage: any) => {
  return (
    <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
      {errorMessage}
    </Text>
  )
}

const EditProfileModal = ({
  modalName,
  showModal,
  userDetail,
  handleModal,
  lang
}: EditProfileModalProps) => {
  const {
    avatar,
    first_name,
    last_name,
    birthdate: dob,
    location: userLocation,
    description,
    xp_lvl: expLevel
  } = userDetail
  const {
    manageProfile: {
      tab: {
        profile: { aboutMeModal }
      }
    }
  } = lang
  const dispatch = useDispatch()

  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [birthdate, setBirthdate] = useState(dob)

  const isUpdatingUserProfile = useSelector((store: any) => store.users.updateUserProfile.fetching)
  const updateUserProfileSuccess = useSelector(
    (store: any) => store.users.updateUserProfile.response
  )
  const xpLevelList = useSelector((store: any) => store.config.config.response?.xp_lvls ?? [])
  const locationList = useSelector((store: any) => store.config.config.response?.location_lists)

  const formattedXpLevelList = xpLevelList?.map?.((xp) => {
    return { ...xp, label: xp.value, value: xp.key }
  })

  const defaultExpLevel = formattedXpLevelList.filter((xp) => expLevel === xp.label)
  const [yearsOfExperience, setYearsOfExperience] = useState(defaultExpLevel[0]?.key)

  const formattedLocationList = flat(formatLocationConfig(locationList))
  const matchedLocation = formattedLocationList.find((loc) => {
    return loc?.value == userLocation
  })
  const [location, setLocation] = useState(matchedLocation)

  // Limit user from selecting date more than 16-100 years ago from now.
  const today = new Date()
  const sixteenYearsAgo = today.getFullYear() - 16
  const hundredYearsAgo = today.getFullYear() - 100

  const defaultValues = {
    firstName: first_name,
    lastName: last_name,
    summary: description,
    location: userLocation,
    birthdate: birthdate,
    yearsOfExperience: defaultExpLevel[0]?.value
  }
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues
  })

  useEffect(() => {
    if (userDetail && userDetail.location) {
      if (userDetail.location) {
        const matchedLocation = formattedLocationList.find((loc) => {
          return loc?.value == userLocation
        })
        // setLocation(matchedLocation)
        setValue('location', matchedLocation?.value)
      }
    }
  }, [userDetail])

  useEffect(() => {
    if (updateUserProfileSuccess) {
      handleCloseModal()
    }
  }, [userDetail])

  const onLocationSearch = (e, value) => {
    setLocation(value)
  }

  const onSubmit = (data) => {
    const { firstName, lastName, summary, yearsOfExperience, location } = data
    const getIdByValue = (options: any[], value) => {
      const selectedOption = options.find((item) => item.value === value)
      return selectedOption?.id
    }
    const location_id = getIdByValue(formattedLocationList, location)
    const xp_lvl_id = getIdByValue(formattedXpLevelList, yearsOfExperience)

    const payload = {
      country_id: getCountryId(),
      avatar: selectedAvatar,
      first_name: firstName,
      last_name: lastName,
      birthdate: birthdate && moment(new Date(birthdate)).format('yyyy-MM-DD'),
      location_key: matchedLocation?.key,
      location_id,
      xp_lvl_key: yearsOfExperience || '',
      xp_lvl_id,
      description: summary?.length > 0 ? summary : ''
    }
    dispatch(updateUserProfileRequest(payload))
  }

  const handleCloseModal = () => {
    handleModal(modalName, false)
    reset(defaultValues)
  }

  const onDateChange = (value) => {
    const year = value?.getFullYear()
    if (year < hundredYearsAgo || year > sixteenYearsAgo) {
      setError(
        'birthdate',
        { message: 'You need to be at least 16 years old to use Bossjob.' },
        { shouldFocus: true }
      )
    } else {
      clearErrors('birthdate')
      setBirthdate(value)
    }
  }

  return (
    <div>
      <Modal
        showModal={showModal}
        handleModal={handleCloseModal}
        headerTitle={aboutMeModal.title}
        firstButtonText={aboutMeModal.btn1}
        secondButtonText={aboutMeModal.btn2}
        isSecondButtonLoading={isUpdatingUserProfile}
        firstButtonIsClose
        handleFirstButton={handleCloseModal}
        handleSecondButton={handleSubmit(onSubmit)}
        // Disable button if error exist for fields with manual setError
        isSecondButtonDisabled={!!(errors && errors.birthdate)}
        fullScreen
      >
        <div className={styles.profile}>
          <div className={styles.profileAvatar}>
            <UploadUserAvatar
              tip={aboutMeModal.avatarTips}
              currentAvatarUrl={avatar}
              selectedAvatar={selectedAvatar}
              setSelectedAvatar={setSelectedAvatar}
            />
          </div>
          <div className={styles.profileForm}>
            <div className={styles.profileFormGroup}>
              <div className={styles.profileFormGroupField}>
                <MaterialTextField
                  refs={{
                    ...register('firstName', {
                      required: {
                        value: true,
                        message: 'Please enter your first name.'
                      }
                    })
                  }}
                  className={styles.profileFormInput}
                  name='firstName'
                  label={requiredLabel(aboutMeModal.firstName)}
                  variant='outlined'
                  autoComplete='off'
                  error={errors.firstName}
                />
                {errors.firstName && errorText(errors.firstName.message)}
              </div>
              <div style={{ width: '20px', height: '24px' }}></div>
              <div className={styles.profileFormGroupField}>
                <MaterialTextField
                  refs={{
                    ...register('lastName', {
                      required: {
                        value: true,
                        message: 'Please enter your last name.'
                      }
                    })
                  }}
                  className={styles.profileFormInput}
                  name='lastName'
                  label={requiredLabel(aboutMeModal.lastName)}
                  variant='outlined'
                  size='small'
                  autoComplete='off'
                  error={errors.lastName}
                />
                {errors.lastName && errorText(errors.lastName.message)}
              </div>
            </div>
            <div className={styles.profileFormTitle}>
              <Text textStyle='lg' bold>
                {/* Date of Birth */}
                {aboutMeModal.birthday}
              </Text>
            </div>
            <div className={styles.profileFormGroup}>
              <div className={styles.profileFormGroupField}>
                <MaterialDatePicker
                  refs={{
                    ...register('birthdate')
                  }}
                  label={aboutMeModal.birthday}
                  views={['year', 'month', 'day']}
                  inputFormat='yyyy-MM-dd'
                  value={birthdate}
                  onDateChange={onDateChange}
                  fullWidth={true}
                />
                {errors.birthdate && errorText(errors.birthdate.message)}
              </div>
            </div>
            <div className={styles.profileFormGroup}>
              <div className={styles.profileFormGroupField}>
                <MaterialLocationField
                  fieldRef={{
                    ...register('location', {
                      required: {
                        value: true,
                        message: 'This field is required.'
                      }
                    })
                  }}
                  className={styles.profileFormInput}
                  label={requiredLabel(aboutMeModal.location)}
                  error={errors.location ? true : false}
                  value={location}
                  defaultValue={location}
                  onChange={onLocationSearch}
                />
                {errors.location && errorText(errors.location.message)}
              </div>
            </div>
            <div className={styles.profileFormGroup}>
              <MaterialBasicSelect
                fieldRef={{
                  ...register('yearsOfExperience')
                }}
                className={styles.profileFormInput}
                label={aboutMeModal.exp}
                value={yearsOfExperience}
                options={formattedXpLevelList}
                onChange={(e) => {
                  setYearsOfExperience(e.target.value)
                }}
              />
            </div>
            <div className={styles.profileFormGroup}>
              <div className={styles.descriptionField}>
                <TextField
                  {...register('summary', {
                    maxLength: { value: 4000, message: 'Please enter text within 4000' }
                  })}
                  className={styles.profileFormInput}
                  label={aboutMeModal.summary}
                  placeholder={aboutMeModal.summary}
                  name='summary'
                  variant='outlined'
                  autoComplete='off'
                  multiline
                  rows={6}
                />
                {errors.summary && errorText(errors.summary.message)}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default EditProfileModal
