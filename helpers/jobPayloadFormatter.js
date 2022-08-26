import { flat, thousandsToNumber, unslugify } from 'helpers/formatter'

/* Helpers */
import { authPathToOldProject } from 'helpers/authenticationTransition'

/* Vendors */
import moment from 'moment'
import slugify from 'slugify'

const handleSalary = (salaryRanges) => {
  let salaryFrom = ''
  let salaryTo = ''
  if (salaryRanges) {
    const sanitiseSalaryRange = salaryRanges.map((range) =>
      range === 'Below 30K' ? '10K - 30K' : range
    )

    salaryFrom = sanitiseSalaryRange
      .filter((salary) => salary !== 'Above 200K')
      .map((salaryFrom) => thousandsToNumber('' + salaryFrom.split(' - ')[0]))

    salaryTo = sanitiseSalaryRange
      .filter((salary) => salary !== 'Above 200K')
      .map((salaryTo) => thousandsToNumber('' + salaryTo.split(' - ')[1]))

    if (sanitiseSalaryRange.includes('Above 200K')) {
      salaryFrom.push(200001)
      salaryTo.push(400000)
    }

    salaryFrom = salaryFrom.join(',')
    salaryTo = salaryTo.join(',')
  }
  return [salaryFrom, salaryTo]
}

const formatLocationConfig = (locationList) => {
  const locationConfig = locationList.map((region) => {
    return {
      label: region.display_name,
      value: region.value,
      subList: region.locations
    }
  })
  return locationConfig
}

const urlQueryParser = (string) => {
  // Uncommenting : positive and negative regex lookbehinds not supported in mobile browsers
  // const regex = /(.+?(?=(-jobs|-jobs-in))|(?<=(-jobs-in-)).+)/g

  const doubleQueryPattern = /((\B|\b)-jobs-in-\b)/g
  const singleQueryPattern = /((\B|\b)-jobs\b)/g

  let array = []
  if (string) {
    const hasDoubleQueryPattern = string.match(doubleQueryPattern)
    const hasSingleQueryPattern = string.match(singleQueryPattern)

    if (hasDoubleQueryPattern) {
      array = string.split('-jobs-in-')
    } else if (hasSingleQueryPattern) {
      array = string.split('-jobs')
      array = array.slice(0, -1)
    }
  }

  return array
}

