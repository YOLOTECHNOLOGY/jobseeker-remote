import { useEffect, useRef, useState } from 'react'

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

/* Helpers */
import {
  categoryParser,
  conditionChecker,
  getPayload,
  getPredefinedParamsFromUrl,
  handleSalary,
  urlQueryParser,
  getLocationList,
} from 'helpers/jobPayloadFormatter'

/* Style */
import styles from './JobSearchFilters.module.scss'

/* Images */
import { CloseIcon } from 'images'
import MaterialAutocompleteLimitTags from 'components/MaterialAutocompleteLimitTags'

interface NavSearchFilterProps {
  isShowFilter: boolean
  onShowFilter: Function
  onApplyFilter: Function
  onResetFilter: Function
  displayQuickLinks: Boolean
}

interface SearchFilters {
  title: string
  fieldName: any
  options: Array<optionsType>
  defaultOpenState?: boolean
  isNotCollapsible?: boolean
}

type optionsType = {
  value: string
  label: string
}

const NavSearchFilter = ({
  isShowFilter,
  onShowFilter,
  onApplyFilter,
  displayQuickLinks,
}: //   onResetFilter,
NavSearchFilterProps) => {
  const router = useRouter()
  //   const { keyword } = router.query
  const queryParams = router.query
  const config = useSelector((state: any) => state.config.config.response)
  console.log('jobSearchFilters config', config)
  const jobCategoryList = config.inputs.job_category_lists
  const locationList = getLocationList(config)

  const industryList = config.inputs.industry_lists.map((industry) => ({
    key: Object.values(industry)[0],
    value: Object.values(industry)[0],
  }))
  const expLvlList = config.filters.work_xps.map((expLvl) => ({
    key: Object.values(expLvl)[0],
    value: Object.values(expLvl)[0],
  }))
  const eduLevelList = config.filters.educations.map((edu) => ({
    key: Object.values(edu)[0],
    value: Object.values(edu)[0],
  }))
  // console.log('jobCategoryList', jobCategoryList)
  // console.log('industryList', industryList)
  // console.log('expLvlList', expLvlList)
  // console.log('eduLevelList', eduLevelList)

  //   const courseLevelConfig = config.course_levels
  //   const categoryConfig = config.course_categories
  //   const learningMethodConfig = config.course_methods
  //   const courseProviderConfig = config.course_providers
  const filterRef = useRef(null)

  // let defaultValues = {}
  // const appendDefaultKeyValue = (fieldName, value) => {
  //   const data = {
  //     ...defaultValues,
  //     [fieldName]: value.toString().split(','),
  //   }
  //   return data
  // }

  // if there is NO filter && keyword matches any filter config, append the filter into defaultValues object
  //   if (count === 0) {
  //     if (categoryMatched) defaultValues = appendDefaultKeyValue('category', [keyword])
  //     if (courseLevelMatched) defaultValues = appendDefaultKeyValue('courseLevel', [keyword])
  //     if (learningMethodMatched) defaultValues = appendDefaultKeyValue('learningMethod', [keyword])
  //     if (courseProviderMatched) defaultValues = appendDefaultKeyValue('courseProvider', [keyword])
  //   }

  // append all queryParams EXCEPT keyword and search into defaultValues object
  // Object.entries(queryParams).forEach(([key, value]) => {
  //   if (key !== 'keyword' && key !== 'search') {
  //     defaultValues = appendDefaultKeyValue(key, value)
  //   }
  // })

  const { register, handleSubmit, reset } = useForm()

  const cx = classNames.bind(styles)
  const isShowFilterClass = cx({ isShow: isShowFilter, displayQuickLinks: displayQuickLinks })
  const [selectedCategories, setSelectedCategories] = useState([])
  //   useEffect(() => {
  //     // set defaultValue after config has been initialised
  //     // TODO: refactor to use defaultValues in useForm() if config can be initialised from getServerSidedProps
  //     if (Object.keys(defaultValues).length !== 0) {
  //       reset(defaultValues)
  //     }
  //   }, [config, keyword])

  const handleApplyFilter = (data) => {
    const values = Object.values(data)
    const allFalsyValues = values.filter((val) => !!val)
    if (allFalsyValues.length !== 0 || selectedCategories) {
      urlFilterParameterBuilder(data)
      // onApplyFilter(data)
    }
    onShowFilter()
  }

  const handleResetFilter = () => {
    reset({})
    // onResetFilter({})
  }

  const urlFilterParameterBuilder = (data) => {
    const { predefinedQuery, predefinedLocation, predefinedCategory } = getPredefinedParamsFromUrl(
      router.query,
      jobCategoryList,
      locationList
    )
    const { keyword, ...rest } = router.query

    // include truthy value into array
    // if array length is only 1 => router.push seo value
    // if array length > 1 => build filter parameter ?fieldName=seo-value
    let filterData = {}
    let isSingleFilter = false
    // for checkbox filters
    for (const [key, value] of Object.entries<any>(data)) {
      if (value && value.length !== 0) {
        if (key !== 'page') {
          filterData = {
            ...filterData,
            // ensure to only push unduplicated results
            [key]: Array.from(new Set(value)).join(','),
            // [key]: Array.from(new Set(value)),
          }
          if (value.length <= 1) isSingleFilter = true
        }
      }
    }
    console.log('jobSearchFilters filterData', filterData)

    let categoryObject = null
    let queryParam = ''
    const categories = selectedCategories.map((val) => val.key)
    // for mui specialization filter
    if (selectedCategories && selectedCategories.length > 1) {
      queryParam =
        conditionChecker(predefinedQuery, predefinedLocation, null) || 'job-search'
      categoryObject = Object.assign({}, { category: categories.join() })
    } else if (selectedCategories && selectedCategories.length === 1) {
      queryParam = conditionChecker(predefinedQuery, predefinedLocation, categories) || 'job-search'
    } else{
      queryParam =
        conditionChecker(predefinedQuery, predefinedLocation, null) || 'job-search'
    }

    const queryObject = Object.assign({}, { ...rest, ...filterData, ...categoryObject })
    router.push(
      {
        pathname: `${process.env.HOST_PATH}/jobs-hiring/${queryParam}`,
        query: queryObject,
      },
      undefined,
      { shallow: true }
    )
  }

  const handleSpecializationChange = (event, value) => {
    setSelectedCategories(value)
  }

  const SearchFilters = ({
    title,
    fieldName,
    options,
    defaultOpenState,
    isNotCollapsible,
  }: SearchFilters) => {
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
          <div className={styles.searchFilterOptions}>
            {options &&
              options.map((option, i) => {
                return (
                  <label key={i} className={styles.searchFilterOption}>
                    <input type='checkbox' value={option['key']} {...register(fieldName)} />
                    <Text textStyle='sm'>{option.value}</Text>
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
    if (isShowFilter && !filterRef.current.contains(e.target) && !isClickingOnSpecializationMUI)
      onShowFilter()
  }

  useEffect(() => {
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
          <div className={styles.searchFilterSection}>
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
                // defaultValue={}
                onChange={handleSpecializationChange}
                style={{ margin: 0, paddingTop: '20px' }}
              />
            </Accordian>
          </div>
          {/* <SearchFilters
            title='Specialization'
            fieldName='specialisation'
            options={jobCategoryList}
            defaultOpenState={true}
            isNotCollapsible={true}
          /> */}
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
          {/* <SearchFilters title='Course Fee' fieldName="courseFee" options={filterOptions.courseFee}/> */}
          <SearchFilters
            title='Qualification'
            fieldName='qualification'
            options={eduLevelList}
            defaultOpenState={true}
            isNotCollapsible={true}
          />
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
