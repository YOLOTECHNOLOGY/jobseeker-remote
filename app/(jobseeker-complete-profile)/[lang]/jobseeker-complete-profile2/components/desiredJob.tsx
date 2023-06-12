import React, { useState, useEffect, useMemo } from 'react'
import styles from '../index.module.scss'
import Header from './Header'
import Stepper from './stepper'
import FootBtn from './footBtn'

import JobFunctionSelector from 'components/JobFunctionSelector'
import { Controller, useForm } from 'react-hook-form'
import MaterialLocationField from 'components/MaterialLocationField'
import { getValueById } from 'helpers/config/getValueById'
import { flatMap } from 'lodash-es'
import { getCountryKey } from 'helpers/country'
import { useDispatch, useSelector } from 'react-redux'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import {
  getNoticePeriodList,
  getSmsCountryList,
  getSalaryOptions,
  getCountryList,
  getJobTypeList,
  getCurrencyList
} from 'helpers/jobPayloadFormatter'
const countryForCountryCode = {
  ph: '+63',
  sg: '+65'
}
const countryForCurrency = {
  ph: 'php',
  sg: 'sgd'
}
const EducationExperience = (props: any) => {
  console.log(props)
  const { lang, userDetail, config } = props

  const [maxSalaryOptions, setMaxSalaryOptions] = useState([])
  const preference = userDetail?.job_preferences?.[0]
  const [currencyLists, countryList, smsCountryList, jobTypeList] = useMemo(() => {
    return [
      getCurrencyList(config),
      getCountryList(config),
      getNoticePeriodList(config),
      getSmsCountryList(config),
      getJobTypeList(config)
    ]
  }, [config])
  const minSalaryOptions = getSalaryOptions(config)
  const locationList = useSelector((store: any) => store.config.config.response?.location_lists)
  const formattedLocationList = flatMap(locationList, (l) => l.locations)
  const desiredLoaction = useMemo(() => {
    return formattedLocationList.find((l) => l.key === preference?.location_key)
  }, [formattedLocationList, preference?.location_key])

  const country = getCountryKey()
  const getSmsCountryCode = (phoneNumber, smsCountryList) => {
    if (!phoneNumber || !smsCountryList) return null
    const matchedCountryCode = smsCountryList.filter((country) => {
      return phoneNumber.includes(country.value)
    })
    return matchedCountryCode ? matchedCountryCode[0]?.value : null
  }
  const defaultValues = useMemo(() => {
    const countryCode =
      getSmsCountryCode(userDetail?.phone_num, smsCountryList) || countryForCountryCode[country]
    const { location_id, job_type_id, industry_id, country_id } = preference || {}
    const result = {
      jobTitle: {
        id: preference?.function_job_title_id,
        value:
          getValueById(config, preference?.function_job_title_id, 'function_job_title_id') ?? ''
      },
      jobType: getValueById(config, job_type_id, 'job_type_id', 'key'),
      minSalary: Number(preference?.salary_range_from) ?? undefined,
      maxSalary: Number(preference?.salary_range_to) ?? undefined,
      location,
      industry: getValueById(config, industry_id, 'industry_id', 'key'),
      desiredLocation: desiredLoaction,
      countryCode,
      noticePeriod: userDetail?.notice_period_id,
      contactNumber: userDetail?.phone_num?.replace(countryCode, '') || null,
      country: userDetail?.country_key,
      currency: countryForCurrency[country],
      desiredCountry: preference?.country_key,
      firstName: userDetail?.first_name,
      lastName: userDetail?.last_name
    }
    return result
  }, [preference])
  const { handleSubmit, setValue, getValues, control } = useForm({ defaultValues })
  const [jobFunction, setJobFunction] = useState({ id: undefined, value: '' })
  const [isShowCountry, setIsShowCountry] = useState(userDetail?.location === 'Overseas')
  const [minSalary, setMinSalary] = useState(getValues().minSalary)

  const [loading, setLoading] = useState(false)
  function handleClick() {
    // setLoading(true);
  }
  const {
    currentLocation = 'Manila',
    thisFieldIsRequired = 'thisFieldIsRequired',
    desiredSalaryCurrency = 'Currency type'
  } = lang?.profile || {}

  const requiredLabel = (text: string) => {
    return (
      <>
        <span>{text}</span>
        <span className={styles.stepFieldRequired}>*</span>
      </>
    )
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
            <div id='jobFunctionDesign' className={styles.stepField}>
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
            <div className={styles.stepField}>
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
                        setIsShowCountry(location?.key === 'overseas')
                        onChange(location)
                      }}
                    />
                  )
                }}
              />
            </div>

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
                <div className={styles.minSalary}>
                  <Controller
                    control={control}
                    name={'maxSalary'}
                    rules={{ validate: (value) => !!value || thisFieldIsRequired }}
                    render={({ field, fieldState }) => {
                      const { value } = field
                      return (
                        <MaterialBasicSelect
                          label={lang?.profile?.maxSalary}
                          rules={{ required: thisFieldIsRequired }}
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
            </div>
          </div>
        </div>
     
       <FootBtn/>

      </div>
    </div>
  )
}

export default EducationExperience
