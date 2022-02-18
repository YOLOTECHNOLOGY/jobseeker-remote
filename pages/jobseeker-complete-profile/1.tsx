import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import classNames from 'classnames/bind'
// @ts-ignore
import { END } from 'redux-saga'

/* Redux Actions */
import { wrapper } from 'store'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { updateUserCompleteProfileRequest } from 'store/actions/users/updateUserCompleteProfile'

// Components
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Text from 'components/Text'
import OnBoardLayout from 'components/OnBoardLayout'
import MaterialTextField from 'components/MaterialTextField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialSelectCheckmarks from 'components/MaterialSelectCheckmarks'

/* Helpers*/
import {
  getNoticePeriodList,
  getSmsCountryList,
  getJobCategoryList,
  getJobCategoryIds,
  getSalaryOptions,
  getCountryList,
  getLocationList
} from 'helpers/jobPayloadFormatter'

// Styles
import styles from './Onboard.module.scss'

const Step1 = (props: any) => {
  const currentStep = 1
  const dispatch = useDispatch()
  const { config, userDetail, accessToken } = props

  const locList = getLocationList(config)
  const countryList = getCountryList(config)
  const noticeList = getNoticePeriodList(config)
  const smsCountryList = getSmsCountryList(config)
  const jobCategoryList = getJobCategoryList(config)
  const salaryFromOptions = getSalaryOptions(config)
  
  const [contactNumber, setContactNumber] = useState(userDetail?.phone_num)
  const [location, setLocation] = useState(null)
  const [country, setCountry] = useState('')
  const [isShowCountry, setIsShowCountry] = useState(false)
  const [noticePeriod, setNoticePeriod] = useState(userDetail.notice_period_id)
  const [specialization, setSpecialization] = useState('')
  const [headhuntMe, setHeadhuntMe] = useState(true)

  const [salaryFrom, setSalaryFrom] = useState(Number(userDetail.job_preference.salary_range_from) || salaryFromOptions[0].value)
  const [salaryTo, setSalaryTo] = useState(null)
  const [salaryToOptions, setSalaryToOptions] = useState([])
  const [hasSelectedSpecMore, setHasSelectedSpecMore] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors }} = useForm()

  const isUpdatingUserProfile = useSelector((store: any) => store.users.updateUserCompleteProfile.fetching)

  useEffect(() => {
    getSalaryToOptions(salaryFrom)
  }, [salaryFrom])
  
  useEffect(() => {
    getSalaryToOptions(salaryFrom)
    if (userDetail) {
      if (userDetail.location) {
        const matchedLocation = locList.filter((loc) => {
          return loc.value === userDetail.location.toString()
        })
        setLocation(matchedLocation[0])
        setValue('location', matchedLocation[0])
      }

      setSalaryTo(Number(userDetail.job_preference.salary_range_to))
    }

  }, [])

  const getSalaryToOptions = (salaryFrom) => {
    const salaryOptions = getSalaryOptions(config, salaryFrom, true)
    setSalaryTo(salaryOptions[0].value)
    setSalaryToOptions(salaryOptions)
  }

  const onLocationSearch = (_, value) => {
    setIsShowCountry(value?.key === 'overseas' ? true : false)
    setLocation(value)
  }

  const requiredLabel = (text: string) => {
    return (
      <>
        <span>{text}</span>
        <span className={styles.StepFieldRequired}>*</span>
      </>
    )
  }

  const errorText = (errorMessage: string) => {
    return <Text textStyle='sm' textColor='red' tagName='p' className={styles.StepFieldError}>{errorMessage}</Text>
  }

  const handleNext = (data) => {
    const { specialization, salaryFrom, salaryTo, contactNumber, noticePeriod } = data
    setHasSelectedSpecMore(specialization.length > 3 ? true : false)

    if (specialization.length > 3) return
    const payload = {
      preferences: {
        job_category_id: getJobCategoryIds(config, specialization),
        salary_range_from: Number(salaryFrom),
        salary_range_to: Number(salaryTo),
        location_key: location?.key || ''
      },
      profile: {
        phone_num: contactNumber,
        country_key: country || '',
        location_key: location?.key || '',
        notice_period_id: noticePeriod,
      },
      accessToken,
      currentStep
    }

    // eslint-disable-next-line no-console
    console.log({data, payload})
    dispatch(updateUserCompleteProfileRequest(payload))
  }

  return (
    <OnBoardLayout
      headingText={<Text bold textStyle='xxxl' tagName='h2'>Let’s get you a job! 🎉👏 <br/> Tell us about yourself.</Text>}
      currentStep={currentStep}
      totalStep={4}
      nextFnBtn={handleSubmit(handleNext)}
      isUpdating={isUpdatingUserProfile}
    >
      <div className={styles.StepForm}>
        <div className={styles.Step1Contact}>
          <MaterialBasicSelect
            className={styles.Step1ContactCountry}
            label='Country'
            value='Philippines'
            defaultValue='Philippines'
            options={smsCountryList}
          />
          <div className={styles.Step1ContactNumber}>
            <MaterialTextField
              refs={{...register('contactNumber', { 
                required: {
                  value: true,
                  message: 'This field is required.'
                },
                minLength: {
                  value: 9,
                  message: 'Must be 9 characters or more.'
                }, 
                maxLength: {
                  value: 10,
                  message: 'Must be 10 characters or less.'
                }
              })}}
              className={styles.Step1ContactNumberField}
              label={requiredLabel('Contact Number')}
              size='small'
              type='number'
              error={errors.contactNumber ? true : false}
              value={contactNumber}
              defaultValue={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
            <Text className={styles.Step1ContactDigits} textStyle='sm' textColor='darkgrey'>9 - 10 digits</Text>
            {errors.contactNumber && errorText(errors.contactNumber.message)}
          </div>
        </div>

        <div className={styles.StepField}>
          <MaterialLocationField
            fieldRef={{...register('location', { 
              required: {
                value: true,
                message: 'This field is required.'
              }
            })}}
            className={styles.StepFullwidth}
            label={requiredLabel('Current Location')}
            error={errors.location ? true : false}
            value={location}
            defaultValue={location}
            onChange={onLocationSearch}
          />
          {errors.location && errorText(errors.location.message)}

          {isShowCountry && (
            <div className={classNames(styles.StepField, styles.StepFieldCountry)}>
              <MaterialBasicSelect
                className={styles.StepFullwidth}
                fieldRef={{...register('country', { 
                  required: {
                    value: true,
                    message: 'This field is required.'
                  }
                })}}
                label={requiredLabel('Country')}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                error={errors.country ? true : false}
                options={countryList}
              />
              {errors.country && errorText(errors.country.message)}
            </div>
          )}
        </div>

        <div className={styles.StepField}>
          <MaterialBasicSelect
            className={styles.StepFullwidth}
            fieldRef={{...register('noticePeriod', { 
              required: {
                value: true,
                message: 'This field is required.'
              }
            })}}
            label={requiredLabel('Availability')}
            value={noticePeriod}
            onChange={(e) => setNoticePeriod(e.target.value)}
            error={errors.noticePeriod ? true : false}
            options={noticeList}
          />
          {errors.noticePeriod && errorText(errors.noticePeriod.message)}
        </div>

        <div className={styles.StepField}>
          <MaterialSelectCheckmarks
            className={styles.StepFullwidth}
            fieldRef={{...register('specialization', { 
              required: {
                value: true,
                message: 'This field is required.'
              }
            })}}
            label={requiredLabel('I’m looking for jobs in these specializations')}
            value={specialization}
            onSelect={(e) => {
              setSpecialization(e)
              setHasSelectedSpecMore(e.length > 3 ? true : false)
            }}
            error={errors.specialization ? true : false || hasSelectedSpecMore}
            options={jobCategoryList}
          />
          <Text textStyle='xsm' textColor={hasSelectedSpecMore ? 'red' : 'darkgrey'}>(Max of 3 Categories)</Text>
          {errors.specialization && errorText(errors.specialization.message)}
        </div>

        <div className={styles.Step1Salary}>
          <Text textColor='darkgrey' textStyle='base' bold>
            Expected salary per month 
            <span className={styles.StepFieldRequired}>*</span>
          </Text>
          <div className={styles.Step1SalaryRanges}>
            <div className={styles.Step1SalaryRange}>
              <MaterialBasicSelect
                className={styles.StepFullwidth}
                fieldRef={{...register('salaryFrom', { 
                  required: {
                    value: true,
                    message: 'This field is required.'
                  }
                })}}
                label={requiredLabel('From')}
                value={salaryFrom}
                onChange={(e) => setSalaryFrom(e.target.value)}
                error={errors.salaryFrom ? true : false}
                options={salaryFromOptions}
              />
              {errors.salaryFrom && errorText(errors.salaryFrom.message)}
            </div>
            
            {salaryTo && (
              <div className={styles.Step1SalaryRange}>
                <MaterialBasicSelect
                  className={styles.StepFullwidth}
                  fieldRef={{...register('salaryTo', { 
                    required: {
                      value: true,
                      message: 'This field is required.'
                    }
                  })}}
                  label={requiredLabel('To')}
                  value={salaryTo}
                  onChange={(e) => setSalaryTo(e.target.value)}
                  error={errors.salaryTo ? true : false}
                  options={salaryToOptions}
                />
                {errors.salaryTo && errorText(errors.salaryTo.message)}
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.Step1Subscribe}>
          <FormControlLabel
            control={
              <Switch 
                checked={headhuntMe}
                onChange={(e) => setHeadhuntMe(e.target.checked)}
              />
            }
            label={<Text textStyle='sm'>I’d like to join Headhunt Me to discover more job opportunities.</Text>}
          />
        </div>
      </div>
    </OnBoardLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const accessToken = req.cookies.accessToken

  store.dispatch(fetchConfigRequest())
  store.dispatch(fetchUserOwnDetailRequest({accessToken}))
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response
  const userDetail = storeState.users.fetchUserOwnDetail.response

  return {
    props: {
      config,
      userDetail,
      accessToken
    },
  }
})

export default Step1
