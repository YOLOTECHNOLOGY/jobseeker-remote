/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { map, is, pipe, filter } from 'ramda'
/* Vendor */
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'
import { useForm } from 'react-hook-form'

/* Components */
import Text from 'components/Text'
import Button from 'components/Button'
import Accordian from 'components/Accordian'

/* Helpers */
import useWindowDimensions from 'helpers/useWindowDimensions'

/* Style */
import styles from './JobSearchFilters.module.scss'

/* Images */
import { CloseIcon } from 'images'

interface NavSearchFilterProps {
  urlDefaultValues: any
  // categories: any
  isShowFilter: boolean
  handleShowFilter: Function
  onResetFilter: Function
  moreFilterReset?: boolean
  isShowingEmailAlert: boolean
  setClientDefaultValues: Function
  keyword: string
  config: any
}

interface SearchFilters {
  title: string
  fieldName: any
  options: Array<optionsType>
  defaultOpenState?: boolean
  isNotCollapsible?: boolean
  isColumn?: boolean
  isRadioButton?: boolean
  hasMainAndSubOption?: boolean
}

type optionsType = {
  value: string
  label: string
  'seo-value'?: string
  id?: any
  key?: any
  // eslint-disable-next-line camelcase
  sub_list?: any
}
const NavSearchFilter = ({
  urlDefaultValues,
  isShowFilter,
  handleShowFilter,
  onResetFilter,
  moreFilterReset = false,
  isShowingEmailAlert,
  setClientDefaultValues,
  keyword,
  config
}: NavSearchFilterProps) => {
  if (!isShowFilter) return null
  const expLvlList = config.xp_lvls
  const eduLevelList = config.educations
  const jobTypeList = config.job_types
  const companySizeList = config.company_sizes
  const industryList = config.industry_lists
  const financingStageList = config.company_financing_stage_lists?.map?.(item => ({ ...item, ['seo-value']: item.key })) ?? []
  const scrollY = useRef(0)
  const salaryRangeList = config.salary_range_filters.map((range) => ({
    ...range,
    value: range.value === '10K - 30K' ? 'Below 30K' : range.value
  }))

  const { width } = useWindowDimensions()
  const filterRef = useRef(null)
  const sortRef = useRef(null)
  const form = useForm()
  const { register, handleSubmit, reset } = form

  const cx = classNames.bind(styles)
  const isShowFilterClass = cx({
    isShowingEmailAlert: isShowingEmailAlert
  })
  const [displayMobileFilters, setDisplayMobileFilters] = useState(false)

  useEffect(() => {
    if (moreFilterReset) {
      handleResetFilter()
    }
  }, [moreFilterReset])

  useEffect(() => {
    // set defaultValues after config has been initialised
    if (Object.keys(urlDefaultValues).length !== 0) {
      reset(urlDefaultValues)
    }
    setDisplayMobileFilters(width < 769 ? true : false)
  }, [config, keyword])

  const onCloseFilter = () => {
    document.documentElement.classList.remove('modal-active')

    /* For IOS devices, restore scroll position*/
    window.scrollTo(0, scrollY.current)
    handleShowFilter()
  }

  const handleClickedOutside = (e) => {
    // hardcoding to detect clicking on MUI component
    const isClickingOnSpecializationMUI = e.target.id.includes('specialization-option')
    const isClickingOnSort = sortRef.current === 'sort'
    if (
      filterRef.current &&
      !filterRef.current.contains(e.target) &&
      !isClickingOnSpecializationMUI &&
      !isClickingOnSort
    )
      onCloseFilter()
  }

  const syncHeight = () => {
    document.documentElement.style.setProperty('--window-inner-height', `${window.innerHeight}px`)
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--window-inner-height', `${window.innerHeight}px`)
    window.addEventListener('resize', syncHeight)
    scrollY.current = window.pageYOffset
    document.documentElement.classList.add('modal-active')
    document.addEventListener('click', handleClickedOutside, true)
    return () => {
      document.removeEventListener('click', handleClickedOutside, true)
    }
  }, [])

  const handleApplyFilter = (data) => {
    onCloseFilter()
    const filtered = pipe(
      map(arr => is(Array)(arr) ? arr.filter(a => a) : []),
      filter(a => a?.length)
    )(data)
    setClientDefaultValues(filtered)
  }

  const handleResetFilter = () => {
    // onCloseFilter()
    reset({})
    onResetFilter({})
  }
  // to handle filters that have 1 tier options
  const SearchFilters = ({
    title,
    fieldName,
    options,
    defaultOpenState,
    isNotCollapsible,
    isColumn,
    isRadioButton
  }: SearchFilters) => {
    const isFilterColumnClass = cx({ searchFilterOptionsColumn: isColumn })

    return (
      <div className={styles.searchFilterSection}>
        <Accordian
          chevronIcon
          paddedContent
          isNotCollapsible={isNotCollapsible}
          defaultOpenState={defaultOpenState}
          title={
            <Text textStyle='lg' bold>
              {title}
            </Text>
          }
          className={styles.searchFilterAccordion}
        >
          <div className={classNamesCombined([styles.searchFilterOptions, isFilterColumnClass])}>
            {options &&
              options.map((option, i) => {
                if (isRadioButton) {
                  return (
                    <label key={i} className={styles.searchFilterOption}>
                      <input
                        defaultChecked={option.value == '1' ? true : false}
                        type='radio'
                        value={option['value']}
                        {...register(fieldName)}
                      />
                      <Text textStyle='lg'>{option.label}</Text>
                    </label>
                  )
                }

                return (
                  <React.Fragment key={i}>
                    {i === 0 && (
                      // injecting an empty checkbox fixes weird bug where selecting the second checkbox will auto select first checkbox
                      <label key='empty' style={{ display: 'none' }}>
                        <input type='checkbox' value={null} {...register(fieldName)} />
                        <Text textStyle='lg'>Empty</Text>
                      </label>
                    )}
                    <label key={i} className={styles.searchFilterOption}>
                      <input
                        type='checkbox'
                        value={option['seo-value']}
                        defaultChecked={
                          urlDefaultValues[fieldName] &&
                          urlDefaultValues[fieldName].includes(option['seo-value'])
                        }
                        {...register(fieldName)}
                      />
                      <Text textStyle='lg'>{option.value}</Text>
                    </label>
                  </React.Fragment>
                )
              })}
          </div>
        </Accordian>
      </div>
    )
  }

  return ReactDOM.createPortal(
    <>
      <div className={styles.modalOverlay} />
      <div className={styles.modalWrapper} aria-modal aria-hidden tabIndex={-1} role='dialog'>
        <div
          ref={filterRef}
          className={classNamesCombined([styles.searchFilter, isShowFilterClass])}
        >
          <div className={styles.searchFilterHeader}>
            <Text textStyle='lg' bold>
              Filters
            </Text>
            <div className={styles.searchFilterClose} onClick={() => onCloseFilter()}>
              <img src={CloseIcon} alt='logo' width='13' height='13' />
            </div>
          </div>
          <div className={styles.searchFilterBody}>
            <form className={styles.searchFilterForm}>
              {displayMobileFilters && (
                <div className={styles.searchFilterSection}>
                  <SearchFilters
                    title='Sort By'
                    fieldName='sort'
                    options={[
                      { value: '1', label: 'Newest' },
                      { value: '2', label: 'Relevance' },
                      { value: '3', label: 'Highest Salary' }
                    ]}
                    defaultOpenState={true}
                    isNotCollapsible={true}
                    isColumn
                    isRadioButton
                  />
                  <SearchFilters
                    title='Job Type'
                    fieldName='jobType'
                    options={jobTypeList}
                    defaultOpenState={true}
                    isNotCollapsible={true}
                    isColumn
                  />
                  <SearchFilters
                    title='Salary'
                    fieldName='salary'
                    options={salaryRangeList}
                    defaultOpenState={true}
                    isNotCollapsible={true}
                    isColumn
                  />
                </div>
              )}

              <SearchFilters
                title='Work Experience'
                fieldName='workExperience'
                options={expLvlList}
                defaultOpenState={true}
                isNotCollapsible={true}
              />
              <SearchFilters
                title='Qualification'
                fieldName='qualification'
                options={eduLevelList}
                defaultOpenState={true}
                isNotCollapsible={true}
              />
              <SearchFilters
                title='Industry'
                fieldName='industry'
                options={industryList}
                defaultOpenState={true}
                isNotCollapsible={true}
              />
              <SearchFilters
                title='Verified Company'
                fieldName='verifiedCompany'
                options={[
                  {
                    key: 'verified-companies',
                    ['seo-value']: 'verified-companies',
                    value: 'View verified companies',
                    label: 'View verified companies'
                  }
                ]}
                defaultOpenState={true}
                isNotCollapsible={true}
              />
              <SearchFilters
                title='Company Size'
                fieldName='companySizes'
                options={companySizeList}
                defaultOpenState={true}
                isNotCollapsible={true}
              />
              <SearchFilters
                title='Financing Stage'
                fieldName='financingStages'
                options={financingStageList}
                defaultOpenState={true}
                isNotCollapsible={true}
              />

            </form>
          </div>
          <div className={styles.searchFilterFooter}>
            <div className={styles.searchFilterReset} onClick={handleResetFilter}>
              <Button>
                <Text textStyle='base' textColor='primary' bold>
                  Reset Filter
                </Text>
              </Button>
            </div>
            <Button
              className={styles.searchFilterApply}
              onClick={handleSubmit(handleApplyFilter)}
              primary
            >
              <Text textStyle='base' textColor='white' bold>
                Apply Filter
              </Text>
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

export default NavSearchFilter
