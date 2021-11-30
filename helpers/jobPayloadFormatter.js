// import { stringify } from 'query-string'
import { thousandsToNumber, unslugify } from 'helpers/formatter'
/* Vendors */
import moment from 'moment'
import slugify from 'slugify'


const handleSalary = (salaryRanges) => {
  const sanitiseSalaryRange = salaryRanges.map(range => range === 'Below 30K' ? '10K - 30K' : range)
  let salaryFrom = '' 
  let salaryTo = ''

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

  return [salaryFrom, salaryTo]
}

// const handleSalary = (salary) => {
//   if (Array.isArray(salary) && salary.length && !salary.includes('All')) {
//     let formattedSalaryFrom = ''
//     let formattedSalaryTo = ''

//     formattedSalaryFrom = salary
//       .filter((salary) => salary !== 'Above_200K')
//       .map((formattedSalaryTo) => thousandsToNumber(formattedSalaryTo.split('_to_')[0]))

//     formattedSalaryTo = salary
//       .filter((salary) => salary !== 'Above_200K')
//       .map((formattedSalaryTo) => thousandsToNumber(formattedSalaryTo.split('_to_')[1]))

//     if (salary.includes('Above_200K')) {
//       formattedSalaryFrom.push('200001')
//       formattedSalaryTo.push('400000')
//     }

//     formattedSalaryFrom = formattedSalaryFrom.join(',')
//     formattedSalaryTo = formattedSalaryTo.join(',')

//     return [formattedSalaryFrom, formattedSalaryTo]
//   }

//   return ['', '']
// }

const handleWorkExperience = (workExperience) => {
  let xpLvls = ''

  if (Array.isArray(workExperience) && workExperience.length && !workExperience.includes('All')) {
    xpLvls = workExperience.join(',')
  }

  return xpLvls
}

const handleEducation = (education) => {
  let degree = ''

  if (Array.isArray(education) && education.length && !education.includes('All')) {
    degree = education.join(',')
  }

  return degree
}

const handleJobType = (jobType) => {
  let formatJobType = ''

  if (Array.isArray(jobType) && jobType.length && !jobType.includes('All')) {
    formatJobType = jobType.join(',')
  }

  return formatJobType
}

const handleIndustry = (industry) => {
  let industryKey = ''

  if (Array.isArray(industry) && industry.length && !industry.includes('All')) {
    industryKey = industry.join(',')
  }
  //   if (Array.isArray(industry) && industry.length && !industry.includes('All')) {
  //     industryKey = industry.join(',').replace(/&/gi, '%26')
  //   }

  return industryKey
}

const handleApplicationStatus = (applicationStatus) => {
  let formatApplicationStatus = ''

  if (Array.isArray(applicationStatus) && applicationStatus.length) {
    formatApplicationStatus = applicationStatus.join(',')
  }

  return formatApplicationStatus
}

const handleJobCategory = (jobCategory, skipEncode = false) => {
  let category = ''

  if (Array.isArray(jobCategory) && jobCategory.length && !jobCategory.includes('All')) {
    category = skipEncode ? jobCategory.join(',') : jobCategory.join(',').replace(/&/gi, '%26')
  }

  return category
}

const handleJobLocation = (jobLocation) => {
  let formatJobLocation = ''

  if (Array.isArray(jobLocation) && jobLocation.length && !jobLocation.includes('All')) {
    formatJobLocation = jobLocation.join(',')
  }

  return formatJobLocation
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

const handleIsCompanyVerified = (isVerified) => {
  return isVerified ? 1 : 0
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
  console.log('queryParser', queryParser)
  if (queryParser) {
    if (queryParser.length > 0) {
      queryParser.forEach((value, index) => {
        matchedLocation = locList.filter((loc) => {
          return loc.value === unslugify(value)
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

const getPayload = (routerQueries) => {
  const { keyword } = routerQueries

  const payloadObj = {
    query: keyword
    // // query: payloadQuery ? payloadQuery.toLowerCase() : payloadQuery,
    // page: isNaN(page) ? 1 : Number(page),
    // salary: salaryRange,
    // workExperience: workExperience,
    // education: education,
    // jobType: jobType,
    // industry: industry,
    // isVerified: isVerified,
    // sort: sortParam,
    // applicationStatus: applicationStatus,
    // viewPage: activeView,
    // jobCategory: payloadJobCategory,
    // jobLocation: payloadJobLocation,
    // companyName,
  }
  return payloadObj
}

// e.g of url = query-jobs?
const appendSingleQueryPattern = (query) => {
  // query can be value from user query OR location OR category
  if (query && !query.includes('job-search')) {
    return query + '-jobs'
  }
  return query
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
  const locList =
    config &&
    config.inputs &&
    config.inputs.location_lists
      .map((region) =>
        region.locations.map((loc) => ({
          ...loc,
          // loc value all lower case
          value: loc.value.toLowerCase(),
        }))
      )
      .reduce((a, c) => a.concat(c), [])

  return locList
}

export {
  handleSalary,
  handleWorkExperience,
  handleEducation,
  handleJobType,
  handleIndustry,
  handleApplicationStatus,
  handleJobCategory,
  handleJobLocation,
  handleIsCompanyVerified,
  urlQueryParser,
  categoryParser,
  capitalizeFirstAlphabet,
  SEOJobSearchMetaBuilder,
  getPredefinedParamsFromUrl,
  formatLocationConfig,
  getPayload,
  conditionChecker,
  getLocationList
}
