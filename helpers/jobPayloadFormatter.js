// import { stringify } from 'query-string'
import { thousandsToNumber, unslugify } from 'helpers/formatter'
/* Vendors */
import moment from 'moment'

const handleSalary = (salary) => {
  if (Array.isArray(salary) && salary.length && !salary.includes('All')) {
    let formattedSalaryFrom = ''
    let formattedSalaryTo = ''

    formattedSalaryFrom = salary
      .filter((salary) => salary !== 'Above_200K')
      .map((formattedSalaryTo) => thousandsToNumber(formattedSalaryTo.split('_to_')[0]))

    formattedSalaryTo = salary
      .filter((salary) => salary !== 'Above_200K')
      .map((formattedSalaryTo) => thousandsToNumber(formattedSalaryTo.split('_to_')[1]))

    if (salary.includes('Above_200K')) {
      formattedSalaryFrom.push('200001')
      formattedSalaryTo.push('400000')
    }

    formattedSalaryFrom = formattedSalaryFrom.join(',')
    formattedSalaryTo = formattedSalaryTo.join(',')

    return [formattedSalaryFrom, formattedSalaryTo]
  }

  return ['', '']
}

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
  catList,
  locList,
  query,
  currentQuery,
  updateSearchQuery,
  clearAllFilters
) => {
  let predefinedQuery = null
  let predefinedLocation = null
  let predefinedCategory = null 
  let matchedLocation = null 
  let matchedCategory = null
  const queryParser = urlQueryParser(query)
  if (!currentQuery && query && queryParser) {
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
            updateSearchQuery([unslugify(value)])
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
}
