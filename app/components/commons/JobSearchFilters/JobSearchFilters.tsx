/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react'
import * as ReactDOM from 'react-dom'
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
// const useOptionDataSelect = (initOptionData, form) => {
//   const [optionData, setOptionData] = useState(initOptionData)

//   useEffect(() => {
//     const category = flatMap(optionData, parent => [parent, ...(parent?.sub_list ?? [])])
//       .map(item => item.isChecked ? item['seo-value'] : undefined)
//       .filter(a => a)

//     form.setValue('category', category.length === 0 ? null : category)
//   }, [optionData])

//   const syncParent = useCallback(data => setOptionData(data.map(parent => {

//     if (parent.sub_list?.length) {
//       const parentCheck = !(parent.sub_list.filter(sub => !sub.isChecked).length > 0)
//       return { ...parent, isChecked: parentCheck }
//     }
//     return parent
//   })), [setOptionData])

//   const onParentCheck = useCallback((e, checkedKey) => syncParent(optionData.map(parent => {
//     if (parent['seo-value'] === checkedKey && parent.sub_list?.length) {
//       const isChecked = !parent.isChecked
//       return { ...parent, sub_list: parent.sub_list.map(sub => ({ ...sub, isChecked })) }
//     }
//     return parent
//   })), [syncParent, optionData, setOptionData])

//   const onSubCheck = useCallback((e, checkedKey) => syncParent(optionData.map(parent => {
//     if (parent.sub_list?.length) {

