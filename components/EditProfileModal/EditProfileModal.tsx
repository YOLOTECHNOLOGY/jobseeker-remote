/* eslint-disable camelcase */
import { useEffect, useRef, useState } from 'react'

/* Vendors */
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import Autocomplete from '@mui/material/Autocomplete';

/* Components */
import Text from 'components/Text'

import { TextField } from '@mui/material'
import Modal from 'components/Modal'
import UploadUserAvatar from 'components/UploadUserAvatar'
import MaterialTextField from 'components/MaterialTextField'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialDatePicker from 'components/MaterialDatePicker'
import GoogleMap from 'components/GoogleMap/GoogleMap'
import _styles from 'styles/maintenance.module.scss';

/* Helpers */
import { flat } from 'helpers/formatter'
/* Styles */
import styles from './EditProfileModal.module.scss'
import React from 'react'
import { removeEmptyOrNullValues } from 'helpers/formatter'
import { updateUserProfile } from 'app/[lang]/manage-profile/service'
import { useLanguage } from 'app/components/providers/languageProvider';
import { useProfileData } from 'app/components/providers/profileProvider';
type EditProfileModalProps = {
  modalName: string
  showModal: boolean
  config: any
  userDetail: any
  handleModal: Function
  lang?: any
  fetchProfile?: () => void;
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

const getDiffYear = (time) => {
  const now = moment(new Date())
  const then = moment(time).format('YYYY-MM-DD')
  const age = now.diff(moment(then), 'years')
  return age
}
interface PlaceType {
  description: string;
  formatted_address: string;
  structured_formatting: any;
  geometry: {
    location: {
      lat: () => number
      lng: () => number
    }
  }
}

const EditProfileModal = ({
  modalName,
  showModal,
  userDetail,
  handleModal,
  fetchProfile,
  config
}: EditProfileModalProps) => {
  const {
    avatar,
    first_name,
    last_name,
    birthdate: dob,
    location: userLocation,
    description,
    location_id,
    phone_num,
    email,
    longitude,
    latitude,
    address,
    working_since

  } = userDetail
  const {fetchProfile: providerFetchProfile} = useProfileData();
  const lang = useLanguage()
  const mapRef = useRef(null);
  const [value, setLocationValue] = React.useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = React.useState(address || '');
  const [options, setOptions] = React.useState<readonly PlaceType[]>([]);
  const [debouncedValue, setDebouncedValue] = useState('');
  const {
    manageProfile: {
      tab: {
        profile: { aboutMeModal }
      }
    }
  } = lang
  const {manageProfile, profile} = useLanguage();
  useEffect(() => {
    const delay = 500; // 设置延迟时间（毫秒）
    const timerId = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(timerId); // 清除计时器
    };
  }, [inputValue]);

  useEffect(() => {
    if (!mapRef.current) return;


    mapRef.current.textSearch({ query: debouncedValue }, function (results, status) {
      // @ts-ignore
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log('results', results);
        setOptions(results);
        // renderSearchPlaceList(results, map)
      }
    })
  }, [mapRef.current, debouncedValue]);

  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [birthdate, setBirthdate] = useState(dob)
  const [isSecondButtonLoading, setIsSecondButtonLoading] = useState(false);
  const [workingSince, setWorkingSince] = useState('');
  const updateUserProfileSuccess = useSelector(
    (store: any) => store.users.updateUserProfile.response
  )
  const { xp_lvls: xpLevelList, location_lists: locationList } = config
  const [yearsOfExperience, setYearsOfExperience] = useState(xpLevelList.find(item => item.id === userDetail.xp_lvl_id)?.id || xpLevelList[0].id)
  const formattedLocationList = flat(formatLocationConfig(locationList))
  const matchedLocation = formattedLocationList.find((loc) => {
    return loc?.id == location_id
  })
  const [location, setLocation] = useState(matchedLocation)
  const SIXTEEN_YEAR = 16
  const HUNDRED_YEAR = 100

  const defaultValues = {
    firstName: first_name,
    lastName: last_name,
    summary: description,
    location: userLocation,
    birthdate: birthdate,
    working_since: working_since,
    yearsOfExperience: xpLevelList.find(item => item.id === userDetail.xp_lvl_id)?.id || xpLevelList[0].id
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
  const handleCloseModal = () => {
    handleModal(modalName, false)
    reset(defaultValues)
  }
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

  const onSubmit = async (data) => {
    const { firstName, lastName, summary } = data
    
    const payload = {
      // country_id: getCountryId(),
      avatar: selectedAvatar,
      first_name: firstName,
      last_name: lastName,
      birthdate: birthdate && moment(new Date(birthdate)).format('yyyy-MM-DD'),
      location: location.value,
      location_id: location.id,
      description: summary?.length > 0 ? summary : '',
      address: inputValue,
      latitude: value?.geometry?.location?.lat() || latitude,
      longitude: value?.geometry?.location?.lng() || longitude,
      working_since: workingSince && moment(new Date(workingSince)).format('yyyy-MM-DD')
    }
    setIsSecondButtonLoading(true)
    try {
      // @ts-ignore
      await updateUserProfile(removeEmptyOrNullValues(payload))
      await fetchProfile()
      await providerFetchProfile()
    } catch (e) {
      console.log(e);
    } finally {
      setIsSecondButtonLoading(false)
    }

    // dispatch(updateUserProfileRequest(removeEmptyOrNullValues(payload)))


  }



  const onDateChange = (value) => {
    const isMinYear = getDiffYear(value) < SIXTEEN_YEAR
    const isMaxYear = getDiffYear(value) > HUNDRED_YEAR
    if (isMaxYear || isMinYear) {
      setBirthdate(value)
      setError(
        'birthdate',
        { message: aboutMeModal.birthdayError },
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
        isSecondButtonLoading={isSecondButtonLoading}
        firstButtonIsClose
        handleFirstButton={handleCloseModal}
        handleSecondButton={handleSubmit(onSubmit)}
        // Disable button if error exist for fields with manual setError
        isSecondButtonDisabled={!!(errors && errors.birthdate)}
        fullScreen

        className={styles.modal}
        bodyClass={styles.showScroll}

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
                        message: profile.thisFieldIsRequired
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
                {errors.firstName && errorText(errors.firstName.message as any)}
              </div>
              <div style={{ width: '20px', height: '24px' }}></div>
              <div className={styles.profileFormGroupField}>
                <MaterialTextField
                  refs={{
                    ...register('lastName', {
                      required: {
                        value: true,
                        message: profile.thisFieldIsRequired
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
                {errors.lastName && errorText(errors.lastName.message as any)}
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
                    ...register('birthdate', {
                      validate: () => {
                        const isMinYear = getDiffYear(birthdate) < SIXTEEN_YEAR
                        const isMaxYear = getDiffYear(birthdate) > HUNDRED_YEAR
                        if (isMaxYear || isMinYear) {
                          return aboutMeModal.birthdayError
                        } else {
                          return true
                        }
                      }
                    })
                  }}
                  label={aboutMeModal.birthday}
                  hiddenLabel
                  views={['year', 'month', 'day']}
                  inputFormat='yyyy-MM-dd'
                  value={birthdate}
                  onDateChange={onDateChange}
                  fullWidth={true}
                />
                {errors.birthdate && errorText(errors.birthdate.message as any)}
              </div>
            </div>
            <div className={styles.profileFormTitle}>
              <Text className={styles.profileFormTitleText}>
                {
                  
                  // @ts-ingore
                manageProfile.tab.profile.aboutMeModal.workingSince
                }
              </Text>
            </div>
            <div className={styles.profileFormGroup}>
            <MaterialDatePicker
                  refs={{
                    ...register('working_since')
                  }}
                  label={profile.startedWorkingSince}
                  hiddenLabel
                  views={['year', 'month']}
                  inputFormat='yyyy-MM'
                  value={workingSince}
                  onDateChange={setWorkingSince}
                  fullWidth={true}
                />

            </div>
            <div className={styles.profileFormTitle}>
              <Text className={styles.profileFormTitleText}>
                {lang.accountSetting.email}
              </Text>
            </div>
            <div className={styles.profileFormGroup + ' ' + styles.info_layout}>
              <span>{email}</span>
              <span className={styles.tips}>Please change it in [Settings - Account Settings]</span>
            </div>

            <div className={styles.profileFormTitle} >
              <Text className={styles.profileFormTitleText}>
                {lang.newGetStarted.phone}
              </Text>
            </div>
            <div className={styles.profileFormGroup + ' ' + styles.info_layout}>
              <span>{phone_num}</span>
              <span className={styles.tips}>Please change it in [Settings - Account Settings]</span>
            </div>

            <div className={styles.profileFormTitle}>
              <Text className={styles.profileFormTitleText}>
                {requiredLabel(aboutMeModal.location)}
              </Text>
            </div>
            <div className={styles.profileFormGroup}>
              <div className={styles.profileFormGroupField}>
                <MaterialLocationField
                  fieldRef={{
                    ...register('location', {
                      required: {
                        value: true,
                        message: profile.thisFieldIsRequired
                      }
                    })
                  }}
                  className={styles.profileFormInput}
                  label={requiredLabel(aboutMeModal.location)}
                  error={errors.location ? true : false}
                  hiddenLabel
                  value={location}
                  defaultValue={location}
                  onChange={onLocationSearch}
                />
                {errors.location && errorText(errors.location.message as any)}
              </div>
            </div>

            <div className={styles.profileFormTitle}>
              <Text className={styles.profileFormTitleText}>
                {lang.myJobs.address}
              </Text>
            </div>
            <Autocomplete
              noOptionsText={aboutMeModal.noLocation}
              options={options}
              autoComplete
              className={styles.hiddenLabel}
              filterOptions={(x) => x}
              getOptionLabel={(option: any) => option.formatted_address || ''}
              size='small'
              value={value || { formatted_address: inputValue }}
              includeInputInList
              onChange={(event: any, newValue: PlaceType | null) => {
                setLocationValue(newValue);
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              disableClearable={false}
              // className={className}
              renderInput={(params) => {
                return (<TextField
                  {...params}
                  label={aboutMeModal.address}
                  placeholder={aboutMeModal.address}
                  autoComplete='off'
                  type='text'
                  className={_styles.hiddenLabel}
                />)
              }}
            // {...rest}
            />
            <div className={styles.profileFormGroup + " " + styles.mapWrapper}>
              <GoogleMap
                height={"500px"}
                lat={Number(value?.geometry.location.lat()) || Number(latitude)}
                lng={Number(value?.geometry.location.lng()) || Number(longitude as String)}
                ref={mapRef}
                gestureHandling='auto'
                zoomControl={true}
                fullscreenControl={false}
                streetViewControl={true}
                clickable={true}
                infoWindow={value?.formatted_address || address}
              />
            </div>

          </div>
        </div>
      </Modal>
    </div>
  )
}

export default EditProfileModal
