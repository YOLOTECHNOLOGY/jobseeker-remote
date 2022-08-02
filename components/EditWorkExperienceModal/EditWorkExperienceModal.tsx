/* eslint-disable camelcase */
import { useEffect, useState } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import moment from 'moment'

/* Actions */

/* Components */
import Switch from '@mui/material/Switch'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import { TextField } from '@mui/material'

import Text from 'components/Text'
import TextEditor from 'components/TextEditor/TextEditor'
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
import styles from './EditWorkExperienceModal.module.scss'

type EditWorkExperienceModalProps = {
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

const EditWorkExperienceModal = ({
  modalName,
  showModal,
  config,
  userDetail,
  handleModal,
}: EditWorkExperienceModalProps) => {
  console.log('EditWorkExperienceModal userDetail', userDetail)
  const dispatch = useDispatch()

  const isUpdatingUserProfile = useSelector((store: any) => store.users.updateUserProfile.fetching)
  const updateProfileSuccess = useSelector((store: any) => store.users.updateUserProfile.response)

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

  // useEffect(() => {
  //   if (userDetail && userDetail.location) {
  //     if (userDetail.location) {
  //       const matchedLocation = formattedLocationList.find((loc) => {
  //         return loc.value == userLocation
  //       })
  //       setLocation(matchedLocation)
  //       setValue('location', matchedLocation)
  //     }
  //   }
  //   if (userDetail && userDetail.notice_period_id) {
  //     setAvailability(userDetail.notice_period_id)
  //     setValue('noticePeriod', userDetail.notice_period_id)
  //   }
  //   if (userDetail && userDetail.xp_lvl) {
  //     setYearsOfExperience(userDetail.xp_lvl)
  //     setValue('yearsOfExperience', userDetail.xp_lvl)
  //   }
  // }, [userDetail])

  // useEffect(() => {
  //   handleCloseModal()
  // }, [updateProfileSuccess])

  //   if (userDetail && userDetail.location) {
  //     if (userDetail.location) {
  //       const matchedLocation = formattedLocationList.find((loc) => {
  //         return loc.value == userLocation
  //       })
  //       setLocation(matchedLocation)
  //       setValue('location', matchedLocation)
  //     }
  //   }
  //   if (userDetail && userDetail.notice_period_id) {
  //     setAvailability(userDetail.notice_period_id)
  //     setValue('noticePeriod', userDetail.notice_period_id)
  //   }
  //   if (userDetail && userDetail.xp_lvl) {
  //     setYearsOfExperience(userDetail.xp_lvl)
  //     setValue('yearsOfExperience', userDetail.xp_lvl)
  //   }
  // }, [userDetail])

  // useEffect(() => {
  //   handleCloseModal()
  // }, [updateProfileSuccess])

  const onLocationSearch = (e, value) => {
    setLocation(value)
  }

  const onSubmit = () => {
    // const { noticePeriod, firstName, lastName, summary } = data
    // const avatar = selectedAvatar
    // console.log('avatar: ', avatar)
    // const avatarFile = avatar && new File([avatar], 'avatar')
    // console.log('avatarFile', avatarFile)
    // console.log('selectedAvatar', selectedAvatar)
    // const payload = {
    //   avatar: selectedAvatar,
    //   first_name: firstName,
    //   last_name: lastName,
    //   birthdate: birthdate && moment(new Date(birthdate)).format('yyyy-MM-DD'),
    //   location_key: (location as any).key || '',
    //   xp_level_key: yearsOfExperience || '',
    //   notice_period_id: noticePeriod,
    //   description: summary.length > 0 ? summary : '',
    // }

    // console.log('payload', payload)
    // dispatch(updateUserProfileRequest(payload))
  }

  const handleCloseModal = () => {
    handleModal(modalName, false)
  }

  return (
    <div>
      <ModalDialog
        open={showModal}
        onClose={handleCloseModal}
        headerTitle='Work experience'
        firstButtonText='Cancel'
        secondButtonText='Save'
        isSecondButtonLoading={isUpdatingUserProfile}
        firstButtonIsClose
        handleFirstButton={handleCloseModal}
        handleSecondButton={handleSubmit(onSubmit)}
        fullScreen
      >
        {/* <div className={styles.profile}>
          {showForm && (
            <div className={styles.step3FormWrapper}>
              <div id='step3Form' className={classNames(styles.stepForm, styles.step3Form)}>
                <div className={styles.stepField}>
                  <MaterialTextField
                    className={styles.stepFullwidth}
                    label={requiredLabel('Job Title')}
                    size='small'
                    value={jobTitle}
                    defaultValue={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>

                <div className={styles.stepField}>
                  <MaterialTextField
                    className={styles.stepFullwidth}
                    label={requiredLabel('Company Name')}
                    size='small'
                    value={companyName}
                    defaultValue={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className={styles.stepField}>
                  <MaterialLocationField
                    className={styles.stepFullwidth}
                    label={requiredLabel('Location')}
                    value={location}
                    defaultValue={location}
                    onChange={onLocationSearch}
                  />
                </div>

                {isShowCountry && (
                  <div className={classNames(styles.stepField, styles.stepFieldCountry)}>
                    <MaterialBasicSelect
                      className={styles.stepFullwidth}
                      label={requiredLabel('Country')}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      error={errors.country ? true : false}
                      options={countryList}
                    />
                    {errors.country && errorText(errors.country.message)}
                  </div>
                )}

                <div className={styles.stepFieldGroup}>
                  <div className={styles.stepFieldHeader}>
                    <Text textStyle='base' bold>
                      Working Period <span className={styles.stepFieldRequired}>*</span>
                    </Text>
                  </div>
                  <div className={styles.stepFieldBody}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isCurrentJob}
                          onChange={() => setIsCurrentJob(!isCurrentJob)}
                          name='currentJob'
                        />
                      }
                      label={<Text textStyle='base'>I currently work here</Text>}
                    />
                  </div>
                </div>

                <div className={styles.stepField}>
                  <div className={styles.stepFieldHeader}>
                    <Text textStyle='base' bold>
                      From
                    </Text>
                  </div>
                  <div className={classNames(styles.stepFieldBody, styles.stepFieldDate)}>
                    <div className={styles.stepFieldDateItem}>
                      <MaterialDatePicker
                        label='Month Year'
                        views={['year', 'month']}
                        inputFormat='MMM yyyy'
                        value={workPeriodFrom}
                        onDateChange={(value) => {
                          setWorkPeriodFrom(value)
                        }}
                      />
                    </div>
                  </div>
                  {hasErrorOnFromPeriod && (
                    <Text textColor='red' textStyle='sm'>
                      Start date must be earlier than completion date.
                    </Text>
                  )}
                </div>

                {!isCurrentJob && (
                  <div className={styles.stepField}>
                    <div className={styles.stepFieldHeader}>
                      <Text textStyle='base' bold>
                        To
                      </Text>
                    </div>
                    <div className={classNames(styles.stepFieldBody, styles.stepFieldDate)}>
                      <div className={styles.stepFieldDateItem}>
                        <MaterialDatePicker
                          label='Month Year'
                          views={['year', 'month']}
                          inputFormat='MMM yyyy'
                          value={workPeriodTo}
                          onDateChange={(value) => {
                            setWorkPeriodTo(value)
                          }}
                        />
                      </div>
                    </div>
                    {hasErrorOnToPeriod && (
                      <Text textColor='red' textStyle='sm'>
                        Start date must be earlier than completion date.
                      </Text>
                    )}
                  </div>
                )}

                <div id='jobFunction' className={styles.stepField}>
                  <MaterialSelectCheckmarks
                    className={styles.stepFullwidth}
                    label={'Job Functions'}
                    name='jobCategory'
                    value={jobFunction}
                    onSelect={(e) => setJobFunction(e)}
                    options={jobCategoryList}
                  />
                </div>

                <div className={styles.stepField}>
                  <MaterialBasicSelect
                    className={styles.stepFullwidth}
                    label='Industry'
                    value={industry}
                    onChange={(e) => {
                      setIndustry(e.target.value)
                    }}
                    options={industryList}
                  />
                </div>

                <div className={styles.stepField}>
                  <MaterialTextField
                    className={styles.stepFullwidth}
                    label='Monthly Salary (PHP)'
                    size='small'
                    value={salary}
                    defaultValue={salary}
                    onChange={(e) => setSalary(handleNumericInput(e.target.value))}
                  />
                </div>

                <div className={styles.step3Editor}>
                  <TextEditor value={description} setValue={setDescription} />
                </div>
              </div>
            </div>
          )}

          {!showForm && (
            <div className={styles.stepFormToggle} onClick={() => newExperienceForm()}>
              <img src={AddOutlineIcon} width='18' height='18' />
              <Text textColor='primaryBlue' textStyle='sm'>
                Add a work experience
              </Text>
            </div>
          )}

          {showErrorToComplete && (
            <Text textStyle='base' textColor='red' tagName='p'>
              Fill up the required field to proceed.
            </Text>
          )}

          {workExperience.length === 0 && (
            <div className={styles.stepField}>
              <FormControlLabel
                control={
                  <Checkbox
                    name='noWorkExperience'
                    onChange={() => setHasNoWorkExperience(!hasNoWorkExperience)}
                    checked={hasNoWorkExperience}
                  />
                }
                label={<Text textStyle='base'>I have no work experience</Text>}
              />
            </div>
          )}
        </div> */}
      </ModalDialog>
    </div>
  )
}

export default EditWorkExperienceModal
