/* eslint-disable camelcase */
import { useEffect, useState } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import moment from 'moment'

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
      <span className={styles.requiredField}>*</span>
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
  userDetail,
  handleModal
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

  const dispatch = useDispatch()

  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [birthdate, setBirthdate] = useState(dob)

  const isUpdatingUserProfile = useSelector((store: any) => store.users.updateUserProfile.fetching)
  const updateUserProfileSuccess = useSelector(
    (store: any) => store.users.updateUserProfile.response
  )
  const xpLevelList = useSelector((store: any) => store.config.config.response?.inputs?.xp_lvls)
  const locationList = useSelector(
    (store: any) => store.config.config.response?.inputs?.location_lists
  )

  const formattedXpLevelList = xpLevelList.map((xp) => {
    return { ...xp, label: xp.value, value: xp.key }
  })

  const defaultExpLevel = formattedXpLevelList.filter((xp) => expLevel === xp.label)
  const [yearsOfExperience, setYearsOfExperience] = useState(defaultExpLevel[0]?.key)

  const formattedLocationList = flat(formatLocationConfig(locationList))
  const matchedLocation = formattedLocationList.find((loc) => {
    return loc.value == userLocation
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
          return loc.value == userLocation
        })
        // setLocation(matchedLocation)
        setValue('location', matchedLocation?.value)
      }
    }
  }, [userDetail])

  useEffect(() => {
    if (updateUserProfileSuccess){
      handleCloseModal()
    }
  }, [userDetail])

  const onLocationSearch = (e, value) => {
    setLocation(value)
  }

  const onSubmit = (data) => {
    const { firstName, lastName, summary, yearsOfExperience, location } = data
    const matchedLocation = formattedLocationList.find((loc) => {
      return loc.value == location
    })

    const payload = {
      avatar: selectedAvatar,
      first_name: firstName,
      last_name: lastName,
      birthdate: birthdate && moment(new Date(birthdate)).format('yyyy-MM-DD'),
      location_key: matchedLocation?.key,
      xp_lvl_key: yearsOfExperience || '',
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
      <ModalDialog
        open={showModal}
        onClose={handleCloseModal}
        headerTitle='About me'
        firstButtonText='Cancel'
        secondButtonText='Save'
        isSecondButtonLoading={isUpdatingUserProfile}
        firstButtonIsClose
        handleFirstButton={handleCloseModal}
        handleSecondButton={handleSubmit(onSubmit)}
        // Disable button if error exist for fields with manual setError
        isSecondButtonDisabled={errors && errors.birthdate}
        fullScreen
        maxHeight='90vh'
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
                  label={requiredLabel('First Name')}
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
                  label={requiredLabel('Last Name')}
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
                Date of Birth
              </Text>
            </div>
            <div className={styles.profileFormGroup}>
              <div className={styles.profileFormGroupField}>
                <MaterialDatePicker
                  refs={{
                    ...register('birthdate')
                  }}
                  label='Date of birth'
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
                  label={requiredLabel('Current Location')}
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
                label='Years of Experience'
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
                  {...register('summary')}
                  className={styles.profileFormInput}
                  placeholder='Provide a career summary and briefly highlight your relevant experience, achievement and skills.'
                  name='summary'
                  variant='outlined'
                  autoComplete='off'
                  multiline
                  rows={9}
                />
              </div>
            </div>
          </div>
        </div>
      </ModalDialog>
    </div>
  )
}

export default EditProfileModal
