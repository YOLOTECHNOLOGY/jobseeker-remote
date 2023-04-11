import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import { isMobile } from 'react-device-detect'
import { END } from 'redux-saga'
import { wrapper } from 'store'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { updateUserOnboardingInfoRequest } from 'store/actions/users/updateUserOnboardingInfo'
import Text from 'components/Text'
import OnBoardLayout from 'components/OnBoardLayout'
import MaterialTextField from 'components/MaterialTextField'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialLocationField from 'components/MaterialLocationField'
// import MaterialMobileTooltip from 'components/MaterialMobileTooltip'
import MaterialButton from 'components/MaterialButton'
import Divider from '@mui/material/Divider'
import {
  getNoticePeriodList,
  getSmsCountryList,
  getSalaryOptions,
  getCountryList,
  getJobTypeList
} from 'helpers/jobPayloadFormatter'
import styles from './Onboard.module.scss'
// import { DisclaimerIcon } from 'images'
import { getItem } from 'helpers/localStorage'
import JobFunctionSelector from 'components/JobFunctionSelector'
import { flatMap } from 'lodash-es'
import Script from 'next/script'

const Step1 = (props: any) => {
  const currentStep = 1
  const quickUpladResumeType = getItem('quickUpladResume')
  const totalStep = quickUpladResumeType === 'upFile' || quickUpladResumeType === 'onLine' ? 3 : 4
  const { userDetail, accessToken } = props
  const preference = userDetail?.job_preferences?.[0]
  const config = useSelector((store: any) => store?.config?.config?.response)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchConfigRequest())
  }, [])
    // const rhTooltipTitle =
    ; ('Robo-headhunting is a fully-automated executive placement service based powered by our very own machine learning algorithms that automatically matches you with employers and help you gain access to the hidden job market.')
  const locationList = useSelector(
    (store: any) => store.config.config.response?.location_lists
  )
  const formattedLocationList = flatMap(locationList, (l) => l.locations)
  const desiredLoaction = useMemo(() => {
    return formattedLocationList.find((l) => l.key === preference?.location_key)
  }, [formattedLocationList, preference?.location_key])

  const location = useMemo(() => {
    return formattedLocationList.find((l) => l.value === userDetail?.location)
  }, [formattedLocationList, userDetail?.location])

  const noticeList = getNoticePeriodList(config)
  const smsCountryList = getSmsCountryList(config)
  const jobTypeList = getJobTypeList(config)
  const countryList = getCountryList(config)
  const getSmsCountryCode = (phoneNumber, smsCountryList) => {
    if (!phoneNumber || !smsCountryList) return null
    const matchedCountryCode = smsCountryList.filter((country) => {
      return phoneNumber.includes(country.value)
    })
    return matchedCountryCode ? matchedCountryCode[0]?.value : null
  }
  const [isShowCountry, setIsShowCountry] = useState(userDetail?.location === 'Overseas')
  const [isShowDesiredCountry, setIsShowDesiredCountry] = useState(
    preference?.location_key === 'overseas'
  )

  const defaultValues = useMemo(() => {
    const countryCode = getSmsCountryCode(userDetail?.phone_num, smsCountryList) || '+63'
    return {
      jobTitle: {
        id: preference?.function_job_title_id,
        value: preference?.function_job_title ?? ''
      },
      jobType: preference?.job_type_key,
      minSalary: Number(preference?.salary_range_from) ?? undefined,
      maxSalary: Number(preference?.salary_range_to) ?? undefined,
      location: location,
      industry: preference?.industry_key,
      desiredLocation: desiredLoaction,
      countryCode,
      noticePeriod: userDetail?.notice_period_id,
      contactNumber: userDetail?.phone_num?.replace(countryCode, '') || null,
      country: userDetail?.country_key,
      currency: 'php',
      desiredCountry: preference?.country_key,
      firstName: userDetail?.first_name,
      lastName: userDetail?.last_name
    }
  }, [preference])
  const minSalaryOptions = getSalaryOptions(config)
  const [maxSalaryOptions, setMaxSalaryOptions] = useState([])
  const industryOptions = useMemo(() => {
    return (
      config?.industry_lists?.map((industry) => ({
        label: industry.value,
        value: industry.key
      })) ?? []
    )
  }, [config?.industry_lists])

  const { handleSubmit, setValue, getValues, control } = useForm({ defaultValues })
  const [minSalary, setMinSalary] = useState(getValues().minSalary)
  const router = useRouter()
  const getMaxSalaryOptions = (minSalary) => {
    const maxSalaryOptions = getSalaryOptions(config, minSalary, true)
    setValue('maxSalary', maxSalaryOptions?.length > 0 ? maxSalaryOptions[0].value : null)
    setMaxSalaryOptions(maxSalaryOptions)
  }
  useEffect(() => {
    getMaxSalaryOptions(minSalary)
  }, [minSalary])
  const isUpdatingUserProfile = useSelector(
    (store: any) => store.users.updateUserOnboardingInfo.fetching
  )
  const handleUpdateProfile = (data) => {
    const {
      minSalary,
      maxSalary,
      contactNumber,
      currency,
      desiredCountry,
      country,
      countryCode,
      location,
      noticePeriod,
      desiredLocation,
      jobTitle,
      jobType,
      industry,
      firstName,
      lastName
    } = data
    const payload = {
      redirect: router.query?.redirect ? router.query.redirect : null,
      preferenceId: preference?.id,
      preferences: {
        job_title: jobTitle.value || '',
        function_job_title_id: jobTitle.id,
        function_job_title: jobTitle.value,
        job_type_key: jobType || '',
        location_key: desiredLocation?.key || '',
        salary_range_from: Number(minSalary),
        salary_range_to: Number(maxSalary),
        industry_key: industry,
        currency_key: currency,
        country_key: desiredCountry
      },
      profile: {
        notice_period_id: noticePeriod,
        country_key: country,
        location_key: location?.key || '',
        phone_num: countryCode + contactNumber,
        first_name: firstName,
        last_name: lastName
      },
      accessToken,
      currentStep,
      type: null
    }
    dispatch(updateUserOnboardingInfoRequest(payload))
  }

  return (<>
    {/* Google One Tap Sign in */}
    <Script src='https://accounts.google.com/gsi/client'
      onReady={() => {
        if (!accessToken) {
          const google = (window as any)?.google
          // console.log('loginGoogle', google)
          google.accounts.id.initialize({
            client_id: '197019623682-n8mch4vlad6r9c6t3vhovu01sartbahq.apps.googleusercontent.com',
            callback: handleGoogleOneTapLoginResponse,
            cancel_on_tap_outside: false,
            itp_support: true,
            skip_prompt_cookie: 'accessToken'
          });
          google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              console.log(notification.getNotDisplayedReason())
            }
          });
          function handleGoogleOneTapLoginResponse(CredentialResponse) {
            // console.log('handleGoogleOneTapLoginResponse', CredentialResponse)
            const accessTokenGoogle = CredentialResponse.credential;
            let activeKey = 1;
            if (window.location.pathname.includes('/employer')) {
              activeKey = 2;
            }
            window.location.replace("/handlers/googleLoginHandler?access_token=" + accessTokenGoogle + "&active_key=" + activeKey);
          }
        }
      }}
    />
    <OnBoardLayout
      headingText={
        <Text bold textStyle='xxxl' tagName='h2'>
          Let’s get you a job! 🎉👏 <br /> Tell us about yourself.
        </Text>
      }
      currentStep={currentStep}
      totalStep={totalStep}
      isMobile={isMobile}
      nextFnBtn={handleSubmit(handleUpdateProfile)}
      isUpdating={isUpdatingUserProfile}
      isNextDisabled={false}
    >
      <div className={styles.stepForm}>
        <div className={styles.step1Names}>
          <div className={styles.step1NamesFirst}>
            <Controller
              control={control}
              name={'firstName'}
              rules={{ required: 'This field is required.' }}
              render={({ field, fieldState }) => {
                return (
                  <MaterialTextField
                    className={styles.stepFullwidth}
                    label='First Name'
                    required
                    {...fieldState}
                    {...field}
                  />
                )
              }}
            />
          </div>
          <div className={styles.step1NamesLast}>
            <Controller
              control={control}
              name={'lastName'}
              rules={{ required: 'This field is required.' }}
              render={({ field, fieldState }) => {
                return (
                  <MaterialTextField
                    className={styles.stepFullwidth}
                    label='Last Name'
                    required
                    {...fieldState}
                    {...field}
                  />
                )
              }}
            />
          </div>
        </div>
        <div className={styles.stepField} style={{ marginBottom: 20 }}>
          <Controller
            control={control}
            name={'location'}
            rules={{ required: 'This field is required.' }}
            render={({ field, fieldState }) => {
              const { onChange } = field
              return (
                <MaterialLocationField
                  className={styles.stepFullwidth}
                  label='Current location'
                  required
                  {...fieldState}
                  {...field}
                  onChange={(_, location) => {
                    setIsShowCountry(location?.key === 'overseas')
                    onChange(location)
                  }}
                />
              )
            }}
          />
          {isShowCountry && (
            <div className={classNames(styles.stepField, styles.stepFieldCountry)}>
              <Controller
                control={control}
                name={'country'}
                rules={{ validate: (value) => !!value || 'This field is required.' }}
                render={({ field, fieldState }) => {
                  return (
                    <MaterialBasicSelect
                      className={styles.stepFullwidth}
                      label='Country'
                      options={countryList}
                      required
                      {...fieldState}
                      {...field}
                    />
                  )
                }}
              />
            </div>
          )}
        </div>
        <div className={styles.step1Contact}>
          <Controller
            control={control}
            name={'countryCode'}
            rules={{ validate: (value) => !!value || 'This field is required.' }}
            render={({ field, fieldState }) => {
              return (
                <MaterialBasicSelect
                  className={styles.step1ContactCountry}
                  label='Country code'
                  options={smsCountryList}
                  required
                  {...fieldState}
                  {...field}
                  ref={undefined}
                />
              )
            }}
          />

          <div className={styles.step1ContactNumber}>
            <Controller
              control={control}
              name={'contactNumber'}
              rules={{ required: 'This field is required.' }}
              render={({ field, fieldState }) => {
                return (
                  <MaterialTextField
                    className={styles.step1ContactNumberField}
                    label='Contact Number'
                    size='small'
                    type='number'
                    required
                    {...fieldState}
                    {...field}
                    ref={undefined}
                  />
                )
              }}
            />
          </div>
        </div>
        <div className={styles.stepField}>
          <Controller
            control={control}
            name={'jobTitle'}
            rules={{ validate: (value) => (value.id ? undefined : 'This field is required.') }}
            render={({ field, fieldState }) => {
              return (
                <JobFunctionSelector
                  className={styles.stepFullwidth}
                  control={control}
                  label='Desired job title'
                  variant='outlined'
                  autoComplete='off'
                  jobTitle={preference?.function_job_title}
                  title='Job Title'
                  helperText={fieldState?.error?.message}
                  required
                  {...fieldState}
                  {...field}
                  ref={undefined}
                />
              )
            }}
          />
        </div>
        <div className={styles.stepField}>
          <Controller
            control={control}
            name={'jobType'}
            rules={{ required: 'This field is required.' }}
            render={({ field, fieldState }) => {
              return (
                <MaterialBasicSelect
                  className={styles.stepFullwidth}
                  label='Desired job type'
                  options={jobTypeList}
                  required
                  {...fieldState}
                  {...field}
                  ref={undefined}
                />
              )
            }}
          />
        </div>
        <div className={styles.stepField}>
          <Controller
            control={control}
            name={'desiredLocation'}
            rules={{ required: 'This field is required.' }}
            render={({ field, fieldState }) => {
              const { onChange } = field
              return (
                <MaterialLocationField
                  className={styles.stepFullwidth}
                  label='Desired working location'
                  required
                  {...fieldState}
                  {...field}
                  onChange={(_, location) => {
                    setIsShowDesiredCountry(location?.key === 'overseas')
                    onChange(location)
                  }}
                  ref={undefined}
                />
              )
            }}
          />
          {isShowDesiredCountry && (
            <div className={classNames(styles.stepField, styles.stepFieldCountry)}>
              <Controller
                control={control}
                name={'desiredCountry'}
                rules={{ validate: (value) => !!value || 'This field is required.' }}
                render={({ field, fieldState }) => {
                  return (
                    <MaterialBasicSelect
                      className={styles.stepFullwidth}
                      label='Country'
                      options={countryList}
                      required
                      {...fieldState}
                      {...field}
                    />
                  )
                }}
              />
            </div>
          )}
        </div>
        <div className={styles.step1Salary}>
          <div className={styles.step1SalaryRanges}>
            <div className={styles.step1SalaryRange}>
              <Controller
                control={control}
                name='currency'
                rules={{ required: 'This field is required.' }}
                render={({ field, fieldState }) => {
                  return (
                    <MaterialBasicSelect
                      className={styles.stepFullwidth}
                      label='Desired salary currency'
                      options={[{ value: 'php', label: 'PHP' }]}
                      required
                      {...fieldState}
                      {...field}
                      ref={undefined}
                    />
                  )
                }}
              />
            </div>
            <div className={styles.step1SalaryRange}>
              <Controller
                control={control}
                name={'minSalary'}
                rules={{ validate: (value) => !!value || 'This field is required.' }}
                render={({ field, fieldState }) => {
                  const { value, onChange } = field
                  return (
                    <MaterialBasicSelect
                      className={styles.stepFullwidth}
                      label='Min. salary'
                      options={minSalaryOptions}
                      required
                      {...fieldState}
                      {...field}
                      value={value || undefined}
                      onChange={(e) => {
                        setMinSalary(e.target.value)
                        onChange(e)
                      }}
                      ref={undefined}
                    />
                  )
                }}
              />
            </div>
            <div className={styles.step1SalaryRange}>
              <Controller
                control={control}
                name={'maxSalary'}
                rules={{ validate: (value) => !!value || 'This field is required.' }}
                render={({ field, fieldState }) => {
                  const { value } = field
                  return (
                    <MaterialBasicSelect
                      className={styles.stepFullwidth}
                      label='Max. salary'
                      rules={{ required: 'This field is required.' }}
                      required
                      options={maxSalaryOptions}
                      {...fieldState}
                      {...field}
                      value={value || undefined}
                      ref={undefined}
                    />
                  )
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.stepField}>
          <Controller
            control={control}
            name={'industry'}
            rules={{ required: 'This field is required.' }}
            render={({ field, fieldState }) => {
              return (
                <MaterialBasicSelect
                  className={styles.stepFullwidth}
                  label='Desired Industry'
                  required
                  options={industryOptions}
                  {...fieldState}
                  {...field}
                  ref={undefined}
                />
              )
            }}
          />
        </div>
        <div className={styles.stepField}>
          <Controller
            control={control}
            name={'noticePeriod'}
            rules={{ required: 'This field is required.' }}
            render={({ field, fieldState }) => {
              return (
                <MaterialBasicSelect
                  className={styles.stepFullwidth}
                  label='Availability'
                  required
                  options={noticeList}
                  {...fieldState}
                  {...field}
                  ref={undefined}
                />
              )
            }}
          />
        </div>
        <div className={styles.step1Subscribe}>
          {/* {isMobile && (
            <MaterialMobileTooltip
              icon={DisclaimerIcon}
              className={styles.disclaimerIcon}
              title={rhTooltipTitle}
            />
          )} */}
        </div>
      </div>
      {isMobile && (
        <React.Fragment>
          <Divider className={styles.divider} />

          <div className={styles.stepFormActions}>
            <MaterialButton
              variant='contained'
              isLoading={isUpdatingUserProfile}
              disabled={false}
              capitalize
              onClick={handleSubmit(handleUpdateProfile)}
            >
              <Text textColor='white'>Next</Text>
            </MaterialButton>
          </div>
        </React.Fragment>
      )}
    </OnBoardLayout>
  </>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return {
      redirect: {
        destination: '/get-started?redirect=/jobseeker-complete-profile/1',
        permanent: false
      }
    }
  }

  // store.dispatch(fetchConfigRequest())
  store.dispatch(fetchUserOwnDetailRequest({ accessToken }))
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  //  const config = storeState.config.config.response
  const userDetail = storeState.users.fetchUserOwnDetail.response

  return {
    props: {
      //  config,
      userDetail,
      accessToken
    }
  }
})

export default Step1