//       return {
//         ...parent, sub_list: parent.sub_list.map(sub => {
//           if (sub['seo-value'] === checkedKey) {
//             return { ...sub, isChecked: !sub.isChecked }
//           }
//           return sub
//         })
//       }
//     }
//     return parent
//   })), [syncParent, optionData])
//   return [optionData, onParentCheck, onSubCheck]
// }
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
  // const router = useRouter()
  // const { keyword } = router.query
  // const config = useSelector((state: any) => state.config.config.response)
  // const industryList = config.inputs.industry_lists
  const expLvlList = config.inputs.xp_lvls
  const eduLevelList = config.filters.educations
  const jobTypeList = config.inputs.job_types
  // const categoryList = config.inputs.job_category_lists
  const scrollY = useRef(0)

  const salaryRangeList = config.filters.salary_range_filters.map((range) => ({
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
    // const updatedData = {
    //   ...data,
    //   sort: [data.sort]
    // }
    // sanitize category data -> only pass main options as value to parser if all sub options are selected
    // if (data && data.category) {
    //   let category = data.category
    //   categoryList.map((mainCategory) => {
    //     // if main option is selected, remove all sub option from data
    //     category.map((selectedCat) => {
    //       if (mainCategory['seo-value'] === selectedCat) {
    //         const subOptionToBeRemoved = mainCategory.sub_list.filter((subCat) => {
    //           return category.includes(subCat['seo-value'])
    //         })
    //         category = category.filter(
    //           (cat) =>
    //             !subOptionToBeRemoved.find((optionToRemove) => optionToRemove['seo-value'] === cat)
    //         )
    //       }
    //     })
    //   })
    //   updatedData.category = category
    // }
    const clearFilter = []
    for (const [key, value] of Object.entries<any>(data)) {
      if (value && value.length === 0) {
        clearFilter.push(key)
      }
    }
    // urlFilterParameterBuilder(updatedData, clearFilter)
    setClientDefaultValues(data)
  }

  const handleResetFilter = () => {
    onCloseFilter()
    reset({})
    onResetFilter({})
  }

  // const urlFilterParameterBuilder = (data, isClear) => {
  //   const { searchQuery, filterParamsObject } = userFilterSelectionDataParser(
  //     'moreFilters',
  //     data,
  //     router.query,
  //     config,
  //     (isClear = isClear.length > 0 ? isClear : false)
  //   )

  //   router.push(
  //     {
  //       pathname: `/jobs-hiring/${searchQuery ? searchQuery : 'job-search'}`,
  //       query: {
  //         ...filterParamsObject
  //       }
  //     },
  //     undefined,
  //     { shallow: true }
  //   )
  // }

  // to handle filters that have 2 tier options (main and sub and list)
  // const MainSubFilters = ({
  //   title,
  //   fieldName,
  //   options,
  //   defaultOpenState,
  //   isNotCollapsible,
  //   isColumn,
  // }: SearchFilters) => {
  //   const isFilterColumnClass = cx({ searchFilterOptionsColumn: isColumn })
  //   const initialListOptions = options.map((data) => {
  //     const isArrayOrString =
  //       Array.isArray(urlDefaultValues[fieldName]) || typeof urlDefaultValues[fieldName] === 'string'
  //     const newSubList = data.sub_list.map((subData) => ({
  //       ...subData,
  //       isChecked: isArrayOrString ?
  //         urlDefaultValues[fieldName]?.includes(subData['seo-value']) ||
  //         urlDefaultValues[fieldName]?.includes(data['seo-value']) : false,
  //     }))
  //     const newList = {
  //       ...data,
  //       isChecked: isArrayOrString ? urlDefaultValues[fieldName]?.includes(data['seo-value']) : false,
  //       sub_list: newSubList,
  //     }
  //     return newList
  //   })

  //   const [listOptions, onMainSelection, onSubSelection] = useOptionDataSelect(initialListOptions, form)

  //   return (
  //     <div className={styles.searchFilterSection}>
  //       <Accordian
  //         chevronIcon
  //         paddedContent
  //         isNotCollapsible={isNotCollapsible}
  //         defaultOpenState={defaultOpenState}
  //         title={
  //           <Text textStyle='lg' bold>
  //             {title}
  //           </Text>
  //         }
  //         className={styles.searchFilterAccordion}
  //       >
  //         <div className={classNamesCombined([styles.searchFilterOptions, isFilterColumnClass])}>
  //           {listOptions.map((option, i) => {
  //             const subListOptions = option.sub_list
  //             const allSubOptionSelected =
  //               subListOptions?.filter((option) => !option.isChecked).length === 0
  //             return (
  //               <React.Fragment key={option.id}>
  //                 {i === 0 && (
  //                   // injecting an empty checkbox fixes weird bug where selecting the second checkbox will auto select first checkbox
  //                   <label key='empty' style={{ display: 'none' }}>
  //                     <input type='checkbox' value={null}/>
  //                     <Text textStyle='lg'>Empty</Text>
  //                   </label>
  //                 )}
  //                 <label className={styles.searchFilterOption}>
  //                   <input
  //                     type='checkbox'
  //                     value={option['seo-value']}
  //                     checked={option.isChecked || allSubOptionSelected}
  //                     onClick={(e) => onMainSelection(e, option['seo-value'])}
  //                   />
  //                   <Text textStyle='lg'>{option.value}</Text>
  //                 </label>
  //                 {subListOptions.map((subOption) => {
  //                   return (
  //                     <label key={subOption.id} className={styles.searchFilterOptionSub}>
  //                       <input
  //                         type='checkbox'
  //                         value={subOption['seo-value']}
  //                         checked={option.isChecked || subOption.isChecked}
  //                         onClick={(e) => onSubSelection(e, subOption['seo-value'])}
  //                       />
  //                       <Text textStyle='lg'>{subOption.value}</Text>
  //                     </label>
  //                   )
  //                 })}
  //               </React.Fragment>
  //             )
  //           })}
  //         </div>
  //       </Accordian>
  //     </div>
  //   )
  // }

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
              {/* <SearchFilters
                title='Industry'
                fieldName='industry'
                options={industryList}
                defaultOpenState={true}
                isNotCollapsible={true}
              /> */}
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
              {/* {displayMobileFilters && (
                <MainSubFilters
                  title='Specialization'
                  fieldName='category'
                  options={categoryList}
                  defaultOpenState={true}
                  isNotCollapsible={true}
                />
              )} */}
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
