// import { stringify } from 'query-string'
import { flat, thousandsToNumber, unslugify } from 'helpers/formatter'
/* Vendors */
import moment from 'moment'
import slugify from 'slugify'


const handleSalary = (salaryRanges) => {
  let salaryFrom = '' 
  let salaryTo = ''
  if (salaryRanges){
    const sanitiseSalaryRange = salaryRanges.map(range => range === 'Below 30K' ? '10K - 30K' : range)
  
    salaryFrom = sanitiseSalaryRange
      .filter((salary) => salary !== 'Above_200K')
      .map((salaryFrom) => thousandsToNumber('' + salaryFrom.split(' - ')[0]))
  
    salaryTo = sanitiseSalaryRange
      .filter((salary) => salary !== 'Above_200K')
      .map((salaryTo) => 
        thousandsToNumber('' + salaryTo.split(' - ')[1]))
  
    if (sanitiseSalaryRange.includes('Above_200K')) {
      salaryFrom.push('200001')
      salaryTo.push('400000')
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
      subList: region.locations,
    }
  })
  return locationConfig
}

const urlQueryParser = (string) => {
  // Uncommenting : positive and negative regex lookbehinds not supported in mobile browsers
  // const regex = /(.+?(?=(-jobs|-jobs-in))|(?<=(-jobs-in-)).+)/g

  const doubleQueryPattern = /(\b-jobs-in-\b)/g
  const singleQueryPattern = /(\b-jobs\b)/g

  let array = null
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

const categoryParser = (category) => {
  const regex = /[^A-Za-z0-9]+/g
  let value = category.replace(regex, '-')

  // check if last character is '-', if yes remove
  const lastDash = value.match(/(-?\s*)$/g)
  if (lastDash.length > 1) {
    const lastIndex = value.lastIndexOf('-')
    value = value.substr(0, lastIndex)
  }
  return value.toLowerCase().replace('-26', '')
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
    canonical: canonical,
  }

  return data
}

const getPredefinedParamsFromUrl = (
  routerQuery,
  catList,
  locList,
  clearAllFilters
) => {
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
    predefinedLocation,
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

const conditionChecker = (queryType, sanitisedLocValue, jobCategory, clearAllFilters) => {
  let queryParam = ''
  const filteredData = []
  // eslint-disable-next-line
  // query && !location && !category
  if (
    queryType && !sanitisedLocValue && !jobCategory 
  ) {
    queryParam = appendSingleQueryPattern(queryType)
  } else if (
    // !query && 1 location && !category
    !queryType &&
    sanitisedLocValue &&
    !jobCategory
  ) {
    queryParam = appendSingleQueryPattern(sanitisedLocValue)
  } else if (
    // !query && !location && 1 category
    !queryType &&
    !sanitisedLocValue &&
    jobCategory 
  ) {
    queryParam = appendSingleQueryPattern(jobCategory)
  }

  // query && 1 location && !category
  if (
    queryType && sanitisedLocValue && !jobCategory
  ) {
    queryParam = appendDoubleQueryPattern(queryType, sanitisedLocValue)
  }

  // query && !location && 1 category
  if (
    queryType && !sanitisedLocValue &&jobCategory 
  ) {
    queryParam = appendSingleQueryPattern(queryType)
    // filteredData.push({ key: 'jobCategory', data: category })
  }

  // !query && 1 location && 1 category
  if (
    !queryType &&
    sanitisedLocValue
    && jobCategory
  ) {
    queryParam = appendDoubleQueryPattern(jobCategory, sanitisedLocValue)
  }

  // query && 1 location && 1 category
  if (
    queryType &&
    sanitisedLocValue &&
    jobCategory 
  ) {
    queryParam = appendDoubleQueryPattern(queryType, sanitisedLocValue)
    filteredData.push({ key: 'jobCategory', data: jobCategory })
  }

  // query && (multiple location || multiple category || other filters)
  if (
    queryType && sanitisedLocValue && 
    ((jobCategory && jobCategory.length > 1))
  ) {
    if (sanitisedLocValue) {
      // E.g: dev-jobs-in-makati
      queryParam = appendDoubleQueryPattern(queryType, sanitisedLocValue)
    }
    if (jobCategory && jobCategory.length > 1) {
      // E.g: dev-jobs?jobLocation=1,2,3&jobCategory=1
      filteredData.push({ key: 'jobCategory', data: jobCategory })
    } else if (jobCategory && jobCategory.length === 1) {
      filteredData.push({ key: 'jobCategory', data: jobCategory })
      queryParam = appendSingleQueryPattern(queryType)
    }
  }

  // !query && (multiple location || multiple category || other filters)
  if (
    !queryType &&
    (jobCategory && jobCategory.length > 1)
  ) {
    if (sanitisedLocValue) {
      queryParam = appendSingleQueryPattern(sanitisedLocValue)
    }
    if (jobCategory && jobCategory.length > 1 && sanitisedLocValue) {
      filteredData.push({ key: 'jobCategory', data: jobCategory })
      queryParam = appendGeneralQueryPattern()
    } else if (jobCategory && jobCategory.length === 1 && !sanitisedLocValue) {
      queryParam = appendSingleQueryPattern(jobCategory)
    }
  }

  // If clearAllFilters is true, only extract searchQuery
  if (clearAllFilters) {
    if (queryType && queryParser && queryParser.length > 0) {
      const matchedLocation = locationList.filter((loc) => {
        return loc.value === unslugify(queryParser[0])
      })
      const matchedCategory = categoryList.filter((cat) => {
        return cat.value === queryParser[0]
      })
      if (
        (!matchedLocation && !matchedCategory) ||
        (matchedLocation &&
          matchedLocation.length === 0 &&
          matchedCategory &&
          matchedCategory.length === 0)
      ) {
        queryParam = appendSingleQueryPattern(queryParser[0])
      }
    } else if (!queryType && queryParser && queryParser.length > 0) {
      queryParam = ''
    }
  }

  // If !query, !jobLocation && !jobCategory
  if (!queryType && !sanitisedLocValue && !jobCategory) {
    queryParam = ''
  }

  return slugify(queryParam).toLowerCase()
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
          value: loc.value,
        }))
      )
      .reduce((a, c) => a.concat(c), [])

  return locList
}