const capitalizeFirstAlphabet = (string) => {
  return (
    (string &&
      string
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')) ||
    ''
  )
  // return (string && string[0].toUpperCase() + string.slice(1)) || ''
}

// const capitalizeFirstAlphabet = string =>
//   (string && string[0].toUpperCase() + string.slice(1)) || ''

const SEOJobSearchMetaBuilder = (query, location, category, path) => {
  let title = ''
  let description = ''
  const canonical = path ? path : ''
  const today = new Date()
  let month = today.getMonth() + 1 // January is 0
  month = moment(today).format('MMMM')
  const year = today.getFullYear()

  if (query && !location && !category) {
    title = `${query} Jobs in Philippines, Job Opportunities - ${month} ${year} | Bossjob`
    description = `New ${query} Jobs in Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
  } else if (!query && location && !category) {
    title = `Jobs in ${location}, Philippines, Job Opportunities -  ${month} ${year} | Bossjob`
    description = `New Jobs in ${location}, Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
  } else if (!query && !location && category) {
    title = `${category} Jobs in Philippines, Job Opportunities - ${month} ${year} | Bossjob`
    description = `New ${category} Jobs in Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
  } else if (query && location) {
    title = `${query} Jobs in ${location}, Philippines, Job Opportunities - ${month} ${year} | Bossjob`
    description = `New ${query} Jobs in ${location}, Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
  } else if (location && category) {
    title = `${category} Jobs in ${location}, Philippines, Job Opportunities - ${month} ${year} | Bossjob`
    description = `New ${category} Jobs in ${location}, Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
  } else {
    title = 'Job Hiring, Job Search & Job Openings in Philippines | Bossjob.ph'
    description =
      'Latest job hiring in Philippines. Search job openings & career opportunities with more than 3000 employers on Bossjob!'
  }

  const data = {
    title: title,
    description: description,
    canonical: canonical
  }

  return data
}

const nonFilterKeys = [
  'keyword',
  'search',
  'page',
  'id',
  'sort',
  'utm_source',
  'utm_campaign',
  'utm_medium'
]

// const buildQueryParams = (data) => {
//   let queryString = ''
//   queryString = Object.keys(data)
//     .map((key) => {
//       const string = data[key]
//         .map((filter) => {
//           if (filter) return filter['seo-value']
//         })
//         .join()
//       return key + '=' + string
//     })
//     .join('&')
//   queryString = '?' + queryStrings
//   return queryString
// }

/**
 * This function solely returns matched filter from URL
 * @param {Object} routerQuery -  router query data retrieved from router.query at the point of user's selection
 * @param {Object} config - config retrieved from config API
 * @return {Object} 
 * @description  Main part to the logic is to handle data extracted from URL
 */
const checkFilterMatch = (routerQuery, config, isMobile = false) => {
  const { keyword, ...rest } = routerQuery
  const queryParser = urlQueryParser(keyword)
  const locationList = config.inputs.location_lists
  const industryList = config.inputs.industry_lists
  const expLvlList = config.inputs.xp_lvls
  const eduLevelList = config.filters.educations
  const jobTypeList = config.inputs.job_types
  const categoryList = config.inputs.job_category_lists
  const salaryRangeList = config.filters.salary_range_filters.map((range) => ({
    key: range.key === '10K - 30K' ? 'Below 30K' : range.key,
    value: range.value === '10K - 30K' ? 'Below 30K' : range.value,
    ['seo-value']: range['seo-value']
  }))
  const formatLocationConfig = (locationList) => {
    const locationConfig = locationList?.map((region) => region.locations)
    return locationConfig
  }
  const formattedLocationList = flat(formatLocationConfig(locationList))
  const sanitisedConfig = {
    industry: industryList,
    jobType: jobTypeList,
    salary: salaryRangeList,
    workExperience: expLvlList,
    qualification: eduLevelList,
    location: formattedLocationList,
    category: categoryList
  }
  let predefinedQuery = ''
  let searchQuery = ''
  let searchMatch = false
  let locationMatch = false
  let predefinedLocation = ''
  let matchedConfigFromUrl = {}
  let matchedLocation = {}
  let matchedConfigFromUserSelection = {}
  let filterCount = 0

  /* handle keyword extracted from url
   * iterate based on number of results from queryParser
   * queryParser can only return at most 2 result.
   * 1 = search keyword
   * 2 = location
   */
  Object.keys(sanitisedConfig).forEach((key) => {
    // iterate based on number of results from queryParser
    queryParser.forEach((parsedData, index) => {
      if (key === 'category') {
        const mainOptionMatched = []
        const subOptionMatched = []

        sanitisedConfig[key].forEach((data) => {
          if (data['seo-value'] === parsedData) {
            predefinedQuery = parsedData
            searchMatch = true
            mainOptionMatched.push(data)
          }
        })
        sanitisedConfig[key].forEach((data) => {
          data.sub_list.forEach((subOption) => {
            if (subOption['seo-value'] === parsedData) {
              predefinedQuery = parsedData
              searchMatch = true
              subOptionMatched.push(subOption)
            }
          })
        })
        if (mainOptionMatched.length > 0) {
          matchedConfigFromUrl = {
            ...matchedConfigFromUrl,
            [key]: mainOptionMatched
          }
        }
        if (subOptionMatched.length > 0) {
          matchedConfigFromUrl = {
            ...matchedConfigFromUrl,
            [key]: subOptionMatched
          }
        }
      } else {
        const hasMatch = sanitisedConfig[key].filter((data) => {
          if (key === 'location' && index == 1) {
            if (data['seo_value'] === parsedData) {
              locationMatch = true
              predefinedLocation = parsedData
              return data['seo_value'] === parsedData
            }
          } else if (key === 'location' && index === 0) {
            if (data['seo_value'] === parsedData) {
              locationMatch = true
              predefinedLocation = parsedData
              return data['seo_value'] === parsedData
            }
          } else {
            if (data['seo-value'] === parsedData) {
              searchMatch = true
              predefinedQuery = parsedData
              return data['seo-value'] === parsedData
            }
          }
        })
        if (hasMatch.length > 0 && key !== 'location') {
          matchedConfigFromUrl = {
            ...matchedConfigFromUrl,
            [key]: hasMatch
          }
        } else if (hasMatch.length > 0 && key === 'location') {
          matchedLocation = {
            [key]: hasMatch
          }
        }
      }
    })
  })

  let filterData = {}
  // handle the rest of the filters. remove nonfilter keys, and convert strings of value to array of strings
  for (const [key, value] of Object.entries(rest)) {
    // only proceed if it is not a non filter key
    if (!nonFilterKeys.includes(key)) {
      const arrayVal = value.split(',')
      // only proceed if value is not null && not empty
      if (arrayVal && arrayVal.length !== 0) {
        // handle filters not under 'More filters' section
        filterData = {
          ...filterData,
          // ensure to only push unduplicated results
          [key]: Array.from(new Set(arrayVal)).join(',')
        }
        const hasMatch = []
        let isLocationMatch = false
        arrayVal.forEach((val) => {
          if (key === 'category') {
            const mainOptionMatched = []
            const subOptionMatched = []

            sanitisedConfig[key].forEach((data) => {
              if (data['seo-value'] === val) {
                predefinedQuery = val
                mainOptionMatched.push(data)
                // return data['seo-value'] === parsedData
              }
            })
            sanitisedConfig[key].map((data) => {
              data.sub_list.forEach((subOption) => {
                if (subOption['seo-value'] === val) {
                  predefinedQuery = val
                  subOptionMatched.push(subOption)
                }
              })
            })

            if (mainOptionMatched.length > 0) {
              const prevValue = matchedConfigFromUserSelection[key]
              matchedConfigFromUserSelection = {
                ...matchedConfigFromUserSelection,
                [key]: prevValue ? [...prevValue, ...mainOptionMatched] : mainOptionMatched
              }
            }
            if (subOptionMatched.length > 0) {
              const prevValue = matchedConfigFromUserSelection[key]
              matchedConfigFromUserSelection = {
                ...matchedConfigFromUserSelection,
                [key]: prevValue ? [...prevValue, ...subOptionMatched] : subOptionMatched
              }
            }
          } else {
            const matchedFilter = sanitisedConfig[key]?.filter((data) => {
              if (key === 'location') {
                if (data['seo_value'] === val) {
                  isLocationMatch = true
                  return data['seo_value'] === val
                }
              } else {
                return data['seo-value'] === val
              }
            })
            if (matchedFilter && matchedFilter.length !== 0) hasMatch.push(matchedFilter[0])
          }
        })
        if (hasMatch.length > 0) {
          if (isLocationMatch) {
            locationMatch = true
            matchedLocation = {
              ...matchedLocation,
              [key]: hasMatch
            }
          } else {
            matchedConfigFromUserSelection = {
              ...matchedConfigFromUserSelection,
              [key]: hasMatch
            }
          }
        }
      }
    }
  }

  if (queryParser.length > 0 && queryParser[0] !== predefinedQuery) {
    searchQuery = queryParser[0]
  }

  // calculate filter count
  const array = []

  if (Object.keys(matchedLocation).length > 0) array.push(matchedLocation)
  if (Object.keys(matchedConfigFromUrl).length > 0) array.push(matchedConfigFromUrl)
  if (Object.keys(matchedConfigFromUserSelection).length > 0)
    array.push(matchedConfigFromUserSelection)

  // Fields that need to be counted based on mobile or desktop view
  const filterCountField = isMobile
    ? ['jobType', 'salary', 'industry', 'workExperience', 'qualification', 'category']
    : ['industry', 'workExperience', 'qualification']

  array.forEach((matchData) => {
    for (const [key] of Object.entries(matchData)) {
      const data = matchData[key].map((filter) => filter['seo-value'])

      if (filterCountField.includes(key)) {
        filterCount += data.length
      }
    }
  })

  const matchedFilter = {
    searchMatch,
    locationMatch,
    searchQuery,
    predefinedQuery,
    predefinedLocation,
    matchedLocation,
    matchedConfigFromUrl,
    matchedConfigFromUserSelection,
    filterCount
  }

  return matchedFilter
}

/**
 * handle filters selected by user in job search page
 * @param {string} field -  the field's name. E.g: query, location, sort etc. 
 * @param {string|string[]|Object} optionValue -  value of the filters selected. 
 * For 'query' field = string
 * For 'location' field = object
 * For 'moreFilters' field = object
 * e.g: moreFilter's optionValue object will look something like this = {
    category: null
    industry: ['accounting-finance']
    jobType: null
    location: null
    qualification: ['bachelor']
    salary: null
    sort: [1]
    urlQuery: ""
    workExperience: ['1-year']
  }
  For any other filters, field = array of strings
 * @param {Object} routerQuery -  router query data retrieved from router.query at the point of user's selection
 * @param {Object} config - config retrieved from config API
 * @param {Boolean} isClear - truthy value denotes that the user has reset/deselected the option
 * @return {Object} 
 * @description 
 * 3 main parts to the logic :
 * PART I - to handle data extracted from URL
 * PART II - to handle data from user selections
 * PART III - logic to determine URL format, utilizes function call appendGeneralQueryPattern, appendSingleQueryPattern, appendDoubleQueryPattern
 * 
 */
const userFilterSelectionDataParser = (field, optionValue, routerQuery, config, isClear) => {
  const { keyword, ...rest } = routerQuery
  const queryParser = urlQueryParser(keyword)
  const locationList = config.inputs.location_lists
  const industryList = config.inputs.industry_lists
  const expLvlList = config.inputs.xp_lvls
  const eduLevelList = config.filters.educations
  const jobTypeList = config.inputs.job_types
  const categoryList = config.inputs.job_category_lists
  const salaryRangeList = config.filters.salary_range_filters.map((range) => ({
    key: range.key === '10K - 30K' ? 'Below 30K' : range.key,
    value: range.value === '10K - 30K' ? 'Below 30K' : range.value,
    ['seo-value']: range['seo-value']
  }))
  const formatLocationConfig = (locationList) => {
    const locationConfig = locationList?.map((region) => region.locations)
    return locationConfig
  }
  const formattedLocationList = flat(formatLocationConfig(locationList))

  // Create a config object that includes all filter's field name for ease of mapping
  const sanitisedConfig = {
    industry: industryList,
    jobType: jobTypeList,
    salary: salaryRangeList,
    workExperience: expLvlList,
    qualification: eduLevelList,
    location: formattedLocationList,
    category: categoryList
  }

  let matchedConfigFromUrl = {} // get matched filter object from config if url keyword matches any of our config filter
  let matchedConfigFromUserSelection = {} // get matched filter object from config if filter selected by user matched any of our config filter
  let matchedLocation = {} // get matched location object from config if url contains location keyword
  let matchedConfig = {} // specifically to return match for query
  let predefinedQuery = '' // query detected from url (if keyword does not meet any filter, it is a predefinedKeyword)
  let searchQuery = '' // search query typed by user
  let predefinedLocation = '' // location detected from url
  let filterData = {}

  /* PART I - handle keyword extracted from url
   * iterate based on number of results from queryParser
   * queryParser can only return at most 2 result.
   * 1 = search keyword
   * 2 = location
   */
  Object.keys(sanitisedConfig).forEach((key) => {
    // handle predefined filters from url (keyword)
    // iterate based on number of results from queryParser
    queryParser.forEach((parsedData, index) => {
      if (key === 'category') {
        const mainOptionMatched = []
        const subOptionMatched = []

        sanitisedConfig[key].forEach((data) => {
          if (data['seo-value'] === parsedData) {
            predefinedQuery = parsedData
            mainOptionMatched.push(data)
            // return data['seo-value'] === parsedData
          }
        })
        sanitisedConfig[key].map((data) => {
          data.sub_list.forEach((subOption) => {
            if (subOption['seo-value'] === parsedData) {
              predefinedQuery = parsedData
              subOptionMatched.push(subOption)
            }
          })
        })

        if (mainOptionMatched.length > 0) {
          matchedConfigFromUrl = {
            ...matchedConfigFromUrl,
            [key]: mainOptionMatched
          }
        }
        if (subOptionMatched.length > 0) {
          matchedConfigFromUrl = {
            ...matchedConfigFromUrl,
            [key]: subOptionMatched
          }
        }
      } else {
        const hasMatch = sanitisedConfig[key].filter((data) => {
          if (key === 'location' && index == 1) {
            if (data['seo_value'] === parsedData) {
              predefinedLocation = parsedData
              return data['seo_value'] === parsedData
            }
          } else if (key === 'location' && index === 0) {
            if (data['seo_value'] === parsedData) {
              predefinedLocation = parsedData
              return data['seo_value'] === parsedData
            }
          } else {
            if (data['seo-value'] === parsedData) {
              predefinedQuery = parsedData
              return data['seo-value'] === parsedData
            }
          }
        })
        if (hasMatch.length > 0 && key !== 'location') {
          matchedConfigFromUrl = {
            ...matchedConfigFromUrl,
            [key]: hasMatch
          }
        } else if (hasMatch.length > 0 && key === 'location') {
          matchedLocation = {
            [key]: hasMatch
          }
        }
      }
    })

    // handle query onKeywordSearch
    if (field === 'query') {
      const keywordSearchValue = optionValue?.toLowerCase()
      if (key === 'category') {
        const mainOptionMatched = []
        const subOptionMatched = []

        sanitisedConfig[key].forEach((data) => {
          if (data['value'].toLowerCase() === keywordSearchValue) {
            searchQuery = keywordSearchValue
            mainOptionMatched.push(data)
            // return data['value'] === keywordSearchValue
          }
        })
        sanitisedConfig[key].map((data) => {
          data.sub_list.forEach((subOption) => {
            if (subOption['value'].toLowerCase() === keywordSearchValue) {
              searchQuery = keywordSearchValue
              subOptionMatched.push(subOption)
            }
          })
        })

        if (mainOptionMatched.length > 0) {
          matchedConfigFromUrl = {
            ...matchedConfigFromUrl,
            [key]: mainOptionMatched
          }
          matchedConfig = {
            ...matchedConfig,
            [key]: mainOptionMatched
          }
        }
        if (subOptionMatched.length > 0) {
          matchedConfigFromUrl = {
            ...matchedConfigFromUrl,
            [key]: subOptionMatched
          }
          matchedConfig = {
            ...matchedConfig,
            [key]: subOptionMatched
          }
        }
      } else {
        const hasMatch = sanitisedConfig[key].filter((data) => {
          if (key === 'location') {
            if (data['value'].toLowerCase() === keywordSearchValue) {
              searchQuery = keywordSearchValue
              return data['value'].toLowerCase() === keywordSearchValue
            }
          } else {
            if (data['value'].toLowerCase() === keywordSearchValue) {
              searchQuery = keywordSearchValue
              return data['value'].toLowerCase() === keywordSearchValue
            }
          }
        })

        if (hasMatch.length > 0 && key !== 'location') {
          matchedConfigFromUrl = {
            ...matchedConfigFromUrl,
            [key]: hasMatch
          }
          matchedConfig = {
            ...matchedConfig,
            [key]: hasMatch
          }
        } else if (hasMatch.length > 0 && key === 'location') {
          matchedLocation = {
            [key]: hasMatch
          }
          matchedConfig = {
            ...matchedConfig,
            [key]: hasMatch
          }
        }
      }
    }
  })

  if (field === 'query') {
    searchQuery = optionValue
  } else {
    // if parsedData[0] is not predefined query, it is a search term
    if (queryParser.length > 0 && queryParser[0] !== predefinedQuery) searchQuery = queryParser[0]
  }

  /* PART II - handle filters from user selection */
  // handle filters from user selection
  let updatedFilters = { ...rest }
  // if optionValue !== [], include current filter with the rest of the filters
  if (field === 'location' && optionValue && optionValue.length !== 0) {
    updatedFilters = { ...updatedFilters, [field]: optionValue.seo_value }
  } else if (field === 'category') {
    updatedFilters = { ...updatedFilters, [field]: optionValue.join() }
  } else if (field === 'moreFilters') {
    for (const [key, value] of Object.entries(optionValue)) {
      if (value && value.length !== 0 && value[0]) {
        updatedFilters = {
          ...updatedFilters,
          // ensure to only push unduplicated results
          [key]: [...new Set(value)].join()
        }
      }
    }
  } else {
    if (optionValue && optionValue.length !== 0 && field !== 'query' && field !== 'sort') {
      updatedFilters = { ...updatedFilters, [field]: optionValue.join(',') }
    } else {
      delete updatedFilters[field]
    }
  }

  // handle the rest of the filters. remove nonfilter keys, and convert strings of value to array of strings
  for (const [key, value] of Object.entries(updatedFilters)) {
    // only proceed if it is not a non filter key
    if (!nonFilterKeys.includes(key)) {
      const arrayVal = value.split(',')
      // only proceed if value is not null && not empty
      if (arrayVal && arrayVal.length !== 0) {
        // handle filters not under 'More filters' section
        filterData = {
          ...filterData,
          // ensure to only push unduplicated results
          [key]: Array.from(new Set(arrayVal)).join(',')
        }
        const hasMatch = []
        let isLocationMatch = false
        arrayVal.forEach((val) => {
          if (key === 'category') {
            const mainOptionMatched = []
            const subOptionMatched = []

            sanitisedConfig[key].forEach((data) => {
              if (data['seo-value'] === val) {
                predefinedQuery = val
                mainOptionMatched.push(data)
                // return data['seo-value'] === parsedData
              }
            })
            sanitisedConfig[key].map((data) => {
              data.sub_list.forEach((subOption) => {
                if (subOption['seo-value'] === val) {
                  predefinedQuery = val
                  subOptionMatched.push(subOption)
                }
              })
            })

            if (mainOptionMatched.length > 0) {
              const prevValue = matchedConfigFromUserSelection[key]
              matchedConfigFromUserSelection = {
                ...matchedConfigFromUserSelection,
                [key]: prevValue ? [...prevValue, ...mainOptionMatched] : mainOptionMatched
              }
            }
            if (subOptionMatched.length > 0) {
              const prevValue = matchedConfigFromUserSelection[key]
              matchedConfigFromUserSelection = {
                ...matchedConfigFromUserSelection,
                [key]: prevValue ? [...prevValue, ...subOptionMatched] : subOptionMatched
              }
            }
          } else {
            const matchedFilter = sanitisedConfig[key]?.filter((data) => {
              if (key === 'location') {
                if (data['seo_value'] === val) {
                  isLocationMatch = true
                  return data['seo_value'] === val
                }
              } else {
                return data['seo-value'] === val
              }
            })
            if (matchedFilter && matchedFilter.length !== 0) hasMatch.push(matchedFilter[0])
          }
        })
        if (hasMatch.length > 0) {
          if (isLocationMatch) {
            matchedLocation = {
              ...matchedLocation,
              [key]: hasMatch
            }
          } else {
            matchedConfigFromUserSelection = {
              ...matchedConfigFromUserSelection,
              [key]: hasMatch
            }
          }
        }
      }
    }
  }

  let filterCount = 0
  let filterParamsObject = {}
  let query = ''
  let filterQuery = ''
  let locationQuery = ''
  Object.values(matchedLocation).forEach((val) => {
    val.forEach((data) => {
      locationQuery = data['seo_value']
    })
  })
  Object.values(matchedConfigFromUserSelection).forEach((val) => {
    val.forEach((data) => {
      filterQuery = data['seo-value']
    })
  })

  let array = []
  if (Object.keys(matchedLocation).length > 0) array.push(matchedLocation)
  if (Object.keys(matchedConfigFromUrl).length > 0) array.push(matchedConfigFromUrl)
  if (Object.keys(matchedConfigFromUserSelection).length > 0)
    array.push(matchedConfigFromUserSelection)

  let uniqueList = []

  /* If field === category or field === 'moreFilters' (in mobile) && 
   * array includes 2 keys from category,
   * remove matchedConfigFromUrl, only take in matchedConfigFromUserSelection
   */
  if (
    (field === 'category' || field === 'moreFilters') && 
    Object.keys(matchedConfigFromUrl).includes('category') &&
    Object.keys(matchedConfigFromUserSelection).includes('category')
  ) {
    array = array.filter((matchData) => matchData !== matchedConfigFromUrl)
  }

  array.forEach((matchData) => {
    for (const [key] of Object.entries(matchData)) {
      const data =
        key === 'location'
          ? matchData[key].map((filter) => filter['seo_value'])
          : matchData[key].map((filter) => filter['seo-value'])

      uniqueList = [...uniqueList, ...data]
      uniqueList = [...new Set(uniqueList)]

      const match = data.join()

      if (filterParamsObject[key]) {
        filterParamsObject = {
          ...filterParamsObject,
          [key]: uniqueList.join()
        }
      } else {
        filterParamsObject = {
          ...filterParamsObject,
          [key]: match
        }
      }

      if (field === 'location' && isClear) delete filterParamsObject['location']
      if (field === 'category' && isClear) delete filterParamsObject['category']
      if (field === 'moreFilters' && isClear) {
        // delete all filters under more filters section, isClear is an array of strings if true for moreFilters
        isClear.forEach((val) => {
          const removeValueFromUniqueList = uniqueList.filter(
            (uniq) => uniq !== filterParamsObject[val]
          )
          uniqueList = removeValueFromUniqueList
          if (filterQuery === filterParamsObject[val]) {
            filterQuery = ''
          }
          delete filterParamsObject[val]
        })
      }
    }
  })

  filterCount = uniqueList.length

  /* PART III - logic to determine URL format
   * There are 4 types of scenario
   * when filterCount === 0 ||  filterCount === 1 || filterCount === 2 || filterCount > 2
   */
  if (filterCount === 0) {
    if ((field === 'query' && isClear) || (field === 'moreFilters' && isClear)) {
      query = appendGeneralQueryPattern()
    } else if (searchQuery) {
      query = appendSingleQueryPattern(searchQuery)
    } else {
      // it means there is no predefinedQuery && predefinedLocation
      query = appendSingleQueryPattern(queryParser[0])
    }
  } else if (filterCount === 1) {
    if (isClear) {
      // if field is location && isClear is true
      if (field === 'location') {
        if (
          searchQuery &&
          predefinedLocation &&
          searchQuery === predefinedLocation &&
          searchQuery === locationQuery
        ) {
          query = appendGeneralQueryPattern()
        } else if (searchQuery && predefinedLocation) {
          query = appendSingleQueryPattern(searchQuery)
        }
      } else if (field === 'category') {
        if (
          searchQuery &&
          !predefinedQuery &&
          !predefinedLocation &&
          locationQuery &&
          !filterQuery
        ) {
          query = appendDoubleQueryPattern(searchQuery, locationQuery)
        }
      } else if (searchQuery && !predefinedQuery && locationQuery && !filterQuery) {
        query = appendDoubleQueryPattern(searchQuery, locationQuery)
      } else if (
        (!searchQuery &&
          !predefinedQuery &&
          !predefinedLocation &&
          locationQuery &&
          !filterQuery) ||
        (!searchQuery &&
          !predefinedQuery &&
          !filterQuery &&
          predefinedLocation &&
          locationQuery &&
          predefinedLocation === locationQuery)
      ) {
        query = appendSingleQueryPattern(locationQuery)
      } else if (
        (!searchQuery &&
          predefinedQuery &&
          !predefinedLocation &&
          !locationQuery &&
          filterQuery &&
          predefinedQuery === filterQuery) ||
        (!searchQuery && !predefinedQuery && !predefinedLocation && !locationQuery && filterQuery)
      ) {
        query = appendSingleQueryPattern(filterQuery)
      } else if (
        !searchQuery &&
        predefinedQuery &&
        !predefinedLocation &&
        !locationQuery &&
        !filterQuery
      ) {
        query = appendGeneralQueryPattern()
        if (Object.keys(filterParamsObject).length > 0) {
          for (const [key, value] of Object.entries(filterParamsObject)) {
            if (predefinedQuery === value) {
              delete filterParamsObject[key]
            }
          }
        }
      } else {
        appendGeneralQueryPattern()
      }
      // handle all onKeywordSearch logic when field === 'query',
      // separate logic on its own because keyword search will always take precendance over filters
    } else if (field === 'query') {
      // for case : makati-jobs-in-makati
      if (
        searchQuery &&
        searchQuery == locationQuery &&
        Object.keys(matchedLocation).length > 0 &&
        Object.keys(matchedConfigFromUrl).length == 0 &&
        Object.keys(matchedConfigFromUserSelection).length == 0
      ) {
        query = appendSingleQueryPattern(searchQuery)
      } else if (
        searchQuery &&
        locationQuery &&
        searchQuery !== locationQuery &&
        Object.keys(matchedLocation).length > 0
      ) {
        query = appendDoubleQueryPattern(searchQuery, locationQuery)
      } else if (
        searchQuery &&
        predefinedLocation &&
        locationQuery &&
        predefinedLocation === locationQuery
      ) {
        query = appendDoubleQueryPattern(searchQuery, locationQuery)
      } else if (searchQuery && predefinedLocation !== locationQuery) {
        query = appendDoubleQueryPattern(searchQuery, locationQuery)
      } else if (
        (!predefinedQuery &&
          !searchQuery &&
          !filterQuery &&
          !predefinedLocation &&
          locationQuery) ||
        (!predefinedQuery && !searchQuery && !filterQuery && predefinedLocation && locationQuery)
      ) {
        query = appendSingleQueryPattern(locationQuery)
      } else if (searchQuery === filterQuery) {
        query = appendSingleQueryPattern(searchQuery)
      } else {
        query = appendSingleQueryPattern(searchQuery)
      }
      // !predefinedQuery && predefinedLocation && locationQuery exist and field is 'location'
    } else if (
      searchQuery &&
      !predefinedQuery &&
      predefinedLocation &&
      locationQuery &&
      searchQuery !== predefinedLocation &&
      predefinedLocation !== locationQuery &&
      field === 'location'
    ) {
      query = appendDoubleQueryPattern(searchQuery, locationQuery)
    } else if (!predefinedQuery && predefinedLocation && locationQuery && field === 'location') {
      query = appendSingleQueryPattern(locationQuery)
    } else if (
      searchQuery &&
      !predefinedQuery &&
      !predefinedLocation &&
      locationQuery &&
      !filterQuery
    ) {
      query = appendDoubleQueryPattern(searchQuery, locationQuery)
      // if there is searchQuery && predefinedLocation
    } else if (searchQuery && predefinedLocation && !locationQuery) {
      query = appendDoubleQueryPattern(searchQuery, predefinedLocation)
      // if there is searchQuery && locationQuery
    } else if (searchQuery && !predefinedLocation && locationQuery) {
      query = appendDoubleQueryPattern(searchQuery, locationQuery)
      // if there is searchQuery but !predfinedLocation && !locationQuery
    } else if (searchQuery && !predefinedLocation && !locationQuery) {
      query = appendSingleQueryPattern(searchQuery)
      // if there is no predefinedQuery && there is predefinedLocation
    } else if (!predefinedQuery && predefinedLocation) {
      query = appendSingleQueryPattern(predefinedLocation)
      // if there is predefinedQuery && !predefinedLocation
    } else if (predefinedQuery && !predefinedLocation) {
      query = appendSingleQueryPattern(predefinedQuery)
      // if there is no predefinedQuery && there is no predefinedLocation but there is locationMatch
    } else if (!predefinedQuery && !predefinedLocation && locationQuery) {
      query = appendSingleQueryPattern(locationQuery)
      // if there is no predefinedQuery && there is no predefinedLocation
    } else if (!predefinedQuery && !predefinedLocation) {
      query = appendSingleQueryPattern(filterQuery)
    }
  } else if (filterCount === 2) {
    if (isClear) {
      if (field === 'query') {
        if (
          !searchQuery &&
          predefinedQuery &&
          Object.keys(matchedConfigFromUrl).length > 0 &&
          Object.keys(matchedLocation).length > 0
        ) {
          query = appendDoubleQueryPattern(predefinedQuery, locationQuery)
        } else if (
          !searchQuery &&
          filterQuery &&
          Object.keys(matchedConfigFromUserSelection).length > 0 &&
          Object.keys(matchedLocation).length > 0
        ) {
          query = appendDoubleQueryPattern(filterQuery, locationQuery)
        } else if (
          searchQuery &&
          !predefinedQuery &&
          !predefinedLocation &&
          !locationQuery &&
          filterQuery &&
          Object.keys(matchedConfigFromUrl).length > 0 &&
          Object.keys(matchedConfigFromUserSelection).length > 0
        ) {
          query = appendGeneralQueryPattern()
        }
      } else {
        if (
          searchQuery &&
          !predefinedQuery &&
          !predefinedLocation &&
          locationQuery &&
          filterQuery
        ) {
          query = appendSingleQueryPattern(searchQuery)
        }
      }
      // if there is searchQuery
    } else if (searchQuery) {
      if (searchQuery === locationQuery && filterQuery) {
        query = appendDoubleQueryPattern(filterQuery, searchQuery)
      } else if (
        searchQuery === locationQuery &&
        predefinedQuery &&
        searchQuery !== predefinedQuery &&
        !filterQuery
      ) {
        query = appendDoubleQueryPattern(predefinedQuery, locationQuery)
      } else if (
        predefinedQuery &&
        searchQuery !== predefinedQuery &&
        predefinedLocation &&
        locationQuery &&
        !filterQuery
      ) {
        query = appendDoubleQueryPattern(searchQuery, locationQuery)
        // if there is search query that hits reserved keyword and location
      } else if (
        !predefinedQuery &&
        predefinedLocation &&
        locationQuery &&
        !filterQuery &&
        Object.keys(matchedLocation).lengt > 0 &&
        Object.keys(matchedConfigFromUrl).length > 0
      ) {
        query = appendDoubleQueryPattern(searchQuery, locationQuery)
        // if there is matchedLocation && matchedConfigFromUser
      } else if (
        Object.keys(matchedLocation).length + Object.keys(matchedConfigFromUserSelection).length >=
        2
      ) {
        query = appendSingleQueryPattern(searchQuery)
      } else if (
        (predefinedQuery &&
          predefinedLocation &&
          locationQuery &&
          predefinedLocation !== locationQuery) ||
        (predefinedQuery &&
          predefinedLocation &&
          locationQuery &&
          predefinedLocation === locationQuery) ||
        (predefinedQuery && !predefinedLocation && locationQuery)
      ) {
        query = appendDoubleQueryPattern(searchQuery, locationQuery)
      } else if (locationQuery) {
        query = appendDoubleQueryPattern(searchQuery, locationQuery)
      } else if (Object.keys(matchedConfigFromUrl).length >= 2) {
        query = appendGeneralQueryPattern()
      } else {
        query = appendSingleQueryPattern(searchQuery)
      }
      // if there is predefinedQuery && predefinedLocation
    } else if (!searchQuery && predefinedQuery && predefinedLocation) {
      query = appendDoubleQueryPattern(predefinedQuery, predefinedLocation)
      // if there is no predefinedQuery or predefinedLocation
    } else if (!predefinedQuery && !predefinedLocation && !filterQuery && !locationQuery) {
      query = appendGeneralQueryPattern()
      // if there is predefinedQuery && predefinedLocation && locationQuery && predefinedLocation !== locationQuery
    } else if (
      predefinedQuery &&
      predefinedLocation &&
      locationQuery &&
      predefinedLocation !== locationQuery
    ) {
      query = appendDoubleQueryPattern(predefinedQuery, locationQuery)
      // if there is predefinedQuery but no predefinedLocation but there is location match
    } else if (predefinedQuery && !predefinedLocation && locationQuery) {
      query = appendDoubleQueryPattern(predefinedQuery, locationQuery)
      // if filter is 2, there is no predefinedQuery and no predefinedLocation, it means it hit reserved keyword
    } else if (!predefinedQuery && !predefinedLocation && filterQuery && locationQuery) {
      query = appendDoubleQueryPattern(filterQuery, locationQuery)
      // if filter is 2, there is no predefinedQuery, but there is predefinedLocation, it means it hit reserved keyword
    } else if (!predefinedQuery && predefinedLocation) {
      query = appendDoubleQueryPattern(filterQuery, predefinedLocation)
    }
  } else {
    if (searchQuery && locationQuery && searchQuery !== locationQuery) {
      query = appendSingleQueryPattern(searchQuery)
    } else if (searchQuery && field === 'query') {
      query = appendSingleQueryPattern(searchQuery)
    } else {
      query = appendGeneralQueryPattern()
    }
  }

  const queryData = urlQueryParser(query)

  // if query value exist in filterParamsObject, remove it
  queryData.forEach((q) => {
    for (const [key, value] of Object.entries(filterParamsObject)) {
      let valueArray = value.split(',')
      const queryValue = field === 'query' ? slugify(q) : q

      if (value.includes(queryValue)) {
        valueArray = valueArray.filter((val) => val !== queryValue)
      }
      if (valueArray.length === 0) {
        delete filterParamsObject[key]
      } else {
        filterParamsObject = {
          ...filterParamsObject,
          [key]: valueArray.join()
        }
      }
    }
  })

  const data = {
    searchQuery: query,
    filterParamsObject,
    matchedConfig,
    matchedConfigFromUrl,
    matchedConfigFromUserSelection
  }

  return data
}

const getPredefinedParamsFromUrl = (routerQuery, catList, locList, clearAllFilters) => {
  const { keyword } = routerQuery
  let predefinedQuery = null
  let predefinedLocation = null
  let predefinedCategory = null
  let matchedLocation = null
  let matchedCategory = null
  const queryParser = urlQueryParser(keyword)
  if (queryParser) {
    if (queryParser.length > 0) {
      queryParser.forEach((value, index) => {
        matchedLocation = locList.filter((loc) => {
          return loc.value.toLowerCase() === unslugify(value)
        })
        matchedCategory = catList.filter((cat) => {
          return cat.key === value
        })
        // if queryParser length is 1, and the value can't be matched to location or category, it will be a search query
        if (queryParser.length === 1 && index === 0) {
          if (matchedLocation && matchedLocation.length > 0 && !clearAllFilters) {
            predefinedLocation = [capitalizeFirstAlphabet(unslugify(value))]
            // predefinedLocation = [value]
          } else if (matchedCategory && matchedCategory.length > 0 && !clearAllFilters) {
            predefinedCategory = [value]
          } else if (
            (!matchedLocation && !matchedCategory) ||
            (matchedLocation.length === 0 && matchedCategory.length === 0)
          ) {
            // updateSearchQuery([unslugify(value)])
            predefinedQuery = [unslugify(value)]
          }
        } else if (queryParser.length === 2 && index === 0) {
          if (matchedCategory && matchedCategory.length > 0 && !clearAllFilters) {
            predefinedCategory = [value]
          } else if (!matchedCategory || matchedCategory.length === 0) {
            predefinedQuery = [unslugify(value)]
          }
        } else if (queryParser.length === 2 && index === 1) {
          if (matchedLocation && matchedLocation.length > 0 && !clearAllFilters) {
            predefinedLocation = [capitalizeFirstAlphabet(unslugify(value))]
          }
        }
      })
    }
  }
  return {
    predefinedQuery,
    predefinedCategory,
    predefinedLocation
  }
}

// e.g of url = query-jobs?
const appendSingleQueryPattern = (query) => {
  // query can be value from user query OR location OR category
  if (query && query.length !== 0 && !query.includes('job-search')) {
    return query + '-jobs'
  }
  return query && query.length === 0 ? '' : query
}

// e.g of url = query-jobs-in-location?
const appendDoubleQueryPattern = (query, location) => {
  // query can be value from user query OR category
  return query && location ? query + '-jobs-in-' + location : null
}

// e.g of url = job-search?
const appendGeneralQueryPattern = () => {
  return 'job-search'
}

const getJobTypeList = (config) => {
  return config?.inputs.job_types.map((jobType) => ({
    ...jobType,
    label: jobType.value,
    value: jobType.key
  }))
}

const getLocationList = (config) => {
  if (!config) return []

  const locList =
    config &&
    config.inputs &&
    config.inputs.location_lists
      .map((region) =>
        region.locations.map((loc) => ({
          ...loc,
          // loc value all lower case
          value: loc.value
        }))
      )
      .reduce((a, c) => a.concat(c), [])

  return locList
}

const getSmsCountryList = (config) => {
  if (!config) return []

  const smsCountryList = []
  const countryList = config?.inputs?.country_lists
  countryList.forEach((country) => {
    if (country.is_sms_allowed) {
      const smsCountry = {
        value: country['code'],
        label: country['code'] + ' (' + country['value'] + ')'
      }

      smsCountryList.push(smsCountry)
    }
  })

  return smsCountryList
}

// const getSmsCountryCode = (phoneNumber, sms_country_list) => {
//   return sms_country_list.filter((country) => {
//     return country.value.includes(phoneNumber)
//   })
// }

const getJobCategoryList = (config) => {
  if (!config) return []

  const categories = []

  config?.inputs?.job_category_lists.forEach((mainCategory) => {
    mainCategory.sub_list.forEach((subList) => {
      subList['label'] = subList['value']
      categories.push(subList)
    })
  })

  return categories
}

const getJobCategoryIds = (config, categories) => {
  if (!config) return []

  const categoryLists = config?.inputs?.job_category_lists
  const categoryIds = []

  categoryLists.forEach((mainCategory) => {
    mainCategory.sub_list.forEach((subList) => {
      if (categories.includes(subList.value)) {
        categoryIds.push(subList.id)
      }
    })
  })

  return categoryIds
}

const getNoticePeriodList = (config) => {
  return config?.inputs?.notice_period_lists.map((notice) => ({
    ...notice,
    label: notice.value,
    value: notice.id
  }))
}

const getSalaryOptions = (config, salaryFrom, hasComparedTo) => {
  if (!config) return null
  const salaryConfig = config?.inputs?.salary_ranges
  if (salaryConfig && salaryConfig.length === 0) return salaryConfig

  const _salaryTo = hasComparedTo ? salaryFrom * salaryConfig.upper_bound_scale : salaryConfig.to
  const _salaryFrom = salaryFrom ? salaryFrom + salaryConfig.interval : salaryConfig.from

  const salaryOptions = []
  for (let salary = _salaryFrom; salary <= _salaryTo; salary += salaryConfig.interval)
    salaryOptions.push({ label: salary, value: salary })
  return salaryOptions
}

const getCountryList = (config) => {
  if (!config) return []

  const countryLists = config?.inputs?.country_lists
  if (countryLists && countryLists.length === 0) return countryLists

  let countryOptions = countryLists.map((country) => {
    return {
      label: country.value,
      value: country.value,
      key: country.key
    }
  })

  countryOptions = countryOptions.filter((country) => country.key !== 'ph')

  return countryOptions
}

const getIndustryList = (config) => {
  if (!config) return []

  const industryList = config?.inputs?.industry_lists
  if (industryList && industryList.length === 0) return industryList

  return industryList.map((industry) => {
    return {
      label: industry.value,
      value: industry.value,
      key: industry.key
    }
  })
}

const getDegreeList = (config) => {
  if (!config) return []

  const degreeList = config?.inputs?.degrees
  if (degreeList && degreeList.length === 0) return degreeList

  return degreeList.map((degree) => {
    return {
      label: degree.value,
      value: degree.value,
      key: degree.key
    }
  })
}

const getApplyJobLink = (job, user, accessToken = null) => {
  // jobUrl => /job/xxxx
  // Apply job url format: /apply-job/xxx
  let applyJobUrl = `${process.env.HOST_PATH}${job?.job_url}/apply`

  if (user) {
    if (!user?.is_profile_completed) {
      return `${process.env.HOST_PATH}/jobseeker-complete-profile/1?redirect=${applyJobUrl}`
    }

    if (job?.external_apply_url) {
      let externalApplyUrl = job?.external_apply_url

      if (
        externalApplyUrl !== '' &&
        externalApplyUrl !== null &&
        !/^(f|ht)tps?:\/\//i.test(externalApplyUrl)
      ) {
        externalApplyUrl = 'https://' + externalApplyUrl
      }

      return externalApplyUrl
    }

    return applyJobUrl
  }

  return `${process.env.HOST_PATH}/login/jobseeker?redirect=${applyJobUrl}`
}

// TODO: remove isLocation param after backend as renamed the field
const mapSeoValueToGetValue = (value, configArray, hasSubList, isLocation) => {
  const valueToReturn = []
  // if config hasSubList e.g: category
  if (hasSubList) {
    value.forEach((v) => {
      configArray.forEach((option) => {
        if (option['seo-value'] === v) {
          valueToReturn.push(option.value)
        } else {
          option.sub_list.forEach((subOption) => {
            if (subOption['seo-value'] === v) {
              valueToReturn.push(subOption.value)
            }
          })
        }
      })
    })
  } else {
    if (isLocation) {
      value.forEach((v) => {
        configArray.forEach((option) => {
          if (option['seo_value'] === v) {
            valueToReturn.push(option.value)
          }
        })
      })
    } else {
      value.forEach((v) => {
        configArray.forEach((option) => {
          if (option['seo-value'] === v) {
            valueToReturn.push(option.value)
          }
        })
      })
    }
  }
  return valueToReturn.join()
}

export {
  handleSalary,
  urlQueryParser,
  capitalizeFirstAlphabet,
  SEOJobSearchMetaBuilder,
  getPredefinedParamsFromUrl,
  formatLocationConfig,
  getJobTypeList,
  getLocationList,
  getNoticePeriodList,
  getSmsCountryList,
  getJobCategoryList,
  getJobCategoryIds,
  getSalaryOptions,
  getCountryList,
  getIndustryList,
  getDegreeList,
  getApplyJobLink,
  userFilterSelectionDataParser,
  checkFilterMatch,
  mapSeoValueToGetValue
}
