import React, { useState, useEffect, useMemo ,useContext} from 'react'
import styles from '../index.module.scss'
import Stepper from './stepper'
import FootBtn from './footBtn'
import JobFunctionSelector from 'components/JobFunctionSelector'
import { Controller, useForm } from 'react-hook-form'
import MaterialLocationField from 'components/MaterialLocationField'
import { getCountryKey } from 'helpers/country'
import { getCountryId } from 'helpers/country'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import { usePathname } from 'next/navigation'
import { createUserPreferencesService,updateUserPreferencesService } from 'store/services/users/addUserPreferences'
import { fetchUserOwnDetailService } from 'store/services/users/fetchUserOwnDetail'
import {
  getSalaryOptions,
  getCountryList,
  getCurrencyList
} from 'helpers/jobPayloadFormatter'
import { getValueById } from 'helpers/config/getValueById'
import { flatMap } from 'lodash-es'
import { getLang } from 'helpers/country'
import { LinkContext } from 'app/components/providers/linkProvider'
import {generateUserResumeService} from 'store/services/users/generateUserResume'
import { getCookie,setCookie } from 'helpers/cookies'
const countryForCurrency = {
  ph: 'php',
  sg: 'sgd'
}
const EducationExperience = (props: any) => {

  const { lang, userDetail, config } = props
  const {job_preferences,resumes} = userDetail
  const pathname = usePathname()
  const { push } = useContext(LinkContext)
  const preference = userDetail?.job_preferences?.[0]
  const [currencyLists] = useMemo(() => {
    return [ getCurrencyList(config), getCountryList(config), ]
  }, [config])

  const minSalaryOptions = getSalaryOptions(config)
  const country = getCountryKey()

  const { handleSubmit, setValue, getValues, control } = useForm({
    defaultValues: {
    minSalary: '',
    maxSalary: '',
    location:'',
    currency: countryForCurrency[country]
  } })
  const accessToken = getCookie('accessToken')
  // const [isShowCountry, setIsShowCountry] = useState(userDetail?.location === 'Overseas')
  const [minSalary, setMinSalary] = useState(getValues().minSalary)
  const [maxSalary, setMaxSalary] = useState(null)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [locationData, setLocationData] = useState(null)
  const [maxSalaryOptions, setMaxSalaryOptions] = useState([])
  const [jobFunction, setJobFunction] = useState({ id: undefined, value: '' })
  const langKey = getLang()
  const isMobile = !!(document?.body.clientWidth < 750)
  const getMaxSalaryOptions = (minSalary) => {
    const maxSalaryOptions = getSalaryOptions(config, minSalary, true)
    const maxSalaryOrg = maxSalaryOptions?.length > 0 ? maxSalaryOptions[0].value : null
    setValue('maxSalary',maxSalaryOrg )
    setMaxSalary(maxSalaryOrg)
    setMaxSalaryOptions(maxSalaryOptions)
  }
  const locationList = config.location_lists
  const formattedLocationList = flatMap(locationList, (l) => l.locations)

  const location = useMemo(() => {
    if(preference?.location_id){
      return formattedLocationList.find((l) => l.id === preference?.location_id)
    }
  }, [formattedLocationList, preference?.id])

  useEffect(()=>{
   if(preference?.id){
    const  {salary_range_from,salary_range_to,location_id} = preference
    const salaryFrom =Number(salary_range_from)
    const maxSalaryOptions = getSalaryOptions(config, salaryFrom, true)
    setMaxSalaryOptions(maxSalaryOptions)
    setValue('minSalary', String(salaryFrom))
    setValue('maxSalary',String(Number(salary_range_to)))
    setValue('location',location)
    setJobFunction({
      id: preference?.function_job_title_id,
      value: getValueById(config, preference?.function_job_title_id, 'function_job_title_id') ?? ''
    })
    setMaxSalary(salary_range_to)
    setLocationData({
      id:location_id
    })
   }
  },[preference])
  
  useEffect(() => {
     if(minSalary){
      getMaxSalaryOptions(minSalary)
     }
  }, [minSalary])

  useEffect(()=>{  
    if(jobFunction?.id && maxSalary && locationData){
      setIsDisabled(false)
    }else{
      setIsDisabled(true)
    }
  },[jobFunction,maxSalary,locationData])

  const handleUpdateProfile = async (data) => {
    const { currency, location ,maxSalary,minSalary} = data || {}
    const params = {
      job_title: jobFunction.value || '',
      function_job_title_id: jobFunction.id,
      function_job_title: jobFunction.value,
      currency_key: currency,
      salary_range_from: Number(minSalary),
      salary_range_to: Number(maxSalary),
      country_id: getCountryId(),
      location_id: location?.id || '',
    }
     
    setLoading(true)
    if(!resumes){
      await generateUserResumeService({accessToken })
    }
    
    if(job_preferences?.length){
       updateUserPreferencesService({
        preferenceId:preference.id,
        params
       }).then(res=>{
        if(res.data){
          jumPage();
        }
       }).finally(()=>setLoading(false))
     }else{ 
       createUserPreferencesService({params}).then(res=>{
        if(res.data){
          jumPage()
        }
       }).finally(()=>setLoading(false))
     }
  }

//  const generateUserResume = ()=>{
//   if(!resumes){
//     generateUserResumeService({
//       accessToken
//     }).then(()=>{
//       getUserInfo?.()
//       jumPage();
//     })
//   }else{
//     jumPage();
//   }
//  };

 const jumPage = () => {
  // getUserInfo?.()
  fetchUserOwnDetailService({accessToken}).then(res=>{
    const userDetail = res?.data?.data
    console.log({userDetail})
    const userCookie = {
      active_key: userDetail.active_key,
      id: userDetail.id,
      first_name: userDetail.first_name,
      last_name: userDetail.last_name,
      email: userDetail.email,
      phone_num: userDetail.phone_num,
      is_mobile_verified: userDetail.is_mobile_verified,
      avatar: userDetail.avatar,
      additional_info: userDetail.additional_info,
      is_email_verify: userDetail.is_email_verify,
      notice_period_id: userDetail.notice_period_id,
      is_profile_completed: userDetail.is_profile_completed
    }
    setCookie('user',userCookie)
    const isChatRedirect = localStorage.getItem('isChatRedirect')
    const redirectPage  = sessionStorage.getItem('redirectPage')
    if(isChatRedirect){
      localStorage.removeItem('isChatRedirect')
      push(`/${langKey}/${isChatRedirect}`)
    }else if (redirectPage) {
      sessionStorage.removeItem('redirectPage')   
      push(redirectPage)      
    }  else{
      push(`/${langKey}/my-jobs`)
    }
  })
 
 }


  const {
    desiredJob,
    desiredJobTitle,
    currentLocation,
    desiredLocation,
    thisFieldIsRequired,
    submit,
    back,
    desiredSalary,
    desiredSalaryCurrency,
    skip
  } = lang?.profile || {}

  const backClick = () => {
    push(`${pathname}?step=3`)
  }
 
  return (
    <div className={styles.work}>
      <div className={styles.workContainer}>
        <Stepper step={2} lang={lang}/>
        <div className={styles.box}>
          <div className={styles.headerInfo}>{desiredJob}</div>
          <div className={styles.body}>
            <p className={styles.title}>
              {desiredJobTitle} <span>*</span>
            </p>
            <div id='jobFunctionDesign' className={styles.stepFieldDateItem}>
              <JobFunctionSelector
                label={lang?.profile?.jobFunction}
                title={lang?.profile?.jobFunction}
                lang={lang}
                name='jobFunction'
                isTouched
                fullWidth
                value={jobFunction}
                onChange={(value) => setJobFunction(value)}
              />
            </div>

            <p className={styles.title}>
             {desiredLocation}<span>*</span>
            </p>
            <div className={styles.stepFieldDateItem}>
              <Controller
                control={control}
                name={'location'}
                rules={{ required: thisFieldIsRequired }}
                render={({ field, fieldState }) => {
                  const { onChange } = field
                  return (
                    <MaterialLocationField
                      className={styles.stepFullwidth}
                      label={currentLocation}
                      required
                      {...fieldState}
                      {...field}
                      onChange={(_, location) => {
                        // setIsShowCountry(location?.key === 'overseas')
                        setLocationData(location)
                        onChange(location)
                      }}
                    />
                  )
                }}
              />
            </div>
            {/* {isShowCountry && (
              <div className={styles.stepFieldToItem}>
                <Controller
                  control={control}
                  name={'country'}
                  rules={{ validate: (value) => !!value || thisFieldIsRequired }}
                  render={({ field, fieldState }) => {
                    return (
                      <MaterialBasicSelect
                        className={styles.stepFullwidth}
                        label={countryText}
                        options={countryList}
                        useID={true}
                        required
                        {...fieldState}
                        {...field}
                      />
                    )
                  }}
                />
              </div>
            )} */}

            <p className={styles.title}>
              {desiredSalary}<span>*</span>
            </p>
            <div className={styles.step1Salary}>
              <div className={styles.step1SalaryRanges}>
                <div className={styles.currency}>
                  <Controller
                    control={control}
                    name='currency'
                    rules={{ required: thisFieldIsRequired }}
                    render={({ field, fieldState }) => {
                      return (
                        <MaterialBasicSelect
                          label={desiredSalaryCurrency}
                          options={currencyLists}
                          disabled
                          {...fieldState}
                          {...field}
                          ref={undefined}
                        />
                      )
                    }}
                  />
                </div>
                <div className={styles.salaryBox}> 
                <div className={styles.minSalary}>
                  <Controller
                    control={control}
                    name={'minSalary'}
                    rules={{ validate: (value) => !!value || thisFieldIsRequired }}
                    render={({ field, fieldState }) => {
                      const { value, onChange } = field
                      return (
                        <MaterialBasicSelect
                         label={lang?.profile?.minSalary}
                          options={minSalaryOptions}
                          required
                          {...fieldState}
                          {...field}
                          value={value}
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
                <div className={styles.minSalary}>
                  <Controller
                    control={control}
                    name={'maxSalary'}
                    rules={{ validate: (value) => !!value || thisFieldIsRequired }}
                    render={({ field, fieldState }) => {
                      const { value ,onChange} = field
                      return (
                        <MaterialBasicSelect
                          label={lang?.profile?.maxSalary}
                          rules={{ required: thisFieldIsRequired }}
                          required
                          options={maxSalaryOptions}
                          {...fieldState}
                          {...field}
                          onChange={(e) => {
                            setMaxSalary(e.target.value)
                            onChange(e)
                          }}
                          value={value}
                          ref={undefined}
                        />
                      )
                    }}
                  />
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
     
       <FootBtn
       loading={loading}
       rightText={submit}
       backText={back}
       backClick={backClick}
       disabled={isDisabled}
       skipText={skip}
       handleClick={handleSubmit(handleUpdateProfile)}
       />

      </div>
    </div>
  )
}

export default EducationExperience