const getSmsCountryList = (config) => {
  if (!config) return []

  return config?.inputs?.sms_country_lists.map((sms) => ({ ...sms, label: sms.code }))
}

const getJobCategoryList = (config) => {
  if (!config) return []

  return flat(config?.inputs?.job_category_lists.map((jobCategory) => Object.values(jobCategory)[2]))
}

const getJobCategoryIds = (config, categories) => {
  if (!config) return []

  const categoryLists = config?.inputs?.job_category_lists
  let categoryIds = []
  categoryLists.forEach((category) => {
    categories.map((cat) => {
      if (category.value === cat) {
        categoryIds.push(category.id)
      }
    })
  })

  return categoryIds
}

const getNoticePeriodList = (config) => {
  return config?.inputs?.notice_period_lists.map((notice) => ({ ...notice, label: notice.value, value: notice.id }))
}

const getSalaryOptions = (config, salaryFrom, hasComparedTo) => {
  if (!config) return []

  const salaryConfig = config?.inputs?.salary_ranges
  if (salaryConfig && salaryConfig.length === 0) return salaryConfig

  const _salaryTo = hasComparedTo ? salaryFrom * salaryConfig.upper_bound_scale : salaryConfig.to
  const _salaryFrom = salaryFrom ? salaryFrom + salaryConfig.interval : salaryConfig.from
  
  let salaryOptions = []
  for (let salary = _salaryFrom; salary <= _salaryTo; salary += salaryConfig.interval) salaryOptions.push({label: salary, value: salary})
  return salaryOptions
}

const getCountryList = (config) => {
  if (!config) return []

  const countryLists = config?.inputs?.country_lists
  if (countryLists && countryLists.length === 0) return countryLists

  let countryOptions = Object.values(countryLists).map(country => {
    return {
      label: Object.values(country)[0],
      value: Object.keys(country)[0],
      key: Object.keys(country)[0]
    }
  })

  countryOptions = countryOptions.filter(country => country.key !== 'ph')

  return countryOptions
}

const getIndustryList = (config) => {
  if (!config) return []

  const industryList = config?.inputs?.industry_lists
  if (industryList && industryList.length === 0) return industryList

  return industryList.map((industry) => {
    return {
      label: Object.values(industry)[0],
      value: Object.keys(industry)[0],
      keys: Object.keys(industry)[0],
    }
  })
}

const getDegreeList = (config) => {
  if (!config) return []

  const degreeList = config?.inputs?.degrees
  if (degreeList && degreeList.length === 0) return degreeList

  return degreeList.map((degree) => {
    return {
      label: Object.values(degree)[0],
      value: Object.keys(degree)[0],
      keys: Object.keys(degree)[0],
    }
  })
}

export {
  handleSalary,
  urlQueryParser,
  categoryParser,
  capitalizeFirstAlphabet,
  SEOJobSearchMetaBuilder,
  getPredefinedParamsFromUrl,
  formatLocationConfig,
  conditionChecker,
  getLocationList,
  getNoticePeriodList,
  getSmsCountryList,
  getJobCategoryList,
  getJobCategoryIds,
  getSalaryOptions,
  getCountryList,
  getIndustryList,
  getDegreeList
}
