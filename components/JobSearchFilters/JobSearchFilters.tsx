import React, { useEffect, useRef, useState } from 'react'

/* Vendor */
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

/* Components */
import Image from 'next/image'
import Text from 'components/Text'
import Button from 'components/Button'
import Accordian from 'components/Accordian'
// import MaterialAutocompleteLimitTags from 'components/MaterialAutocompleteLimitTags'

/* Helpers */
import {
  // conditionChecker,
  // getPredefinedParamsFromUrl,
  // getLocationList,
  userFilterSelectionDataParser,
} from 'helpers/jobPayloadFormatter'
import useWindowDimensions from 'helpers/useWindowDimensions'

/* Style */
import styles from './JobSearchFilters.module.scss'

/* Images */
import { CloseIcon } from 'images'

interface NavSearchFilterProps {
  urlDefaultValues: any
  categories: any
  isShowFilter: boolean
  onShowFilter: Function
  onResetFilter: Function
  displayQuickLinks: Boolean
  moreFilterReset?: boolean
  isEmailVerify: boolean
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
  id?: any
  key?: any
  // eslint-disable-next-line camelcase
  sub_list?: any
}

const NavSearchFilter = ({
  // urlDefaultValues,
  categories,
  isShowFilter,
  onShowFilter,
  displayQuickLinks,
  onResetFilter,
  moreFilterReset = false,
  isEmailVerify,
}: NavSearchFilterProps) => {
  const router = useRouter()
  const { keyword } = router.query
  const queryParams = router.query
  const config = useSelector((state: any) => state.config.config.response)
  // TODO: mobile job filters for salary, job type, categories
  // const jobCategoryList = config.inputs.job_category_lists
  // const locationList = getLocationList(config)

  const industryList = config.inputs.industry_lists
  const expLvlList = config.inputs.xp_lvls
  const eduLevelList = config.filters.educations
  const jobTypeList = config.inputs.job_types

  const salaryRangeList = config.filters.salary_range_filters.map((range) => ({
    key: range.key === '10K - 30K' ? 'Below 30K' : range.key,
    value: range.value === '10K - 30K' ? 'Below 30K' : range.value,
  }))

  const { width } = useWindowDimensions()
  const filterRef = useRef(null)
  const sortRef = useRef(null)
  const { register, handleSubmit, reset } = useForm()
  const cx = classNames.bind(styles)
  const isShowFilterClass = cx({
    isShow: isShowFilter,
    displayQuickLinks: displayQuickLinks,
    emailNotVerified: !isEmailVerify,
  })
  const [selectedCategories, setSelectedCategories] = useState([])
  const [displayMobileSort, setDisplayMobileSort] = useState(false)

  useEffect(() => {
    if (moreFilterReset) {
      handleResetFilter()
    }
  }, [moreFilterReset])

  useEffect(() => {
    setSelectedCategories(categories)
  }, [categories])

  let defaultValues = {}
  const appendDefaultKeyValue = (fieldName, value) => {
    const data = {
      ...defaultValues,
      [fieldName]: value.toString().split(','),
    }
    return data
  }

  // append all queryParams EXCEPT keyword and search into defaultValues object
  Object.entries(queryParams).forEach(([key, value]) => {
    if (key !== 'keyword' && key !== 'search') {
      defaultValues = appendDefaultKeyValue(key, value)
    }
  })

  useEffect(() => {
    // set defaultValue after config has been initialised
    if (Object.keys(defaultValues).length !== 0) {
      reset(defaultValues)
    }
    setDisplayMobileSort(width < 769 ? true : false)
  }, [config, keyword])

  const handleApplyFilter = (data) => {
    const values = Object.values(data)
    const allFalsyValues = values.filter((val) => !!val)
    const updatedData = {
      ...data,
      sort: [data.sort || router.query.sort],
    }
    if (allFalsyValues.length !== 0 || selectedCategories) {
      urlFilterParameterBuilder(updatedData)
    }
    onShowFilter()
  }

  const handleResetFilter = () => {
    setSelectedCategories([])

    reset({})
    onResetFilter({})
  }

  // const onRemoveProperty = (propertyName, object) => {
  //   // eslint-disable-next-line
  //   const { [propertyName]: propertyValue, ...newObject } = { ...object }
  //   return { ...newObject }
  // }

  const urlFilterParameterBuilder = (data) => {
    const { searchQuery, filterParamsObject } = userFilterSelectionDataParser(
      'moreFilters',
      data,
      router.query,
      config
    )

    router.push(
      {
        pathname: `${process.env.HOST_PATH}/jobs-hiring/${
          searchQuery ? searchQuery : 'job-search'
        }`,
        query: {
          ...filterParamsObject,
        },
      },
      undefined,
      { shallow: true }
    )
  }

  // const handleSpecializationChange = (event, value) => {
  //   setSelectedCategories(value)
  // }

  const SearchFilters = ({
    title,
    fieldName,
    options,
    defaultOpenState,
    isNotCollapsible,
    isColumn,
    isRadioButton,
    hasMainAndSubOption,
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
            {hasMainAndSubOption
              ? options.map((option) => {
                  const subListOptions = option.sub_list
                  return (
                    <React.Fragment key={option.id}>
                      <label className={styles.searchFilterOption}>
                        <input
                          type='checkbox'
                          value={option['seo-value']}
                          // onClick={(e) => handleMainClick(e, option)}
                          {...register(fieldName)}
                        />
                        <Text textStyle='lg'>{option.value}</Text>
                      </label>
                      {subListOptions.map((subOption) => {
                        return (
                          <label key={subOption.id} className={styles.searchFilterOptionSub}>
                            <input
                              type='checkbox'
                              value={subOption['seo-value']}
                              // onClick={(e) => handleSubClick(e, subOption)}
                              {...register(fieldName)}
                            />
                            <Text textStyle='lg'>{subOption.value}</Text>
                          </label>
                        )
                      })}
                    </React.Fragment>
                  )
                })
              : options &&
                options.map((option, i) => {
                  if (isRadioButton) {
                    return (
                      <label key={i} className={styles.searchFilterOption}>
                        <input type='radio' value={option['seo-value']} {...register(fieldName)} />
                        <Text textStyle='lg'>{option.label}</Text>
                      </label>
                    )
                  }

                  return (
                    <label key={i} className={styles.searchFilterOption}>
                      <input type='checkbox' value={option['seo-value']} {...register(fieldName)} />
                      <Text textStyle='lg'>{option.value}</Text>
                    </label>
                  )
                })}
          </div>
        </Accordian>
      </div>
    )
  }

  const handleClickedOutside = (e) => {
    // hardcoding to detect clicking on MUI component
    const isClickingOnSpecializationMUI = e.target.id.includes('specialization-option')
    const isClickingOnSort = sortRef.current === 'sort'
    if (
      isShowFilter &&
      !filterRef.current.contains(e.target) &&
      !isClickingOnSpecializationMUI &&
      !isClickingOnSort
    )
      onShowFilter()
  }

  useEffect(() => {
    if (isShowFilter) {
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    }
    document.addEventListener('click', handleClickedOutside, true)
    return () => {
      document.removeEventListener('click', handleClickedOutside, true)
    }
  }, [isShowFilter])

  return (
    <div ref={filterRef} className={classNamesCombined([styles.searchFilter, isShowFilterClass])}>
      <div className={styles.searchFilterHeader}>
        <Text textStyle='lg' bold>
          Filters
        </Text>
        <div className={styles.searchFilterClose} onClick={() => onShowFilter()}>
          <Image src={CloseIcon} alt='logo' width='13' height='13' />
        </div>
      </div>
      <form className={styles.searchFilterForm} onSubmit={handleSubmit(handleApplyFilter)}>
        <div className={styles.searchFilterBody}>
          {displayMobileSort && (
            <div className={styles.searchFilterSection}>
              <SearchFilters
                title='Sort By'
                fieldName='sort'
                options={[
                  { value: '1', label: 'Newest' },
                  { value: '2', label: 'Relevance' },
                  { value: '3', label: 'Highest Salary' },
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
          {/* <div className={styles.searchFilterSection}>
            <Accordian
              chevronIcon
              paddedContent
              isNotCollapsible={true}
              defaultOpenState={true}
              title={
                <Text textStyle='lg' bold>
                  Specialization
                </Text>
              }
              className={styles.searchFilterAccordion}
            >
              <MaterialAutocompleteLimitTags
                id='specialization'
                options={jobCategoryList}
                limitTagCount={8}
                onChange={handleSpecializationChange}
                style={{ margin: 0, paddingTop: '20px' }}
                defaultValue={urlDefaultValues?.category}
                value={selectedCategories}
              />
            </Accordian>
          </div> */}
          <SearchFilters
            title='Industry'
            fieldName='industry'
            options={industryList}
            defaultOpenState={true}
            isNotCollapsible={true}
          />
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
          {displayMobileSort && (
            <SearchFilters
              title='Specialization'
              fieldName='category'
              options={config.inputs.job_category_lists}
              defaultOpenState={true}
              isNotCollapsible={true}
              hasMainAndSubOption
            />
          )}
        </div>
        <div className={styles.searchFilterFooter}>
          <div className={styles.searchFilterReset} onClick={handleResetFilter}>
            <Text textStyle='base' textColor='primaryBlue' bold>
              Reset Filter
            </Text>
          </div>
          <Button className={styles.searchFilterApply} primary>
            <Text textStyle='base' textColor='white' bold>
              Apply Filter
            </Text>
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NavSearchFilter
