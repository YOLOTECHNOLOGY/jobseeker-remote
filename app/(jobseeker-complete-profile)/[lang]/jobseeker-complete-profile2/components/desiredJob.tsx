import React, { useState, useEffect, useMemo } from 'react'
import styles from '../index.module.scss'
import Header from './Header'
import Stepper from './stepper'
import FootBtn from './footBtn'
import JobFunctionSelector from 'components/JobFunctionSelector'
import { Controller, useForm } from 'react-hook-form'
import MaterialLocationField from 'components/MaterialLocationField'
import { getCountryKey } from 'helpers/country'
import { getCountryId } from 'helpers/country'
import { useDispatch, useSelector } from 'react-redux'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import { useRouter, usePathname } from 'next/navigation'
import { createUserPreferencesService,updateUserPreferencesService } from 'store/services/users/addUserPreferences'
import {
  getSalaryOptions,
  getCountryList,
  getCurrencyList
} from 'helpers/jobPayloadFormatter'
import { getValueById } from 'helpers/config/getValueById'
import { flatMap } from 'lodash-es'
const countryForCurrency = {
  ph: 'php',
  sg: 'sgd'
}
const EducationExperience = (props: any) => {
  console.log(props)
  const { lang, userDetail, config,getUserInfo } = props
  const {job_preferences} = userDetail
  const pathname = usePathname()
  const router = useRouter()

  const preference = userDetail?.job_preferences?.[0]
  const [currencyLists,countryList] = useMemo(() => {
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
 
  // const [isShowCountry, setIsShowCountry] = useState(userDetail?.location === 'Overseas')
  const [minSalary, setMinSalary] = useState(getValues().minSalary)
  const [maxSalary, setMaxSalary] = useState(null)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [locationData, setLocationData] = useState(userDetail?.location === 'Overseas')
  const [maxSalaryOptions, setMaxSalaryOptions] = useState([])
  const [jobFunction, setJobFunction] = useState({ id: undefined, value: '' })
  const getMaxSalaryOptions = (minSalary) => {
    const maxSalaryOptions = getSalaryOptions(config, minSalary, true)
    setValue('maxSalary', maxSalaryOptions?.length > 0 ? maxSalaryOptions[0].value : null)
    setMaxSalaryOptions(maxSalaryOptions)
  }
  const locationList = config.location_lists
  const formattedLocationList = flatMap(locationList, (l) => l.locations)

  const location = useMemo(() => {
    if(preference?.location_id){
      return formattedLocationList.find((l) => l.id === preference.location_id)
    }
  }, [formattedLocationList, preference?.id])

  useEffect(()=>{
   if(preference?.id){

    const salaryFrom =Number(preference?.salary_range_from)
    getMaxSalaryOptions(salaryFrom)
     setValue('minSalary', String(salaryFrom))
     setValue('maxSalary',String(Number(preference?.salary_range_to)))
    setValue('location',location)
    setJobFunction({
      id: preference?.function_job_title_id,
      value: getValueById(config, preference?.function_job_title_id, 'function_job_title_id') ?? ''
    })

   }
  },[preference])

  
  useEffect(() => {
    getMaxSalaryOptions(minSalary)
  }, [minSalary])
 console.log({minSalary})
  useEffect(()=>{  
    if(jobFunction && maxSalary && locationData){
      setIsDisabled(false)
    }else{
      setIsDisabled(true)
    }
  },[jobFunction,maxSalary,locationData])
  console.log({jobFunction})
  const handleUpdateProfile = (data) => {
    console.log({data},jobFunction)
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
    if(job_preferences?.length){
       updateUserPreferencesService({
        preferenceId:preference.id,
        params
       }).then(res=>{
        if(res.data){
          getUserInfo?.()
          router.push(`${pathname}?step=4`)
        }
       }).finally(()=>setLoading(false))
     }else{
     
       createUserPreferencesService({params}).then(res=>{
        if(res.data){
          getUserInfo?.()
          router.push(`${pathname}?step=4`)
        }
       }).finally(()=>setLoading(false))
     }
  }




  const {
    currentLocation = 'Manila',
    thisFieldIsRequired = 'thisFieldIsRequired',
    desiredSalaryCurrency = 'Currency type',
  } = lang?.profile || {}

  const backClick = () => {
    router.push(`${pathname}?step=3`)
  }
 
  return (
    <div className={styles.work}>
      <Header />
      <div className={styles.workContainer}>
        <Stepper step={2} />
        <div className={styles.box}>
          <div className={styles.headerInfo}>Desired job</div>
          <div className={styles.body}>
            <p className={styles.title}>
              Desired job title <span>*</span>
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
              Desired location<span>*</span>
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
              Desired salary<span>*</span>
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
                          value={value || ''}
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
                          value={value || ''}
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
       rightText={'Submit'}
       backClick={backClick}
       disabled={isDisabled}
       handleClick={handleSubmit(handleUpdateProfile)}
       />

      </div>
    </div>
  )
}

export default EducationExperience
